module.exports = function (app) {
  if (typeof app.channel !== 'function') {
    // If no real-time functionality has been configured just return
    return;
  }

  app.on('connection', connection => {
    // On a new real-time connection, add it to the anonymous channel
    app.channel('anonymous').join(connection);
  });

  app.on('login', (authResult, {connection}) => {
    // connection can be undefined if there is no
    // real-time connection, e.g. when logging in via REST
    if (connection) {
      // Obtain the logged in user from the connection
      const user = connection.user;
      let connect = app.service('users')._patch(connection.user._id, {active: true});

      // The connection is no longer anonymous, remove it
      app.channel('anonymous').leave(connection);

      // Add it to the authenticated user channel
      app.channel('authenticated').join(connection);

      if (Array.isArray(user.chats)) user.chats.forEach(chat_id => app.channel(`chats/${chat_id}`).join(connection));

      // Channels can be named anything and joined on any condition

      // E.g. to send real-time events only to admins use
      // if(user.isAdmin) { app.channel('admins').join(connection); }

      // Easily organize users by email and userid for things like messaging
      // app.channel(`emails/${user.email}`).join(connection);
      // app.channel(`userIds/${user.id}`).join(connection);
    }
  });

  app.on('disconnect', connection => {
    if(connection.user){
      let disconnect = app.service('users')._patch(connection.user._id, {active: false});
    }
  });

  // return chat events only to each chat specific channel which users have already been connected to on login.
  app.service('chats').publish((data) => {
    let userIds = data.users.map(user => user.user);
    const connections = app.channel('authenticated').connections.filter(conn => {
      return userIds.includes(String(conn.user._id));
    });
    connections.forEach(conn => {
      if (conn) app.channel(`chats/${data._id}`).join(conn);
    });
    return app.channel(`chats/${data._id}`);
  });

  app.service('listings').publish(() => {
    return [
      app.channel('authenticated'),
      app.channel('anonymous')
    ];
  });

  app.service('users').publish(() => {
    return [
      app.channel('authenticated'),
    ];
  });


  // will need this eventually!!
  // app.service('users').on('patched', updateChannels);


  // eslint-disable-next-line no-unused-vars
  app.publish((data, hook) => {
    // Here you can add event publishers to channels set up in `channels.js`
    // To publish only for a specific event use `app.publish(eventname, () => {})`

    console.log('Publishing all events to all authenticated users. See `channels.js` and https://docs.feathersjs.com/api/channels.html for more information.'); // eslint-disable-line
    console.log('published event!!!!', data);
    // e.g. to publish all service events to all authenticated users use
    return app.channel('authenticated');
  });

  // Here you can also add service specific event publishers
  // e.g. the publish the `users` service `created` event to the `admins` channel
  // app.service('users').publish('created', () => app.channel('admins'));

  // With the userid and email organization from above you can easily select involved users
  // app.service('messages').publish(() => {
  //   return [
  //     app.channel(`userIds/${data.createdBy}`),
  //     app.channel(`emails/${data.recipientEmail}`)
  //   ];
  // });
};
