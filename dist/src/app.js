"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = __importStar(require("dotenv"));
dotenv.config();
var admin = __importStar(require("firebase-admin"));
var serviceAccount = {
    "type": process.env.FIREBASE_TYPE,
    "project_id": process.env.FIREBASE_PROJECT_ID,
    "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
    "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_CLIENT_ID,
    "auth_uri": process.env.FIREBASE_AUTH_URI,
    "token_uri": process.env.FIREBASE_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL,
};
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://gambler-bot.firebaseio.com"
});
var db = admin.firestore();
var telegraf_1 = require("telegraf");
var bot = new telegraf_1.Telegraf(process.env.TELEGRAM_KEY);
var handlers_1 = require("./handlers");
bot.command('schmuckles', handlers_1.handleScore(db));
bot.command('leaderboard', handlers_1.handleLeaderboard(db));
bot.command('gamble', handlers_1.handleGamble(db));
bot.command('rules', handlers_1.handleRules);
bot.command('help', handlers_1.handleHelp);
bot.hears(['schmuckle', 'schmuckles', 'Schmuckle', 'Schmuckles'], function (ctx) { return ctx.reply('Did I hear anyone say schmuckle?'); });
bot.on('message', handlers_1.handleMessage(db));
// ============= TESTING MENU STUFF
// import { MenuTemplate, MenuMiddleware } from 'telegraf-inline-menu'
// import { TelegrafContext } from 'telegraf/typings/context'
// const menuTemplate = new MenuTemplate<TelegrafContext>((ctx: TelegrafContext) => `Hey ${ctx.from.first_name}!`)
// const menuMiddleware = new MenuMiddleware('/', menuTemplate)
// menuTemplate.interact('I am excited!', 'a', {
//   do: async (ctx: TelegrafContext) => ctx.reply('As am I!') as any
// })
// bot.command('/s', (ctx) => menuMiddleware.replyToContext(ctx))
// bot.use(menuMiddleware)
// ============= TESTING MENU STUFF
if (process.env.NODE_ENV === 'development') {
    console.log("🎲 Mr. Schmuckle running on development.");
    bot.launch();
}
else if (process.env.NODE_ENV === 'production') {
    var port = process.env.PORT || 5000;
    console.log("\uD83C\uDFB2 Mr. Schmuckle running on production on port " + port + ".");
    require('http')
        .createServer(bot.webhookCallback('/telegram'))
        .listen(port);
}
else {
    console.log("process.env.NODE_ENV missing or invalid.");
}
