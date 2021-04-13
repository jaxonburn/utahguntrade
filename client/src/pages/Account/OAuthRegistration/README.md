### Instructions:

- For the OAuth to work correctly it will require some configuration to your authentication.


- Add googleId fields and facebookId field to user model:
  `googleId: {type: String}`
  `facebookId: {type: String}`

- In authentication.js file import OAuthStrategy
```
  const { expressOauth,OAuthStrategy } = require('@feathersjs/authentication-oauth');
```
- Add Google and Facebook Strategy to authentication.js file.

```class GoogleStrategy extends OAuthStrategy {
async getEntityData(profile) {


    const baseData = await super.getEntityData(profile);

    return {
      ...baseData,
      email: profile.email,
    };
}
}

class FacebookStrategy extends OAuthStrategy {
async getProfile(authResult) {
// This is the OAuth access token that can be used
// for Facebook API requests as the Bearer token
const accessToken = authResult.access_token;

    const {data} = await axios.get('https://graph.facebook.com/me', {
      headers: {
        authorization: `Bearer ${accessToken}`
      },
      params: {
        // There are
        fields: 'id,name,email,picture'
      }
    });

    return data;
}
async getEntityData(profile) {
// `profile` is the data returned by getProfile
const baseData = await super.getEntityData(profile);

    return {
      ...baseData,
      email: profile.email
    };
  }
}
```
- Register the new Auth Strategies
```
  authentication.register('google', new GoogleStrategy());
  authentication.register('facebook', new FacebookStrategy());
```
- In your default.js file add configs after the authentication.local field
```
    'oauth': {
      'redirect': 'http://localhost:8080/register',
      'google': {
        'key': '<App ID>',
        'secret': '<App Secret>',
        'scope': ['openid', 'email'],
        'nonce': true,
        'redirect_uri': process.env.OAUTH_GOOGLE_REDIRECT_URI || 'http://localhost:3030/oauth/google/callback',
      },
      'facebook': {
        'key': '<App ID>',
        'secret': '<App Secret>',
        'scope': ['email', 'public_profile']
      }
    },
```

- Generate a Google App & Facebook App and get App Secret/App Id and insert into corresponding config places
  - https://console.cloud.google.com/apis/credentials
  - https://developers.facebook.com/apps
