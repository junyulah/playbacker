'use strict';

let toNextMoment = require('./toNextMoment');

let runAction = require('./runAction');

let rejectWaitRefreshError = require('./rejectWaitRefreshError');

let {
    assertBeforeState, assertAfterState
} = require('./assertState');

let playAction = (action, refreshId, actionOpts = {}) => {
    actionOpts.before && actionOpts.before(action);
    // wait the moment
    return toNextMoment(action).then(() => {
        // not in the same page, should not run this action here, wait for refreshing.
        if (refreshId !== action.refreshId) {
            return rejectWaitRefreshError(action, refreshId);
        }

        // assert before state
        assertBeforeState(action.beforeState);

        // start to run action
        return runAction(action, {
            actionOpts
        }).then(() => {
            // assert after state
            assertAfterState(action.afterState);
            //
            return actionOpts.after && actionOpts.after(action);
        });
    });
};

module.exports = playAction;
