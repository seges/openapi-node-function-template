# Function internal schema

```
functions:
  customer-performance:
    lang: openapi-node-function-template
    handler: ./customer-performance
    image: yeself/customer-performance:latest
    environment:
      logger__level: debug
      openapi__filename: /home/app/function/api.json
```

**openapi__filename** points to a file inside the function project.

```
{
    "openapi": "3.0.0",
    "paths": {
        "/": {
            "post": {
                "operationId": "singleHandler",
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
        "title": "Customer Performance Function API",
        "version": "1.0.0"
    },
    "servers": [
        {
            "url": "/"
        }
    ]
}
```
