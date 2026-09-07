const presidio = require('../Presidio adapter/presidio')


async function service_health () {
    const requete = await presidio.health()
    if (requete != true) {
        return false;
    }
    return true;
}


module.exports = { service_health }