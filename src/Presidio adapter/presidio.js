async function health() {
    const requete = await fetch('http://presidio:3000/health');
    if (!requete.ok) {
        return false;
    }
    return true;
}


async function analyze(texte, lang) {
        console.log(JSON.stringify({text: texte, language: lang}))
        
        const requete = await fetch('http://presidio:3000/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: texte,
                language: lang
            })
        });
        if (!requete.ok) {
            throw new Error('Erreur, le service ne fonctionne pas')
        }
        const data = await requete.json();
        return data;
}




module.exports = {health, analyze}

