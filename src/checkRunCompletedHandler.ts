import { Context } from 'probot' // eslint-disable-line no-unused-vars
import Github from '@octokit/rest' // eslint-disable-line no-unused-vars
import mergeIfGreen from './mergeIfGreen'

export default async function checkRunCompletedHandler (context: Context) {
  await Promise.all(context.payload.check_run.pull_requests.map(async (prRef: Github.ChecksListForRefResponseCheckRunsItemPullRequestsItem) => {
    const pr = (await context.github.pullRequests.get(
      context.repo({ number: prRef.number })
    )).data

    await mergeIfGreen(context, pr)
  }))
}
