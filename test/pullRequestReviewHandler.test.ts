import mergeIfGreen from '../src/mergeIfGreen'
import pullRequestReviewHandler from '../src/pullRequestReviewHandler'
jest.mock('../src/mergeIfGreen')

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

test('call mergeIfGreen', async () => {
  await pullRequestReviewHandler(context)

  expect(mergeIfGreen).toBeCalledWith(context, context.payload.pull_request)
})
