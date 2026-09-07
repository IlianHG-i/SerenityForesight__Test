const express = require('express')
const router = express.Router()
const controller = require('../controllers/controllers')


router.get('/', (req, res) => {
    console.log('test de la page de base')
    res.send('Hello world')
})

router.get('/health', async (req, res) => {
    console.log('test mcv health'); 
    controller.controller_health(req, res); 
})

module.exports = router;