'use strict';

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

let getDisplayText = (node) => {
    if (node.nodeType === 3) {
        return node.textContent || '';
    }

    if (node.nodeType !== 1) {
        return '';
    }

    if(node.tagName === 'INPUT') {
        return node.value || '';
    }

    if (node.tagName === 'HEAD' ||
        node.tagName === 'LINK' ||
        node.tagName === 'SCRIPT' ||
        node.tagName === 'NOSCRIPT' ||
        node.tagName === 'CANVAS' ||
        node.tagName === 'STYLE' ||
        node.tagName === 'META') {
        return '';
    }

    let style = window.getComputedStyle(node);
    let display = style.display;

    if (display === 'none') {
        return '';
    } else {
        let text = '';
        let children = node.childNodes;
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            text += getDisplayText(child);
        }

        return text;
    }
};
