// 'Application' is defined but never used
import { Application } from 'probot' // eslint-disable-line
import { checkRunCompletedHandler } from './checkRunCompletedHandler'


export = (app: Application) => {
  app.on('check_run.completed', async context => {
    await checkRunCompletedHandler(context)
  })
}
