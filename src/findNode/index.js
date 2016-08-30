'use strict';

let {
    findMostSimilarNode
} = require('dom-node-similarity');

let {
    contain
} = require('bolzano');

let {
    serializeNodes
} = require('serialize-front');

/**
 * nodeMap = {
 *     domNodeId: node
 * }
 */
let nodeMap = {};

let findNode = (source, opts) => {
    if (source.domNodeId) {
        let savedNode = nodeMap[source.domNodeId];
        // find in cache
        if (savedNode &&
            getRoot(savedNode.node) === document) {
            return savedNode;
        } else {
            let node = queryNode(source, opts);
            nodeMap[source.domNodeId] = node;
            return node;
        }
    } else {
        let node = queryNode(source, opts);
        return node;
    }
};

let getRoot = (node) => {
    let root = node;
    while (root.parentNode) {
        root = root.parentNode;
    }
    return root;
};

let queryNode = (source, {
    nodes,
    similarityFailThreshold,
    selector
}) => {
    // filter all nodes by some informations
    nodes = nodes || getAllNodes(null, selector);

    if (!nodes.length) {
        throw new Error('fail to find target node for source' + JSON.stringify(source));
    }

    // find the most possibility one
    let ret = findTheMostPossibleOne(nodes, source);

    if (ret.degree < similarityFailThreshold) {
        throw new Error(`node similarity degree is ${ret.degree} lower than ${similarityFailThreshold}. finded node is ${ret.node}, source is ${JSON.stringify(source)}`);
    }
    return ret;
};

let findTheMostPossibleOne = (nodes, source) => {
    let nodeInfos = serializeNodes(nodes);

    let {
        index, degree
    } = findMostSimilarNode(nodeInfos, source);

    return {
        node: nodes[index],
        degree
    };
};

let getAllNodes = (parent, selector = '*') => {
    parent = parent || document;

    let nodes = [];
    if (parent.querySelectorAll) {
        nodes = parent.querySelectorAll(selector);
    } else {
        nodes = degradeFindAll(parent);
    }

    let rets = [];
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        if (!contain(['HEAD', 'SCRIPT', 'LINK'], node.tagName)) {
            rets.push(node);
        }
    }

    return rets;
};

let degradeFindAll = (parent) => {
    let nodes = [];

    for (let i = 0; i < parent.children.length; i++) {
        let child = parent.children[i];
        nodes.push(child);
        nodes = nodes.concat(
            degradeFindAll(child)
        );
    }

    return nodes;

};

module.exports = {
    findNode, getAllNodes
};
