import posthog from 'posthog-js'
import { consentRequired } from '@/lib/consent'

/* EEA/UK visitors must accept before anything is captured or stored. Both flags
   are required and do different jobs: `opt_out_capturing_by_default` stops
   events, while `opt_out_persistence_by_default` stops posthog-js writing its
   identifier to cookies/localStorage. Setting only the first would still drop a
   tracking cookie before consent, which is the exact thing PECR prohibits.
   components/CookieConsent.tsx flips both via posthog.opt_in_capturing(). */
const requireConsent = consentRequired()

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    defaults: '2026-05-30',
    // Our privacy policy promises we honour Do Not Track / global privacy control.
    respect_dnt: true,
    opt_out_capturing_by_default: requireConsent,
    opt_out_persistence_by_default: requireConsent,
})
