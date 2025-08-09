import { createClient } from '@sanity/client'
import { SANITY_PROJECT_ID, SANITY_DATASET } from '$env/static/private'

export const sanity = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  useCdn: true,
  apiVersion: '2025-02-06',
})

export default sanity