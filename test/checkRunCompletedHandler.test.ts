import mergeWhenGreen from '../src/mergeWhenGreen'
import checkRunCompletedHandler from '../src/checkRunCompletedHandler'
jest.mock('../src/mergeWhenGreen')

let context:any

beforeEach(() => {
  context = {
    github: {
      pulls: {
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

test('calls mergeWhenGreen for all pull requests', async () => {
  const pr = context.payload.check_run.pull_requests[0]

  context.github.pulls.get.mockResolvedValue({
    data: pr
  })
  await checkRunCompletedHandler(context)

  expect(mergeWhenGreen).toBeCalledWith(context, pr)
})
