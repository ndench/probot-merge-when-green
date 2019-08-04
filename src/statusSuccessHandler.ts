import { Context } from 'probot' // eslint-disable-line no-unused-vars
import Github from '@octokit/rest' // eslint-disable-line no-unused-vars
import mergeWhenGreen from './mergeWhenGreen'

export default async function statusSuccessHandler (context: Context) {
  if (context.payload.state !== 'success') return

  const associatedPrs = (await context.github.repos.listPullRequestsAssociatedWithCommit(
    context.repo({ commit_sha: context.payload.sha })
  )).data

  await Promise.all(associatedPrs.map(async (prRef: Github.ReposListPullRequestsAssociatedWithCommitResponseItem) => {
    const pr = (await context.github.pulls.get(
      context.repo({ pull_number: prRef.number })
    )).data

    await mergeWhenGreen(context, pr)
  }))
}
