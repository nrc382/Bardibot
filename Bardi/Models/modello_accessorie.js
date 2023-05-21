const fs = require('fs');
const path = require("path");
const utilità = require("../../Utils/utilità");

const messaggi_errore = require("../../Sources/Testi/errori.json")



// Elimina una cartella e tutti i sottoelementi
async function rimuovi_directory(directory) {
    try {
        const files = await fs.promises.readdir(directory);

        for (const file of files) {
            const filePath = path.join(directory, file);
            const stat = await fs.promises.lstat(filePath);

            if (stat.isDirectory()) {
                await rimuovi_directory(filePath); // Ricorsione per eliminare sottodirectory
            } else {
                await fs.promises.unlink(filePath); // Elimina il file
            }
        }

        await fs.promises.rmdir(directory); // Elimina la directory vuota
        return { esito: true, msg: "" };

    } catch (err) {
        return { esito: false, msg: `${messaggi_errore.rimuovi_directory} ${directory}` };
    }
}
module.exports.rimuovi_directory = rimuovi_directory


// Scrive dati in formato json alla directory
async function scrivi_JSON(dati, directory) {
    const datiJSON = JSON.stringify(dati);

    try {
        await fs.promises.writeFile(directory, datiJSON, 'utf8');
        return { esito: true, msg: "" };
    } catch (error) {
        return { esito: false, msg: `${messaggi_errore.scrivi_json} ${directory}` };
    }
}
module.exports.scrivi_JSON = scrivi_JSON


// Legge dati in formato json dalla directory
async function leggi_JSON(directory) {
    try {
        const fileJSON = await fs.promises.readFile(directory, 'utf8');
        return { esito: true, dati: JSON.parse(fileJSON) };
    } catch (error) {
        return { esito: false, msg: `${messaggi_errore.leggi_json} ${directory}` };
    }
}
module.exports.leggi_JSON = leggi_JSON




// ##########################################################################    SULLE STATISTICHE

// Ottiene la directory per il file statistiche_bot.json
function directory_statistiche() {
    let dir = path.dirname(require.main.filename);
    dir = path.join(dir, `./${utilità.configurazione.directory.Sorgenti}/${utilità.configurazione.directory.statistiche}`);
    return dir;
}


//Carica il file statistiche_bot
module.exports.statistiche_bot = async () => {
    let dir = directory_statistiche();
    return await leggi_JSON(dir);
}

//Sovrascrive il file statistiche_bot (AGGIORNA)
module.exports.aggiorna_statistiche_bot = async (nuove_statistiche) => {
    const statistiche_JSON = JSON.stringify(nuove_statistiche, null, 2);
    // Scrivi la stringa JSON nel file
    await scrivi_JSON(directory_statistiche(), statistiche_JSON);
}
