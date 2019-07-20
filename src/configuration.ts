import { Context } from 'probot' // eslint-disable-line no-unused-vars
import { CONFIGURATION_FILE } from './constants'

const defaultConfig = {
  requiredCi: ['circleci', 'travis-ci']
}

export default async function getConfiguration (context: Context) {
  // We're typing this explicitly because probot types context.config as possibly returning null
  // but that makes no sense when we're passing in defaultConfig.
  return context.config(CONFIGURATION_FILE, defaultConfig)
}
