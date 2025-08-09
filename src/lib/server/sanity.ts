import {createClient} from '@sanity/client'
import {z} from 'zod'

import { SANITY_PROJECT_ID, SANITY_DATASET } from '$env/static/private'

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  useCdn: true, // set to `false` to bypass the edge cache
  apiVersion: '2025-02-06', // use current date (YYYY-MM-DD) to target the latest API version. Note: this should always be hard coded. Setting API version based on a dynamic value (e.g. new Date()) may break your application at a random point in the future.
})

const schema = z.number()
const data = schema.parse(await client.fetch(`count(*)`))
// data is guaranteed to be `number`, or zod will throw an error
console.log(`Number of documents: ${data}`)