/**
 * FunctionEvent is the first parameter of OpenAPI Node Template handler method.
 * 
 * It contains following fields from OpenAPI Backend:
 * 
 * - `body`
 * - `requestBody` - parsed body
 * - `cookies`
 * - `headers`
 * - `method`
 * - `query`
 * - `path`
 * - `params` - path parsed to path params
 * 
 * Some specific fields of the Node Template:
 * 
 * - `files` - files in case of multipart message
 * 
 * Low-level accessors:
 * 
 * - `req` - original Node HTTP Request
 * - `oabContext` - OpenAPI Backend context where some of the fields are already extracted. This can be used when you want to use some fields that were not translated by Node Template. Find more here - https://github.com/anttiviljami/openapi-backend/blob/master/DOCS.md#context-object
 */
class FunctionEvent {
    constructor(c, req) {
        // extract data from Context of OpenAPI Backend
        // https://github.com/anttiviljami/openapi-backend/blob/master/DOCS.md#context-object
        this.body = c.request.body;
        this.cookies = c.request.cookies;
        this.headers = c.request.headers;
        this.method = c.request.method;
        this.query = c.request.query;
        this.path = c.request.path;
        this.params = c.request.params;
        this.files = req.files;
        this.req = req;
        this.oabContext = c;
    }
}

module.exports = FunctionEvent;