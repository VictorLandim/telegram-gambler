# Telegram gambler bot
Collect virtual currency by interacting in a telegram group chat.
Gamble your currency and have fun.

# Contributing
You should have both `.env` and `firestore.json` in your root directory. Create a telegram bot using BotFather and place your bot key in your `.env` using `.env.local` as a base. You'll chat with that bot in development. I'll provide the remaining env variables to you.
- Develop:
`yarn dev`: watches and reloads `ts` files.


# Bugs
Sometimes my machine's clock goes out of sync from google's servers. Run `yarn fix-clock` to fix that.

# Setting webhook url:
`https://api.telegram.org/bot{my_bot_token}/setWebhook?url={url_to_send_updates_to}`