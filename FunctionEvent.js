class FunctionEvent {
    constructor(c) {
        this.body = c.request.body;
        this.headers = c.request.headers;
        this.method = c.request.method;
        this.query = c.request.query;
        this.path = c.request.path;
    }
}

module.exports = FunctionEvent;