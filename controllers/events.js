module.exports = function (app, models) {
  app.get('/events', (req, res) => {
    res.render('events-index', { events: events });
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
  
  app.get('/events/new', (req, res) => {
    res.render('events-new', {});
  });
  
  app.get('/events/:id', (req, res) => {
    models.Event.findOne({ where: { id: req.params.id } })
    .then((event) => {
      event = {
        id: event.id,
        title: event.title,
        desc: event.desc,
        imgUrl: event.imgUrl,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
      }
      res.render('events-show', { event: event })
    });
  });
  
  app.get('/events/:id/edit', (req, res) => {
    models.Event.findOne({ where: { id: req.params.id } })
    .then((event) => {
      event = {
        id: event.id,
        title: event.title,
        desc: event.desc,
        imgUrl: event.imgUrl,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
      }
      res.render('events-edit', { event: event })
    });
  });
  
  app.put('/events/:id', (req, res) => {
    models.Event.findOne({ where: { id: req.params.id } })
    .then((event) => {
      event.update(req.body).then((event) => {
        res.redirect(`/events/${event.id}`);
      })
    });
  });
  
  app.delete('/events/:id', (req, res) => {
    models.Event.findOne({ where: { id: req.params.id } }).then((event) => {
      event.destroy().then(() => {
        res.redirect('/');
      })
    })
  });  
}
