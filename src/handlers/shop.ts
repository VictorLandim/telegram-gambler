import { TelegrafContext } from "telegraf/typings/context"
import { Firestore } from '@google-cloud/firestore'

const handleShop =
  (db: Firestore) =>
    (ctx: TelegrafContext): void => {
      ctx.reply(`
Schmuckle shop:

🚧 This area is under construction.
Come back later with schmuckle in your pockets.
    `, { parse_mode: 'HTML' })
    }

export { handleShop }