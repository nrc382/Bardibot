// File main

const utilità = require('./Utils/utilità'); // file per log e configurazione
const bardi_router = require('./Server/bardi_router'); // router express
const express = require('express');

// creo log per main
const log = new utilità.log();
log.in_console("\n\n#######################\n\n• Avvio server BardiBot\t\t"+(new Date(Date.now()).toISOString())+"\n")

//Inizzializza il server
var express_server = new express();
//Utilizza il router definito in bardi_router
express_server.use(bardi_router);

//Ascolta alla porta definita in config
express_server.listen(utilità.configurazione.server.port, function () {
	log.in_console("> Server in ascolto sulla porta "+utilità.configurazione.server.port);
});
