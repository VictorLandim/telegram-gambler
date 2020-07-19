import * as dotenv from 'dotenv'
dotenv.config()

import * as admin from 'firebase-admin'

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