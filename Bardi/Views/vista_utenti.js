const albero_query = require("../../Utils/albero_query");
const model = require("../Models/message_model");
const simboli = require("./Testi/simboli.json");
const testi = require("./Testi/Vista utenti/it.json");


module.exports.dimentica_utente = () => {
    let messaggi = [];
    let opzioni = model.opzioni_standard();
    let delay = 3000;

    messaggi = testi.dimentica_utente.messaggi.slice();


    return {
        messaggi: messaggi,
        opzioni: opzioni,
        delay: delay
    }
}

module.exports.nuovo_utente = () => {
    let messaggi = [];
    let tastiera = [];
    let opzioni = {};
    let delay = 2500;

    
    messaggi = testi.nuovo_utente.messaggi.slice(); 
    tastiera.push([
        // { text: "id?", callback_data: `${albero_query.utente.stmp}:${albero_query.utente.mostra_id.stmp}:s` },
        { text: simboli.info, callback_data: `${albero_query.utente.stmp}:${albero_query.utente.registrazione.stmp}:${albero_query.utente.registrazione.esempio.stmp}` },
        { text: simboli.bot, callback_data: `${albero_query.utente.stmp}:${albero_query.utente.registrazione.stmp}:${albero_query.utente.registrazione.sviluppo.stmp}` },
        { text: simboli.entra, callback_data: `${albero_query.utente.stmp}:${albero_query.utente.registrazione.stmp}:${albero_query.utente.registrazione.conferma.stmp}` }  
    ]);
    tastiera.push([model.bottone_chiudi_puff]);

    opzioni = model.opzioni_standard(tastiera); 
    console.log(opzioni.reply_markup.inline_keyboard)


    return {
        messaggi: messaggi,
        opzioni: opzioni,
        delay: delay
    }

}

module.exports.registrazione = () => {
    let messaggio = ""
    let tastiera = [];


}



// Query: Bottone mostra id. Mostra l'id dell'utente 
module.exports.query_mostraID = (callback_id, id_utente) => {
    let risposta = model.query;
    risposta.id = callback_id;
    risposta.options.text = `${testi.query_mostraID.testo}${id_utente}`;
    risposta.options.show_alert = true;

    return risposta;
}
