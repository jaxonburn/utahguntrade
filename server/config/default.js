module.exports = {
  'host': 'localhost',
  'port': 3030,
  'public': '../public/',
  'paginate': {
    'default': 50,
    'max': 500
  },
  'encryption': {
    'ENCRYPT_32BYTE_STRING': '/KCzwyzSjrxEx7C4jc10T3lLSDhUovhRrS7YBCUezeM=',
    'ENCRYPT_64BYTE_STRING': 'oGTlOBe7rQhySGt589912d2XpV3d0Ejxu5m2Un6C2AjENKn7GfK4yXvZyoGRpCd/DRJnwnSxtpocbH1N/4hazw==',
  },
  'boring': 'b003AXeUk4bdTNweUgFT2fLhqjr1tuQ52sVqFnoC',
  'authentication': {
    'entity': 'user',
    'service': 'users',
    'secret': '6bgFXk+fw3ggkmvxZpiGlWUkiZw=',
    'authStrategies': [
      'jwt',
      'local',
      'google'
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
      'redirect': 'http://localhost:8080',
      'google': {
        'key': '172168111874-50a715risg1a7jlbl0s6vhji46k9n8m1.apps.googleusercontent.com',
        'secret': 'T1Ybk4QNmtpM3wU6OHSxu45S',
        'scope': ['openid', 'email'],
        'nonce': true,
        'redirect_uri': process.env.OAUTH_GOOGLE_REDIRECT_URI || 'http://localhost:3030/oauth/google/callback',
      }
    }
  },
  'mongodb': 'mongodb+srv://jaxonburn:jaxon@utahguntrade.jr6ab.mongodb.net/utahguntrade?retryWrites=true&w=majority'
};
