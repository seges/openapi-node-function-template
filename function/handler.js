"use strict"

module.exports = (event, context) => {
    console.log('event', event);
    const res = {
        "niceJson": true
    }
    console.log('res', res);
    context
        .status(200)
        .succeed({ payload: res });
}

