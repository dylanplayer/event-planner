const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const models = require('./db/models');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set("views", "./views");

app.get('/', (req, res) => {
  models.Event.findAll({ order: [['createdAt', 'DESC']] }).then((events) => {
    events = events.map((event) => {
      return {
        title: event.title,
        desc: event.desc,
        imgUrl: event.imgUrl,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
      }
    })
    res.render('events-index', { events: events })
  });
});

app.get('/events', (req, res) => {
  res.render('events-index', { events: events });
});

app.get('/events/new', (req, res) => {
  res.render('events-new', {});
});

app.post('/events', (req, res) => {
  models.Event.create(req.body)
  .then(event => {
    res.redirect('/');
  })
  .catch(err => {
    console.log(err);
  })
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
})
