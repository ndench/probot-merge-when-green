import {
  checkRunCompletedHandler,
  MERGE_LABEL
  asda
} from '../src/checkRunCompletedHandler'

const context = {
  github: {
    pullRequests: {
      get: jest.fn(),
      merge: jest.fn()
    },
    checks: {
      listForRef: jest.fn()
    },
    gitdata: {
      deleteReference: jest.fn()
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

test('skip empty check_runs', async () => {
  context.payload.check_run.pull_requests = []

  await checkRunCompletedHandler(context)

  expect(context.github.pullRequests.get).not.toHaveBeenCalled()
  expect(context.github.checks.listForRef).not.toHaveBeenCalled()
  expect(context.github.pullRequests.merge).not.toHaveBeenCalled()
  expect(context.github.gitdata.deleteReference).not.toHaveBeenCalled()
})

test('skip pull requests without merge label', async () => {
  context.github.pullRequests.get.mockReturnValue({
    data: {
      labels: []
    }
  })

  await checkRunCompletedHandler(context)

  expect(context.github.checks.listForRef).not.toHaveBeenCalled()
  expect(context.github.pullRequests.merge).not.toHaveBeenCalled()
  expect(context.github.gitdata.deleteReference).not.toHaveBeenCalled()
})

test('skip pull requests with failing checks', async () => {
  context.github.pullRequests.get.mockReturnValue({
    data: {
      labels: [{ name: MERGE_LABEL }]
    }
  })

  context.github.checks.listForRef.mockReturnValue([
    { status: 'failed', conclusion: 'success' }
  ])

  await checkRunCompletedHandler(context)

  expect(context.github.pullRequests.merge).not.toHaveBeenCalled()
  expect(context.github.gitdata.deleteReference).not.toHaveBeenCalled()
})

test('merge pull requests', async () => {
  context.github.pullRequests.get.mockReturnValue({
    data: {
      number: 1,
      labels: [{ name: MERGE_LABEL }],
      head: {
        ref: '3efb1d'
      }
    }
  })

  context.github.checks.listForRef.mockReturnValue({
    data: {
      check_runs: [
        {
          status: 'in_progress',
          conclusion: null,
          app: { owner: { login: 'circleci' } }
        }
      ]
    }
  })

  context.github.pullRequests.merge.mockReturnValue({
    data: {
      merged: true
    }
  })

  await checkRunCompletedHandler(context)

  // FIXME
  // expect(context.github.pullRequests.merge).toHaveBeenCalledWith(
  //   { owner: 'owner', repo: 'repo', number: 1 }
  // )
  // expect(context.github.gitdata.deleteReference).toHaveBeenCalledWith()
})
