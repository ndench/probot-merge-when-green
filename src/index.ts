// 'Application' is defined but never used
import { Application } from 'probot' // eslint-disable-line no-unused-vars
import checkRunCompletedHandler from './checkRunCompletedHandler'
import pullRequestReviewHandler from './pullRequestReviewHandler'
import installationCreatedHandler from './installationCreatedHandler'
import Rollbar from 'rollbar'

const rollbar = new Rollbar({ accessToken: process.env.ROLLBAR_ACCESS_TOKEN })

export = (app: Application) => {
  app.router.use(rollbar.errorHandler())

  app.on('check_run.completed', async context => {
    await checkRunCompletedHandler(context)
  })

  app.on('status.success', async context => {
    await checkRunCompletedHandler(context)
  })

  app.on('pull_request_review', async context => {
    await pullRequestReviewHandler(context)
  })

  app.on('installation.created', async context => {
    await installationCreatedHandler(context, context.payload.repositories)
  })

  app.on(
    [
      'integration_installation_repositories.added',
      'installation_repositories.added'
    ],
    async context => {
      await installationCreatedHandler(
        context,
        context.payload.repositories_added
      )
    }
  )
}
