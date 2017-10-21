// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '1411438358972421', // your App ID
        'clientSecret'  : 'd1ba4571c88aedcb522550bf8504dcfa', // your App Secret
        'callbackURL'   : 'http://localhost:3000/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : 'KPJEI1VBFcT6RCwjvKqAufxcg',
        'consumerSecret'    : 'KOqURmHCsv3jA3oaGzkA1wosQCaVCtbhmfBQvbRwPeu51mAnTU',
        'callbackURL'       : 'http://localhost:3000/auth/twitter/callback'
    }
};