/**
 * Sanity Studio mounted inside the Next.js app.
 *
 * Reachable at:
 *   - foalandpony.com/studio                (always)
 *   - admin.foalandpony.com/                (via subdomain rewrite in next.config.js)
 *
 * Studio handles its own auth via Sanity SSO. Invite team members at
 * https://www.sanity.io/manage → your project → Members.
 */

import { NextStudio } from 'next-sanity/studio'
import config from '../../../sanity.config'

export const dynamic = 'force-static'
export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  return <NextStudio config={config} />
}
