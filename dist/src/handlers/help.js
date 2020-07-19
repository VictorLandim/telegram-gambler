"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleHelp = void 0;
var handleHelp = function (ctx) {
    ctx.reply("\nThese are the available commands:\n    ", { parse_mode: 'HTML' });
};
exports.handleHelp = handleHelp;
