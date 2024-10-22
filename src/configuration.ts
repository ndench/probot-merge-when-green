import { Context } from 'probot' // eslint-disable-line no-unused-vars
import { CONFIGURATION_FILE } from './constants'

const defaultConfig = {
  requiredChecks: ['circleci', 'travis-ci'],
  requiredStatuses: [],
  requireApprovalFromRequestedReviewers: false,
  isDefaultConfig: true
}

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

  if (config.requireApprovalFromRequestedReviewers === null) {
    config.requireApprovalFromRequestedReviewers = false
  }

  return {...config, isDefaultConfig: false}
}
