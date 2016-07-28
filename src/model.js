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
    findIndex, group, getDistinctIndex, contain
} = require('./util');

/**
 * action {beforeState, afterState}
 */
let toActionList = (nodes) => {
    let actions = [];
    let prevState = null;
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        if (node.type === 'action') {
            node.beforeState = prevState;
            actions.push(node);
        } else {
            let last = actions[actions.length - 1];
            if (last) {
                last.afterState = node;
            }
            prevState = node;
        }
    }
    return actions;
};

let getFragments = (nodes) => group(toActionList(nodes), (node) => node.winId);

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

let isLastAction = (fragments, action) => {
    let lastFragment = fragments[fragments.length - 1];
    return action === lastFragment[lastFragment.length - 1];
};

let getLastAction = (fragments) => {
    let lastFragment = fragments[fragments.length - 1];
    if (!lastFragment || !lastFragment.length) return null;
    return lastFragment[lastFragment.length - 1];
};

module.exports = {
    getFragments,
    getFragmentWinIndex,
    getRefreshIds,
    getRefreshIndex,
    getRefreshId,
    isLastAction,
    getLastAction
};
