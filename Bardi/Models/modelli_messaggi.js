const albero_query = require("../../Utils/albero_query")
const simboli = require("../Views/Testi/simboli.json")
const configurazione = require("../../Utils/utilità").configurazione


// ##########################################################################    SCHELETRI


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
    options: opzioni_standard()
}

module.exports.conversazione = {
    messaggi: [],
    opzioni: opzioni_standard(),
    delay: 0
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
        reply_markup: { inline_keyboard: Array.isArray(tastiera) ? tastiera.slice() : [] }
    }
    return opzioni;
}
module.exports.opzioni_standard = opzioni_standard;

// ##########################################################################    BOTTONI


module.exports.bottone_contatta_admin = {
    text: simboli.admin, url: `https://t.me/${configurazione.bot.admin_nick}`
};

module.exports.bottone_chiudi = {
    text: simboli.chiudi, callback_data: `${genera_percorso_callback(albero_query.chiudi.stmp)}`
};

module.exports.bottone_chiudi_puff = {
    text: simboli.chiudi, callback_data: `${genera_percorso_callback(albero_query.chiudi.puff.stmp)}`
};

module.exports.bottone_torna_al_menu = {
    text: simboli.home, callback_data: `${genera_percorso_callback(albero_query.utente.menu.stmp)}`
};

module.exports.bottoni_menu = {
    text: simboli.home, callback_data: `${genera_percorso_callback(albero_query.utente.menu.stmp)}`
};

// ##########################################################################    FUNZIONI
// Non sono sicuro che modelli_messaggi sia il luogo giusto per questa parte di codice…

// Queste funzioni sono state generate da chatGPT di openai 
function genera_percorso_callback(ultimo_elemento) {
    const risultato = [];
    cercaInAlbero(albero_query, [], ultimo_elemento, risultato);
    return risultato.length > 1 ? risultato.join(":") : risultato[0];
}

function cercaInAlbero(nodo, percorsi, stringa, risultato) {
    if (nodo.hasOwnProperty("stmp")) {
        percorsi.push(nodo.stmp);

        if (nodo.stmp === stringa) {
            risultato.push(...percorsi);
        }
    }

    for (const chiave in nodo) {
        if (typeof nodo[chiave] === 'object') {
            cercaInAlbero(nodo[chiave], percorsi, stringa, risultato);
        }
    }

    if (percorsi.length > 0) {
        percorsi.pop();
    }
}
module.exports.genera_percorso_callback = genera_percorso_callback;