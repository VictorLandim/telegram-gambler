import * as dotenv from 'dotenv'
dotenv.config()

import * as admin from 'firebase-admin'
const serviceAccount = require("../firestore.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://gambler-bot.firebaseio.com"
})

const db = admin.firestore()

import { Telegraf } from 'telegraf'
const bot = new Telegraf(process.env.TELEGRAM_KEY)

import {
  handleGamble,
  handleScore,
  handleMessage,
  handleRules,
  handleHelp,
  handleLeaderboard
} from './handlers'

bot.command('schmuckles', handleScore(db))
bot.command('leaderboard', handleLeaderboard(db))
bot.command('gamble', handleGamble(db))
bot.command('rules', handleRules)
bot.command('help', handleHelp)
bot.hears(['schmuckle', 'schmuckles', 'Schmuckle', 'Schmuckles'], (ctx) => ctx.reply('Did I hear anyone say schmuckle?'))
bot.on('message', handleMessage(db))

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

bot.launch()