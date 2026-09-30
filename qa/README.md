# QA scripts

Browser tests for the site, written with `playwright-core`. They are what was used to check the revision,
and anyone can re-run them.

## Setup

```bash
npm install
npm run build
# Playwright needs a Chromium. Point at one you already have, or install one:
export CHROMIUM_PATH=/path/to/chromium        # or: npx playwright install chromium
```

## Site checks (routes, navigation, every interaction, touch, keyboard, reduced motion, overflow)

```bash
npx next start -p 3100 &
node qa/site.mjs                     # prints PASS/FAIL per check and a total
```

## Form checks (contact message and project brief), against a local stand-in for Supabase

The stand-in (`qa/fake-supabase.mjs`) speaks the same REST API and enforces the same shape rules as the
migrations (unique keys, NOT NULL, and the `source` CHECK). It has a switch for "migration not yet run".
It is a **test double**: it proves the site's own logic, not Supabase itself.

```bash
node qa/fake-supabase.mjs &
SUPABASE_URL=http://127.0.0.1:54321 SUPABASE_SERVICE_ROLE_KEY=fake INQUIRY_HASH_SALT=test npx next start -p 3102 &
node qa/forms.mjs
```

Covers: required and invalid fields, focus on the first error, the honest "not sent" state before the migration,
brief storage unaffected by the migration, contact stored with `source = 'contact'`, IP stored only as a hash,
double click stores one row, failure then retry, honeypot refused, and the five-per-hour limit.

## What these cannot check

* **Row Level Security on the real database.** The stand-in cannot prove that visitors are denied access.
  Check it against the real project with the public key (it should be refused or return nothing):

  ```bash
  curl -s "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/inquiries?select=id&limit=1" \
    -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" -H "Authorization: Bearer $NEXT_PUBLIC_SUPABASE_ANON_KEY"
  ```
* The deployed Vercel preview, real phones, and screen readers.
