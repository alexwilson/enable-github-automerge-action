# Enable Github Auto-Merge Action

> Speed up your workflows by automatically enabling Auto-Merge in your Github pull-requests, so you can release when ready.

[![Public workflows that use this action](https://img.shields.io/endpoint?url=https%3A%2F%2Fapi-git-master.endbug.vercel.app%2Fapi%2Fgithub-actions%2Fused-by%3Faction%3Dalexwilson%2Fenable-github-automerge-action%26badge%3Dtrue)](https://github.com/search?o=desc&q=alexwilson%2Fenable-github-automerge-action+path%3A.github%2Fworkflows+language%3AYAML&s=&type=Code)
[![CI status](https://github.com/alexwilson/enable-github-automerge-action/workflows/Test/badge.svg)](https://github.com/alexwilson/enable-github-automerge-action/actions?query=workflow%Test)


Name: `alexwilson/enable-github-automerge-action`

## 1) What is this?

To speed up some of your workflows, this action allows you to automatically enable [Auto-Merge](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/automatically-merging-a-pull-request) in your Github pull-requests.

When enabled, auto-merge will merge pull-requests automatically _as soon as all requirements are met_ (i.e. approvals, passing tests).

_You can use this, for example, to automatically merge Dependabot pull-requests_.

This action pairs well with [`hmarr/auto-approve-action`](https://github.com/hmarr/auto-approve-action).

## 2) Usage

Add as a step inside a GitHub workflow, e.g. `.github/workflows/auto-merge.yml`.  [You can see an example of this in this repository](./.github/workflows/auto-merge-dependabot.yml).

> ⚠️  GitHub have [recently improved the security model of actions](https://github.blog/changelog/2021-02-19-github-actions-workflows-triggered-by-dependabot-prs-will-run-with-read-only-permissions/) reducing the risk of unknown code accessing secrets, so we recommend running this in an isolated workflow within the `pull_request_target` scope, on a trusted event (e.g. `labeled`).

```yaml
name: Auto-Merge
on:
  pull_request_target:
    types: [labeled]

jobs:
  enable-auto-merge:
    runs-on: ubuntu-latest

    # Specifically check that dependabot (or another trusted party) created this pull-request, and that it has been labelled correctly.
    if: github.event.pull_request.user.login == 'dependabot[bot]' && contains(github.event.pull_request.labels.*.name, 'dependencies')
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
