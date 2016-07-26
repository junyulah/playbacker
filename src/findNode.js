'use strict';

let {
    findMostSimilarNode
} = require('dom-node-similarity');

let {
    contain
} = require('./util');

let {
    serializeNode, serializePath
} = require('serialize-front');

let findNode = (source) => {
    let {
        path
    } = source;

    path = path.slice(0);

    // filter all nodes by some informations
    let nodes = getAllNodes();

    if (!nodes.length) {
        throw new Error('fail to find target node for source' + JSON.stringify(source));
    }

    // find the most possibility one
    return findTheMostPossibleOne(nodes, source);
};

let findTheMostPossibleOne = (nodes, source) => {
    let nodeInfos = getAllNodeInfos(nodes);
    let {
        index, degree
    } = findMostSimilarNode(nodeInfos, source);

    return {
        node: nodes[index],
        degree
    };
};

let getAllNodeInfos = (nodes) => {
    let nodeInfos = [];
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        let nodeInfo = getNodeInfo(node);
        nodeInfos.push(nodeInfo);
    }
    return nodeInfos;
};

let getNodeInfo = (node) => {
    let nodeInfo = serializeNode(node, {
        textContent: true
    });
    let path = serializePath(node);

    return {
        node: nodeInfo,
        path
    };
};

let getAllNodes = (parent) => {
    parent = parent || document;

    let nodes = [];

    for (let i = 0; i < parent.children.length; i++) {
        let child = parent.children[i];
        if (contain(['HEAD', 'SCRIPT', 'LINK'], child.tagName)) {
            continue;
        }
        nodes.push(child);
        nodes = nodes.concat(
            getAllNodes(child)
        );
    }

    return nodes;
};

module.exports = findNode;
