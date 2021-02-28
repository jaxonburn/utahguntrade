/* eslint-disable no-unused-vars */
const stripe = require('stripe')('sk_test_51IPfrSJZXWwylQAL6Nn39XjWeZezBFbwQ3yKMApve7Nyra5YFPi0vr1kpoIdMoelj8tODeyyVMBtmBivNfCMNLG300tEF4Iter');

exports.CreateCustomerPortalSession = class CreateCustomerPortalSession {
  constructor (options) {
    this.options = options || {};
  }

  async find (params) {

  }

  async get (id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  async create (data, params) {
    const session = await stripe.billingPortal.sessions.create({
      customer: data.stripeId,
      return_url: 'http://localhost:8080/account',
    });
    data.result = session.url;
    return data;
  }

  async update (id, data, params) {
    return data;
  }

  async patch (id, data, params) {
    return data;
  }

  async remove (id, params) {
    return { id };
  }
};
