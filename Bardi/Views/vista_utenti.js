const albero_query = require("../../Utils/albero_query");
const model = require("../Models/message_model");


module.exports.dimentica_utente = () => {
    let messaggi = [];
    let opzioni = model.opzioni_standard();
    let delay = 3000;

    messaggi.push("Ma?", "Io…", "Io non ti conosco!");


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

    
    messaggi.push( 
        "…",
        "*!*", 
        "Ciao!",
        `*Bardi di Telegram*\n`+
        `È un bot che permette di scrivere e giocare ad avventure testuali.\n\n`
        //+
        //`Registrandoti verrà salvato sul server il tuo id pubblico\n`+
        //`(in qualsiasi momento con il comando /dimenticami potrai cancellare ogni tuo dato)`
    ); 
    tastiera.push([
        // { text: "id?", callback_data: `${albero_query.utente.stmp}:${albero_query.utente.mostra_id.stmp}:s` },
        { text: "？", callback_data: `${albero_query.utente.stmp}:${albero_query.utente.registrazione.stmp}:${albero_query.utente.registrazione.esempio.stmp}` },
        { text: "🤖", callback_data: `${albero_query.utente.stmp}:${albero_query.utente.registrazione.stmp}:${albero_query.utente.registrazione.sviluppo.stmp}` },
        { text: "Registrati", callback_data: `${albero_query.utente.stmp}:${albero_query.utente.registrazione.stmp}:${albero_query.utente.registrazione.conferma.stmp}` }  
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




// ##########################################################################    QUERY (risposte query)


module.exports.query_mostraID = (callback_id, id_utente) => {
    let risposta = model.query;
    risposta.id = callback_id;
    risposta.options.text = `🌎\nÈ un dato pubblico\n\nIl tuo id telegram è:\n${id_utente}`;
    risposta.options.show_alert = true;

    return risposta;
}

module.exports.query_prossimamente = (id) => {
    let risposta = model.query;
    risposta.id = id;
    risposta.options.text = `Prossimamente…`;
    risposta.options.show_alert = true;

    return risposta;
}

module.exports.query_chiudo = (id) => {
    let risposta = model.query;
    risposta.id = id;
    risposta.options.text = `Chiudo`;
    risposta.options.show_alert = false;
    risposta.options.cache_time = 2;

    return risposta;
}

module.exports.query_puff = (id) => {
    let risposta = model.query;
    risposta.id = id;
    risposta.options.text = `Puff`;
    risposta.options.show_alert = false;
    risposta.options.cache_time = 2;

    return risposta;
}


// ##########################################################################    ELIMINA 

module.exports.elimina = (chat_id, id_messaggio) => {
    let da_eliminare = model.elimina;
    da_eliminare.chat_id = chat_id;
    da_eliminare.msg_id = id_messaggio;
    return da_eliminare;
}
