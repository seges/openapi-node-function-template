# OpenAPI 3 function template

![Build Status](https://travis-ci.org/seges/openapi-node-function-template.svg?branch=develop) ![OpenFaaS](https://img.shields.io/badge/openfaas-serverless-blue.svg) ![OpenAPI](https://img.shields.io/badge/openfaas-serverless-blue.svg)[![npm version](https://img.shields.io/npm/v/openapi-node-function-template.svg)](https://www.npmjs.com/package/openapi-node-function-template)
[![npm downloads](https://img.shields.io/npm/dw/openapi-node-function-template)](https://www.npmjs.com/package/openapi-node-function-template)

Do you want to build a microservice based on OpenAPI 3 specification? Do you hate writing all the boilerplate endpoint code? Or do you need your neat serverless function? Running on OpenFaaS or another serverless provider?

You came to the right place.

OpenAPI Node Function Template is a single dependency along your OpenAPI 3 specification file you actually need in order to run your service!

- :white_check_mark: generated OpenAPI 3 REST endpoint
- :white_check_mark: validated inputs based on the provided schemas
- :white_check_mark: flexible middlewares
- :white_check_mark: follows OpenFaaS template but it is not bound to it
- :white_check_mark: running as standalone NodeJS server
- :white_check_mark: works on top of Express
- :white_check_mark: uses fantastic [OpenAPI Backend](https://github.com/anttiviljami/openapi-backend) project

## Release notes

### 1.5.1

* version fix of 1.5.0
* this version is also published to NPM

### 1.5.0

* passing request fields from OpenAPI Backend Context as part of FunctionEvent
* passing also raw Context if necessary
* documented FunctionEvent

### 1.4.0

* version bump
* upgraded OpenAPI Backend to 3.7.0
  * [list of changes](https://github.com/anttiviljami/openapi-backend/compare/2.3.0...3.7.0)

### 1.3.0

* support for flexible middleware injections

### 1.2.0

* upgraded OpenAPI Backend to 2.3.0

## Operation handler

Your operation handler for an endpoint looks like this:

```
export default async (message, context) => {
  context.status(200).succeed({ "nice": "json" });
}
```

Where `message` is of type `FunctionEvent` and `context` is of type `FunctionContext`.

## Environment configuration

| Variable                     | Default value      | Description
| -----------------------------| ------------------ | ------------------
| NODE_ENV                     |                    |
| SSL                          | false              |
| http__port                   | 4000               |
| http__request_id_header      | X-Request-Id       |
| http__ssl__key_file          | $(cwd)/ca/key.pem  |
| http__ssl__cert_file         | $(cwd)/ca/cert.pem |
| openapi__single_operation_id | singleHandler      |
| openapi__filename            |                    |
| openapi__url                 |                    |
| service__namespace           | default-ns         |
| request__body__size          | 1mb                |
| logger__name                 | defaultLogger      |
| logger__level                | info               |

## Examples

* [With internal API schema](./docs/internal-schema.md)
* [Flexible middlewares](./docs/flexible-middlewares.md)

## Develop

### Prepare .npmrc

Create `.npmrc` in the root:

```
save-exact=true
prefix=/home/developer/.npm-global
```

### Use Docker for development

`docker-compose up -d dev`
`docker-compose exec dev zsh`

### Publish

`npm login registry.npmjs.org`
`npm publish`

