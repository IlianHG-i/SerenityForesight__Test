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


module.exports = { controller_health }
    