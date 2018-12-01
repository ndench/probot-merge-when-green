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
      pull_requests: []
    }
  }
}

test('skip empty check_runs', async () => {
  await checkRunCompletedHandler(context)

  expect(context.github.pullRequests.get).not.toHaveBeenCalled()
  expect(context.github.pullRequests.merge).not.toHaveBeenCalled()
  expect(context.github.checks.listForRef).not.toHaveBeenCalled()
  expect(context.github.gitdata.deleteReference).not.toHaveBeenCalled()
})