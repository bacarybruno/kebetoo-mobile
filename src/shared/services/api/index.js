
import { env } from '@app/config'

import ApiClient from './api-client'

const api = new ApiClient(env.apiBaseUrl, 'en')

export default api
