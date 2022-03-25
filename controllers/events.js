module.exports = function (app, prisma) {  
  app.post('/events', (req, res) => {
    prisma.Event.create({data: req.body})
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
    prisma.Event.findUnique({ where: { id: Number(req.params.id)  }, include: { rsvps: true } })
    .then((event) => {
      event = {
        id: event.id,
        title: event.title,
        desc: event.desc,
        imgUrl: event.imgUrl,
        rsvps: event.rsvps,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
      }
      res.render('events-show', { event: event })
    });
  });
  
  app.get('/events/:id/edit', (req, res) => {
    prisma.Event.findUnique({ where: { id: Number(req.params.id)  } })
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
    prisma.Event.update({ where: { id: Number(req.params.id)}, data: req.body })
    .then((event) => {
      res.redirect(`/events/${event.id}`);
    });
  });
  
  app.delete('/events/:id', (req, res) => {
    prisma.Event.delete({ where: { id: Number(req.params.id) } }).then(
      () => {
        res.redirect('/');
      }
    )
  });

  app.post('/events/:id/rsvp', (req, res) => {
    req.body.eventId = Number(req.params.id);
    prisma.Rsvp.create({ data: req.body }).then((rsvp) => {
      res.redirect(`/events/${req.params.id}`);
    });
  });

  app.delete('/events/:eventId/rsvp/:id', (req, res) => {
    prisma.Rsvp.delete({ where: { id: Number(req.params.id) } }).then(
      () => {
        res.redirect(`/events/${req.params.eventId}`);
      }
    );
  });
}
