import { TelegrafContext } from "telegraf/typings/context"
import { Firestore } from '@google-cloud/firestore'
import { handleGamble } from "./gamble"

const handleKeyboard =
  (ctx: TelegrafContext): void => {
    ctx.reply(`${ctx.from.first_name} gambles: `, {
      reply_to_message_id: ctx.message.message_id,
      reply_markup: {
        resize_keyboard: true,
        inline_keyboard: [
          [
            { 'text': '1', callback_data: 'gamble_1' },
            { 'text': '2', callback_data: 'gamble_2' },
            { 'text': '3', callback_data: 'gamble_3' }
          ],
          [
            { 'text': '4', callback_data: 'gamble_4' },
            { 'text': '5', callback_data: 'gamble_5' },
            { 'text': '6', callback_data: 'gamble_6' }]
          ,
          [
            { 'text': '7', callback_data: 'gamble_7' },
            { 'text': '8', callback_data: 'gamble_8' },
            { 'text': '9', callback_data: 'gamble_9' }
          ],
          [
            { 'text': '0', callback_data: 'gamble_0' },
            { 'text': '❌', callback_data: 'gamble_cancel' },
            { 'text': '✅', callback_data: 'gamble_go' },
          ]
        ]
      }
    })
  }

const handleGambleKeyboard = (db: Firestore) =>
  async (ctx: TelegrafContext): Promise<void> => {
    try {
      const { data, message } = ctx.callbackQuery
      const amount = data.split('_')[1]

      if (amount === 'cancel') {
        ctx.deleteMessage(message.message_id)

      } else if (amount === 'go') {
        const gambleValue = message.text.split(':')[1]

        console.log(ctx.callbackQuery)
        const newCtx = {
          ...ctx,
          from: ctx.callbackQuery.from,
          chat: ctx.callbackQuery.message.chat,
          message: ctx.callbackQuery.message,
        }
        newCtx.message.text = `/gamble ${gambleValue}`

        ctx.deleteMessage(message.message_id)
        handleGamble(db)(newCtx as any)

      } else if (Number(amount) !== NaN) {

        const editedMessage = `${message.text}${amount}`
        const reply_markup = ctx.callbackQuery.message?.['reply_markup']

        ctx.deleteMessage(message.message_id)

        ctx.reply(editedMessage, {
          reply_markup
        })
      }

    }
    catch (e) {
      console.log(e)
    }
  }

export { handleGambleKeyboard, handleKeyboard }


