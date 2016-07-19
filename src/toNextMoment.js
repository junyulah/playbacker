'use strict';

let toNextMoment = (nextAction, index, actions, lastworkTime) => {
    if (!nextAction) return Promise.resolve();
    let waitTimeout = nextAction.waitTimeout || 5000;

    let waitTime = getWaitTime(nextAction, lastworkTime);

    // trust gap time to next
    if (waitTime > waitTimeout) {
        waitTimeout = waitTime + 1500;
    }

    return new Promise((resolve, reject) => {
        if (waitTimeout && typeof waitTimeout === 'number') {
            setTimeout(() => {
                reject(
                    new Error(JSON.stringify({
                        type: 'timeout: action.waitTimeout',
                        action: nextAction
                    }, null, 4))
                );
            }, waitTimeout);
        }

        //
        playNextMomentByTime(waitTime).then(resolve).catch(reject);
    });
};

let getWaitTime = (action, lastworkTime) => {
    // when specify time, use it
    if (typeof action.waitTime === 'number') {
        return action.waitTime;
    } else {
        let restTime = action.gapTimeToPrev;
        if (lastworkTime) {
            let now = new Date().getTime();
            let passed = now - lastworkTime;
            restTime = restTime - passed;
            if (restTime < 0) restTime = 0;
        }
        return restTime;
    }
};

let playNextMomentByTime = (time = 500) => {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
};

module.exports = toNextMoment;
