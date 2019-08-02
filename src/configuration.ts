import { Context } from 'probot' // eslint-disable-line no-unused-vars
import { CONFIGURATION_FILE } from './constants'

const defaultConfig = {
  requiredChecks: ['circleci', 'travis-ci'],
  requiredStatuses: []
}

export default async function getConfiguration (context: Context): Promise<any> {
  return context.config(CONFIGURATION_FILE, defaultConfig)
}
