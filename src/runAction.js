'use strict';

let findNode = require('./findNode');

let {
    evalCode
} = require('./util');

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
 */

let runAction = (action, opts) => {
    let {
        actionOpts
    } = opts;

    // wrap action
    action = wrapAction(action);

    // after before
    return beforeAction(action).then(() => {
        // step 1: find the target node
        let {
            node, degree
        } = findNode(action.source);
        actionOpts.findedNode && actionOpts.findedNode(node, degree);
        // step2: dispatch the event
        dispatchEvent(node, action.event);
        actionOpts.dispatchedEvent && actionOpts.dispatchedEvent(action.event);
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
    window.scrollTo(attachedUIStates.window.pageXOffset, attachedUIStates.window.pageYOffset);

    let current = attachedUIStates.current;
    for (let name in current) {
        node[name] = current[name];
    }
};

let dispatchEvent = (node, eInfo) => {
    let type = eInfo.type;
    // trigger event
    let event = new Event(type, eInfo);
    node.dispatchEvent(event);
};

let id = v => v;

module.exports = runAction;
