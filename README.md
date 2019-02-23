# OpenAPI 3 function template

![Build Status](https://travis-ci.org/seges/openapi-node-function-template.svg?branch=master) ![OpenFaaS](https://img.shields.io/badge/openfaas-serverless-blue.svg) ![OpenAPI](https://img.shields.io/badge/openfaas-serverless-blue.svg)

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

[With internal API schema](./docs/internal-schema.md)
