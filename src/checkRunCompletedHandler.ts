export const MERGE_LABEL = 'merge when green'
const SUPPORTED_CI = ['circleci', 'travis-ci']

export async function checkRunCompletedHandler(context: any) {
  const github = context.github
  const checkRun = context.payload.check_run

  checkRun.pull_requests.forEach(async (prRef: any) => {
    const pr = (await github.pullRequests.get(context.repo({ number: prRef.number }))).data

    const shouldMerge = pr.labels.find((label: any) => {
      return label.name === MERGE_LABEL
    })

    if (!shouldMerge) {
      return
    }

    const checks = (await github.checks.listForRef(context.repo({ ref: pr.head.ref }))).data

    const unsuccessful = checks.check_runs.find((cr: any) => {
      return (
        cr.status !== 'completed' || (cr.status === 'completed' && cr.conclusion !== 'success' && SUPPORTED_CI.includes(cr.app.owner.login))
      )
    })

    if (!unsuccessful) {
      const result = await github.pullRequests.merge(context.repo({ number: pr.number }))

      if (result.data.merged) {
        await github.gitdata.deleteReference(context.repo({ ref: `heads/${pr.head.ref}` }))
      }
    }
  })
}