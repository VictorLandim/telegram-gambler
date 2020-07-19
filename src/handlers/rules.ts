import { TelegrafContext } from "telegraf/typings/context"
import { Firestore } from '@google-cloud/firestore'

const handleRules =
  (ctx: TelegrafContext): void => {
    ctx.reply(`
Collect shmuckles and gamble them!
Dice multipliers:
(1): -10%
(2): -25%
(3): -50%
(4): +10%
(5): +25%
(6): +50%
    `, { parse_mode: 'HTML' })

  }

export { handleRules }