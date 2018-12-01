import { checkRunCompletedHandler } from '../src/checkRunCompletedHandler'

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
      pull_requests: [ { number: 1 }]
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
  expect(context.github.pullRequests.merge).not.toHaveBeenCalled()
  expect(context.github.checks.listForRef).not.toHaveBeenCalled()
  expect(context.github.gitdata.deleteReference).not.toHaveBeenCalled()
})

test('skip pull requests without merge label', async () => {
  context.github.pullRequests.get.mockReturnValue({
    data: {
      labels: []
    }
  })

  context.payload.check_run.pull_requests.push({ number: 1 })

  await checkRunCompletedHandler(context)

  expect(context.github.pullRequests.merge).not.toHaveBeenCalled()
  expect(context.github.checks.listForRef).not.toHaveBeenCalled()
  expect(context.github.gitdata.deleteReference).not.toHaveBeenCalled()
})
