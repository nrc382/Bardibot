const albero_query = require("../../Utils/albero_query")


module.exports.query = { 
        id: -1,
        options: {
            text: ``,
            show_alert: false,
            cache_time: 2 
        }
}

module.exports.invia = {
    chat_id: -1,
    testo: "",
    opzioni: opzioni_standard()
}

module.exports.elimina = {
    chat_id: -1,
    msg_id: -1,
}

module.exports.modifica = {
    testo: "",
    options: opzioni_standard(),
    // + inline_message_id o altrimenti la coppia chat_id e msg_id 
}


function opzioni_standard(tastiera) {
    let opzioni = {
        parse_mode: "Markdown",
        disable_web_page_preview: true,
        reply_markup: {inline_keyboard: []}
    }
    if (Array.isArray(tastiera)){
        opzioni.reply_markup.inline_keyboard = tastiera.slice();
    }
    return opzioni;
}
module.exports.opzioni_standard = opzioni_standard;

module.exports.bottone_chiudi = { 
    text: "⨷", callback_data: `${albero_query.chiudi.stmp}` 
};

module.exports.bottone_chiudi_puff = { 
    text: "⨷", callback_data: `${albero_query.chiudi.puff.stmp}` 
};
