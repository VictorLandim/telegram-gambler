import * as dotenv from 'dotenv'
dotenv.config()

import * as admin from 'firebase-admin'
import express from 'express'
import * as fetch from 'node-fetch'

const serviceAccount = {
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
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
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
  handleLeaderboard,
  handleKeyboard,
  handleGambleKeyboard,
  handleShop,
} from './handlers'

bot.command('schmuckles', handleScore(db))
bot.action('schmuckles', handleScore(db))

bot.command('leaderboard', handleLeaderboard(db))
bot.action('leaderboard', handleLeaderboard(db))

bot.command('gamble', handleGamble(db))
// bot.hears(/gamble/i, handleKeyboard)
bot.hears(/keyboard/i, handleKeyboard)
bot.action(/gamble_/, handleGambleKeyboard(db))

bot.command('rules', handleRules)
bot.command('help', handleHelp)
bot.command('shop', handleShop(db))
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

if (process.env.NODE_ENV === 'development') {
  bot.launch()
  console.log("🎲 Mr. Schmuckle running on development.")

} else if (process.env.NODE_ENV === 'production') {
  const port = process.env.PORT || 5000

  const expressApp = express()

  expressApp.use(bot.webhookCallback('/webhook'))
  bot.telegram.setWebhook(`${process.env.APP_URL}:8443/webhook`)

  expressApp.get('/', (req, res) => {
    res.json({ status: "Mr. Schmuckle online." })
  })

  expressApp.listen(port, () => {
    console.log(`🎲 Mr. Schmuckle running on production on port ${port}.`)
    fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_KEY}/setWebhook?url=${process.env.APP_URL}/webhook`)
  })

} else {
  console.log("process.env.NODE_ENV missing or invalid.")
}