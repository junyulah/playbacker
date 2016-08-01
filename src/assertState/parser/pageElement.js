'use strict';

let {
    findNode, getAllNodes
} = require('../../findNode');

let {
    serializeNode, serializePath
} = require('serialize-front');

module.exports = (nodeInfos) => {
    let nodes = getAllNodes();
    for (let i = 0; i < nodeInfos.length; i++) {
        let source = nodeInfos[i];
        let {
            node
        } = findNode(source, {
            nodes
        });
        assertNodeState(node, source);
    }
};

let assertNodeState = (node, source) => {
    let targetInfo = serializeNode(node, {
        textContent: true,
        style: true
    });

    targetInfo.path = serializePath(node);

    // check style
    let chosenStyle = source.chosenStyle;
    for (let name in chosenStyle) {
        let marked = chosenStyle[name];

        let cur = targetInfo.style.style[name];
        if (marked !== cur) {
            throw new Error(`marked style is not equal. style name is ${name}. marked: ${marked}, real: ${cur}.`);
        }
    }
    // check textConten
    if (source.chosenText) {
        if (source.textContent !== targetInfo.textContent) {

            throw new Error(`text content value is not equal. source text is ${source.textContent}, real text is ${targetInfo.textContent}.`);
        }
    }
};
