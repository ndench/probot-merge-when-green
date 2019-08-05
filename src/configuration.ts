import { Context } from 'probot' // eslint-disable-line no-unused-vars
import { CONFIGURATION_FILE } from './constants'

const defaultConfig = {
  requiredChecks: ['circleci', 'travis-ci'],
  requiredStatuses: [],
  mergeMethod: 'merge',
  requireApprovalFromRequestedReviewers: false,
  isDefaultConfig: true
}

// Specified mergeMethod must be one of the following
// https://developer.github.com/v3/pulls/#merge-a-pull-request-merge-button
const validMergeMethods = [
  'merge',
  'squash',
  'rebase'
]

export async function getConfiguration (context: Context): Promise<any> {
  const config = await context.config(CONFIGURATION_FILE)

  if (config === null || config === {}) return defaultConfig

  // set defaults
  if (config.requiredChecks === null) {
    config.requiredChecks = []
  }

  if (config.requiredStatuses === null) {
    config.requiredStatuses = []
  }

  if (config.mergeMethod === null || !validMergeMethods.includes(config.mergeMethod)) {
    config.mergeMethod = 'merge'
  }

  if (config.requireApprovalFromRequestedReviewers === null) {
    config.requireApprovalFromRequestedReviewers = false
  }

  return {...config, isDefaultConfig: false}
}
