'use strict';

let startMomenter = () => {
    let loadedFlag = false;

    let resolves = [];

    document.addEventListener('DOMContentLoaded', () => {
        loadedFlag = true;
        for (let i = 0; i < resolves.length; i++) {
            resolves[i]();
        }
    });

    // generalWaitTime is used for async rendering
    return ({
        generalWaitTime, startTimeout
    }) => new Promise((resolve, reject) => {
        resolves.push(resolve);
        if (loadedFlag || document.body) {
            setTimeout(resolve, generalWaitTime);
        } else {
            setTimeout(() => {
                reject(new Error('timeout'));
            }, startTimeout);
        }
    });
};

module.exports = startMomenter;
