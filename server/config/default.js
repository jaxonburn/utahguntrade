module.exports = {
  'host': 'localhost',
  'port': 3030,
  'public': '../public/',
  'paginate': {
    'default': 50,
    'max': 500
  },
  'authentication': {
    'entity': 'user',
    'service': 'users',
    'secret': '6bgFXk+fw3ggkmvxZpiGlWUkiZw=',
    'authStrategies': [
      'jwt',
      'local'
    ],
    'jwtOptions': {
      'header': {
        'typ': 'access'
      },
      'audience': 'https://api.utahgunhub.com',
      'issuer': 'feathers',
      'algorithm': 'HS256',
      'expiresIn': '1d'
    },
    'local': {
      'usernameField': 'email',
      'passwordField': 'password'
    },
    'oauth': {
      'google': {
        'key': '172168111874-50a715risg1a7jlbl0s6vhji46k9n8m1.apps.googleusercontent.com',
        'secret': 'T1Ybk4QNmtpM3wU6OHSxu45S',
        'scope': ['openid', 'email'],
        'nonce': true,
        'callback': '/oauth/google/authenticate',
        'redirect_uri': 'http://localhost:8080/register',
      }
    }
  },
  'mongodb': 'mongodb+srv://jaxonburn:jaxon@utahguntrade.jr6ab.mongodb.net/utahguntrade?retryWrites=true&w=majority'
};
