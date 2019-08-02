import { Context } from 'probot' // eslint-disable-line no-unused-vars
import Github, { ReposListPullRequestsAssociatedWithCommitResponseItem, ReposListPullRequestsAssociatedWithCommitResponseItemLabelsItem } from '@octokit/rest' // eslint-disable-line no-unused-vars
import mergeIfGreen from './mergeIfGreen'
import { MERGE_LABEL } from './constants'

export default async function checkRunCompletedHandler (context: Context) {
  if (context.payload.state !== 'success') return

  const prs = await (context.github.repos.listPullRequestsAssociatedWithCommit(
    context.repo({ commit_sha: context.payload.sha })
  )).data

  await Promise.all(prs.map(async (pr: Github.ReposListPullRequestsAssociatedWithCommitResponseItem) => {
    const hasMergeLabel = pr.labels.some((label: ReposListPullRequestsAssociatedWithCommitResponseItemLabelsItem) => {
      return label.name === MERGE_LABEL
    })

    if (hasMergeLabel) {
      await mergeIfGreen(context, pr)
    }
  }))
}
