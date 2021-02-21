import * as core from "@actions/core";
import * as github from "@actions/github";
import EnableGithubAutomergeAction from "./enable-github-automerge-action"

export async function run() {

  try {    
    const { context }  = github;
    const token = core.getInput("github-token", { required: true });
    const client = github.getOctokit(token);
  
    const automergeAction = new EnableGithubAutomergeAction(client, context)
    await automergeAction.run();

  } catch(error) {
    core.setFailed(error.message);
  }

}

run();