import { Context } from 'probot' // eslint-disable-line no-unused-vars
import { MERGE_LABEL, LABEL_COLOR, LABEL_DESCRIPTION } from './constants'

async function createLabel (context: Context, owner: string, repo: string) {
  const github = context.github
  await github.issues.createLabel({
    owner,
    repo,
    name: MERGE_LABEL,
    color: LABEL_COLOR,
    description: LABEL_DESCRIPTION
  })
}

export default async function installationCreatedHandler (context: Context, repos: any) {
  repos.forEach(async (item: any) => {
    const [owner, repo] = item.full_name.split('/')

    await createLabel(context, owner, repo)
  })
}
