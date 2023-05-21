const fs = require('fs');
const path = require("path");
const utilità = require("../../Utils/utilità");

const messaggi_errore = require("../../Sources/Testi/errori.json")
const modello_accessorie = require("./modello_accessorie");







// Controlla se esiste la directory utente
module.exports.è_registrato = async (id_utente) => {
  try {
    let user_dir = directory_utente(id_utente);
    return (fs.existsSync(user_dir));
  } catch (err) {
    return messaggi_errore.è_registrato; // questo è l'unico motivo per tenere const messaggi_errore anche qui :(
  }
}

// Crea la directory utente ed al suo interno info_utente.json
module.exports.registra_utente = async (id_utente) => {
  try { // Qui devo tenere il try…catch per mkdir :(
    // creo directory
    let user_dir = directory_utente(id_utente);
    await fs.promises.mkdir(user_dir);

    // creo file user_info
    let info_utente = utilità.scheletro_info_utente;
    info_utente.id_telegram = id_utente;
    user_dir = path.join(user_dir, utilità.configurazione.directory.user_info);
    await modello_accessorie.scrivi_JSON(info_utente, user_dir);

    return { esito: true, msg: `${user_dir}` };
  } catch (err) {
    return { esito: false, msg: `> ${messaggi_errore.registra_utente}\n> ${err}` };
  }
}

// Rimuove la directory utente
module.exports.elimina_directory_utente = async (id_utente) => {
  let user_dir = directory_utente(id_utente);
  return await modello_accessorie.rimuovi_directory(user_dir);
}

// Carica il file info_utente
module.exports.info_utente = async (id_utente) => {
  let user_dir = directory_utente(id_utente);
  user_dir = path.join(user_dir, utilità.configurazione.directory.user_info);
  return (await modello_accessorie.leggi_JSON(user_dir)).dati ;
}


//Aggiorna il file info_utente 
module.exports.aggiorna_info_utente = async (id_utente, nuove_info) => {
  const info_utente = JSON.stringify(nuove_info, null, 2);
  // Scrivi la stringa JSON nel file
  await modello_accessorie.scrivi_JSON(directory_utente(id_utente), info_utente);
}





// ##########################################################################    UTILITÀ

// Ottiene la directory per l'utente di id_utente
function directory_utente(id_utente) {
  let user_dir = path.dirname(require.main.filename);
  user_dir = path.join(user_dir, `./${utilità.configurazione.directory.Sorgenti}/${utilità.configurazione.directory.Utenti}/${id_utente}`);
  return user_dir;
}


