/* Utilità.js ---- 
Il modulo espone:
 > una classe per il log in console 
 > il file `configurazione.json`
 > l'oggetto `statistiche`

 le funzioni:
 > dividiTesto (per la gestione di messaggi troppo lunghi)
 > mescolaArray (mescola un array)
*/

const configurazione = require("../Utils/configurazione.json"); // Il file configurazione comprende tutte le variabili di inizializzazione
module.exports.configurazione = configurazione; 

// Log è una classe. Un esperimento. bah…
module.exports.log = class log {
    constructor(tmp_enable) { // La classe di log dipende dalla variabile 'logs_abilitati' nel file configurazione.json
        if (typeof tmp_enable != "undefined"){
            if (tmp_enable == true) {
                this.abilitato = true;
            } else {
                this.abilitato = false;
            }
        } else{
            if (configurazione.sviluppo.logs_abilitati == true) {
                this.abilitato = true;
            } else {
                this.abilitato = false;
            }
        }
        
        this.ora_inizio = 0;
    }
    inizio(testo) { // setta la variabile locale ora_inizio (secondi)
        this.ora_inizio = Date.now()/1000;
        if (this.abilitato == true) {
            if (typeof testo === 'string'){
                console.log("> "+testo);
            } else{
                //console.log(typeof testo);

                console.log("\n\n");
            }
        } else{
             console.log(this.abilitato);
        }
    }
    fine() { // stampa la differenza con la variabile locale ora_inizio (secondi)
        if (this.abilitato == true) {
            console.log(`> secondi impiegati ${ ((Date.now()/1000)-this.ora_inizio).toFixed(3)}\n`);
            this.ora_inizio = 0;
        }
    }
    //
    in_console(testo) { // se abilitato, stampa "testo"
        if (this.abilitato == true) {
            console.log(`${this.ora_inizio != 0 ? "\t" : ""}${testo}`);
        }
    }
    error(testo) { // stampa "testo" come messaggio di errore
        console.error(testo);
    }
}


// Le statistiche del bot, sono riempite dal modulo conversazione
module.exports.statistiche = {
    messaggi: {
        inviati: 0,
        modificati: 0,
        ricevuti: 0,
        eliminati: 0
    },
    callback: {
        risposte: 0
    },
    inline: {
        inviati: 0,
        modificati: 0,
        ricevuti: 0
    },
    errori: {
        invio: 0,
        modifica: 0,
        cancellazione: 0,
        inline: 0,
        callback: 0
    },
    router: {
        richieste: {
            post: 0,
            get: 0
        }
    }
}

// restituisce sempre e comunque un array. Se un testo è piu lungo di lunghezza_limite, lo divide negli elementi dell'array
module.exports.dividiTesto = (testo, lunghezza_limite) => {
        let str_array = testo.split("\n");
        if (str_array.length < 10){
            str_array = testo.split(" ");
        }
        let my_len = str_array.length;
        const numChunks = Math.ceil(my_len / lunghezza_limite); // console.log("> Saranno " + numChunks + " messaggi\n\n");
        const chunks = new Array(numChunks);
        let str_copy = str_array.slice();
    
        let mile_stone = 0;
        let counter = 0;
        
        for (let i = 0; i < my_len; i++) {
            mile_stone++;
            if (mile_stone >= lunghezza_limite || (mile_stone > lunghezza_limite / 2 && (str_copy[i].length == 0 || str_copy[i] == "\n"))) {
                chunks[counter] = str_array.slice(0, mile_stone).join("\n");
                str_array = str_array.slice(mile_stone);
                counter++;
                mile_stone = 0;
            }
        }
    
    
        return (chunks); //L'array finale. Ogni elemento contiene il testo_parziale (un messaggio)
    
}

// Mescola gli elementi di un array
module.exports.mescolaArray = (array) => {
    let indice_attuale = array.length;
    let indice_casuale;
  
    while (indice_attuale != 0) {
  
      indice_casuale = Math.floor(Math.random() * indice_attuale);
      indice_attuale--;
  
      [array[indice_attuale], array[indice_casuale]] = [
        array[indice_casuale], array[indice_attuale]];
    }
  
    return array;
}


// ##########################################################################               - - - SCHELETRI

module.exports.scheletro_racconto = {
    id_recconto: -1,
    titolo: "",
    autore: "",
    data_creazione: Date.now(),
    versione: 0
}

module.exports.scheletro_racconto_giocato = {
    id_recconto: -1,
    data_inizio: Date.now(),
    completamento: 0
}

module.exports.scheletro_info_utente = {
    id_telegram: -1,
    data_registrazione: Date.now(),
    pseudonimo: "",
    biblioteca: [], // Array di racconti
    collezione: [], // collezione di oggetti
    racconti_giocati: [] // Array di racconti giocati
}


