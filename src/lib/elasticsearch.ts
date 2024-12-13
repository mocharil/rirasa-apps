import { Client } from '@elastic/elasticsearch'

if (!process.env.ELASTICSEARCH_CLOUD_ID) {
  throw new Error('ELASTICSEARCH_CLOUD_ID is not defined')
}

if (!process.env.ELASTICSEARCH_USERNAME) {
  throw new Error('ELASTICSEARCH_USERNAME is not defined')
}

if (!process.env.ELASTICSEARCH_PASSWORD) {
  throw new Error('ELASTICSEARCH_PASSWORD is not defined')  
}

export const client = new Client({
  cloud: {
    id: process.env.ELASTICSEARCH_CLOUD_ID,
  },
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME,
    password: process.env.ELASTICSEARCH_PASSWORD,
  },
  requestTimeout: 30000,
  tls: {
    rejectUnauthorized: false
  }
})