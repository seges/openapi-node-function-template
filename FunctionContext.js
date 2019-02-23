class FunctionContext {
    constructor(cb) {
        this.value = 200;
        this.cb = cb(this);
        this.headerValues = {};
    }

    status(value) {
        if(!value) {
            return this.value;
        }

        this.value = value;
        return this;
    }

    headers(value) {
        if(!value) {
            return this.headerValues;
        }

        this.headerValues = value;
        return this;    
    }

    succeed(value) {
        let err;
        this.cb(err, value);
    }

    fail(value) {
        let message;
        this.cb(value, message);
    }
}

module.exports = FunctionContext;