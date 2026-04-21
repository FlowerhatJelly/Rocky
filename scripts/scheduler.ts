import cron from 'node-cron'
import { runAgentForAllTools } from '../lib/agent'

cron.schedule('0 3 * * *', async () => {
  console.log('[Rocky Scheduler] Starting nightly agent run...')
  try {
    await runAgentForAllTools()
    console.log('[Rocky Scheduler] Completed successfully')
  } catch (err) {
    console.error('[Rocky Scheduler] Failed:', err)
  }
})

console.log('[Rocky Scheduler] Cron job registered. Waiting for 03:00...')
