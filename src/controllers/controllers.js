const service = require('../services/service');
const validator = require('../validators/validators');



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
    const text = req.body.text;
    const lang = req.body.language;
    
    const isValid = validator.valid(text, lang); 
    const requete = await service.service_analyze(text, lang);
    const data = await requete;
    res.json(data);

  } catch(err) {
    console.error('Erreur:', err);
    if (err.message == "MISSING_TEXT_FIELD") {
      res.status(400).json({"error": {"code": "MISSING_TEXT_FIELD","message": "The text field is required."}});
    } else if (err.message == "EMPTY_TEXT") {
      res.status(400).json({"error": {"code": "EMPTY_TEXT","message": "The text field is empty."}});
    } else if (err.message == "NOT_STRING_TEXT") {
      res.status(400).json({"error": {"code": "NOT_STRING_TEXT","message": "The text field is not a string."}});
    } else if (err.message == "TOO_LONG_TEXT") {
      res.status(400).json({"error": {"code": "TOO_LONG_TEXT","message": "The text is too long."}})
    } else if (err.message == "MISSING_LANGUAGE") {
      res.status(400).json({"error": {"code": "MISSING_LANGUAGE","message": "The language field is missing."}})
    } else if (err.message == "UNSUPPORTED_LANGUAGE") {
      res.status(400).json({"error": {"code": "UNSUPPORTED_LANGUAGE","message": "The language is not supported."}})
    }
    else {
      res.status(500).json({ error: 'Impossible de contacter le service analyze' }); 
    }

  }
  
}

module.exports = {controller_health, controller_analyze}
    