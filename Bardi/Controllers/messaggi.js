// Alto livello di gestione per messaggi testuali ricevuti

const utenti = require("./Specifiche/controller_utenti");
const model = require("../Models/user_model");
const utilità = require("../../Utils/utilità");


module.exports.gestisci = async (messaggio) => {
    if (messaggio.text === utilità.configurazione.comandi.dimentica) {
        await utenti.dimentica_utente(messaggio);
    } else {
        if (!model.è_registrato(messaggio.from.id)){
            await utenti.nuovo_utente(messaggio);
        } else {
            await utenti.menu_utente(messaggio)
        }
    }
}
