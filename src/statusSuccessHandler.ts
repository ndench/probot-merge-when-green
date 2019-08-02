import { Context } from 'probot' // eslint-disable-line no-unused-vars
import Github from '@octokit/rest' // eslint-disable-line no-unused-vars
import mergeWhenGreen from './mergeWhenGreen'

export default async function statusSuccessHandler (context: Context) {
  if (context.payload.state !== 'success') return

  const prs = (await context.github.repos.listPullRequestsAssociatedWithCommit(
    context.repo({ commit_sha: context.payload.sha })
  )).data

  await Promise.all(prs.map(async (pr: Github.ReposListPullRequestsAssociatedWithCommitResponseItem) => {
    await mergeWhenGreen(context, pr)
  }))
}
