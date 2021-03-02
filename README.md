# Enable Github Auto-Merge Action

Name: `alexwilson/enable-github-automerge-action`

## 1) What is this?

To speed up some of your workflows, this action allows you to automatically enable [Auto-Merge](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/automatically-merging-a-pull-request) in your Github pull-requests.  

When enabled, Auto-Merge will merge pull-requests automatically _as soon as all requirements are met_ (approvals, passing tests).

_You can use this, for example, to automatically merge Dependabot pull-requests_.

This action pairs well with [`hmarr/auto-approve-action`](https://github.com/hmarr/auto-approve-action)

## 2) Usage

Add as a step inside a GitHub workflow, e.g. `.github/workflows/auto-merge.yml`.  [You can see an example of this in this repository](./.github/workflows/auto-merge-dependabot.yml).

```yaml
name: Auto-Merge
on: pull_request

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: alexwilson/enable-github-automerge-action@main
      with:
        github-token: "${{ secrets.GITHUB_TOKEN }}"
```

*Note*: You will probably want to add some restrictions so this doesn't auto-merge every PR: these are handled fairly well by GitHub Workflow syntax, [you can read more about this here](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idstepsif).

### 2.1) Additional Options

```yaml
    - uses: alexwilson/enable-github-automerge-action@1.0.0
      with:
        github-token: "${{ secrets.GITHUB_TOKEN }}"
        merge-method: "SQUASH"
```

- **github-token**: The Github Token to use for this action.  By default this variable is set to run as `github-actions`, however you can replace this with another user/actor's Github Token (make sure it has, _at minimum_, `repo` scope).
- **merge-method**: Override the merge method.  By default this action attempts to select your repository's default merge method, and falls back to merge.  One of `MERGE`, `SQUASH` or `REBASE`.  [Read more here](https://docs.github.com/en/graphql/reference/enums#pullrequestmergemethod).

## 3) Developing Locally

Github Action developer-experience isn't fantastic, so for now we mimic the Github Action environment in `./src/local.ts`.

This file sets environment variables locally to enable action inputs, and points to a sample pull-request webhook event in `./stub/example-pull-request.json`.

1. Make sure you're running a recent version of Node (the correct version will always be in `.nvmrc` and `action.yml`)
2. Set `GITHUB_TOKEN` locally.  (You can do this via `$ export GITHUB_TOKEN=blah`)
3. Optionally(!) set `MERGE_METHOD` locally.  (You can do this via `$ export MERGE_METHOD=MERGE`)
4. Run with `npm run local`.
5. **Important**: Avoid committing anything to `dist/*` — this is automatically regenerated and manually adjusting this will make rebasing harder!