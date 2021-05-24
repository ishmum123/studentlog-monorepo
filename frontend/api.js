import getConfig from 'next/config'
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()

export function getAPIBase(){
  return serverRuntimeConfig.URI || publicRuntimeConfig.URI;
}