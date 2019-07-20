import { Context } from 'probot' // eslint-disable-line no-unused-vars
import Github from '@octokit/rest' // eslint-disable-line no-unused-vars
import { MERGE_LABEL } from './constants'
import getConfiguration from './configuration'

export default async function mergeIfGreen (context: Context, pr: Github.PullRequestsGetResponse) {
  if (!hasMergeLabel(pr)) return
  if (!(await isEveryCheckSuccessful(context, pr))) return

  await mergeAndDeleteBranch(context, pr)
}

const hasMergeLabel = (pr: Github.PullRequestsGetResponse) : boolean => pr.labels.some((label: Github.PullRequestsGetResponseLabelsItem) => label.name === MERGE_LABEL)
const isEveryCheckSuccessful = async (context: Context, pr: Github.PullRequestsGetResponse): Promise<boolean> => {
  const checks = (await context.github.checks.listForRef(
    context.repo({ ref: pr.head.ref })
  )).data

  const config = await getConfiguration(context) as any

  // Github.ChecksListForRefResponse
  const supportedCheckRuns = checks.check_runs.filter((checkRun: Github.ChecksListForRefResponseCheckRunsItem) =>
    config.requiredCi.includes(checkRun.app.owner.login)
  )
  if (supportedCheckRuns.length === 0) return false

  return supportedCheckRuns.every(
    (checkRun: Github.ChecksListForRefResponseCheckRunsItem) =>
      checkRun.status === 'completed' && checkRun.conclusion === 'success'
  )
}

const mergeAndDeleteBranch = async (context: Context, pr: Github.PullRequestsGetResponse): Promise<void> => {
  const result = await context.github.pullRequests.merge(
    context.repo({ number: pr.number })
  )

  if (!result.data.merged) return

  await context.github.gitdata.deleteRef(
    context.repo({ ref: `heads/${pr.head.ref}` })
  )
}
