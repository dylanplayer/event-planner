const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const { PrismaClient } = require('@prisma/client');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

const prisma = new PrismaClient()
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser())
app.use(
  (req, res, next) => {
    const token = req.cookies.userJWT;
    if (token) {
      const user = jwt.verify(token, accessTokenSecret);
      if (user.id) {
        prisma.User.findUnique({ where: { id: Number(user.id) } }).then(
          (user) => {
            res.locals.currentUser = user;
            next();
          }
        ).catch(
          (err) => {
            console.log(err);
            next();
          }
        );
      }
    } else {
      next();
    }
  }
);

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set("views", "./views");

app.get('/', 
  (req, res) => {
    prisma.Event.findMany({ orderBy: {id: 'desc'} }).then((events) => {
      events = events.map((event) => {
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
  }
);

require('./controllers/events')(app, prisma);
require('./controllers/auth')(app, prisma);

app.listen(PORT, 
  () => {
    console.log(`App listening at http://localhost:${PORT}`);
  }
)
