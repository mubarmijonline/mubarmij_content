# Arabic copy awaiting review

`docs/SPEC.md` locks Arabic against machine translation. The design revamp
introduced English strings with no approved Arabic equivalent. Where a close
match existed in `messages/ar.json` or `cms/src/endpoints/v1/data/*`, that
wording was reused verbatim. Everything below is a **draft written in the
existing brand voice** and needs a native pass before it can be considered
final.

Technical terms (React, Nginx, Flutter, DevOps, WhatsApp …) stay Latin in both
locales, per SPEC. Those are not listed here.

Status: `draft` = written by the revamp, unreviewed. `reused` = lifted from
already-approved copy, no review needed.

| Where | English | Arabic (draft) | Status |
|---|---|---|---|
| `src/lib/content/stack.ts` — group label | Front-end | الواجهة الأمامية | draft |
| `src/lib/content/stack.ts` — group label | Mobile | الموبايل | draft |
| `src/lib/content/stack.ts` — group label | Back-end | الواجهة الخلفية | draft |
| `src/lib/content/stack.ts` — group label | Infra & DevOps | البنية التحتية و DevOps | draft |
| `src/lib/content/stack.ts` — group label | Data & automation | البيانات والأتمتة | draft |
| `src/lib/content/stack.ts` — eyebrow | Stack | التقنيات | draft |
| `src/lib/content/stack.ts` — heading | Modern front-end, production infrastructure | واجهات حديثة وبنية تحتية جاهزة للإنتاج | draft |
| `src/lib/content/stack.ts` — lede | We choose per project, not per habit — then deploy and run it ourselves behind hardened Nginx… | بنختار التقنية حسب المشروع، مش حسب العادة — وبعدين بننشرها وبنشغّلها بنفسنا خلف Nginx مؤمّن… | draft |

Further rows are appended as each phase lands (hero pill and lede, the
Capabilities pull-quote, "Next builds", the Work-page highlights, and the
contact form labels).
