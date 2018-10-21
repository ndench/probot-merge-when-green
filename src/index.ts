// 'Application' is defined but never used
import { Application } from 'probot' // eslint-disable-line

export = (app: Application) => {
  app.on('check_run.completed', async context => {
    const github = context.github
    const checkRun = context.payload.check_run
    const owner = context.payload.repository.owner.login
    const repo = context.payload.repository.name

    checkRun.pull_requests.forEach(async (prRef: any) => {
      const pr = (await github.pullRequests.get({owner, repo, number: prRef.number})).data

      const shouldMerge = pr.labels.find(label => {
        return label.name === 'merge when green'
      })

      if(!shouldMerge) { return }

      const checks = (await github.checks.listForRef({
        owner,
        repo,
        ref: pr.head.ref
      })).data

      const unsuccessful = checks.check_runs.find(cr => {
        return (
          cr.status !== 'completed' &&
          cr.conclusion !== 'success' &&
          cr.app.owner.login === 'travis-ci'
        )
      })

      if (!unsuccessful) {
        const result = await github.pullRequests.merge({
          owner,
          repo,
          number: pr.number
        })

        if (result.data.merged) {
          await github.gitdata.deleteReference({
            owner,
            repo,
            ref: `heads/${pr.head.ref}`
          })
        }
      }
    })
  })
}
