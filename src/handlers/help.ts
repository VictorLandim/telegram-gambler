import { TelegrafContext } from "telegraf/typings/context"

const handleHelp =
  (ctx: TelegrafContext): void => {
    ctx.reply(`
These are the available commands:
/gamble - [value] Gamble some or all of your schmuckles.
/schmuckles - Get your current schmuckles.
/leaderboard - Get the top 5 users' schmuckles.
/rules - Read the rules regarding schmucklery and gambling.
/buy - Buy schmuckles with real world currency.
/shop - Exchange your schmuckles for goodies and collectibles.
    `, { parse_mode: 'HTML' })
  }

export { handleHelp }