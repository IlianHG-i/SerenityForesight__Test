async function health() {
    const requete = await fetch('http://presidio:3000/health');
    if (!requete.ok) {
        return false;
    }
    return true;
}


async function analyze(texte) {
    const requete = await fetch('http://presidio:3000/analyze')
}




module.exports = { health }

