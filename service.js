const express = require('express');
const bodyParser = require('body-parser');
const bunyanRequest = require('bunyan-middleware');
const { getNamespace, createNamespace } = require('cls-hooked');
const http = require('http');
const https = require('https');
const fs = require('fs');
const { OpenAPIBackend } = require('openapi-backend');

const log = require('./log');
const FunctionEvent = require('./FunctionEvent');
const FunctionContext = require('./FunctionContext');
const emptyApi = require('./emptyApi');

/*
 * Environment config in README
 */

const requestIdHeader = () => process.env.http__request_id_header || 'X-Request-Id';

const apiMiddleware = (api) => (req, res) => api.handleRequest(req, req, res);

const namespaceMiddleware = (ns) => (req, res, next) => {
    const requestId = req.get(requestIdHeader());
    ns.bindEmitter(req);
    ns.bindEmitter(res);

    ns.run(() => {
        ns.set('requestId', requestId);
        next();
    });
};

const loggingMiddleware = bunyanRequest({
    logger: log,
    headerName: requestIdHeader(),
    verbose: true
});

const maybeApplyCors = (app) => {
    if (process.env.NODE_ENV === 'dev') {
        const cors = require('cors');
        const corsOptions = {
            origin: '*',
            methods: 'PUT, GET, POST, DELETE, OPTIONS'
        };
        app.use(cors(corsOptions));
        log.debug('Applied CORS');
    }
}

const prepareApi = ({ definition, handlers }) => new Promise((resolve, reject) => {
    log.debug('Loading OpenAPI definition', definition);

    const api = new OpenAPIBackend({
        definition,
        handlers
    });
    const validationFailHandler = (c, req, res) =>
        res.status(400).json({ status: 400, err: c.validation.errors });

    api.register('notFound', (c, req, res) => res.status(404).json({ err: 'not found' }),)
    api.register('validationFail', validationFailHandler);
    api.register('notImplemented', (c, req, res) => {
        const { status, mock } = c.api.mockResponseForOperation(c.operation.operationId);
        return res.status(status).json(mock);
    });
    api.init();

    resolve(api);
});

const listen = (app) => new Promise((resolve, reject) => {
    const port = process.env.http__port || 4000;
    if (process.env.SSL === true || process.env.SSL === 'true') {
        const key = fs.readFileSync(process.env.http__ssl__key_file || process.cwd() + '/ca/key.pem', 'utf-8');
        const cert = fs.readFileSync(process.env.http__ssl__cert_file || process.cwd() + '/ca/cert.pem', 'utf-8');

        https
            .createServer(
                {
                    key,
                    cert
                },
                app
            )
            .listen(port);
        resolve('HTTPs listening on ' + port);
    } else {
        app.listen(port);
        resolve('HTTP listening on ' + port);
    }
});

const isArray = (a) => (!!a) && (a.constructor === Array);
const isObject = (a) => (!!a) && (a.constructor === Object);

const handlerCallback = (res) => (fnContext) => (err, functionResult) => {
    if (err) {
        log.error(err);
        return res.status(500).send(err);
    }

    const isAttachment = isObject(functionResult) && functionResult.type === 'attachment';

    if (isAttachment) {
        const { fileName, writeStream } = functionResult;
        res.attachment(fileName);
        // the stream needs to be finalized outside
        writeStream.pipe(res);
    } else if(isArray(functionResult) || isObject(functionResult)) {
        res.set(fnContext.headers()).status(fnContext.status()).send(JSON.stringify(functionResult));
    } else {
        res.set(fnContext.headers()).status(fnContext.status()).send(functionResult);
    }
};

/**
 * Transform between OpenAPI Backend handler and Function handler.
 * 
 * @param {*} handlers 
 */
const wrapHandlers = (handlers) => {
    return Object.keys(handlers).reduce((acc, handlerName) => {
        const handler = handlers[handlerName];

        // https://github.com/anttiviljami/openapi-backend#registering-handlers-for-operations
        acc[handlerName] = (c, req, res) => handler(new FunctionEvent(c), new FunctionContext(handlerCallback(res)), handlerCallback);

        return acc;
    }, {});
};

const prepareApiDefinition = (handlerOrHandlers, openApiUrl, openApiFilename) => new Promise((resolve, reject) => {

    let handlers;

    if (isObject(handlerOrHandlers)) {
        // handler is actually object containing map of handlers: handlerName -> function
        handlers = wrapHandlers(handlerOrHandlers);
    } else {
        // it is just handling function, we register a handler 'singleHandler'
        handlers = wrapHandlers({
            'singleHandler': handlerOrHandlers
        });
    }

    log.debug('handlers', handlers);

    if (!openApiUrl && !openApiFilename) {
        resolve({
            definition: emptyApi(process.env.openapi__single_operation_id),
            handlers
        });
    } else if (openApiFilename) {
        resolve({
            definition: JSON.parse(fs.readFileSync(openApiFilename, 'utf-8')),
            handlers
        });
    } else if (openApiUrl) {
        const file = fs.createWriteStream('/tmp/openapi.json');
        const resolveRemoteSchema = response => {
            const stream = response.pipe(file);

            stream.on('finish', () => {
                resolve({
                    definition: JSON.parse(fs.readFileSync('/tmp/openapi.json', 'utf-8')),
                    handlers
                });
            });
        };

        const remote = openApiUrl.indexOf('https://') === -1 ? http : https;
        remote.get(openApiUrl, resolveRemoteSchema
        );
    }
});

const registerApiMiddleware = (app) => (api) => new Promise((resolve, reject) => {
    app.use(apiMiddleware(api));
    resolve(app);
});

const service = (handler) => {
    const namespaceName = process.env.service__namespace || 'default-ns';

    const ns = getNamespace(namespaceName) || createNamespace(namespaceName);

    const app = express();
    app.use(namespaceMiddleware(ns));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json({ limit: process.env.request__body__size || '1mb' }));
    app.use(bodyParser.text());
    app.use(loggingMiddleware);
    app.disable('x-powered-by');
    app.disable('etag');

    maybeApplyCors(app);

    prepareApiDefinition(handler, process.env.openapi__url, process.env.openapi__filename)
        .then(prepareApi)
        .then(registerApiMiddleware(app))
        .then(listen)
        .then(value => {
            log.info('Function ready: ', value);
        })
        .catch(reason => {
            log.error('Could not register service ', reason);
        });

    return { app };
};

module.exports = service;
