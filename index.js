const core = require('@actions/core')
const exec = require('@actions/exec')
const github = require('@actions/github')
const io = require('@actions/io')

const install = async() => {
  console.log("installing NPM dependencies using Yarn")
  await exec.exec("yarn install")
}

const start = async() => {
  console.log("starting lambda server")
  await exec.exec("yarn start:lambda &")

  console.log("starting react server")
  await exec.exec("yarn start:app &")

  console.log("waiting for the app")
  await exec.exec("./node-modules/.bin/wait-on http://localhost:3000")
}

const test = async() => {
  console.log("starting Cypress tests")
  await exec.exec("yarn test")
}

async function run() {
  try {
    await install()
    await start()
    await test()

  } catch (error) {
    core.setFailed(error.message)
  }
}

run()