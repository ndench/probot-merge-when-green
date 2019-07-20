import { Context } from 'probot' // eslint-disable-line no-unused-vars
import { CONFIGURATION_FILE } from './constants'

export interface IConfiguration {
  requiredCi: string[];
}

const defaultConfig: IConfiguration = {
  requiredCi: ['circleci', 'travis-ci']
}

export default async function getConfiguration (context: Context): Promise<IConfiguration> {
  // We're typing this explicitly because probot types context.config as possibly returning null
  // but that makes no sense when we're passing in defaultConfig.
  return await context.config(CONFIGURATION_FILE, defaultConfig) as IConfiguration
}
