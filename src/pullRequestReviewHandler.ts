import { Context } from 'probot' // eslint-disable-line no-unused-vars
import mergeWhenGreen from './mergeWhenGreen'

export default async function pullRequestReviewHandler (context: Context) {
  if (context.payload.review.state !== 'approved') return
  if (context.payload.pull_request.state !== 'open') return

  await mergeWhenGreen(context, context.payload.pull_request)
}
