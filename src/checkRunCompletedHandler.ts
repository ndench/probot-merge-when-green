export const MERGE_LABEL = 'merge when green'
const SUPPORTED_CI = ['circleci', 'travis-ci']

export async function checkRunCompletedHandler (context: any) {
  context.payload.check_run.pull_requests.forEach(async (prRef: any) => {
    const pr = (await context.github.pullRequests.get(
      context.repo({ number: prRef.number })
    )).data

    if (!hasMergeLabel(pr)) return
    if (!(await isEveryCheckSuccessful(context, pr))) return

    await mergeAndDeleteBranch(context, pr)
  })
}

const hasMergeLabel = (pr: any) : boolean => pr.labels.find((label: any) => label.name === MERGE_LABEL)
const isEveryCheckSuccessful = async (context: any, pr: any): Promise<boolean> => {
  const checks = (await context.github.checks.listForRef(
    context.repo({ ref: pr.head.ref })
  )).data

  const supportedCheckRuns = checks.check_runs.filter((checkRun: any) =>
    SUPPORTED_CI.includes(checkRun.app.owner.login)
  )
  if (supportedCheckRuns.length === 0) return false

  return supportedCheckRuns.every(
    (checkRun: any) =>
      checkRun.status === 'completed' && checkRun.conclusion === 'success'
  )
}

const mergeAndDeleteBranch = async (context: any, pr: any): Promise<void> => {
  const result = await context.github.pullRequests.merge(
    context.repo({ number: pr.number })
  )

  if (!result.data.merged) return

  await context.github.gitdata.deleteRef(
    context.repo({ ref: `heads/${pr.head.ref}` })
  )
}
