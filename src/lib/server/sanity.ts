import { createClient } from '@sanity/client'
import { SANITY_PROJECT_ID, SANITY_DATASET, SANITY_TOKEN } from '$env/static/private'

export const sanity = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  useCdn: true,
  apiVersion: '2025-08-09',
  token: SANITY_TOKEN
})

export default sanity