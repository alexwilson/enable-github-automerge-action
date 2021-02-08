import * as core from "@actions/core";
import * as github from "@actions/github";

async function run() {
  try {
    const token = core.getInput("github-token", { required: true });
    const client = github.getOctokit(token);

    const { pull_request: pullRequest } = github.context.payload;
    if (!pullRequest) {
      throw new Error("Event payload missing `pull_request`");
    }

    core.debug(`Enabling auto-merge for pull-request #${pullRequest.number}`);
    client.graphql(`
        mutation {
            enablePullRequestAutoMerge(input:{
            pullRequestId: "${pullRequest.node_id}"
          }) {
            clientMutationId
            pullRequest {
              id
              state
            }
          }
        }
    `);
    core.debug(
      `Successfully enabled auto-merge for pull-request #${pullRequest.number}`
    );
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
