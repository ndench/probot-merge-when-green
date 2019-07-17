import { Context } from 'probot'
import { CONFIGURATION_FILE } from './constants'

const getConfig = require('probot-config')

export interface IConfiguration {
  supportedCi: string[];
}

export default async function getConfiguration (context: Context): Promise<IConfiguration> {
  return await getConfig(context, CONFIGURATION_FILE)
}
