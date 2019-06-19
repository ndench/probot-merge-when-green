import installationCreatedHandler from '../src/installationCreatedHandler'
import { MERGE_LABEL, LABEL_COLOR, LABEL_DESCRIPTION } from '../src/constants'

let context:any

beforeEach(() => {
  context = {
    github: {
      issues: {
        createLabel: jest.fn()
      }
    }
  }
})

test('create label', async () => {
  const owner = 'phstc'
  const repo = 'probot-merge-when-green'

  const repos = [
    { full_name: `${owner}/${repo}` }
  ]

  await installationCreatedHandler(context, repos)

  expect(context.github.issues.createLabel).toBeCalledWith({
    owner,
    repo,
    name: MERGE_LABEL,
    color: LABEL_COLOR,
    description: LABEL_DESCRIPTION
  })
})
