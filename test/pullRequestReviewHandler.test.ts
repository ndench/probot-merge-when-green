import mergeWhenGreen from '../src/mergeWhenGreen'
import pullRequestReviewHandler from '../src/pullRequestReviewHandler'
jest.mock('../src/mergeWhenGreen')

let context:any

beforeEach(() => {
  context = {
    payload: {
      review: {
        state: 'approved'
      },
      pull_request: { state: 'open' }
    }
  }
})

test('call mergeWhenGreen', async () => {
  await pullRequestReviewHandler(context)

  expect(mergeWhenGreen).toBeCalledWith(context, context.payload.pull_request)
})
