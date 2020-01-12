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
  await exec.exec("yarn ci:lambda")

  console.log("starting react server")
  await exec.exec("yarn ci:start")

  console.log("waiting for the app")
  await exec.exec("yarn ci:wait")
}

const test = async() => {
  console.log(process.env)
  console.log("starting Cypress tests")
  await exec.exec("yarn ci:test")
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