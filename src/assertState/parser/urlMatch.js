'use strict';

/**
 * match url to assertion current page state
 */

/**
 * type: regExp | ...
 */
module.exports = ({
    type,
    content
}) => {
    if (type === 'regExp') {
        let reg = new RegExp(content);

        let ret = reg.test(window.location.href);

        if (!ret) {
            throw new Error(`url not match. regExp is ${content}, url is ${window.location.href}`);
        }
    }
};
