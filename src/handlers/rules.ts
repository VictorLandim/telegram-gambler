import { TelegrafContext } from "telegraf/typings/context"

const handleRules =
  (ctx: TelegrafContext): void => {
    ctx.reply(`
Collect shmuckles and gamble them!
Dice multipliers:
(1): -50%
(2): -25%
(3): -12.5%
(4): +25%
(5): +50%
(6): +100%
    `, { parse_mode: 'HTML' })

  }

export { handleRules }