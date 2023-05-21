// Non mi convince molto, questo albero_query…
// Dovrebbe semplificare la vita quando si va a scrivere il codice… Vedrem!

// Agiornamento dopo 2 giorni. Ora nel message_model c'è genera_percorso_callback e… UAU!

module.exports = {
    utente: {
        stmp: "UTENTE",
        menu_utente: {
            stmp: "MENU_UTENTE",
            imposta_pseudonimo: {
                stmp: "IMPOSTA_PSEUDONIMO",
            },
            biblioteca_utente: {
                stmp: "BIBLIOTECA",
            },
            collezione_oggetti: {
                stmp: "OGGETTI_UTENTE",
            },
            racconti_giocati: {
                stmp: "RACCONTI_GIOCATI",
            },
        },
        mostra_id: {
            stmp: "MOSTRA_ID",
        },
        registra: {
            stmp: "REGISTRA_UTENTE",
        }
    },
    menu_generale: {
        stmp: "MENU_GENERALE",
    },
    guide: {
        stmp: "GUIDE",
        generali: {
            stmp: "INFO_GENERALI",
            
        }
        
    },
    racconti: {
        stmp: "RACCONTI",

        lista: {
            stmp: "LISTA",
        },
    },
    info: {
        stmp: "INFO",

        sviluppo: {
            stmp: "SVILUPPO"
        }
    },
    chiudi: {
        stmp: "CHIUDI",
        puff: {
            stmp: "PUFF"
        }
    }
}