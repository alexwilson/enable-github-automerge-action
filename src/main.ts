import * as github from "@actions/github";
import { setFailed, getInput } from "@actions/core";
import {
  EnableGithubAutomergeAction,
  Options,
} from "./enable-github-automerge-action";

export async function run() {
  try {
    const { context } = github;
    const options: Options = Object.create(null);

    const token = getInput("github-token", { required: true });
    const client = github.getOctokit(token);

    const preferredMergeMethod = getInput("merge-method", { required: false });
    if (preferredMergeMethod) {
      options.preferredMergeMethod = preferredMergeMethod;
    }

    const automergeAction = new EnableGithubAutomergeAction(
      client,
      context,
      options
    );
    await automergeAction.run();
  } catch (error) {
    setFailed(error.message);
  }
}

run();
