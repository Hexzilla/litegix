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
  data: { name: string; userId: string; collation: string }
) {
  try {
    const res = await axios.post<JSON>(`http://${address}:21000/database`, data)
    return {
      success: true,
      status: res.status,
      data: res.data,
    }
  } catch (err: any) {
    return {
      success: false,
      message: getErrorMessage(err),
    }
  }
}

export async function deleteDatabase(address: string, name: string) {
  try {
    const res = await axios.delete(`http://${address}:21000/database/${name}`)
    return {
      success: true,
      status: res.status,
      data: res.data,
    }
  } catch (err: any) {
    return {
      success: false,
      message: getErrorMessage(err),
    }
  }
}

export async function createDatabaseUser(address: string, data: any) {
  try {
    const res = await axios.post(`http://${address}:21000/database/user`, data)
    return {
      success: true,
      status: res.status,
      data: res.data,
    }
  } catch (err: any) {
    return {
      success: false,
      message: getErrorMessage(err),
    }
  }
}

export async function deleteDatabaseUser(address: string, name: string) {
  try {
    const res = await axios.delete(
      `http://${address}:21000/database/user/${name}`
    )
    return {
      success: true,
      status: res.status,
      data: res.data,
    }
  } catch (err: any) {
    return {
      success: false,
      message: getErrorMessage(err),
    }
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
    const response = await axios.post(`http://${address}:21000/system/user`, {
      name,
      password,
    })
    console.log('createSystemUser', response.data)
    return response.data
  } catch (e) {
    console.log(e)
    return e
  }
}

export async function deleteSystemUser(address: string, name: string) {
  try {
    const response = await axios.post(
      `http://${address}:21000/system/user/delete`,
      {
        name: name,
      }
    )
    console.log('createSystemUser', response.data)
    return response.data
  } catch (e) {
    console.log(e)
    return e
  }
}

export async function createDeploymentKey(address: string, data: any) {
  try {
    const response = await axios.post(
      `http://${address}:21000/deploymentkey/create`,
      data
    )
    return response
  } catch (e) {
    console.log(e)
    return e
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
    return e
  }
}

export async function createCronJob() {
  return null
}

export async function removeCronJob() {
  return null
}

export async function rebuildCronJob() {
  return null
}
