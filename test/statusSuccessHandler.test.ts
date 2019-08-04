import mergeWhenGreen from '../src/mergeWhenGreen'
import statusSuccessHandler from '../src/statusSuccessHandler'
jest.mock('../src/mergeWhenGreen')

let context:any

beforeEach(() => {
  context = {
    github: {
      repos: {
        listPullRequestsAssociatedWithCommit: jest.fn()
      },
      pulls: {
        get: jest.fn()
      }
    },
    payload: {
      state: 'success',
      sha: '3efb1d'
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

  expect(context.github.pulls.get).not.toBeCalled()
  expect(mergeWhenGreen).not.toBeCalled()
})

test('calls mergeWhenGreen for all pull requests related to the status', async () => {
  let pr1 = { number: 1 }
  let pr2 = { number: 2 }
  const associatedPrs = [pr1, pr2]

  context.github.repos.listPullRequestsAssociatedWithCommit.mockResolvedValue({
    data: associatedPrs
  })

  context.github.pulls.get.mockImplementation((pr: { pull_number: number }) => {
    if (pr.pull_number === pr1.number) {
      return Promise.resolve({ data: pr1 })
    }

    if (pr.pull_number === pr2.number) {
      return Promise.resolve({ data: pr2 })
    }

    throw new Error('Unexpected pull number')
  })

  await statusSuccessHandler(context)

  expect(context.github.pulls.get).toBeCalledTimes(2)

  expect(mergeWhenGreen).toBeCalledTimes(associatedPrs.length)
  expect(mergeWhenGreen).toBeCalledWith(context, pr1)
  expect(mergeWhenGreen).toBeCalledWith(context, pr2)
})
