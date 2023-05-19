/* conversazione.js ---- 
 Questo è il modulo che si occupa dell'invio di messaggi e conversazioni tramite l'istanza "bardi"
*/



const bardi = require('../bot');
const utilità = require("../../Utils/utilità");
//const timers = require("timers/promises");

const log = new utilità.log();










// ##########################################################################    INVIO MESSAGGI

/*
 L'invio, la modifica, la cancellazione e risposta a query del bot sono tutte gestite da conversazione.invia(),
 che si occupa anche dell'eventuale divisione in piu messaggi per testi troppo lunghi
*/

async function invia(oggetto_messaggio) {
    // oggetto_messaggio è:
    //       un oggetto => {query?, elimina?, invia?, modifica? }
    //       un array di oggetti => [{query?, elimina?, invia?, modifica? }]

    
    try {
        let risultato = {
            id_primo_invio: -1,
        };

        if (typeof (oggetto_messaggio) != "undefined") {            // Può succedere. Meglio di no…
            let array_oggettiMessaggio = [];

            // Controlla se oggetto_messaggio è già un array, altrimenti lo mette dentro ad array_oggettiMessaggio
            if (!(oggetto_messaggio instanceof Array)) {
                array_oggettiMessaggio.push(oggetto_messaggio);
            } else {
                array_oggettiMessaggio = oggetto_messaggio.slice(0, oggetto_messaggio.length);
            }



            // controlla se in uno degli oggetti array_oggettiMessaggio c'è la risposta ad una callback (si: può essercene al massimo solo una)
            let ha_una_query = array_oggettiMessaggio.filter(function (oggetto) {
                return typeof oggetto.query != "undefined"; // ma anche il controllo sulla proprietà andrebbe benone...
            });

            // Eventuale risposta alla callback
            if (ha_una_query.length > 0) {
                await bardi.bot.answerCallbackQuery(
                    ha_una_query[0].query.id,
                    ha_una_query[0].query.options
                ).catch(function (err) {
                    utilità.statistiche.errori.callback++;
                    log.in_console(`Errore rispondendo alla calback  -> ${ha_una_query[0].query.id}`);
                    log.error(err.response.body);
                }).then(function (res) {
                    utilità.statistiche.callback.risposte++;
                });
            }

            // … La risposta all'eventuale query va fatta prima di qualunque altra cosa, questo dovrebbe giustificare la presenza del doppio ciclo sulla lista array_oggettiMessaggio



            // Loop su array_oggettiMessaggio (elimina?, invia?, modifica?)
            for (let i = 0; i < array_oggettiMessaggio.length; i++) {
                let con_errore = 0;

                // .elimina
                if (typeof (array_oggettiMessaggio[i].elimina) != "undefined") {
                    await bardi.bot.deleteMessage(
                        array_oggettiMessaggio[i].elimina.chat_id,
                        array_oggettiMessaggio[i].elimina.msg_id
                    ).catch(function (err) {
                        utilità.statistiche.errori.cancellazione++;
                        //con_errore++;
                        log.error(`Errore eliminando  -> ${array_oggettiMessaggio[i].elimina.msg_id}\n• ${err.response.body.description}`);
                    }).then(function (res) {
                        utilità.statistiche.messaggi.eliminati++;
                    });
                }

                // .invia
                if (typeof (array_oggettiMessaggio[i].invia) != "undefined") {

                    // I testi con più di 3500 caratteri vanno divisi in piu messaggi…
                    if (array_oggettiMessaggio[i].invia.testo.length >= 3500) {
                        log.in_console("> Ho un testo da dividere")
                        let arr = utilità.dividiTesto(array_oggettiMessaggio[i].invia.testo, 100);

                        for (let l = 0; l < arr.length; l++) {

                            await bardi.bot.sendMessage(
                                array_oggettiMessaggio[i].invia.chat_id,
                                arr[l],
                                array_oggettiMessaggio[i].invia.options
                            ).catch(function (err) {
                                con_errore++;
                                utilità.statistiche.errori.invio++;
                                log.in_console(`Errore inviando (testo diviso)  -> ${array_oggettiMessaggio[i].invia.mess_id}`);
                                log.error(err.response.body.description);
                            }).then(function (res) {
                                utilità.statistiche.messaggi.inviati++;
                            });
                        }

                    } else {
                        await bardi.bot.sendMessage(
                            array_oggettiMessaggio[i].invia.chat_id,
                            array_oggettiMessaggio[i].invia.testo,
                            array_oggettiMessaggio[i].invia.options
                        ).catch(function (err) {
                            con_errore++;
                            utilità.statistiche.errori.invio++;
                            log.in_console(`Errore inviando  -> ${array_oggettiMessaggio[i].invia.mess_id}`);
                            log.error(err.response.body.description);
                        }).then(function (res) {
                            
                            risultato.id_primo_invio = res.message_id;
                            utilità.statistiche.messaggi.inviati++;
                        });
                    }


                }

                // .modifica
                if (array_oggettiMessaggio[i].modifica) {
                    let to_return = {
                        testo: array_oggettiMessaggio[i].modifica.testo,
                        options: {
                            parse_mode: array_oggettiMessaggio[i].modifica.options.parse_mode,
                            disable_web_page_preview: true,
                            reply_markup: array_oggettiMessaggio[i].modifica.options.reply_markup
                        }
                    };

                    // Ci sono due modi per risalire al messaggio da modificare
                    if (typeof array_oggettiMessaggio[i].modifica.inline_message_id != "undefined") {
                        to_return.options.inline_message_id = array_oggettiMessaggio[i].modifica.inline_message_id;
                    } else {
                        to_return.options.chat_id = array_oggettiMessaggio[i].modifica.chat_id;
                        to_return.options.message_id = array_oggettiMessaggio[i].modifica.msg_id;
                    }


                    await bardi.bot.editMessageText(
                        to_return.testo,
                        to_return.options
                    ).catch(function (err_2) {
                        utilità.statistiche.errori.modifica++;

                        log.error("Errore Modifica: ");
                        log.in_console("Codice " + err_2.code);
                        log.in_console(`chat_id ${to_return.options.chat_id}`);
                        log.in_console(`message_id ${to_return.options.message_id}`);
                        log.in_console(`inline_message_id ${to_return.options.inline_message_id}`);

                        log.error(err_2.response.body);

                    }).then(function (res) {
                        utilità.statistiche.messaggi.modificati++;
                    });
                }

                // Può capitare…
                if (con_errore > 0) {
                    await bardi.bot.sendMessage(
                        array_oggettiMessaggio[i].invia.chat_id,
                        `*Woops!* (${con_errore})\n\nMi spiace, ma qualche cosa è andato storto…\nSe il problema persiste contatta @${utilità.configurazione.bot.admin_nick}`,
                        { parse_mode: "Markdown", disable_web_page_preview: true }
                    ).catch(function (err) {
                        utilità.statistiche.errori.invio++;
                        log.in_console(`Errore inviando  (SERVIZIO) -> ${array_oggettiMessaggio[i].invia.mess_id}`);
                        log.error(err.response.body.description);
                    }).then(function (res) {
                        utilità.statistiche.messaggi.inviati++;
                    });
                }

            }

            return risultato;
        }
    }
    catch (error) {
        log.error(error);
    }

}
module.exports.invia = invia;













// ##########################################################################    CONVERSAZIONE

/* La conversazione è un invio con delay di N-messaggi (che possono variare nel testo).
 Il metodo di accesso pubblico è simula_conversazione che prende in ingresso l'array di testi e le opzioni messaggio.
 Il delay può essere fisso (se fornito "delay_fisso") altrimenti viene calcolato dinamicamente da calcola_delay
*/

// Riceve un array di messaggi testuali: invia il primo e ne modifica il testo ogni delay-secondi
async function simula_conversazione(array_testi, chat_id, opzioni, delay_fisso) {
    log.in_console("simula_conversazione: ")

    let original_inline_keyboard = [];
    if (opzioni.hasOwnProperty("reply_markup") && opzioni.reply_markup.hasOwnProperty("inline_keyboard")) {
        original_inline_keyboard = opzioni.reply_markup.inline_keyboard.slice();
        console.log(original_inline_keyboard);
        log.in_console("Cancello la tastiera…");
        delete opzioni.reply_markup.inline_keyboard;
    }

    let primo_invio = await invia({
        invia: { chat_id: chat_id, testo: array_testi[0], options: opzioni }
    }).catch(function (err) {
        log.error(err);
    })


    let message_id = primo_invio.id_primo_invio

    if (typeof primo_invio != "undefined" && typeof message_id != "-1") {
        let toEdit_array = [];

        // Popolo l'array di messaggi "toEdit_array"
        for (let i = 0; i < array_testi.length; i++) {
            let tmp_opzioni = opzioni;
            let delay;

            if (typeof delay_fisso === "number") {
                delay = delay_fisso
            } else {
                delay = calcola_delay(array_testi[i]);
            }
            log.in_console("Delay calcolato: " + delay)

            tmp_opzioni.chat_id = chat_id;
            tmp_opzioni.message_id = message_id;
            tmp_opzioni.delay = delay;
            log.in_console("Delay settato: " + tmp_opzioni.delay)

            //array_testi[i] += "\n\n• " + (delay / 1000).toFixed(2) + " secondi\n";

            toEdit_array.push({
                testo: array_testi[i],
                opzioni: { ...tmp_opzioni }
            });
        }

        for (let i = 0; i < array_testi.length; i++) {
            log.in_console(`${i}° -> ${toEdit_array[i].opzioni.delay}`);
        }



        let res_conversazione = await conversazione(0, toEdit_array, original_inline_keyboard);

        log.in_console("TEST - Fine invio conversazione");
        log.in_console(res_conversazione);
    } // fuori dall'if non succede altro… andrebbe gestita sta cosa…


}
module.exports.simula_conversazione = simula_conversazione;


// calcola un tempo (ms) in base al testo in ingresso
function calcola_delay(testo) {
    let delay = 0;
    let frasi = testo.split("\n");

    for (let i = 0; i < frasi.length; i++) {
        let parole = frasi[i].split(" ");
        for (let j = 0; j < parole.length; j++) {
            delay += 100; // 0.1s ogni parola
            delay += 100 + (Math.min(3500, parole[j].length * 100)); // Da 0.2s a 3.5s per parola
        }
        delay += 1000; // 1s ogni frase
    }
    return delay;
}
module.exports.calcola_delay = calcola_delay;


// Loop conversazione (ricorsiva con timeout)
async function conversazione(indice, toSend_array, original_inline_keyboard) {
    try {
        if (indice >= (toSend_array.length - 1)) {
            return;
        } else {
            log.inizio();
            log.in_console(`Indice ${indice}`);
            log.in_console(`Delay impostato: ${toSend_array[indice].opzioni.delay}`);



            setTimeout(async () => {
                let modifica = toSend_array[indice + 1];

                if (indice == (toSend_array.length - 2) && typeof original_inline_keyboard != "undefined") { // Riaggiungo la (eventuale) tastiera
                    modifica.opzioni.reply_markup = { inline_keyboard: original_inline_keyboard.slice() };
                }


                let edit_res = await bardi.bot.editMessageText(modifica.testo, modifica.opzioni).catch(function (err) {
                    log.error(err)
                });

                log.in_console("TEST - edit_res " + (indice + 1));
                log.in_console(edit_res);
                log.fine();
                return conversazione(indice + 1, toSend_array, original_inline_keyboard)

            }, toSend_array[indice].opzioni.delay);

        }
    }
    catch (error) {
        log.error(error);
    };

}














// ##########################################################################    UTILITÀ


// Chiede a telegram l'eliminazione di ogni messaggio nella chat privata.
// Alcuni messaggi potrebbero essere già stati cancellati, altri troppo vecchi per esserlo. 
module.exports.elimina_tutto = async (chat_id, limite) => {
    let da_eliminare = [];
    for (let i = 0; i <= limite; i++) {
        da_eliminare.push({ elimina: { chat_id: chat_id, msg_id: i } });
    }

    await invia(da_eliminare);
}


// Elimina il messaggio con id_comando (presumibilmente un comando) e quello successivo (presumibilmente la risposta del bot)
module.exports.elimina_comandoerisposta = async (chat_id, id_comando) => {
    let da_eliminare = [];
    da_eliminare.push({ elimina: { chat_id: chat_id, msg_id: id_comando + 1 } });
    da_eliminare.push({ elimina: { chat_id: chat_id, msg_id: id_comando } });


    await invia(da_eliminare);
}













// ##########################################################################    TEST SULLE FUNZIONI

/* 
 Più che altro qui ci sono le tracce di quando mi sono messo a giochicchiare…
*/

// Invio: Ciao mondo(!)
module.exports.testInvio = async (messaggio) => {
    let moji_array = utilità.mescolaArray("🎯 🙊 🌚 🎲 🎯 💋 👍 🧜 🪲 🕸 ⛅️ 🥦 🎯".split(" "));

    let risposta = {
        invia: {
            chat_id: messaggio.chat.id,
            testo: "*Ciao modo!* 🌎",
            options: {
                parse_mode: "Markdown",
                disable_web_page_preview: true,
                reply_markup: {
                    inline_keyboard: [[
                        { text: moji_array[0], callback_data: `TEST:${moji_array[0]}` },
                        { text: moji_array[1], callback_data: `TEST:${moji_array[1]}` },
                        { text: moji_array[2], callback_data: `TEST:${moji_array[2]}` },
                    ]]
                }
            }
        }
    }

    if (Math.random() * 5 < 2) {
        let schizofrenia = Math.floor(Math.random() * 5);
        let testo = risposta.invia.testo
        for (let i = schizofrenia; i >= 0; i--) {
            testo = `${testo} ${testo}`;

            if (testo.length | 60 == 1) {
                testo += "\n";
            }
        }
        risposta.invia.testo = testo;
    }
    await invia(risposta);
}

// Conversazione: Test casuale
module.exports.testConversazione = (messaggio) => {
    let toSend_array = ["Ciao"];
    let testo = "";
    let array = "Molesta è la storia degli Argonauti\nche su di una spiaggia in granchi furon trasformati\ne destino di quegli arditi\nfu finir a smuover sabbia, come l'antichi.\n\nInsieme con due chele ed otto zampe,\ncon stupore scopriron il carapace pesante\ne che la notte, senza l'uccellacci\nci si poteva abbufar d'animali, piante e carcasse.\n\nIl sole caldo, la calma piatta ed il prigo giorno\nli allietaron presto e piu non voller far ritorno\nal burrascoso mare e al fiero legno\nche Argo dicean ed era lor segno\n\nCome spadaccini col gomito duellavano\nCome cretini di lato leggiadri dondolavano\ne come... granchi si riproducevano:\n\nDa che eran meno d'una ventina scarcagnata\nin pochi mesi l'intera isola avean conquistata\n\ne il prezzo dell'affitto saliva vertiginoso\ne il cibo scarso e puzzoloso\ne il gabbiano famelico e rancoroso\ne la foca famelica e bavosa\n\ne il...\ne niente.\nil riscaldamento globale aumentò,\nla marea salì\n\nla spiaggia si rimpicciolì \ne piano, con i piccoli argonauti, sparì.".split(" ");
    for (let i = 0; i < 10; i++) {
        testo = (`Conto: ${i + 1}`);

        if (Math.random() * 10 > 6) {
            testo += "\nMondo ";
            if (Math.random() * 10 > 3) {
                let range = Math.floor(Math.random() * 6);
                for (let k = 0; k < range; k++) {
                    testo += " " + array[Math.floor(Math.random() * (array.length - 1))] + " ";
                }
            }
        } else if (Math.random() * 10 > 4) {
            let range = Math.floor(Math.random() * 11);
            for (let k = 0; k < range; k++) {
                testo += " " + array[Math.floor(Math.random() * (array.length - 1))] + " ";
            }
            if (Math.random() * 10 > 4) {
                let range = Math.floor(Math.random() * 6);
                for (let k = 0; k < range; k++) {
                    testo += "\n" + array[Math.floor(Math.random() * (array.length - 1))] + array[Math.floor(Math.random() * (array.length - 1))] + " ";
                }
            }
        } else {
            let range = Math.floor(Math.random() * 20);
            for (let k = 0; k < range; k++) {
                testo += " " + array[Math.floor(Math.random() * (array.length - 1))] + " ";
            }
        }

        toSend_array.push(testo);
    }

    let tempo_lettura = calcola_delay(messaggio.text) / 1000;
    if (tempo_lettura < 60) {
        toSend_array.splice(1, 0, "Il tempo di lettura per:\n" + messaggio.text + "\n\n• " + tempo_lettura + " secondi")
    } else {
        toSend_array.splice(1, 0, "Il tempo di lettura per:\n" + messaggio.text + "\n\n• Circa " + Math.floor(tempo_lettura / 60) + " minuti")
    }

    return toSend_array;
}

// Query:  Ciao mondo (ad una query)
module.exports.testQuery = async (query) => {
    console.log(query);
    let moji_array = utilità.mescolaArray("🎯 🙊 🌚 🎲 🎯 💋 👍 🧜 🪲 🕸 ⛅️ 🥦 🎯".split(" "));

    let risposta = {
        query: { id: query.id, options: { text: query.data.split(":")[1], show_alert: true, cache_time: 2 } },
        modifica: {
            testo: "*Ciao modo!* 🌎\n",
            chat_id: query.message.chat.id,
            msg_id: query.message.message_id,

            options: {
                parse_mode: "Markdown",
                disable_web_page_preview: true,
                reply_markup: {
                    inline_keyboard: [[
                        { text: moji_array[0], callback_data: `TEST:${moji_array[0]}` },
                        { text: moji_array[1], callback_data: `TEST:${moji_array[1]}` },
                        { text: moji_array[2], callback_data: `TEST:${moji_array[2]}` },
                    ]]
                }
            }
        }
    }
    if (Math.random() * 5 < 2) {
        risposta.elimina = { chat_id: query.message.chat.id, msg_id: query.message.message_id };
        delete risposta.modifica;
    }
    await invia(risposta);

}



