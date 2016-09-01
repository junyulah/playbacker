'use strict';

let toNextMoment = require('./playAction/toNextMoment');

let playAction = require('./playAction');

let model = require('./model');

let assertState = require('front-assertion');

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
    toNextMoment,
    playAction,
    model,
    assertState
};
