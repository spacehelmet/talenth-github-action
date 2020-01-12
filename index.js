const core = require('@actions/core')
const exec = require('@actions/exec')
const github = require('@actions/github')
const io = require('@actions/io')

const install = async() => {
  console.log("installing NPM dependencies using Yarn")
  await exec.exec("yarn install")
}

const start = async() => {
  console.log("starting server with command")
  await exec.exec("yarn start")
}

const waitOn = async() => {
  console.log("waiting for the server to start")
  await exec.exec("wait-on http://localhost:3000")
}

async function run() {
  try {
    await install()
    await start()
    await waitOn()

  } catch (error) {
    core.setFailed(error.message)
  }
}

run()