'use strict';

let toNextMoment = require('./toNextMoment');

let runAction = require('../runAction');

let rejectWaitRefreshError = require('./rejectWaitRefreshError');

let {
    assertBeforeState, assertAfterState
} = require('../assertState');

let id = v => v;

let playAction = (action, refreshId, {
    collectAsserts,
    similarityFailThreshold,
    before = id, after = id, log = id
} = {}) => {
    log(`start to play action ${action.id}`);
    before(action);
    // wait the moment

    log(`wait to action start moment ${action.gapTimeToPrev}`);
    return toNextMoment(action).then(() => {
        log('finished waiting');

        // not in the same page, should not run this action here, wait for refreshing.
        if (refreshId !== action.refreshId) {
            log('not in the same page, should not run this action here, wait for refreshing');
            return rejectWaitRefreshError(action, refreshId);
        }

        // assert before state
        collectAsserts(assertBeforeState(action.beforeState, {
            log
        }));

        // start to run action
        return runAction(action, {
            log,
            similarityFailThreshold
        }).then(() => {
            // assert after state
            collectAsserts(assertAfterState(action.afterState, {
                log
            }));
            //
            return after(action);
        });
    });
};

module.exports = playAction;
