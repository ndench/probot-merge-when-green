import { Context } from 'probot'
import { CONFIGURATION_FILE } from './constants'

export interface IConfiguration {
  supportedCi: string[];
}

const defaultConfig: IConfiguration = {
  supportedCi: ['circleci', 'travis-ci']
}

export default async function getConfiguration (context: Context): Promise<IConfiguration> {
  return await context.config(CONFIGURATION_FILE, defaultConfig)
}
