"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGamble = void 0;
var util_1 = require("../util");
var diceData = {
    1: {
        mult: 0.5,
    },
    2: {
        mult: 0.75,
    },
    3: {
        mult: 0.9,
    },
    4: {
        mult: 1.1,
    },
    5: {
        mult: 1.25,
    },
    6: {
        mult: 1.5,
    },
};
var containsValue = function (text) { var _a; return !!Number(text.split(' ')[1]) || ((_a = text.split(' ')[1]) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === 'all'; };
var handleGamble = function (db) {
    return function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var chatId, userId, userRef, foundUser, points, pointsToGamble, dice, diceVal, message, updatedPoints, pointMessage, e_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!containsValue(ctx.message.text)) return [3 /*break*/, 11];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 9, , 10]);
                    chatId = String(ctx.chat.id);
                    userId = String(ctx.from.id);
                    userRef = db.collection(chatId).doc(userId);
                    return [4 /*yield*/, userRef.get()];
                case 2:
                    foundUser = _b.sent();
                    points = !foundUser.exists
                        ? 0
                        : foundUser.data().points;
                    pointsToGamble = ((_a = ctx.message.text.split(' ')[1]) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === 'all'
                        ? points
                        : Number(ctx.message.text.split(' ')[1]);
                    if (!(pointsToGamble <= 0)) return [3 /*break*/, 3];
                    ctx.reply('Invalid amount!');
                    return [3 /*break*/, 8];
                case 3:
                    if (!(pointsToGamble <= points)) return [3 /*break*/, 7];
                    if (pointsToGamble === points)
                        ctx.reply('Going all in!');
                    return [4 /*yield*/, ctx.replyWithDice()];
                case 4:
                    dice = (_b.sent()).dice;
                    diceVal = dice.value.toString();
                    message = ctx.from.first_name + " just rolled a beautiful " + diceVal + "!";
                    return [4 /*yield*/, util_1.waitFor(3500)];
                case 5:
                    _b.sent();
                    ctx.reply(message);
                    return [4 /*yield*/, util_1.waitFor(200)];
                case 6:
                    _b.sent();
                    updatedPoints = (points - pointsToGamble) + Math.floor(pointsToGamble * diceData[diceVal].mult);
                    updatedPoints = updatedPoints < 0
                        ? 0
                        : updatedPoints;
                    userRef.set(__assign(__assign({}, ctx.from), { points: updatedPoints }));
                    pointMessage = updatedPoints > points
                        ? "You won " + (updatedPoints - points) + " schmuckle" + (updatedPoints - points > 1 ? 's' : '') + "!"
                        : "You lost " + (points - updatedPoints) + " schmuckle" + (points - updatedPoints > 1 ? 's' : '') + "!";
                    ctx.reply(pointMessage + "\nYour now have: " + updatedPoints + " schmuckles");
                    return [3 /*break*/, 8];
                case 7:
                    ctx.reply("You can't gamble more schmuckles than you have.");
                    _b.label = 8;
                case 8: return [3 /*break*/, 10];
                case 9:
                    e_1 = _b.sent();
                    console.log(e_1);
                    return [3 /*break*/, 10];
                case 10: return [3 /*break*/, 12];
                case 11:
                    ctx.reply("Invalid roll, value missing \\.\nUsage: `\/roll [value]` ", { parse_mode: 'MarkdownV2' });
                    _b.label = 12;
                case 12: return [2 /*return*/];
            }
        });
    }); };
};
exports.handleGamble = handleGamble;
