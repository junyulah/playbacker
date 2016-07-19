'use strict';

/**
 * use a simple algo right now
 *
 * 1. get all fragments
 *
 * 2. find current action index
 *
 * 3. current fragment
 *
 * 4. window index
 *
 * TODO unit tests
 */

let {
    findIndex, group, findListInGroup, getDistinctIndex, contain
} = require('./util');

let getActionFragment = (actions, index) => {
    // group by winId
    let fragments = getFragments(actions);

    let fragInfo = findListInGroup(fragments, index);

    if (fragInfo) {
        fragInfo.fragment = fragInfo.list;
        fragInfo.actions = actions;
        // chose window
        let winIndex = getDistinctIndex(getWinIds(fragments), fragInfo.index);
        return {
            winIndex,
            fragInfo
        };
    }
    return {
        fragInfo,
        winIndex: -1
    };
};

let getFragments = (actions) => group(actions, (action) => action.winId);

let getFragmentWinIndex = (fragment, fragments) => {
    let fIndex = findIndex(fragments, fragment);
    let winIds = getWinIds(fragments);
    return getDistinctIndex(winIds, fIndex);
};

/**
 * exclude root window
 *
 * analysis fragments to know the window switch information
 */

let getWinIds = (fragments) => {
    let winIds = [];
    for (let i = 0; i < fragments.length; i++) {
        let fragment = fragments[i];
        if (fragment.length) {
            let winId = fragment[0].winId;
            winIds.push(winId);
        }
    }
    return winIds;
};

let getRefreshIds = (fragments) => {
    let ids = [];
    for (let i = 0; i < fragments.length; i++) {
        let fragment = fragments[i];
        for (let j = 0; j < fragment.length; j++) {
            let action = fragment[j];
            if (!contain(ids, action.refreshId)) {
                ids.push(action.refreshId);
            }
        }
    }
    return ids;
};

let getRefreshIndex = (action, fragments) => {
    return findIndex(getRefreshIds(fragments), action.refreshId);
};

let getRefreshId = (fragments, index) => getRefreshIds(fragments)[index];

module.exports = {
    getActionFragment,
    getFragments,
    getFragmentWinIndex,
    getRefreshIds,
    getRefreshIndex,
    getRefreshId
};
