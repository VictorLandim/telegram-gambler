import { TelegrafContext } from "telegraf/typings/context"
import { Firestore } from '@google-cloud/firestore'

const handleLeaderboard = (db: Firestore) =>
  async (ctx: TelegrafContext): Promise<void> => {
    try {
      const chatId = String(ctx.chat.id)
      const userId = String(ctx.from.id)

      const users = await db.collection(chatId).get()

      let data = []

      users.forEach(doc => {
        data.push(doc.data())
      });

      data = data.sort((a, b) => b.points - a.points)

      if (data.length > 0) {
        data = data.slice(0, 5)
      }

      let message = '🏆 Leaderboard 🏆\n\n'

      data.forEach((user, i) => {
        let emoji = ''
        if (i === 0) emoji = '🥇'
        if (i === 1) emoji = '🥈'
        if (i === 2) emoji = '🥉'
        if (i === 3) emoji = '🧢'
        if (i === 4) emoji = '🧃'
        const row = `${emoji} ${user.first_name} ${user.last_name}:\n${user.points} schmuckles\n\n`

        message += row
      })

      ctx.reply(message)
    }
    catch (e) {
      console.log(e)
    }
  }

export { handleLeaderboard }