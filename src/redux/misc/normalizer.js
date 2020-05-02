import { normalize } from 'normalizr'

import schema from './schema'

const mapAuthor = (data) => ({ id: data.author })

const transformer = (initialData) => (
  initialData.map((data) => ({
    ...data,
    author: mapAuthor(data),
  }))
)

const normalizeData = (data, transformerFn = transformer) => (
  normalize(transformerFn(data), schema)
)

export default normalizeData
