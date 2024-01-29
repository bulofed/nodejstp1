const express = require('express')
const app = express()
const port = 3000

app.use((req, res, next) => {
  const currentTime = new Date().toISOString();
  console.log(`[${currentTime}]: ${req.url}`);
  next();
})

app.use((req, res, next) => {
  res.status(404).send("Cette page n'existe pas!")
})

const requestCountMiddleware = (req, res, next) => {
  if (!app.locals.requestsCount) {
    app.locals.requestsCount = {};
  }

  app.locals.requestsCount[req.url] = (app.locals.requestsCount[req.url] || 0) + 1;

  next();
};

app.use(requestCountMiddleware);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/metrics', (req, res) => {
  const uptimeInSeconds = Math.floor(process.uptime());

  const metrics = {
    status: 'healthy',
    requestsCount: app.locals.requestsCount,
    uptime: uptimeInSeconds,
  };

  res.json(metrics);
});

app.get('/welcome', (req, res) => {
  res.send("Bienvenue sur le TP 1 du cours d'architecture logicielle")
})

app.get('/secret', (req, res) => {
  res.status(401).send("Vous ne possédez pas les grôles pour accéder à ma page secrète")
})

app.get('/error', (req, res) => {
  res.status(500).json({ message: 'Erreur serveur' })
})

app.get('/img', (req, res) => {
  const file = `${__dirname}/express.png`;
  res.download(file);
})

app.get('/redirectMe', (req, res) => {
  const link = "https://www.iut-littoral.fr/";
  res.redirect(link);
})

app.get('/users/:name', (req, res) => {
  res.send(`Bienvenue sur la page de ${req.params.name}`)
})

app.get('/somme', (req, res) => {
  const a = parseInt(req.query.a)
  const b = parseInt(req.query.b)
  res.send(`${a} + ${b} = ${a+b}`)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})