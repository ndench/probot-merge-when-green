import { Context } from 'probot' // eslint-disable-line no-unused-vars
import Github from '@octokit/rest' // eslint-disable-line no-unused-vars
import { MERGE_LABEL } from './constants'
import getConfiguration from './configuration'

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

export default async function mergeWhenGreen (context: Context, pr: Github.PullsGetResponse) {
  if (!hasMergeLabel(pr)) return
  if (!(await isEveryCheckSuccessful(context, pr))) return

  await mergeAndDeleteBranch(context, pr)
}

const hasMergeLabel = (pr: PullType) : boolean => pr.labels.some((label) => label.name === MERGE_LABEL)
const isEveryCheckSuccessful = async (context: Context, pr: PullType): Promise<boolean> => {
  const checks = (await context.github.checks.listForRef(
    context.repo({ ref: pr.head.ref })
  )).data

  const { requiredChecks } = await getConfiguration(context)

  // Github.ChecksListForRefResponse
  const supportedCheckRuns = checks.check_runs.filter((checkRun: Github.ChecksListForRefResponseCheckRunsItem) =>
    requiredChecks.includes(checkRun.app.owner.login)
  )
  if (supportedCheckRuns.length === 0) return false

  return supportedCheckRuns.every(
    (checkRun: Github.ChecksListForRefResponseCheckRunsItem) =>
      checkRun.status === 'completed' && checkRun.conclusion === 'success'
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
