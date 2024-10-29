const core = require('@actions/core')
const axios = require('axios');
const fs = require('fs')

async function validateSubscription() {
    const API_URL = `https://agent.api.stepsecurity.io/v1/github/${process.env.GITHUB_REPOSITORY}/actions/subscription`;

    try {
        await axios.get(API_URL, { timeout: 3000 });
    } catch (error) {
        if (error.response) {
            console.error(
                'Subscription is not valid. Reach out to support@stepsecurity.io'
            );
            process.exit(1);
        } else {
            core.info('Timeout or API not reachable. Continuing to next step.');
        }
    }
}

async function main() {
    try {
        await validateSubscription();

        const source = core.getInput('source')
        const find = core.getInput('find')
        const replace = core.getInput('replace')
        const replaceAllInput = core.getInput('replaceAll')
        const replaceAll = replaceAllInput ? replaceAllInput == 'true' : false
        const resultValue = replaceAll ? source.replaceAll(find, replace) : source.replace(find, replace)
        core.setOutput('value', resultValue)
    } catch (error) {
        core.setFailed(error.message)
    }
}

main()