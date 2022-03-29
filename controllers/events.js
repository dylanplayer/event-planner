module.exports = function (app, prisma) {
  app.post('/events', (req, res) => {
    if (res.locals.currentUser) {
      req.body.ownerId = res.locals.currentUser.id;
      prisma.Event.create({data: req.body})
        .then(event => {
          res.redirect('/');
        }
      ).catch(err => {
          console.log(err);
        }
      );
    } else {
      res.redirect('/');
    }
  });
  
  app.get('/events/new', (req, res) => {
    if (res.locals.currentUser) {
      res.render('events-new');
    } else {
      res.redirect('/');
    }
  });
  
  app.get('/events/:id', (req, res) => {
    prisma.Event.findUnique({ where: { id: Number(req.params.id)  }, include: { rsvps: { include: { user: true } }, owner: true } })
      .then((event) => {
        event = {
          id: event.id,
          title: event.title,
          desc: event.desc,
          imgUrl: event.imgUrl,
          rsvps: event.rsvps,
          owner: event.owner,
          createdAt: event.createdAt,
          updatedAt: event.updatedAt,
        }
        const currentUserOwnsEvent = res.locals.currentUser && res.locals.currentUser.id == event.owner.id;
        const currentUserNotInRsvps = res.locals.currentUser && event.rsvps.find(rsvp => rsvp.user.id == res.locals.currentUser.id) == null;
        res.render('events-show', { event: event, currentUserNotInRsvps: currentUserNotInRsvps, currentUserOwnsEvent: currentUserOwnsEvent });
      }
    );
  });
  
  app.get('/events/:id/edit', (req, res) => {
    if (res.locals.currentUser) {
      prisma.Event.findUnique({ where: { id: Number(req.params.id)  }, include: { owner:true } })
        .then((event) => {
          event = {
            id: event.id,
            title: event.title,
            desc: event.desc,
            imgUrl: event.imgUrl,
            owner: event.owner,
            createdAt: event.createdAt,
            updatedAt: event.updatedAt,
          }
          if (res.locals.currentUser.id == event.owner.id) {
            res.render('events-edit', { event: event })
          } else {
            res.redirect('/');
          }
        }
      );
    } else {
      res.redirect('/');
    }
  });
  
  app.put('/events/:id', (req, res) => {
    if (res.locals.currentUser) {
      prisma.Event.findUnique({ where: { id: Number(req.params.id)  }, include: { owner:true } }).then(
        (event) => {
          if (res.locals.currentUser.id == event.owner.id) {
            prisma.Event.update({ where: { id: Number(req.params.id)}, data: req.body })
              .then((event) => {
                res.redirect(`/events/${event.id}`);
              }
            );
          } else {
            res.redirect(`/events/${event.id}`);
          }
        }
      )
    } else {
      res.redirect(`/events/${req.params.id}`);
    }
  });
  
  app.delete('/events/:id', (req, res) => {
    if (res.locals.currentUser) {
      prisma.Event.findUnique({ where: { id: Number(req.params.id)  }, include: { owner:true } }).then(
        (event) => {
          if (res.locals.currentUser.id == event.owner.id) {
            prisma.Event.delete({ where: { id: Number(req.params.id) } }).then(
              () => {
                res.redirect('/');
              }
            );
          } else {
            res.redirect(`/events/${req.params.id}`);
          }
        }
      );
    } else {
      res.redirect(`/events/${req.params.id}`);
    }
  });

  app.post('/events/:id/rsvp', (req, res) => {
    if (res.locals.currentUser) {
      req.body.userId = Number(res.locals.currentUser.id);
      req.body.eventId = Number(req.params.id);
      prisma.Rsvp.create({ data: req.body }).then(
        (rsvp) => {
          res.redirect(`/events/${req.params.id}`);
        }
      );
    } else {
      res.redirect(`/events/${req.params.id}`);
    }
  });

  app.delete('/events/:id/rsvp/:userId', (req, res) => {
    if (res.locals.currentUser) {
      prisma.Rsvp.delete({ where: { eventId_userId: { userId: Number(req.params.userId), eventId: Number(req.params.id) } } }).then(
        () => {
          res.redirect(`/events/${req.params.id}`);
        }
      );
    } else {
      res.redirect(`/events/${req.params.id}`);
    }
  });
}
