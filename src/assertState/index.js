'use strict';

let keywordInPage = require('./parser/keywordInPage');

let urlMatch = require('./parser/urlMatch');

let code = require('./parser/codeRule');

let pageElement = require('./parser/pageElement');

/**
 * state assert data structure
 *
 * state {
 *   type: 'state',
 *   duration: [],
 *   assertion: {
 *      'beforeNextActionRun': [{
 *          type: '',
 *          content,
 *          opts
 *      }],
 *      'asyncTime': [{
 *          time,
 *          type: '',
 *          content,
 *          opts
 *      }],
 *      ...
 *   }
 * }
 */

/**
 * type: parser
 */
let parserMap = {
    keywordInPage,
    urlMatch,
    code,
    pageElement
};

// beforeNextActionRun assertion
let assertBeforeState = (beforeState, {
    log
}) => {
    let rets = [];

    let beforeNextActionRun = getBeforeNextActionRun(beforeState);

    for (let i = 0; i < beforeNextActionRun.length; i++) {
        let {
            type, content, opts
        } = beforeNextActionRun[i];
        // run assertion
        let ret = runAssertion(type, content, opts);
        ret = Promise.resolve(ret);

        // log
        ret.then((res) => {
            log(`[assertion pass] Assertion type is ${type}. Assertion content is ${JSON.stringify(content, null, 4)}.`);
            return res;
        }).catch(err => {
            log(`[assertion fail] Assertion type is ${type}. Assertion content is ${JSON.stringify(content, null, 4)}. Error message ${err}`);
            throw err;
        });

        rets.push(ret);
    }
    return Promise.all(rets);
};

let getBeforeNextActionRun = (state) => {
    let assertion = state.assertion || {};
    let beforeNextActionRun = assertion.beforeNextActionRun || [];
    return beforeNextActionRun;
};

let assertAfterState = (afterState) => {
    let assertion = afterState.assertion || {};
    let asyncTime = assertion.asyncTime || [];
    return assertAsyncTime(asyncTime);
};

let assertLastState = (afterState, {
    log,
    delayTime = 3000
} = {}) => {
    return delay(delayTime).then(() => {
        return assertBeforeState(afterState, {
            log
        });
    });
};

let assertAsyncTime = (asyncTime) => {
    let rets = [];
    for (let i = 0; i < asyncTime.length; i++) {
        let {
            time = 0, type, content, opts
        } = asyncTime[i];

        let ret = delay(time).then(() => runAssertion(type, content, opts));
        rets.push(ret);
    }
    return Promise.all(rets);
};

let runAssertion = (type, content, opts) => {
    try {
        let ret = parserMap[type](content, opts);
        return Promise.resolve(ret);
    } catch (err) {
        return Promise.reject(err);
    }
};

let delay = (time) => {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
};

module.exports = {
    assertBeforeState,
    assertAfterState,
    assertLastState,
    getBeforeNextActionRun
};
