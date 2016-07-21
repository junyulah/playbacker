'use strict';

let toNextMoment = require('./toNextMoment');

let runAction = require('./runAction');

let rejectWaitRefreshError = require('./rejectWaitRefreshError');

let {
    assertBeforeState, assertAfterState
} = require('./assertState');

let id = v => v;

let playAction = (action, refreshId, {
    collectAsserts,
    before = id, after = id
} = {}) => {
    before(action);
    // wait the moment
    return toNextMoment(action).then(() => {
        // not in the same page, should not run this action here, wait for refreshing.
        if (refreshId !== action.refreshId) {
            return rejectWaitRefreshError(action, refreshId);
        }

        // assert before state
        collectAsserts(assertBeforeState(action.beforeState));

        // start to run action
        return runAction(action).then(() => {
            // assert after state
            collectAsserts(assertAfterState(action.afterState));
            //
            return after(action);
        });
    });
};

module.exports = playAction;
