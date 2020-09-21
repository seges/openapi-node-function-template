class FunctionEvent {
    constructor(c, req) {
        this.body = c.request.body;
        this.headers = c.request.headers;
        this.method = c.request.method;
        this.query = c.request.query;
        this.path = c.request.path;
        this.files = req.files;
        this.req = req;
    }
}

module.exports = FunctionEvent;