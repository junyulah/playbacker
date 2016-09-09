'use strict';

let playNodes = require('./playNodes');

let {
    runSequence
} = require('jsenhance');

let {
    map
} = require('bolzano');

let runWithPlugins = (plugins, startRun, {
    log
} = {}) => {
    return new Promise((resolve, reject) => {
        let beforeWaitNextMoment = (action) => {
            return runSequence(map(plugins, (plugin) => plugin.beforeWaitNextMoment), [action, resolve, reject], 'stop');
        };

        let beforeRunAction = (action) => {
            return runSequence(map(plugins, (plugin) => plugin.beforeRunAction), [action, resolve, reject]);
        };

        let afterRunAction = (action) => {
            return runSequence(map(plugins, (plugin) => plugin.afterRunAction), [action, resolve, reject]);
        };

        let errorAction = (action, err) => {
            return runSequence(map(plugins, (plugin) => plugin.errorAction), [action, err, resolve, reject]);
        };

        let afterPlay = () => {
            return runSequence(map(plugins, (plugin) => plugin.afterPlay), [resolve, reject]);
        };

        let errorPlay = (err) => {
            return runSequence(map(plugins, (plugin) => plugin.errorPlay), [err, resolve, reject]);
        };

        startRun({
            beforeWaitNextMoment,
            beforeRunAction,
            afterRunAction,
            errorAction,
            log
        }).then(afterPlay).catch(errorPlay);
    });
};

module.exports = (nodes, options) => {
    let {
        startRun, getInitState
    } = playNodes(nodes, options);

    let startPlay = (plugins, opts) => {
        return runWithPlugins(plugins, startRun, opts);
    };

    return {
        getInitState,
        startPlay
    };
};
