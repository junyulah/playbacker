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
    before = id, after = id, log = id
} = {}) => {
    log(`start to play action ${action.id}`);
    before(action);
    // wait the moment

    log(`wait to action start momemnt ${action.gapTimeToPrev}`);
    return toNextMoment(action).then(() => {
        log('finished waiting');

        // not in the same page, should not run this action here, wait for refreshing.
        if (refreshId !== action.refreshId) {
            log('not in the same page, should not run this action here, wait for refreshing');
            return rejectWaitRefreshError(action, refreshId);
        }

        // assert before state
        collectAsserts(assertBeforeState(action.beforeState));

        // start to run action
        return runAction(action, {
            log
        }).then(() => {
            // assert after state
            collectAsserts(assertAfterState(action.afterState));
            //
            return after(action);
        });
    });
};

module.exports = playAction;
