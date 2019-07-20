import mergeIfGreen from '../src/mergeIfGreen'
import { MERGE_LABEL } from '../src/constants'

let context:any

beforeEach(() => {
  context = {
    config: jest.fn().mockImplementation((_fileName, defaultConfig) => defaultConfig),
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

test('skip if no merge label', async () => {
  const pr:any = { labels: [] }
  await mergeIfGreen(context, pr)

  expect(context.github.checks.listForRef).not.toHaveBeenCalled()
  expect(context.github.pullRequests.merge).not.toHaveBeenCalled()
  expect(context.github.gitdata.deleteRef).not.toHaveBeenCalled()
})

test('skip if failing checks', async () => {
  const pr:any = {
    number: 1,
    labels: [{ name: MERGE_LABEL }],
    head: {
      ref: '3efb1d'
    }
  }

  context.github.checks.listForRef.mockResolvedValue({
    data: {
      check_runs: [
        {
          pull_requests: [pr],
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
  await mergeIfGreen(context, pr)

  expect(context.github.pullRequests.merge).not.toHaveBeenCalled()
  expect(context.github.gitdata.deleteRef).not.toHaveBeenCalled()
})

test('merge pull requests', async () => {
  const pr:any = {
    number: 1,
    labels: [{ name: MERGE_LABEL }],
    head: {
      ref: '3efb1d'
    }
  }

  context.github.checks.listForRef.mockResolvedValue({
    data: {
      check_runs: [
        {
          pull_requests: [pr],
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

  await mergeIfGreen(context, pr)

  expect(context.github.pullRequests.merge).toHaveBeenCalled()
  expect(context.github.gitdata.deleteRef).toHaveBeenCalled()
})
