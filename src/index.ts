import * as core from '@actions/core';
import axios from 'axios';

export interface FindReplaceInputs {
  source: string;
  find: string;
  replace: string;
  replaceAll: boolean;
}

export async function validateSubscription(): Promise<void> {
  const API_URL = `https://agent.api.stepsecurity.io/v1/github/${process.env.GITHUB_REPOSITORY}/actions/subscription`;

  try {
    await axios.get(API_URL, { timeout: 3000 });
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 403) {
      console.error(
        'Subscription is not valid. Reach out to support@stepsecurity.io'
      );
      process.exit(1);
    } else {
      core.info('Timeout or API not reachable. Continuing to next step.');
    }
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
