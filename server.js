const express = require('express')
const app = express()

app.get('/', (req, res) => {
    res.send('Hello world')
    console.log('Hello world')
})

app.get('/health', async (req, res) => {
    try {
    const requete = await fetch('http://presidio:3000/health');
    if (!requete.ok) {
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

})

// a changer en post quand je n'utilise plus le navigateur
app.get('/api/v1/analyze', async (req, res) => {
  try {
    const requete = await fetch('http://presidio:3000/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: "My name is Mario Rossi and my email is mario.rossi@example.com",
        language: "en"
      })
    });

    const data = await requete.json();
    res.json(data);

  } catch (err) {
    console.error('Erreur:', err);
    res.status(500).json({ error: 'Impossible de contacter le service analyze' });
  }
});


app.listen(3000)