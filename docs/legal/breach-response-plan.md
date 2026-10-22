# Data breach response plan

Internal. Keep it short enough to follow under stress. Review it every six months and after any incident.
Fill in the names and numbers in the first table before launch.

| Role | Person | Phone / email |
|---|---|---|
| Incident lead (decides, owns the clock) | | |
| Technical lead (investigates, fixes) | | |
| Legal adviser | | |
| Hosting / database / storage provider support | | |

## What counts as a breach
Anyone who should not have it may have seen, copied, changed or lost personal information. Examples: a leaked
database or storage key, an admin account taken over, ID documents opened by someone who is not a verifier,
a bug that shows one person's data to another, a lost laptop with access to production.

The most serious: **ID and trade-licence documents and ID numbers** (`kyc/` in the bucket, `KycSubmission` table).

## First hour
1. **Tell the incident lead.** Write down the time you found out. The clock for any legal deadline starts then.
2. **Stop the leak.** Rotate whatever may be exposed: `BETTER_AUTH_SECRET` (signs everyone out), database password,
   storage keys, `RESEND_API_KEY`. Suspend the admin account involved. Make the bucket private if it was opened.
3. **Keep evidence.** Do not delete logs. Save the audit log (`AuditLog`), host logs and storage access logs.
4. **Write down what you know:** what happened, when, which systems, how it was found. Keep adding to it.

## First day
5. **Find the size.** Which people, which fields (names, emails, ID numbers, documents, wallet history), how many,
   for how long. The audit log records every time an admin opened an ID document.
6. **Close the hole** and check nobody still has access. Restore from a backup if data was changed.
7. **Ask the legal adviser** whether you must tell the authorities, and by when. Do this on day one, because some
   laws set deadlines of 72 hours from the moment you knew.

## Telling people
8. If people could be harmed (ID details exposed, passwords at risk), tell them without waiting for every detail.
   Say plainly: what happened, what information was involved, what you have done, what they should do (for example
   change their password, watch for scams using their ID details), and who to contact.
9. Send it by email from the verified domain, and put a short notice on the site.
10. Tell the authorities and the payment provider if the law or the contract says so.

## Afterwards
11. Write a short report: cause, timeline, who was affected, what changed. Keep it with the evidence.
12. Fix the cause, not just the symptom, and add a test or a check so it cannot quietly come back.
13. Update this plan, and the Privacy Policy if what you collect or keep has changed.

## Do not
- Do not delete evidence or edit logs.
- Do not tell people "no personal data was affected" until it is confirmed.
- Do not pay or negotiate with an attacker without the legal adviser.
