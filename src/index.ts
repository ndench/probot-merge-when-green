// 'Application' is defined but never used
import { Application } from 'probot' // eslint-disable-line
import { checkRunCompletedHandler } from './checkRunCompletedHandler'
import { installationCreatedHandler } from './installationCreatedHandler'

export = (app: Application) => {
  app.on('check_run.completed', async context => {
    await checkRunCompletedHandler(context)
  })

  app.on('installation.created', async context => {
    await installationCreatedHandler(context)
  })
}
