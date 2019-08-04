import { Context } from 'probot' // eslint-disable-line no-unused-vars
import Github from '@octokit/rest' // eslint-disable-line no-unused-vars
import { MERGE_LABEL } from './constants'
import { getConfiguration } from './configuration'

/* eslint-disable no-undef, no-unused-vars */
/**
 * This represents the properties of a PR we require in order to merge it.
 * It's required because there are multiple ways to get a PR from Github, and their types do not overlap.
 * eg. Github.PullsGetResponse and Github.ReposListPullRequestsAssociatedWithCommitResponseItem
 */
interface PullType {
  number: number
  head: { ref: string }
  labels: { name: string }[]
}
/* eslint-enable no-undef, no-unused-vars */

export default async function mergeWhenGreen (context: Context, pr: PullType) {
  if (!hasMergeLabel(pr)) return
  if (!(await isEveryCheckSuccessful(context, pr))) return
  if (!(await isEveryStatusSuccessful(context, pr))) return

  await mergeAndDeleteBranch(context, pr)
}

const hasMergeLabel = (pr: PullType) : boolean => pr.labels.some((label) => label.name === MERGE_LABEL)

const isEveryCheckSuccessful = async (context: Context, pr: PullType): Promise<boolean> => {
  const checkRuns = (await context.github.checks.listForRef(
    context.repo({ ref: pr.head.ref })
  )).data.check_runs

  const { requiredChecks } = await getConfiguration(context)

  // Github.ChecksListForRefResponse
  const supportedCheckRuns = checkRuns.filter((checkRun: Github.ChecksListForRefResponseCheckRunsItem) =>
    requiredChecks.includes(checkRun.app.owner.login)
  )

  if (supportedCheckRuns.length !== requiredChecks.length) return false

  return supportedCheckRuns.every(
    (checkRun: Github.ChecksListForRefResponseCheckRunsItem) =>
      checkRun.status === 'completed' && checkRun.conclusion === 'success'
  )
}

const isEveryStatusSuccessful = async (context: Context, pr: PullType): Promise<boolean> => {
  const statuses = (await context.github.repos.listStatusesForRef(
    context.repo({ ref: pr.head.ref })
  )).data

  const { requiredStatuses } = await getConfiguration(context)

  const supportedStatuses = statuses.filter((statusItem: Github.ReposListStatusesForRefResponseItem) =>
    requiredStatuses.includes(statusItem.context)
  )
  if (supportedStatuses.length !== requiredStatuses.length) return false

  return supportedStatuses.every(
    (statusItem: Github.ReposListStatusesForRefResponseItem) =>
      statusItem.state === 'success'
  )
}

const mergeAndDeleteBranch = async (context: Context, pr: PullType): Promise<void> => {
  const result = await context.github.pulls.merge(
    context.repo({ pull_number: pr.number })
  )

  if (!result.data.merged) return

  await context.github.git.deleteRef(
    context.repo({ ref: `heads/${pr.head.ref}` })
  )
}
