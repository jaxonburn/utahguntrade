const stripeWebHook = async context => {
  console.log('context data type', context.data.type);
  if (context.data.type === 'invoice.payment_succeeded') {
    let userEmail = context.data.data.object.billing_details.email;
    let stripeCustomer = context.data.data.object.customer;
    let users = await context.app.service('users').find({query: {email: userEmail}});
    let user = users.data[0];
    await context.app.service('users').patch(user._id, {stripeId: stripeCustomer, premium: true});
    return context;
  } else if (context.data.type === 'customer.subscription.updated') {
    console.log('updating subscription');
  } else if (context.arguments[0].type === 'context.subscription.deleted') {
    console.log('deleting');
  }
};

module.exports = {
  before: {
    all: [
      stripeWebHook
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
