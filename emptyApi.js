const emptyApi = (operationId = 'singleHandler') => ({
    "openapi": "3.0.0",
    "paths": {
        "/": {
            "post": {
                "operationId": operationId,
                "responses": {
                    "200": {
                        "description": "OK",
                        "x-oad-type": "response"
                    }
                },
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "x-oad-type": "object",
                                "type": "object"
                            }
                        }
                    },
                    "required": true,
                    "x-oad-type": "parameter"
                }
            },
            "x-oad-type": "operation"
        }
    },
    "info": {
        "title": "Function API",
        "version": "1.0.0"
    },
    "servers": [
        {
            "url": "/"
        }
    ]
});

module.exports = emptyApi;
