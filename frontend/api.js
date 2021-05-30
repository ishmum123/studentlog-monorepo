import getConfig from 'next/config'
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()

function getAPIBase(){
  return serverRuntimeConfig.URI || publicRuntimeConfig.URI;
}

export function getStudentApplicationAPI(){
  return getAPIBase()+"/student-applications"
}

export function getStudentAPI(){
  return getAPIBase()+"/students"
}

export function getAttendanceAPI(){
  return getAPIBase()+"/attendance"
}

export function getLeaveApplicationAPI(){
  return getAPIBase()+"/leave-applications"
}