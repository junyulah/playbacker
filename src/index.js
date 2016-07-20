'use strict';

let startMomenter = require('./startMomenter');

let runAction = require('./runAction');

let getRefreshId = require('./getRefreshId');

let toNextMoment = require('./toNextMoment');

let rejectWaitRefreshError = require('./rejectWaitRefreshError.js');

let playAction = require('./playAction');

let model = require('./model');

let startPlayMoment = startMomenter();

/**
 * page turning bug fix thoughts
 *
 * 1. action trigger moment ? (this rule?)
 *
 * action 1 -> action 2
 *
 * if action 1 and action are not in the same page, then action2 should not trigger until to next page.
 *
 * actual, when recoding actions, we can know that.
 */

module.exports = {
    startPlayMoment,
    runAction,
    toNextMoment,
    getRefreshId,
    rejectWaitRefreshError,
    playAction,
    model
};
