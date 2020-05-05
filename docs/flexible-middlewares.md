# Flexible middleware injection

OpenAPI backend allows you to set additional options. One of them is `injectMiddlewares` function with following notation:

`const injectMiddlewares = (existingMiddlewares) => existingMiddlewares;`

If you provide such function, it should always return final set of middlewares. You are free to reorganize and include own in the list.

```
import service from "openapi-node-function-template/service";
import Keycloak from 'keycloak-connect';

const kcConfig = {};

const injectMiddlewares = (existingMiddlewares) => {
  const keycloak = new Keycloak(
    {},
    kcConfig
  );
  
  if (keycloak !== undefined) {
    console.log('Attaching Keycloak middleware');
    return [
      keycloak.middleware(),
      ...existingMiddlewares,
    ];
  } else {
    // always return middlewares
    return existingMiddlewares;
  }
}

service({
  handler1,
  handler2
}, { injectMiddlewares });
```
