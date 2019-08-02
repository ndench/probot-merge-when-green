import mergeWhenGreen from '../src/mergeWhenGreen'
import { MERGE_LABEL } from '../src/constants'

let context:any

beforeEach(() => {
  context = {
    config: jest.fn().mockImplementation((_fileName, defaultConfig) => Promise.resolve(defaultConfig)),
    github: {
      pulls: {
        get: jest.fn(),
        merge: jest.fn()
      },
      checks: {
        listForRef: jest.fn()
      },
      git: {
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
  await mergeWhenGreen(context, pr)

  expect(context.github.checks.listForRef).not.toHaveBeenCalled()
  expect(context.github.pulls.merge).not.toHaveBeenCalled()
  expect(context.github.git.deleteRef).not.toHaveBeenCalled()
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

  context.github.pulls.merge.mockResolvedValue({
    data: {
      merged: true
    }
  })
  await mergeWhenGreen(context, pr)

  expect(context.github.pulls.merge).not.toHaveBeenCalled()
  expect(context.github.git.deleteRef).not.toHaveBeenCalled()
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

  context.github.pulls.merge.mockResolvedValue({
    data: {
      merged: true
    }
  })

  await mergeWhenGreen(context, pr)

  expect(context.github.pulls.merge).toHaveBeenCalled()
  expect(context.github.git.deleteRef).toHaveBeenCalled()
})
