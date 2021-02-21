# Enable Github Auto-Merge Action

⚠️**WIP: Please wait until version 1.0.0 before using this.** ⚠️

## What is this?

A Github action for enabling [Github Auto-Merge](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/automatically-merging-a-pull-request) in a workflow for a pull-request.
You might want to use this for automatically merging Dependabot pull-requests.

## Running Locally
Github Action developer-experience isn't fantastic, so for now we mimic the Github Action environment in `./src/local.ts`.

This file sets environment variables locally to enable action inputs, and points to a sample pull-request webhook event in `./stub/example-pull-request.json`.

1. Make sure you're running a recent version of Node (the correct version will always be in `.nvmrc` and `action.yml`)
2. Set `GITHUB_TOKEN` locally.  (You can do this via `$ export GITHUB_TOKEN=blah`)
3. Optionally(!) set `MERGE_METHOD` locally.  (You can do this via `$ export MERGE_METHOD=MERGE`)
4. Run with `npm run local`.
