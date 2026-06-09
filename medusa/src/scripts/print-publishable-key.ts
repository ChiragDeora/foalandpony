import { ExecArgs } from '@medusajs/framework/types'
import { createApiKeysWorkflow } from '@medusajs/medusa/core-flows'
import { linkSalesChannelsToApiKeyWorkflow } from '@medusajs/medusa/core-flows'
import { Modules } from '@medusajs/framework/utils'

/**
 * Creates a fresh publishable API key and prints the token once.
 * Run: yarn medusa exec ./src/scripts/print-publishable-key.ts
 */
export default async function printPublishableKey({ container }: ExecArgs) {
  const salesChannelService = container.resolve(Modules.SALES_CHANNEL)
  const channels = await salesChannelService.listSalesChannels({}, { take: 1 })
  const salesChannelId = channels[0]?.id

  if (!salesChannelId) {
    throw new Error('No sales channel found. Run yarn seed first.')
  }

  const {
    result: [apiKey],
  } = await createApiKeysWorkflow(container).run({
    input: {
      api_keys: [
        {
          title: 'Foal Pony Storefront',
          type: 'publishable',
          created_by: 'seed-script',
        },
      ],
    },
  })

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: apiKey.id,
      add: [salesChannelId],
    },
  })

  const token = (apiKey as { token?: string }).token
  if (!token) {
    console.error('API key created but token missing on result:', apiKey)
    process.exit(1)
  }

  console.log('\n--- Copy to .env.local ---')
  console.log(`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${token}`)
  console.log('---\n')
}
