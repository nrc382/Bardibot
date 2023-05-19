/* bot.js ---- 
Espone:
    > L'istanza bardi_bot (TelegramBot)
    > la funzione imposta_webhook)
    > l'oggetto statistiche


- Riceve gli eventi message, callback_query, inline_query 
- li smista ai moduli controller 
*/

const TelegramBot = require('node-telegram-bot-api');

const utilità = require("../Utils/utilità");
const callback_utente = require("./Controllers/callback")
const messaggi_utente = require("./Controllers/messaggi");
const inline_utente = require("./Controllers/inline");


//const schedule = require('node-schedule');

// Gestore delle stampe log su console
const log = new utilità.log();


// Yagop's framework
const bardi_bot = new TelegramBot(utilità.configurazione.telegram.token, { filepath: false });
module.exports.bot = bardi_bot;


// funzione per set del webhook (telegram)
module.exports.imposta_webhook = async () => {
    log.inizio("Imposto webhook");

    let post_url = `${utilità.configurazione.server.url}/${utilità.configurazione.server.router}/post`; //Indirizzo sul server su cui Telegram farà le POST
    let bot_options = {
        max_connections: utilità.configurazione.server.max_connections,
        allowed_updates: utilità.configurazione.telegram.allowed_updates
    }

    let webHook_res = await bardi_bot.setWebHook(post_url, bot_options);

    if (webHook_res) {
        log.in_console("> Bardi di Telegram, bot registrato e attivo"); // webHook_res
        log.fine();
    } else {
        log.error("> Woops! Non son riuscito a registrare il WebHookTelegram per il bot dei Bardi!\n> ESCO!");
        log.fine();
        process.exit(1);
    };
}


// ######################################################################## DISPATCHER EVENTI

// Messaggi
bardi_bot.on("message", async (messaggio) => {
    await messaggi_utente.gestisci(messaggio);
});

// Callback
bardi_bot.on("callback_query", async (callback) => {
   await callback_utente.gestisci(callback);
});


// Inline
bardi_bot.on("inline_query", async (inline) => {
    await inline_utente.gestisci(inline);
});



