// Alto livello di gestione per User
const utenti = require("./Specifiche/utenti");
const model = require("../Models/user_model")


module.exports.gestisci = async (messaggio) => {
    if (messaggio.text === "/dimenticami") {
        await utenti.dimentica_utente(messaggio);
    } else {
        if (!model.è_registrato(messaggio.from.id)){
            await utenti.nuovo_utente(messaggio);
        } else {
            await utenti.menu_utente(messaggio)
        }
    }
}
