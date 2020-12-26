import RNFetchBlob from 'rn-fetch-blob'
import auth from '@react-native-firebase/auth'

class HttpClient {
  constructor(options = {}) {
    this.baseURL = options.baseURL || ''
    this.headers = options.headers || {}
  }

  setHeader(key, value) {
    this.headers[key] = value
    return this
  }

  setBearerAuth(token) {
    this.headers.Authorization = `Bearer ${token}`
    return this
  }

  async fetchJSON(endpoint, options = {}) {
    try {
      const token = await auth().currentUser.getIdToken()
      this.setBearerAuth(token)
    } catch (error) {
      console.log('No token was given for request', endpoint, options)
    }
    // eslint-disable-next-line no-undef
    const res = await fetch(this.baseURL + endpoint, {
      ...options,
      headers: this.headers,
    })

    if (!res.ok) throw new Error(res.statusText)

    if (options.parseResponse !== false && res.status !== 204) return res.json()

    return undefined
  }

  get(endpoint, options = {}) {
    return this.fetchJSON(endpoint, {
      ...options,
      method: 'GET',
    })
  }

  post(endpoint, body, options = {}) {
    return this.fetchJSON(endpoint, {
      ...options,
      body: JSON.stringify(body),
      method: 'POST',
    })
  }

  put(endpoint, body, options = {}) {
    return this.fetchJSON(endpoint, {
      ...options,
      body: JSON.stringify(body),
      method: 'PUT',
    })
  }

  delete(endpoint, options = {}) {
    return this.fetchJSON(endpoint, {
      parseResponse: false,
      ...options,
      method: 'DELETE',
    })
  }

  postAsset(endpoint, field, asset, data) {
    const headers = { 'Content-Type': 'multipart/form-data' }
    const payload = {
      name: 'data',
      data: JSON.stringify(data),
    }
    const file = {
      name: `files.${field}`,
      filename: asset.name,
      type: asset.mimeType,
      data: RNFetchBlob.wrap(asset.uri),
    }
    const formData = [payload, file]
    return RNFetchBlob
      .fetch('POST', this.baseURL + endpoint, headers, formData)
      .then((res) => res.json())
  }
}

export default HttpClient
