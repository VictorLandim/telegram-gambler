"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitFor = void 0;
var waitFor = function (timeMs) {
    return new Promise(function (resolve) { return setTimeout(resolve, timeMs); });
};
exports.waitFor = waitFor;
