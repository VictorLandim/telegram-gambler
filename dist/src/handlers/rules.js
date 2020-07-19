"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRules = void 0;
var handleRules = function (ctx) {
    ctx.reply("\nCollect shmuckles and gamble them!\nDice multipliers:\n(1): -10%\n(2): -25%\n(3): -50%\n(4): +10%\n(5): +25%\n(6): +50%\n    ", { parse_mode: 'HTML' });
};
exports.handleRules = handleRules;
