import mergeIfGreen from '../src/mergeIfGreen'
import checkRunCompletedHandler from '../src/checkRunCompletedHandler'
jest.mock('../src/mergeIfGreen')

let context:any

beforeEach(() => {
  context = {
    github: {
      pullRequests: {
        get: jest.fn()
      }
    },
    payload: {
      check_run: {
        pull_requests: [{ number: 1 }]
      }
    },
    repo: (obj: object) => {
      return Object.assign(
        {
          owner: 'owner',
          repo: 'repo'
        },
        obj
      )
    }
  }
})

test('calls mergeIfGreen for all pull requests', async () => {
  const pr = context.payload.check_run.pull_requests[0]

  context.github.pullRequests.get.mockResolvedValue({
    data: pr
  })
  await checkRunCompletedHandler(context)

  expect(mergeIfGreen).toBeCalledWith(context, pr)
})
