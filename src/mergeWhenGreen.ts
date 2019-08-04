import { Context } from 'probot' // eslint-disable-line no-unused-vars
import Github from '@octokit/rest' // eslint-disable-line no-unused-vars
import { MERGE_LABEL } from './constants'
import { getConfiguration } from './configuration'

export default async function mergeWhenGreen (context: Context, pr: Github.PullsGetResponse) {
  if (!pr.mergeable) return
  if (!hasMergeLabel(pr)) return

  if (!(await isEveryCheckSuccessful(context, pr))) return
  if (!(await isEveryStatusSuccessful(context, pr))) return
  if (!(await requestedReviewsComplete(context, pr))) return

  await mergeAndDeleteBranch(context, pr)
}

const hasMergeLabel = (pr: Github.PullsGetResponse) : boolean => pr.labels.some((label) => label.name === MERGE_LABEL)

const isEveryCheckSuccessful = async (context: Context, pr: Github.PullsGetResponse): Promise<boolean> => {
  const checkRuns = (await context.github.checks.listForRef(
    context.repo({ ref: pr.head.ref })
  )).data.check_runs

  const { isDefaultConfig, requiredChecks } = await getConfiguration(context)

  if (requiredChecks === undefined || requiredChecks === []) return true

  const uniqMatches = new Set()

  const supportedCheckRuns = checkRuns.filter((checkRun: Github.ChecksListForRefResponseCheckRunsItem) => {
    const check = checkRun.app.owner.login
    if (requiredChecks.includes(check)) {
      uniqMatches.add(check)
      return true
    }
    return false
  })

  // for default config MWG searches for circleci or travis-ci
  // most of the repos will have one OR the other
  // if default config and circleci or travis-ci passes we are good to merge
  if (isDefaultConfig && supportedCheckRuns.length === 0) return false

  // for non-default config all required checks must be found and successful
  if (!isDefaultConfig && uniqMatches.size !== requiredChecks.length) return false

  return supportedCheckRuns.every(
    (checkRun: Github.ChecksListForRefResponseCheckRunsItem) =>
      checkRun.status === 'completed' && checkRun.conclusion === 'success'
  )
}

const isEveryStatusSuccessful = async (context: Context, pr: Github.PullsGetResponse): Promise<boolean> => {
  const statuses = (await context.github.repos.listStatusesForRef(
    context.repo({ ref: pr.head.ref })
  )).data

  const { requiredStatuses } = await getConfiguration(context)

  if (requiredStatuses === undefined || requiredStatuses === []) return true

  const uniqMatches = new Set()

  const supportedStatuses = statuses.filter((statusItem: Github.ReposListStatusesForRefResponseItem) => {
    const check = statusItem.context
    if (requiredStatuses.includes(check)) {
      uniqMatches.add(check)
      return true
    }
    return false
  })

  if (uniqMatches.size !== requiredStatuses.length) return false

  return supportedStatuses.every(
    (statusItem: Github.ReposListStatusesForRefResponseItem) =>
      statusItem.state === 'success'
  )
}

const requestedReviewsComplete = async (context: Context, pr: Github.PullsGetResponse): Promise<boolean> => {
  const { requireApprovalFromRequestedReviewers } = await getConfiguration(context)
  if (!requireApprovalFromRequestedReviewers) {
    return Promise.resolve(true)
  }

  const requestedReviews = (await context.github.pulls.listReviewRequests(
    context.repo({ pull_number: pr.number })
  )).data

  // I tested on one of my repositories and the list review requests api only returns users or teams that have not submitted a review yet.
  // https://github.com/phstc/probot-merge-when-green/pull/45
  return requestedReviews.users.length === 0 && requestedReviews.teams.length === 0
}

const mergeAndDeleteBranch = async (context: Context, pr: Github.PullsGetResponse): Promise<void> => {
  const result = await context.github.pulls.merge(
    context.repo({ pull_number: pr.number })
  )

  if (!result.data.merged) return

  await context.github.git.deleteRef(
    context.repo({ ref: `heads/${pr.head.ref}` })
  )
}
