'use strict';

/**
 *  play a group of actions on this window
 */

let pageBreakPoint = require('handlebreak');

let getRefreshId = require('./getRefreshId');

let runAction = require('./runAction');

let toNextMoment = require('./toNextMoment');

let rejectWaitRefreshError = require('./rejectWaitRefreshError');

let getFragmentLastRefreshId = (actions, start, end) => {
    let fragment = actions.slice(start, end + 1);
    let refreshId = fragment.length && fragment[fragment.length - 1].refreshId;
    return refreshId;
};

module.exports = (({
    start,
    end,
    actions,
    memory,
    actionIndexKey,
    actionOpts
}) => {
    let {
        handleBreakList, getIndex
    } = pageBreakPoint(memory, actionIndexKey, actions, start, end);

    return getIndex().then(index => {
        // be ready to play
        let refreshId = getRefreshId(actions, index);
        let playAction = (...args) => {
            actionOpts && actionOpts.before.apply(undefined, args);
            let action = args[0];
            // wait the moment
            return toNextMoment(action).then(() => {
                // not in the same page, should not run this action here, wait for refreshing.
                if (refreshId !== action.refreshId) {
                    return rejectWaitRefreshError(action, refreshId);
                }

                // run action
                return runAction(action, {
                    actionOpts
                }).then(() => {
                    return actionOpts && actionOpts.after.apply(undefined, args);
                });
            });
        };

        return handleBreakList(playAction).then(() => {
            return {
                refreshId: getFragmentLastRefreshId(actions, start, end),
                next: end + 1
            };
        });
    });
});
