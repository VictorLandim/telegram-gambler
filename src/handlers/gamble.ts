import { waitFor } from '../util'
import { TelegrafContext } from "telegraf/typings/context"
import { Firestore } from '@google-cloud/firestore'

const diceData = {
  1: {
    mult: 0.5,
    text: 'an unfortunate 1️⃣'
  },
  2: {
    mult: 0.75,
    text: 'a sad 2️⃣',
  },
  3: {
    mult: 0.9,
    text: 'an almost good 3️⃣',
  },
  4: {
    mult: 1.1,
    text: 'a safe 4️⃣'
  },
  5: {
    mult: 1.25,
    text: 'a lucky 5️⃣'
  },
  6: {
    mult: 1.5,
    text: 'a beautiful 6️⃣'
  },
}

const containsValue = (text) => !!Number(text.split(' ')[1]) || text.split(' ')[1]?.toLowerCase() === 'all'

const handleGamble = (db: Firestore) =>
  async (ctx: TelegrafContext): Promise<void> => {
    if (containsValue(ctx.message.text)) {
      try {
        const chatId = String(ctx.chat.id)
        const userId = String(ctx.from.id)

        const houseRef = db.collection(chatId).doc('house')
        const foundHouse = await houseRef.get()

        const userRef = db.collection(chatId).doc(userId)
        const foundUser = await userRef.get()

        const points = !foundUser.exists
          ? 0
          : foundUser.data().points

        const pointsToGamble = ctx.message.text.split(' ')[1]?.toLowerCase() === 'all'
          ? points
          : Number(ctx.message.text.split(' ')[1])

        if (pointsToGamble <= 0) {
          ctx.reply('Invalid amount!')
        }
        else if (pointsToGamble <= points) {
          const allInMessage = pointsToGamble === points
            ? '\nGoing all in!'
            : '';

          ctx.reply(`${ctx.from.first_name} gambles ${pointsToGamble} schmuckles.${allInMessage}`)

          const { dice } = await ctx.replyWithDice()
          ctx.replyWithChatAction('record_video')

          await waitFor(3500)

          const diceVal = dice.value.toString()
          console.log('Dice val: ' + diceVal)

          let updatedPoints = (points - pointsToGamble) + Math.floor(pointsToGamble * diceData[diceVal].mult)
          updatedPoints = updatedPoints < 0
            ? 0
            : updatedPoints

          const userRoll = (foundUser.data()?.rolls?.[diceVal] ?? 0) + 1;

          let userLost = (foundUser.data()?.lost ?? 0)
          let userWon = (foundUser.data()?.won ?? 0)
          let housePoints = (foundHouse?.data()?.points ?? 0)

          if (updatedPoints > points) {
            const wonVal = updatedPoints - points

            userWon += wonVal
            housePoints -= wonVal
          } else if (updatedPoints < points) {
            const lostVal = points - updatedPoints

            userLost += lostVal
            housePoints += lostVal
          }

          userRef.set({
            ...ctx.from,
            points: updatedPoints,
            rolls: {
              ...foundUser.data().rolls,
              [diceVal]: userRoll
            },
            lost: userLost,
            won: userWon,
          })

          houseRef.set({
            ...foundHouse.data(),
            first_name: 'Mr.',
            last_name: "Schmuckle",
            is_bot: true,
            language_code: 'en',
            points: housePoints
          })

          const diceMessage = `Rolled ${diceData[diceVal].text}!`
          const pointMessage = updatedPoints > points
            ? `⬆ won ${updatedPoints - points} schmuckle${updatedPoints - points > 1 ? 's' : ''}!`
            : updatedPoints < points
              ? `⬇ lost ${points - updatedPoints} schmuckle${points - updatedPoints > 1 ? 's' : ''}!`
              : '🏳 No win or loss here!'
          const balanceMessage = `💰 Balance: ${updatedPoints} schmuckles.`

          ctx.reply(`${diceMessage} \n${pointMessage} \n${balanceMessage} `)
        } else {
          ctx.reply("You can't gamble more schmuckles than you have.")
        }
      }
      catch (e) {
        console.log(e)
      }
    } else {
      ctx.reply("Invalid roll, value missing \\.\nUsage: `\/roll [value]` ", { parse_mode: 'MarkdownV2' })
    }
  }

export { handleGamble }
