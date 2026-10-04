# AiGen-One public website

`client/` is the current, deployable static website maintained by Web CMS. The
root package's older Vite configuration is retained from the original source
import; publishing the current CMS artifact does not require rebuilding that
older application.

## Contact page

`client/contact/index.html` is the visitor-facing contact page. It posts to the
existing Aigen-One public inquiry API. Google Chat credentials stay in Aigen-One's
registered integration; no webhook secret is copied into this repository.

`client/assets/contact-links.js` connects the existing site's contact links to
this page after React renders, including subsequent language changes. It keeps
the same relative directory structure when viewed through Web CMS.

The form validates required fields, requests consent, includes a honeypot, retains
input after failures, and reuses a submission ID on retries. It displays receipt
only when the API confirms acceptance. A sandboxed CMS preview cannot submit.

Run `node --test tests/contact-form.test.js` for the submission tests. These tests
mock the API and never post to Google Chat. For visual checks, serve `client/`
with a static HTTP server. Do not send real test inquiries without choosing the
intended destination first.

## Publishing

Keep the `client/` artifact in Git and in the CMS preview branch. Deploy an
immutable copy of a verified commit to the configured static site host, then
atomically switch the current release. The contact API and its site-specific
origin/destination settings must be ready before making the page live.

Future work: let Web CMS develop and verify server-side features as well as
static pages. This release uses the existing inquiry API; it does not add a
general server-side code-generation capability to Web CMS.
