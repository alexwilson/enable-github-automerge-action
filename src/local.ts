import { resolve } from "path"

async function run() {

    [
        ['github-action', 'GITHUB_ACTION'],
        ['merge-method', 'MERGE_METHOD']
    ].forEach(([inputName, envInputVariable]) => {
        process.env[`INPUT_${inputName.replace(/ /g, '_').toUpperCase()}`] = process.env[envInputVariable]
    })

    process.env[`GITHUB_EVENT_PATH`] = resolve(__dirname, "..", "stub", "example-pull-request.json")

    require("./main")
}

run()