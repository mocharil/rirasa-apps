import { Client } from '@elastic/elasticsearch'

export const esClient = new Client({
  node: 'http://57.155.112.231:9200',
  // Add additional settings if needed
  requestTimeout: 30000, // 30 seconds
  tls: {
    rejectUnauthorized: false // Only use this for development/testing
  }
})
