//Router express -> riceve le richieste da telegram e le passa a Bardi/bot.js

const express_server = require('express');
const utilità = require("../Utils/utilità");
const bardi = require('../Bardi/bot');

// Creo il log
const log = new utilità.log();

// Definizione del router
const bot_serverRouter = express_server.Router();
bot_serverRouter.use(express_server.json());

// Oggetto contatori per statistiche
let contatori = utilità.statistiche.router;

// setta il webhook del bot, ASYNC
bardi.imposta_webhook(); 

// GET sul router
bot_serverRouter.get(`/${utilità.configurazione.server.router}`, function (req, res){
	log.in_console(`• Ricevuta get sul router del bot ${utilità.configurazione.bot.nome_bot}...`);
	res.status(200).json({msg: `${utilità.configurazione.bot.nome_bot} => online!`, stat: contatori.richieste});
	contatori.richieste.get++;
});


// POST sul ruter, le richieste vengono processate da bot.js
bot_serverRouter.post(`/${utilità.configurazione.server.router}/post`, function (req, res) {
	log.in_console(`• Ricevuta post sul router del bot ${utilità.configurazione.bot.nome_bot}...`);
	log.in_console(req);
	contatori.richieste.post++;

	// risposta
	res.status(200).json({msg: "POST Ricevuta 👍"});

	// trigger-event su bot.js
    bardi.bot.processUpdate(req.body);

});


module.exports = bot_serverRouter;

