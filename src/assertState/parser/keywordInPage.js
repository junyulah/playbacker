'use strict';

let {
    getDisplayText
} = require('page-text');

/**
 * keyword that page contains
 */

module.exports = (keywords) => {
    let text = getDisplayText(document.body);
    for (let i = 0; i < keywords.length; i++) {
        let keyword = keywords[i];
        if (text.indexOf(keyword) === -1) {
            throw new Error(`missing keyword: ${keyword} in page`);
        }
    }
};
