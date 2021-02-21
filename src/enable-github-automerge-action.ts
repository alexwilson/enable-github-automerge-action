import { getInput, debug, error } from "@actions/core";
import { GitHub } from "@actions/github/lib/utils";
import { Context } from "@actions/github/lib/context"

type GitHubClient = InstanceType<typeof GitHub>

export default class EnableGithubAutomergeAction {

    private client: GitHubClient
  
    private context: Context;
  
    constructor(client: GitHubClient, context: Context) {
      this.client = client
      this.context = context;
    }
  
    async run() {
    
        // Find out where we are!
        const { repo } = this.context;
        if (!repo) {
          throw new Error("Could not find repository!")
        }
    
        // Make sure this is actually a pull-request!
        // We need this to retrieve the pull-request node ID.
        const { pull_request: pullRequest } = this.context.payload;
        if (!pullRequest) {
          throw new Error("Event payload missing `pull_request`, is this a pull-request?");
        }
        const pullRequestId = pullRequest.node_id
  
        // Step 1. Retrieve the merge method!
        debug(`Retrieving merge-method...`)
        const mergeMethod = await this.getMergeMethod(repo)
        debug(`Successfully retrieved merge-method: ${mergeMethod}`)
    
        // Step 2. Enable auto-merge.
        debug(`Enabling auto-merge for pull-request #${pullRequest.number}`);
        await this.enableAutoMerge(pullRequestId, mergeMethod)
        debug(
          `Successfully enabled auto-merge for pull-request #${pullRequest.number}`
        );
  
    }
  
    private async getMergeMethod(repo) {
      
      const preferredMergeMethod = getInput("merge-method", { required: false });
      
      // Allow users to specify a merge method.
      if (preferredMergeMethod) {
        return preferredMergeMethod;
      }
      
      //
      // Otherwise try and discover one.
      //
  
      // Merge is the default behaviour.
      let mergeMethod = `MERGE`;
  
      // Try to discover the repository's default merge method.
      try {
        const repositorySettings = await this.client.graphql(`
          query($repository: String!, $owner: String!) {
            repository(name:$repository, owner:$owner) {
              viewerDefaultMergeMethod
            }
          }
        `, {
          repository: repo.repo,
          owner: repo.owner
        }) as any
        const viewerDefaultMergeMethod = repositorySettings?.repository?.viewerDefaultMergeMethod || undefined
    
        if (viewerDefaultMergeMethod) {
          mergeMethod = viewerDefaultMergeMethod
        }
      } catch (err) {
        error(`Failed to read default merge method: ${err.message}`)
      }
  
      return mergeMethod
    }
  
    private async enableAutoMerge(pullRequestId: string, mergeMethod: string) {
      return await this.client.graphql(`
        mutation(
          $pullRequestId: ID!,
          $mergeMethod: PullRequestMergeMethod!
        ) {
            enablePullRequestAutoMerge(input: {
              pullRequestId: $pullRequestId,
              mergeMethod: $mergeMethod
            }) {
            clientMutationId
            pullRequest {
              id
              state
            }
          }
        }
      `, {
        pullRequestId,
        mergeMethod
      });
    }
  
  }