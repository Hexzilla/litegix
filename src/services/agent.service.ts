import axios from 'axios'

function getErrorMessage(err: any) {
  if (err.response) {
    if (err.response.data) {
      return err.response.data.message
    } else {
      return 'Agent service error'
    }
  } else if (err.request) {
    return 'Your server seems to be offline now.'
  }
  return 'Unknown'
}

export async function diskClean(address: string) {
  try {
    const response = await axios.get(`http://${address}:21000/disk/clean`)
    return response
  } catch (err: any) {
    return {
      success: false,
      message: getErrorMessage(err),
    }
  }
}

export async function createDatabase(
  address: string,
  data: { name: string; encoding: string }
) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return { error: 0 }
    }
    const res = await axios.post(`http://${address}:21000/database`, data)
    console.log('createDatabase', res.data)
    return res.data
  } catch (err: any) {
    console.log(err)
    return { error: -1 }
  }
}

export async function deleteDatabase(address: string, name: string) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return { error: 0 }
    }
    const res = await axios.delete(`http://${address}:21000/database/${name}`)
    console.log('deleteDatabase', res.data)
    return res.data
  } catch (err: any) {
    return { error: -1 }
  }
}

export async function createDatabaseUser(
  address: string,
  data: { name: string; password: string }
) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return { error: 0 }
    }
    const res = await axios.post(`http://${address}:21000/database/user`, data)
    console.log('createDatabaseUser', res.data)
    return res.data
  } catch (err: any) {
    return { error: -1 }
  }
}

export async function deleteDatabaseUser(address: string, name: string) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return { error: 0 }
    }
    const res = await axios.delete(
      `http://${address}:21000/database/user/${name}`
    )
    console.log('deleteDatabaseUser', res.data)
    return res.data
  } catch (err: any) {
    return { error: -1 }
  }
}

export async function createWebApplication() {
  return null
}

export async function updateWebApplication() {
  return null
}

export async function setDefaultApp() {
  return null
}

export async function removeDefaultApp() {
  return null
}

export async function deleteWebApplication(address: string, name: string) {
  return null
}

export async function createSystemUser(
  address: string,
  { name, password }: { name: string; password: string }
) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return { error: 0 }
    }
    const response = await axios.post(`http://${address}:21000/system/user`, {
      name,
      password,
    })
    console.log('createSystemUser', response.data)
    return response.data
  } catch (e) {
    console.log(e)
    return { error: -1 }
  }
}

export async function deleteSystemUser(address: string, name: string) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return { error: 0 }
    }
    const response = await axios.delete(
      `http://${address}:21000/system/user/${name}`
    )
    console.log('deleteSystemUser', response.data)
    return response.data
  } catch (e) {
    console.log(e)
    return { error: -1 }
  }
}

export async function changeSystemUserPassword(
  address: string,
  name: string,
  password: string
) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return { error: 0 }
    }
    const res = await axios.put(
      `http://${address}:21000/system/user/password/change`,
      {
        name,
        password,
      }
    )
    console.log('changeSystemUserPassword', res.data)
    return res.data
  } catch (e) {
    console.log(e)
    return { error: -1 }
  }
}

export async function createSSHKey(
  address: string,
  usreName: string,
  pubKey: string
) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return { error: 0 }
    }
    const res = await axios.post(`http://${address}:21000/sshkey`, {
      usreName,
      pubKey,
    })
    console.log('createSSHKey', res.data)
    return res.data
  } catch (e) {
    console.log(e)
    return { error: -1 }
  }
}

export async function deleteSSHKey(
  address: string,
  usreName: string,
  pubKey: string
) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return { error: 0 }
    }
    const res = await axios.post(`http://${address}:21000/sshkey/delete`, {
      usreName,
      pubKey,
    })
    console.log('deleteSSHKey', res.data)
    return res.data
  } catch (e) {
    console.log(e)
    return { error: -1 }
  }
}

export async function createDeploymentKey(
  address: string,
  deploymentKey: string
) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return { error: 0 }
    }
    const res = await axios.post(`http://${address}:21000/deploymentkey`, {
      deploymentKey,
    })
    console.log('createDeploymentKey', res.data)
    return res.data
  } catch (e) {
    console.log(e)
    return { error: -1 }
  }
}

export async function deleteDeploymentKey(address: string, name: string) {
  try {
    const response = await axios.post(
      `http://${address}:21000/deploymentkey/delete`,
      { name: name }
    )
    return response
  } catch (e) {
    console.log(e)
    return { error: -1 }
  }
}

export async function createCronJob(address: string, data: any) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return { error: 0 }
    }
    const res = await axios.post(`http://${address}:21000/cronjob`, data)
    console.log('createCronJob', res.data)
    return res.data
  } catch (e) {
    console.log(e)
    return { error: -1 }
  }
}

export async function removeCronJob(address: string, label: string) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return { error: 0 }
    }
    const res = await axios.delete(`http://${address}:21000/cronjob/label`)
    console.log('removeCronJob', res.data)
    return res.data
  } catch (e) {
    console.log(e)
    return { error: -1 }
  }
}

export async function rebuildCronJob() {
  return null
}
