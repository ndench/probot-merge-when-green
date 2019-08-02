import mergeWhenGreen from '../src/mergeWhenGreen'
import statusSuccessHandler from '../src/statusSuccessHandler';
jest.mock('../src/mergeWhenGreen')

let context:any

beforeEach(() => {
  context = {
    github: {
      repos: {
        listPullRequestsAssociatedWithCommit: jest.fn()
      }
    },
    payload: {
      state: 'success',
      sha: '1234'
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

test('does not call mergeWhenGreen when the status was not successful', async () => {
  context.payload.state = 'failed'

  await statusSuccessHandler(context)

  expect(mergeWhenGreen).not.toBeCalled();
})

test('calls mergeWhenGreen for all pull requests related to the status', async () => {
  const prs = [{ number: 1 }, { number: 2 }]

  context.github.repos.listPullRequestsAssociatedWithCommit.mockResolvedValue({
    data: prs
  })
  await statusSuccessHandler(context)

  expect(mergeWhenGreen).toBeCalledTimes(prs.length);
  prs.map((pr) => {
    expect(mergeWhenGreen).toBeCalledWith(context, pr)
  })
})
