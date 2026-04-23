import * as core from '@actions/core';
import axios, { isAxiosError } from 'axios';
import * as fs from 'fs';

export interface FindReplaceInputs {
  source: string;
  find: string;
  replace: string;
  replaceAll: boolean;
}

export async function validateSubscription(): Promise<void> {
  const eventPath = process.env.GITHUB_EVENT_PATH
  let repoPrivate: boolean | undefined

  if (eventPath && fs.existsSync(eventPath)) {
    const eventData = JSON.parse(fs.readFileSync(eventPath, 'utf8'))
    repoPrivate = eventData?.repository?.private
  }

  const upstream = 'mad9000/actions-find-and-replace-string'
  const action = process.env.GITHUB_ACTION_REPOSITORY
  const docsUrl =
    'https://docs.stepsecurity.io/actions/stepsecurity-maintained-actions'

  core.info('')
  core.info('[1;36mStepSecurity Maintained Action[0m')
  core.info(`Secure drop-in replacement for ${upstream}`)
  if (repoPrivate === false)
    core.info('[32m✓ Free for public repositories[0m')
  core.info(`[36mLearn more:[0m ${docsUrl}`)
  core.info('')

  if (repoPrivate === false) return

  const serverUrl = process.env.GITHUB_SERVER_URL || 'https://github.com'
  const body: Record<string, string> = {action: action || ''}
  if (serverUrl !== 'https://github.com') body.ghes_server = serverUrl
  try {
    await axios.post(
      `https://agent.api.stepsecurity.io/v1/github/${process.env.GITHUB_REPOSITORY}/actions/maintained-actions-subscription`,
      body,
      {timeout: 3000}
    )
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 403) {
      core.error(
        `[1;31mThis action requires a StepSecurity subscription for private repositories.[0m`
      )
      core.error(
        `[31mLearn how to enable a subscription: ${docsUrl}[0m`
      )
      process.exit(1)
    }
    core.info('Timeout or API not reachable. Continuing to next step.')
  }
}

export function getInputs(): FindReplaceInputs {
  const source = core.getInput('source');
  const find = core.getInput('find');
  const replace = core.getInput('replace');
  const replaceAllInput = core.getInput('replaceAll');
  const replaceAll = replaceAllInput ? replaceAllInput === 'true' : false;

  return {
    source,
    find,
    replace,
    replaceAll,
  };
}

export function performFindReplace(inputs: FindReplaceInputs): string {
  const { source, find, replace, replaceAll } = inputs;
  
  if (replaceAll) {
    return source.replaceAll(find, replace);
  } else {
    return source.replace(find, replace);
  }
}

export async function main(): Promise<void> {
  try {
    await validateSubscription();

    const inputs = getInputs();
    const resultValue = performFindReplace(inputs);
    
    core.setOutput('value', resultValue);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    core.setFailed(errorMessage);
  }
}

main().catch((error) => {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
  core.setFailed(errorMessage);
});