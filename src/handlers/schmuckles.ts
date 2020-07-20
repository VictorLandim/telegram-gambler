import { TelegrafContext } from "telegraf/typings/context"
import { Firestore } from '@google-cloud/firestore'

const handleScore = (db: Firestore) =>
  async (ctx: TelegrafContext): Promise<void> => {
    try {
      const chatId = String(ctx.chat.id)
      const userId = String(ctx.from.id)

      const userRef = db.collection(chatId).doc(userId)
      const foundUser = await userRef.get()

      const points = !foundUser.exists
        ? 0
        : foundUser.data().points

      const s = points === 1 ? '' : 's'

      ctx.reply(`You have ${points} schmuckle${s} in the pocket.`, { reply_to_message_id: ctx.message.message_id })

      if (ctx.callbackQuery) ctx.editMessageReplyMarkup()
    }
    catch (e) {
      console.log(e)
    }
  }

export { handleScore }