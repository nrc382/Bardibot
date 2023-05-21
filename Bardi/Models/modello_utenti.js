const fs = require('fs');
const path = require("path");

const utilità = require("../../Utils/utilità");
const messaggi_errore = require("../../Sources/Testi/errori.json")







// Controlla se esiste la directory utente
module.exports.è_registrato = (id_utente) => {
  try {
    let user_dir = directory_utente(id_utente);
    return (fs.existsSync(user_dir));
  } catch (err) {
    return messaggi_errore.è_registrato;
  }
}

// Crea la directory utente ed al suo interno info_utente.json
module.exports.registra_utente = async (id_utente) => {
  try {
    // creo directory
    let user_dir = directory_utente(id_utente);
    await fs.promises.mkdir(user_dir);

    // creo file user_info
    let info_utente = utilità.scheletro_info_utente;
    info_utente.id_telegram = id_utente;
    user_dir = path.join(user_dir, utilità.configurazione.directory.user_info); 
    await scrivi_JSON(info_utente, user_dir);

    return {esito: true, msg: `${user_dir}`};
  } catch (err) {
    return {esito: false, msg: `> ${messaggi_errore.registra_utente}\n> ${err}`};
    }
}

// Rimuove la directory utente
module.exports.elimina_directory_utente = async (id_utente) => {
  try {
    let user_dir = directory_utente(id_utente);

    await rimuovi_directory(user_dir);

    return {esito: true, msg: `${user_dir}`};
  } catch (err) {
    console.log(err);
    return {esito: false, msg: `> ${messaggi_errore.rimuovi_directory_utente}\n> ${err}`};
    }
}

module.exports.info_utente= async(id_utente) => {
  let user_dir = directory_utente(id_utente);
  user_dir = path.join(user_dir, utilità.configurazione.directory.user_info); 

  return await leggi_JSON(user_dir);
}




// ##########################################################################    UTILITÀ

// Ottiene la directory per l'utente di id_utente
function directory_utente(id_utente) {
  let user_dir = path.dirname(require.main.filename);
  user_dir = path.join(user_dir, `./${utilità.configurazione.directory.Utenti}/${id_utente}`); 
  return user_dir;
}

// Elimina una cartella e tutti i sottoelementi
async function rimuovi_directory(dir_path) {
  try {
    const files = await fs.promises.readdir(dir_path);

    for (const file of files) {
      const filePath = path.join(dir_path, file);
      const stat = await fs.promises.lstat(filePath);

      if (stat.isDirectory()) {
        await rimuovi_directory(filePath); // Ricorsione per eliminare sottodirectory
      } else {
        await fs.promises.unlink(filePath); // Elimina il file
      }
    }

    await fs.promises.rmdir(dir_path); // Elimina la directory vuota
  } catch (err) {
    console.log(err);
    }
}


// Scrive dati in formato json alla directory
async function scrivi_JSON(dati, directory) {
  const datiJSON = JSON.stringify(dati);

  try {
    await fs.promises.writeFile(directory, datiJSON, 'utf8');
    return {esito: true, msg: ""} ;
  } catch (error) {
    return {esito: false, msg: `${messaggi_errore.scrivi_json} ${directory}\n> ${error}`} ;
  }
}

// Legge dati in formato json dalla directory
async function leggi_JSON(directory) {
  try {
    const fileJSON = await fs.promises.readFile(directory, 'utf8');
    return {esito: true, dati: JSON.parse(fileJSON)};
  } catch (error) {
    return {esito: false, msg: `${messaggi_errore.leggi_json} ${directory}\n> ${error}`} ;
  }
}

