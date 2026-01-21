import { resolve } from "path"; // Import 'resolve' to construct absolute file paths

// Define an asynchronous function to set up environment variables and run the main script
async function run() {
  // Map environment variables to GitHub Action input format
  [
    ["github-token", "GITHUB_TOKEN"], // Maps GITHUB_TOKEN to INPUT_GITHUB_TOKEN
    ["merge-method", "MERGE_METHOD"], // Maps MERGE_METHOD to INPUT_MERGE_METHOD
  ].forEach(([inputName, envInputVariable]) => {
    // If the environment variable exists, convert and assign it as a GitHub Action input
    if (process.env[envInputVariable]) {
      process.env[`INPUT_${inputName.replace(/ /g, "_").toUpperCase()}`] =
        process.env[envInputVariable];
    }
  });

  // Set the GitHub event path to a stub JSON file (simulating a pull request event)
  process.env[`GITHUB_EVENT_PATH`] = resolve(
    __dirname,
    "..",
    "stub",
    "example-pull-request.json",
  );

  // Load and execute the main script
  require("./main");
}

// Run the setup function
run();
