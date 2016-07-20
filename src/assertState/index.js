'use strict';

let keywordInPage = require('./parser/keywordInPage');

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
    keywordInPage
};

// beforeNextActionRun assertion
let assertBeforeState = (beforeState) => {
    let assertion = beforeState.assertion || {};
    let beforeNextActionRun = assertion.beforeNextActionRun || [];

    for (let i = 0; i < beforeNextActionRun.length; i++) {
        let {
            type, content, opts
        } = beforeNextActionRun[i];
        // run assertion
        runAssertion(type, content, opts);
    }
};

let assertAfterState = (afterState) => {
    let assertion = afterState.assertion || {};
    let asyncTime = assertion.asyncTime || [];
    assertAsyncTime(asyncTime);
};

let assertAsyncTime = (asyncTime) => {
    for (let i = 0; i < asyncTime.length; i++) {
        let {
            time = 0, type, content, opts
        } = asyncTime[i];

        setTimeout(() => {
            runAssertion(type, content, opts);
        }, time);
    }
};

let runAssertion = (type, content, opts) => {
    parserMap[type](content, opts);
};

module.exports = {
    assertBeforeState,
    assertAfterState
};
