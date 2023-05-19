const fs = require('fs');
const path = require("path");

const utilità = require("../../Utils/utilità");







// Ottiene le informazioni di un utente (file locale in formato json)
module.exports.è_registrato = (id_utente) => {
  let userInfo_dir = path.dirname(require.main.filename);
  userInfo_dir = path.join(userInfo_dir, `./${utilità.configurazione.directory.Utenti}/${id_utente}/info.json`);
  return (fs.existsSync(userInfo_dir));
}




// ##########################################################################    UTILITÀ

