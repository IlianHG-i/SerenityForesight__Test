const service = require('../services/service')

async function controller_health(req, res) {
    try {
    const requete = await service.service_health();
    if (requete == false) {
      return res.status(503).json({
        status: 'error',
        analyzeService: 'unavailable'
      });
    }
    
    res.status(200).json({
      status: 'ok',
      analyzeService: 'available'
    });

  } catch (err) {
    res.status(503).json({
      status: 'error',
      analyzeService: 'unavailable'
    });
  }
}

async function controller_analyze(req, res) {
  try {
    const texte = req.body.text;
    const lang = req.body.language;


    const requete = await service.service_analyze(texte, lang);
    const data = await requete;
    res.json(data);

  } catch(err) {
    console.error('Erreur:', err);
    res.status(500).json({ error: 'Impossible de contacter le service analyze' });
  }
  
}

module.exports = {controller_health, controller_analyze}
    