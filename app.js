const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set("views", "./views");


let events = [
  { title: "I am your first event", desc: "A great event that is super fun to look at and good", imgUrl: "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F227954059%2F75208802%2F1%2Foriginal.20220210-201349?w=800&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C279%2C1920%2C960&s=f214f3ef806362f985c5533a70370d55" },
  { title: "I am your second event", desc: "A great event that is super fun to look at and good", imgUrl: "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F227954059%2F75208802%2F1%2Foriginal.20220210-201349?w=800&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C279%2C1920%2C960&s=f214f3ef806362f985c5533a70370d55" },
  { title: "I am your third event", desc: "A great event that is super fun to look at and good", imgUrl: "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F227954059%2F75208802%2F1%2Foriginal.20220210-201349?w=800&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C279%2C1920%2C960&s=f214f3ef806362f985c5533a70370d55" }
];

app.get('/', (req, res) => {
  res.render('events-index', { events: events });
});

app.get('/events', (req, res) => {
  res.render('events-index', { events: events });
});

app.get('/events/new', (req, res) => {
  res.render('events-new', {});
});

app.post('/events', (req, res) => {
  console.log(req.body)
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
})
