'use strict';

let {
    findNode
} = require('../findNode');

let {
    evalCode
} = require('jsenhance');

/**
 *
 * action interface
 *
 *      wrapAction
 *      before
 *      after
 *      waitTimeout
 *      waitTime
 *      refreshWaitTime
 *
 *      event
 *      source
 *      attachedUIStates
 */

let id = v => v;

let runAction = (action, {
    similarityFailThreshold = 0.15,
        log = id
} = {}) => {

    // wrap action
    action = wrapAction(action);

    // after before
    return beforeAction(action).then(() => {
        log('start to find target node');
        // step 1: find the target node
        let {
            node, degree
        } = findNode(action.source, {
            similarityFailThreshold
        });
        log(`find node with degree ${degree}`);
        // step2: dispatch the event
        dispatchEvent(node, action.event);
        // step3: apply some page states
        applyPageState(node, action.attachedUIStates);
    }).then(() => {
        return afterAction(action);
    });
};

let wrapAction = (action) => {
    let wrap = evalCode(action.wrapAction) || id;
    // wrap action
    action = wrap(action);
    return action;
};

let beforeAction = (action) => {
    let before = evalCode(action.before) || id;

    return Promise.resolve(before(action));
};

let afterAction = (action) => {
    let after = evalCode(action.after) || id;

    return Promise.resolve(after(action));
};

let applyPageState = (node, attachedUIStates) => {
    let windowInfo = attachedUIStates.window;
    if (windowInfo) {
        window.scrollTo(windowInfo.pageXOffset, windowInfo.pageYOffset);
    }

    let current = attachedUIStates.current;
    if (current) {
        for (let name in current) {
            node[name] = current[name];
        }
    }
};

let dispatchEvent = (node, eInfo) => {
    let type = eInfo.type;
    // trigger event
    let event = new Event(type, eInfo);
    node.dispatchEvent(event);
};

module.exports = runAction;
