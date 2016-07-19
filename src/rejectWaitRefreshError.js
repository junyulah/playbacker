'use strict';

let rejectWaitRefreshError = (action, refreshId) => {
    let refreshWaitTime = getRefreshWaitTime(action);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(
                new Error(JSON.stringify({
                    type: 'timeout: action.refreshWaitTime',
                    message: {
                        ationUrl: action.extra.url,
                        currentUrl: window.location.href,
                        pageRefreshId: refreshId,
                        actionRefreshId: action.refreshId,
                        action
                    }
                }, null, 4))
            );
        }, refreshWaitTime);
    });
};

let getRefreshWaitTime = (action) => {
    let refreshWaitTime = 5000;
    if(action.gapTimeToPrev) {
        refreshWaitTime = action.gapTimeToPrev + 3500;
    }
    return refreshWaitTime;
};

module.exports = rejectWaitRefreshError;
