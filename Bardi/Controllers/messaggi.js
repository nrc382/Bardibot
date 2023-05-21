// Alto livello di gestione per messaggi testuali ricevuti
const utilità = require("../../Utils/utilità");
const utenti = require("./Specifiche/controller_utenti");
const accessorie = require("./Specifiche/controller_accessorie");



module.exports.gestisci = async (messaggio) => {
    if (messaggio.text === utilità.configurazione.comandi.dimentica) {
        await utenti.dimentica_utente(messaggio);
    } else {
        const è_registrato = await utenti.è_registrato(messaggio.from.id);
        if (è_registrato == false){
            await utenti.nuovo_utente(messaggio);
        } else if (è_registrato == true) {
            await utenti.menu_utente(messaggio)
        } else {
            await accessorie.stampa_errore(messaggio, è_registrato);
        }
    }
}
