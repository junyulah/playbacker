'use strict';

// get refreshId, when jump to this page, get the current index of actions
// and get the current action's refreshId
// bad logic
let getRefreshId = (actions, index) => {
    let action = actions[index];
    let refreshId = action && action.refreshId;
    return refreshId;
};

module.exports = getRefreshId;
