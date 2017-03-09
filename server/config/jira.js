let logger = require('../app/services/logger')
let fs = require('fs')
let path = require('path')
let OAuth = require('oauth').OAuth

module.exports = (base_url, callback_host, consumer_key, certificate) => {

    const api = {}
    const requestUrl = base_url + '/plugins/servlet/oauth/request-token'
    const accessUrl = base_url + '/plugins/servlet/oauth/access-token'
    const consumerKey = consumer_key
    const consumerSecret = fs.readFileSync(certificate, 'utf8')
    const version = '1.0'
    const authorizeCallback = callback_host + '/login/callback'
    const permissionCallback = base_url + '/plugins/servlet/oauth/authorize?oauth_token='
    const userProfileRest = base_url + '/rest/api/latest/myself.json?expand=groups'
    const signatureMethod = 'RSA-SHA1'
    const nonceSize = null

    const customHeaders = {
        'Accept': '*/*',
        'Connection': 'close',
        'User-Agent': 'DynaClub Authentication',
        'Content-Type': 'application/json'
    }

    const consumer = new OAuth(
        requestUrl,
        accessUrl,
        consumerKey,
        consumerSecret,
        version,
        authorizeCallback,
        signatureMethod,
        nonceSize,
        customHeaders
    )

    api.connect = (req, res) => {
        consumer.getOAuthRequestToken(
            function (error, oauthToken, oauthTokenSecret, results) {
                if (error) {
                    console.log('Error on retrieving oAuth token: ' + JSON.stringify(error))
                    logger.error('Error on retrieving oAuth token: ' + JSON.stringify(error))
                    return res.sendStatus(400)
                } else {
                    res.send({
                        oauthToken: oauthToken,
                        oauthTokenSecret: oauthTokenSecret,
                        url: permissionCallback + oauthToken
                    })
                }
            }
        )
    };

    api.callback = (req, res) => {
        return new Promise((resolve, reject) => {
            consumer.getOAuthAccessToken(
                req.query.oauthToken,
                req.query.oauthTokenSecret,
                req.query.oauthVerifier,
                function (error, oauthAccessToken, oauthAccessTokenSecret, results) {
                    if (error) {
                        logger.error('Error on retrieving access token: ' + JSON.stringify(error))
                        reject(error);
                    } else {
                        resolve(handleUserProfile(oauthAccessToken, oauthAccessTokenSecret))
                    }
                }
            )
        });
    };

    /**
     * Uses the user access token to retrieve their information from Jira.
     */
    handleUserProfile = (oauthAccessToken, oauthAccessTokenSecret) => {
        return new Promise((resolve, reject) => {
            consumer.get(
                userProfileRest,
                oauthAccessToken,
                oauthAccessTokenSecret,
                (error, data, resp) => {
                    if (error) {
                        logger.error('Error on retrieving user information: ' + JSON.stringify(error))
                        reject(error)
                        return
                    }
                    resolve(JSON.parse(data))
                }
            );
        });
    }

    return api
}