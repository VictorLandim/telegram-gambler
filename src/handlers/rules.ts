import { TelegrafContext } from "telegraf/typings/context"

const handleRules =
  (ctx: TelegrafContext): void => {
    ctx.reply(`
Collect shmuckles and gamble them!
Dice multipliers:
(1): -75%
(2): -50%
(3): -25%
(4): +25%
(5): +50%
(6): +100%
    `, { parse_mode: 'HTML' })

  }

export { handleRules }