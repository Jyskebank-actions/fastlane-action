const core = require('@actions/core');
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

function authorize(serviceAccountCredentials, callback) {
    const client = new google.auth.JWT(
        serviceAccountCredentials.client_email,
        null,
        serviceAccountCredentials.private_key,
        SCOPES
    );

    client.authorize()
        .then(function(token) {
            client.setCredentials(token);
            callback(client)
        }).catch(function(error) {
            console.log("Failed to authorize: " + error);
        });
}

function listMessages(client) {
    console.log("List messages");
}

function run() {
    try {
        const serviceAccountCredentialData = core.getInput('service-account-credentials', { required: true });
        const serviceAccountCredentials = JSON.parse(serviceAccountCredentialData);

        authorize(serviceAccountCredentials, function(client) {
            listMessages(client);
        });
    } catch (error) {
        setFailed(error);
    }
}

function setFailed(error) {
    core.error(error);
    core.setFailed(error.message);
}

run();