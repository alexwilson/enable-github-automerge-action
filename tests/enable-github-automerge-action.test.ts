import { describe, it, expect, vi, beforeEach } from "vitest";
import * as core from "@actions/core";

vi.mock("@actions/core", () => ({
  info: vi.fn(),
  debug: vi.fn(),
  error: vi.fn(),
}));

import { EnableGithubAutomergeAction } from "../src/enable-github-automerge-action.js";

const fakeContext = {
  repo: { repo: "frontend", owner: "alexwilson" },
  payload: { pull_request: { number: 1, node_id: "PR_kwDO" } },
} as any;

const enableAutoMergeSuccess = {
  enablePullRequestAutoMerge: {
    clientMutationId: "abc",
    pullRequest: {
      id: "PR_kwDO",
      state: "OPEN",
      autoMergeRequest: {
        enabledAt: "2026-01-01T00:00:00Z",
        enabledBy: { login: "alexwilson" },
      },
    },
  },
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("EnableGithubAutomergeAction.run", () => {
  it("uses the preferredMergeMethod when configured, skipping the lookup", async () => {
    const graphql = vi.fn().mockResolvedValueOnce(enableAutoMergeSuccess);
    const action = new EnableGithubAutomergeAction(
      { graphql } as any,
      fakeContext,
      {
        preferredMergeMethod: "REBASE",
      },
    );

    await action.run();

    expect(graphql).toHaveBeenCalledTimes(1);
    expect(graphql.mock.calls[0][1]).toMatchObject({ mergeMethod: "REBASE" });
  });

  it("uses the repo's viewerDefaultMergeMethod when no preference is set", async () => {
    const graphql = vi
      .fn()
      .mockResolvedValueOnce({
        repository: { viewerDefaultMergeMethod: "SQUASH" },
      })
      .mockResolvedValueOnce(enableAutoMergeSuccess);
    const action = new EnableGithubAutomergeAction(
      { graphql } as any,
      fakeContext,
      {},
    );

    await action.run();

    expect(graphql).toHaveBeenCalledTimes(2);
    expect(graphql.mock.calls[1][1]).toMatchObject({ mergeMethod: "SQUASH" });
  });

  it("falls back to MERGE when the viewerDefault lookup throws", async () => {
    const graphql = vi
      .fn()
      .mockRejectedValueOnce(new Error("GraphQL failed"))
      .mockResolvedValueOnce(enableAutoMergeSuccess);
    const action = new EnableGithubAutomergeAction(
      { graphql } as any,
      fakeContext,
      {},
    );

    await action.run();

    expect(graphql.mock.calls[1][1]).toMatchObject({ mergeMethod: "MERGE" });
    expect(core.error).toHaveBeenCalledWith(
      expect.stringContaining("Failed to read default merge method"),
    );
  });

  it("throws when the event payload has no pull_request", async () => {
    const action = new EnableGithubAutomergeAction(
      { graphql: vi.fn() } as any,
      { ...fakeContext, payload: {} },
      {},
    );

    await expect(action.run()).rejects.toThrow(/pull_request/);
  });
});
