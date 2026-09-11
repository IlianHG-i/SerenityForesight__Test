
async function health() {
    const requete = await fetch(process.env.HEALTH_LINK);
    if (!requete.ok) {
        return false;
    }
    return true;
}

async function analyze(texte, lang) {
    try {
        const requete = await fetch(process.env.ANALYZE_LINK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: texte,
                language: lang
            })
        });
        if (!requete.ok) {
            throw new Error('PRESIDIO_ERROR');
        }
        const data = await requete.json();
        return data;
    }catch (err) {
        if (err.message == "PRESIDIO_ERROR") {
            throw new Error('PRESIDIO_ERROR');
        } else {
            throw new Error('PRESIDIO_UNREACHABLE');
        }
    }
}

module.exports = {health, analyze}

