const core = require('@actions/core')
const exec = require('@actions/exec')
const github = require('@actions/github')
const io = require('@actions/io')

const install = async () => {
  console.log("installing NPM dependencies using Yarn")
  await exec.exec("yarn install")
}

const start = async () => {
  console.log("starting lambda server")
  await exec.exec("yarn ci:lambda")

  console.log("starting react server")
  await exec.exec("yarn ci:start")

  console.log("waiting for the app")
  await exec.exec("yarn ci:wait")
}

const test = async () => {
  console.log(process.env.CYPRESS_RECORD_KEY)
  console.log("starting Cypress tests")
  await exec.exec("npx cypress run --record --browser chrome")
}

const faunaSetup = async () => {
  console.log("setting up Fauna")
  await exec.exec(`npx fauna eval talenth-ci --file=./fauna/cleanup.fql --secret=${process.env.PARENT_FAUNADB_KEY}`)
  await exec.exec(`npx fauna eval talenth-ci --file=./fauna/seed/recruiter.fql --secret=${process.env.PARENT_FAUNADB_KEY}`)
  await exec.exec(`npx fauna eval talenth-ci --file=./fauna/seed/applicant.fql --secret=${process.env.PARENT_FAUNADB_KEY}`)
}

async function run() {
  try {
    await install()
    await start()
    await faunaSetup()
    await new Promise(resolve => setTimeout(resolve, 1000))
    await test()

  } catch (error) {
    core.setFailed(error.message)
  }
}

run()