// 'Application' is defined but never used
import { Application } from 'probot' // eslint-disable-line
// import { mergeWhenGreen } from './checkRunHandler'

export = (app: Application) => {
  app.on('check_run.completed', async context => {})
}
