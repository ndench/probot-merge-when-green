// import { Context } from 'probot'
import findFixableIssues from './findFixableIssues'

export const MERGE_LABEL = 'merge when green'
const SUPPORTED_CI = ['circleci', 'travis-ci']

export async function checkRunCompletedHandler (context: any) {
  const github = context.github
  const checkRun = context.payload.check_run

  checkRun.pull_requests.forEach(async (prRef: any) => {
    const pr = (await github.pullRequests.get(
      context.repo({ number: prRef.number })
    )).data

    const shouldMerge = pr.labels.find(
      (label: any) => label.name === MERGE_LABEL
    )

    if (!shouldMerge) return

    const checks = (await context.github.checks.listForRef(
      context.repo({ ref: pr.head.ref })
    )).data

    const supportedCheckRuns = checks.check_runs.filter((checkRun: any) =>
      SUPPORTED_CI.includes(checkRun.app.owner.login)
    )
    if (supportedCheckRuns.length === 0) return

    const unsuccessfulCheckRun = checks.check_runs.find(
      (checkRun: any) =>
        checkRun.status !== 'completed' || checkRun.conclusion !== 'success'
    )
    if (unsuccessfulCheckRun) return

    const result = await context.github.pullRequests.merge(
      context.repo({ number: pr.number })
    )

    if (!result.data.merged) return

    await github.gitdata.deleteRef(
      context.repo({ ref: `heads/${pr.head.ref}` })
    )
    // Only close issues if the PR targets the default branch
    // in order to replicate GitHub's functionality (closing keywords)
    if (!isTargetDefaultBranch(pr)) return

    await findFixableIssues(pr.body).forEach(async number => closeIssue(context, number))
  })
}

const isTargetDefaultBranch = (pr: any): boolean =>
  pr.base.repo.default_branch === pr.base.ref

const closeIssue = async (context: any, number: string) => {
  const github = context.github
  const issue = (await github.issues.get(context.repo({ number }))).data

  if (issue.pull_request) /* skip pull requests */ return

  await github.issues.edit(context.repo({ state: 'closed', number }))
}
