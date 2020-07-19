import { TelegrafContext } from "telegraf/typings/context"

const handleHelp =
  (ctx: TelegrafContext): void => {
    ctx.reply(`
These are the available commands:
    `, { parse_mode: 'HTML' })

  }

export { handleHelp }