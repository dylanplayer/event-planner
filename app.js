const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient()
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set("views", "./views");

app.get('/', (req, res) => {
  prisma.Event.findMany({ orderBy: {id: 'desc'} }).then((events) => {
    events = events.map((event) => {
      console.log(event)
      return {
        id: event.id,
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

require('./controllers/events')(app, prisma);

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
})
