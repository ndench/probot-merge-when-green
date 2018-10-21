import { Application } from 'probot'
// import { mergeWhenGreen } from './checkRunHandler'

export = (app: Application) => {
  app.on('check_run.completed', async context => {})
}
