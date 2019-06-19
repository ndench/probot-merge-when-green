// 'Application' is defined but never used
import { Application } from 'probot' // eslint-disable-line no-unused-vars
import checkRunCompletedHandler from './checkRunCompletedHandler'
import pullRequestReviewHandler from './pullRequestReviewHandler'
import installationCreatedHandler from './installationCreatedHandler'

export = (app: Application) => {
  app.on('check_run.completed', async context => {
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
