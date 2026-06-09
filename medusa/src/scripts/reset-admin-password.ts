import { ExecArgs } from '@medusajs/framework/types'
import { Modules } from '@medusajs/framework/utils'

/**
 * Reset Medusa Admin password for an existing user (emailpass).
 *
 * Usage:
 *   ADMIN_EMAIL=raghav@spco.in ADMIN_PASSWORD='YourNewPassword' \
 *     yarn medusa exec ./src/scripts/reset-admin-password.ts
 */
export default async function resetAdminPassword({ container }: ExecArgs) {
  const email = process.env.ADMIN_EMAIL ?? 'raghav@spco.in'
  const password = process.env.ADMIN_PASSWORD

  if (!password) {
    throw new Error('Set ADMIN_PASSWORD, e.g. ADMIN_PASSWORD=\'Dhruvi@30\'')
  }

  const authService = container.resolve(Modules.AUTH)
  const userService = container.resolve(Modules.USER)
  const provider = 'emailpass'

  const users = await userService.listUsers({ email })
  if (!users.length) {
    throw new Error(`No user with email ${email}. Create one with: yarn medusa user -e ${email} -p '...'`)
  }

  const { error } = await authService.updateProvider(provider, {
    entity_id: email,
    email,
    password,
  })

  if (error) {
    console.error('updateProvider failed:', error)
    process.exit(1)
  }

  console.log(`\nPassword updated for ${email}. Sign in at http://localhost:9000/app\n`)
}
