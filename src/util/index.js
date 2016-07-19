'use strict';

const classNameReg = /\[object (.*)\]/;

let isAtom = v => !v || typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean';

let findProtoOwnMethod = (obj, name) => {
    if (obj.hasOwnProperty(name)) {
        return obj;
    }
    return findProtoOwnMethod(Object.getPrototypeOf(obj), name);
};

let getClassName = (e) => {
    let cons = Object.getPrototypeOf(e);
    return cons.toString().match(classNameReg)[1];
};

let evalCode = (code) => {
    if (typeof code !== 'string') return code;
    return `(function(){
    try {
        return ${code}
    } catch(err) {
        console.log('Error happened, when eval code: ${code}');
        throw err;
    }
})()`;
};

let isPromise = (v) => v && typeof v === 'object' && typeof v.then === 'function' && typeof v.catch === 'function';

let counter = 0;

let genId = () => {
    counter++;
    if (counter > 10e6) {
        counter = 0;
    }
    let id = `${Math.random(Math.random(Math.random()))}-${new Date().getTime()}-${counter}`;
    id = id.replace(/\./g, '');
    return id;
};

let getAttributes = (el) => {
    let attributes = {};
    for (let i = 0; i < el.attributes.length; i++) {
        let attr = el.attributes[i];
        attributes[attr.nodeName] = attr.nodeValue;
    }
    return attributes;
};

let contain = (list, item) => {
    for (let i = 0; i < list.length; i++) {
        if (item === list[i]) {
            return true;
        }
    }
    return false;
};

let shadowClone = (map = {}) => {
    let newMap = {};
    for (let name in map) {
        newMap[name] = map[name];
    }
    return newMap;
};

let interset = (list1, list2) => {
    let ret = [];
    for (let i = 0; i < list1.length; i++) {
        if (contain(list2, list1[i]) &&
            !contain(ret, list1[i])) {
            ret.push(list1[i]);
        }
    }
    return ret;
};

let union = (list1, list2) => {
    let ret = [];

    for (let i = 0; i < list1.length; i++) {
        if (!contain(ret, list1[i])) {
            ret.push(list1[i]);
        }
    }

    for (let i = 0; i < list2.length; i++) {
        if (!contain(ret, list2[i])) {
            ret.push(list2[i]);
        }
    }

    return ret;
};

let getKeys = (obj) => {
    if (Object.keys) {
        return Object.keys(obj);
    } else {
        let keys = [];
        for (let name in obj) {
            keys.push(name);
        }
        return keys;
    }
};

let getValues = (obj, keys) => {
    let values = [];
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        values.push(obj[key]);
    }
    return values;
};

let mapToList = (obj, join = defJoin) => {
    let ret = [];
    for (let name in obj) {
        ret.push(join(name, obj[name]));
    }
    return ret;
};

let defJoin = (key, value) => [key, value];

let maxItem = (list, compare = defCompare) => {
    if (!list || !list.length) return {
        index: -1
    };
    let cur = list[0],
        index = 0;
    for (let i = 1; i < list.length; i++) {
        let next = list[i];
        if (compare(next, cur)) {
            cur = next;
            index = i;
        }
    }
    return {
        item: cur,
        index
    };
};

let maxIndex = (list, compare) => maxItem(list, compare).index;

let defCompare = (a, b) => a > b;

let findIndex = (list, item) => {
    for (let i = 0; i < list.length; i++) {
        if (item === list[i]) {
            return i;
        }
    }
    return -1;
};

let group = (list = [], feature) => {
    let fragments = [];
    let cur = null;
    let fragment = null;
    for (let i = 0; i < list.length; i++) {
        let item = list[i];
        if (!cur) {
            cur = feature(item);
            fragment = [item];
            fragments.push(fragment);
        } else {
            if (feature(item) === cur) {
                fragment.push(item);
            } else {
                //
                cur = feature(item);
                fragment = [item];
                fragments.push(fragment);
            }
        }
    }
    return fragments;
};

let findListInGroup = (matrix, index = 0) => {
    let pass = 0;
    for (let i = 0; i < matrix.length; i++) {
        let list = matrix[i];
        if (list.length) {
            let limit = pass + list.length - 1;
            if (index >= pass && index <= limit) {
                return {
                    index: i,
                    start: pass,
                    end: limit,
                    list
                };
            }
            pass = limit + 1;
        }
    }
};

let getDistinctIndex = (Ids, index) => {
    let collects = [];
    for (let i = 0; i <= index; i++) {
        let id = Ids[i];
        if (!contain(collects, id)) {
            collects.push(id);
        }
    }

    return findIndex(collects, Ids[index]);
};

module.exports = {
    maxIndex,
    mapToList,
    getKeys,
    getValues,
    contain,
    isAtom,
    findProtoOwnMethod,
    getClassName,
    evalCode,
    isPromise,
    genId,
    getAttributes,
    shadowClone,
    interset,
    union,
    findIndex,
    group,
    findListInGroup,
    getDistinctIndex
};
