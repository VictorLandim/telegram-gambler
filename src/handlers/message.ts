/**
 * Increments senders points by 1 on message
 */
import { TelegrafContext } from "telegraf/typings/context"
import { Firestore } from '@google-cloud/firestore'

const handleMessage = (db: Firestore) =>
  async (ctx: TelegrafContext): Promise<void> => {
    try {
      const chatId = String(ctx.chat.id)
      const userId = String(ctx.from.id)

      const userRef = db.collection(chatId).doc(userId)
      const foundUser = await userRef.get()

      const pointIncrement = 1

      const points = foundUser.exists
        ? foundUser.data().points + pointIncrement
        : pointIncrement

      userRef.set({ ...ctx.from, points })
    }
    catch (e) {
      console.log(e)
    }
  }

export { handleMessage }
