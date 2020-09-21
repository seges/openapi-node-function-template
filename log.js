const { createLogger, stdSerializers } = require('bunyan');
const { createNamespace, getNamespace } = require('cls-hooked');

const namespaceName = process.env.service__namespace || 'default-ns';

const ns = getNamespace(namespaceName) || createNamespace(namespaceName);

const log = createLogger({
    name: process.env.logger__name || 'defaultLogger',
    src: process.env.NODE_ENV !== 'production',
    serializers: { err: stdSerializers.err },
    streams: [
        {
            level: process.env.logger__level || 'info',
            stream: process.stdout
        }
    ]
});

const wrapIfError = obj =>
    obj instanceof Error
        ? {
              err: obj
          }
        : obj;

const decorator = fn => (first, ...rest) => {
    const context = {
        requestId: ns.get('requestId')
    };

    const args = [
        ...(typeof first === 'object'
            ? [
                  {
                      ...wrapIfError(first),
                      context
                  }
              ]
            : [{ context }, first]),
        ...rest
    ];
    return fn.apply(log, args);
};

['trace', 'debug', 'info', 'warn', 'error', 'fatal'].forEach(name => {
    log[name] = decorator(log[name]);
});

module.exports = log;
