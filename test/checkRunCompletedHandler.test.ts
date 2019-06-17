import {
  checkRunCompletedHandler,
  MERGE_LABEL
} from '../src/checkRunCompletedHandler'

let context:any

beforeEach(() => {
  context = {
    github: {
      pullRequests: {
        get: jest.fn(),
        merge: jest.fn()
      },
      checks: {
        listForRef: jest.fn()
      },
      gitdata: {
        deleteRef: jest.fn()
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

test('skip if no pull requests', async () => {
  context.payload.check_run.pull_requests = []

  await checkRunCompletedHandler(context)

  expect(context.github.pullRequests.get).not.toHaveBeenCalled()
  expect(context.github.checks.listForRef).not.toHaveBeenCalled()
  expect(context.github.pullRequests.merge).not.toHaveBeenCalled()
  expect(context.github.gitdata.deleteRef).not.toHaveBeenCalled()
})

test('skip if no merge label', async () => {
  context.github.pullRequests.get.mockReturnValue({
    data: {
      labels: []
    }
  })

  await checkRunCompletedHandler(context)

  expect(context.github.checks.listForRef).not.toHaveBeenCalled()
  expect(context.github.pullRequests.merge).not.toHaveBeenCalled()
  expect(context.github.gitdata.deleteRef).not.toHaveBeenCalled()
})

test('skip if failing checks', async () => {
  context.github.pullRequests.get.mockResolvedValue({
    data: {
      number: 1,
      labels: [{ name: MERGE_LABEL }],
      head: {
        ref: '3efb1d'
      }
    }
  })

  context.github.checks.listForRef.mockResolvedValue({
    data: {
      check_runs: [
        {
          pull_requests: [{ number: 1 }],
          status: 'completed',
          conclusion: 'failed',
          app: { owner: { login: 'circleci' } }
        }
      ]
    }
  })

  context.github.pullRequests.merge.mockResolvedValue({
    data: {
      merged: true
    }
  })
  await checkRunCompletedHandler(context)

  expect(context.github.pullRequests.merge).not.toHaveBeenCalled()
  expect(context.github.gitdata.deleteRef).not.toHaveBeenCalled()
})

test('merge pull requests', async () => {
  context.github.pullRequests.get.mockResolvedValue({
    data: {
      number: 1,
      labels: [{ name: MERGE_LABEL }],
      head: {
        ref: '3efb1d'
      }
    }
  })

  context.github.checks.listForRef.mockResolvedValue({
    data: {
      check_runs: [
        {
          pull_requests: [{ number: 1 }],
          status: 'completed',
          conclusion: 'success',
          app: { owner: { login: 'circleci' } }
        }
      ]
    }
  })

  context.github.pullRequests.merge.mockResolvedValue({
    data: {
      merged: true
    }
  })

  await checkRunCompletedHandler(context)

  expect(context.github.pullRequests.merge).toHaveBeenCalled()
  expect(context.github.gitdata.deleteRef).toHaveBeenCalled()
})
