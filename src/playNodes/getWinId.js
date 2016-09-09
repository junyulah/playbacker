'use strict';

let {
    getFragmentWinIndex
} = require('../model');

// find which window to play fragments
let getWinId = (fragment, windows, fragments) => {
    let winIndex = getFragmentWinIndex(fragment, fragments);

    if (winIndex <= 0) {
        return null;
    } else {
        // TODO bug fix, delay to next moment
        return delay(1000).then(() => {
            // TODO bug window still not created
            // run at leaf window
            let winId = windows[winIndex - 1];
            return winId;
        });
    }
};

let delay = (time) => new Promise((resolve) => {
    setTimeout(resolve, time);
});

module.exports = getWinId;
