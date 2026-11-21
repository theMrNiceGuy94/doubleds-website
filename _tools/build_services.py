#!/usr/bin/env python3
"""Builds the service pages in /services/<slug>/index.html.

Content lives in _tools/services_content.py. The header, footer and floating
Messenger button are copied from index.html so they always match the homepage.
Run from the repo root:  python3 _tools/build_services.py
(Folders starting with "_" are not published by GitHub Pages.)
"""
import html, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from services_content import SERVICES, ORDER  # noqa: E402

SITE = "https://doubledsautomotive.co.uk"
BOOK = "https://app.doubledsautomotive.co.uk/book"
MESSENGER = "https://m.me/MrNiceGuy9494?ref=website"

home = open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()


def block(start, end):
    i = home.index(start)
    j = home.index(end, i) + len(end)
    return home[i:j]


header = block('<header class="site-header">', '</header>')
footer = block('<footer class="site-footer">', '</footer>')
fab = block('<a class="fab-messenger"', '</a>')

# Header/footer links point back to the homepage sections.
header = header.replace('href="#top"', 'href="/"')
header = re.sub(r'href="#([a-z]+)"', r'href="/#\1"', header)
header = header.replace('src="images/', 'src="../../images/')
footer = re.sub(r'href="#([a-z]+)"', r'href="/#\1"', footer)
footer = footer.replace('href="privacy.html"', 'href="/privacy.html"')
# Footer service list -> links to the service pages
items = "".join(
    f'<li><a href="../{s}/">{html.escape(SERVICES[s]["short"])}</a></li>' for s in ORDER
)
footer = re.sub(r'(<h3>Our services</h3><ul>).*?(</ul>)', r'\1' + items + r'\2', footer, flags=re.S)

MSG_SVG = '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5A8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5z"/></svg>'
PLAY_SVG = '<svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="#fff"><path d="M7 4.5v15l13-7.5z"/></svg>'


def strip_tags(s):
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", s)).strip()


def schema(slug, s):
    url = f"{SITE}/services/{slug}/"
    graph = [
        {
            "@type": "Service",
            "@id": url + "#service",
            "name": s["schema_name"],
            "serviceType": s["schema_name"],
            "description": s["description"],
            "url": url,
            "image": f"{SITE}/images/{s['photo']}",
            "areaServed": ["United Kingdom", "Europe"],
            "audience": {"@type": "Audience", "audienceType": "Mazda 2.2 Skyactiv-D diesel owners"},
            "provider": {
                "@type": "AutoRepair",
                "@id": f"{SITE}/#business",
                "name": "Double D's Automotive",
                "url": f"{SITE}/",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Unit 2, Odden Farm",
                    "addressLocality": "Woodchurch, Ashford",
                    "addressRegion": "Kent",
                    "postalCode": "TN26 3TQ",
                    "addressCountry": "GB",
                },
            },
        },
        {
            "@type": "FAQPage",
            "@id": url + "#faq",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": q,
                    "acceptedAnswer": {"@type": "Answer", "text": strip_tags(a)},
                }
                for q, a in s["faq"]
            ],
        },
        {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": f"{SITE}/"},
                {"@type": "ListItem", "position": 2, "name": "Services", "item": f"{SITE}/#services"},
                {"@type": "ListItem", "position": 3, "name": s["short"], "item": url},
            ],
        },
    ]
    return json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False, indent=2)


def video_block(s):
    v = s.get("video")
    if not v:
        return ('<p class="video-missing">[DRAFT – YouTube video link needed for this page. '
                'If there isn\'t one, this section is left out.]</p>')
    vid, title = v
    return (
        f'<a class="svc-video" href="https://www.youtube.com/watch?v={vid}" target="_blank" rel="noopener">'
        f'<span class="thumb"><img src="https://i.ytimg.com/vi/{vid}/hqdefault.jpg" alt="" width="480" height="360" loading="lazy">'
        f'<span class="play">{PLAY_SVG}</span></span>'
        f'<span class="title">{title}</span></a>'
    )


def page(slug, s):
    url = f"{SITE}/services/{slug}/"
    symptoms = "".join(f"<li><strong>{h}</strong>{t}</li>" for h, t in s["symptoms"])
    steps = "".join(f"<li><div><h3>{h}</h3><p>{t}</p></div></li>" for h, t in s["diagnose"])
    faq = "".join(f"<details><summary>{html.escape(q)}</summary><p>{a}</p></details>" for q, a in s["faq"])
    others = "".join(
        f'<li><a href="../{o}/">{html.escape(SERVICES[o]["short"])}</a></li>' for o in ORDER if o != slug
    )
    count_label = s["count_label"]
    return f"""<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(s['title'])}</title>
<meta name="description" content="{html.escape(s['description'])}">
<link rel="canonical" href="{url}">
<meta name="theme-color" content="#0B0B0C">
<link rel="icon" type="image/png" href="../../images/favicon.png">
<link rel="apple-touch-icon" href="../../images/favicon.png">

<meta property="og:type" content="website">
<meta property="og:site_name" content="Double D's Automotive">
<meta property="og:title" content="{html.escape(s['title'])}">
<meta property="og:description" content="{html.escape(s['description'])}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{SITE}/images/{s['photo']}">
<meta property="og:locale" content="en_GB">
<meta name="twitter:card" content="summary_large_image">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,800;1,700;1,800;1,900&family=Barlow:wght@400;600&display=swap">
<link rel="stylesheet" href="../../styles.css">
<link rel="stylesheet" href="../services.css">

<script type="application/ld+json">
{schema(slug, s)}
</script>
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>

{header}

<main id="main">

<section class="svc-hero">
  <div class="container svc-hero-inner">
    <div>
      <ol class="crumbs" aria-label="Breadcrumb"><li><a href="/">Home</a></li><li><a href="/#services">Services</a></li><li aria-current="page">{html.escape(s['short'])}</li></ol>
      <p class="svc-kicker display">Mazda 2.2 Skyactiv-D <span class="slashes">///</span></p>
      <h1>{s['h1']}</h1>
      <p class="svc-lead">{s['lead']}</p>
      <div class="hero-actions">
        <a class="btn btn-red" href="{BOOK}" data-book>Book diagnostics</a>
        <a class="btn btn-light messenger-link" href="{MESSENGER}" target="_blank" rel="noopener">{MSG_SVG}Message us</a>
      </div>
    </div>
    <div class="svc-count">
      <video src="../../images/jobs/{s['icon']}.mp4" poster="../../images/jobs/{s['icon']}.jpg" autoplay muted loop playsinline preload="metadata" aria-hidden="true"></video>
      <div>
        <p class="job-num">{s['count']}<span class="plus">+</span></p>
        <p class="job-label">{count_label}</p>
        <p class="count-note">Counted from our own invoices since 2024</p>
      </div>
    </div>
  </div>
</section>

<div class="section">
  <div class="container svc-body">
    <article class="svc-article">
      <section aria-labelledby="what">
        <h2 id="what">{s['what_title']}</h2>
        {s['what']}
        <figure class="svc-photo">
          <img src="../../images/{s['photo']}" alt="{html.escape(s['photo_alt'])}" width="900" height="402" loading="lazy">
          <figcaption>{s['photo_caption']}</figcaption>
        </figure>
      </section>

      <section aria-labelledby="symptoms">
        <h2 id="symptoms">Symptoms</h2>
        <p>{s['symptoms_intro']}</p>
        <ul class="symptoms">{symptoms}</ul>
      </section>

      <section aria-labelledby="diagnose">
        <h2 id="diagnose">How we diagnose it</h2>
        <ol class="diag-steps">{steps}</ol>
      </section>

      <section aria-labelledby="fix">
        <h2 id="fix">The fix</h2>
        {s['fix']}
      </section>

      <section aria-labelledby="video">
        <h2 id="video">Watch us do it</h2>
        {video_block(s)}
      </section>

      <section aria-labelledby="faq" class="faq">
        <h2 id="faq">Questions we get asked</h2>
        {faq}
      </section>
    </article>

    <aside class="svc-aside" aria-label="Book diagnostics">
      <div class="aside-box">
        <p class="kicker">Where every job starts</p>
        <h2>{s['aside_title']}</h2>
        <p>Every repair starts with our diagnostic inspection and health check. You get a written report with what we found and your options. No guesswork, and no obligation to go ahead.</p>
        <a class="btn btn-red" href="{BOOK}" data-book>Book diagnostics</a>
        <a class="btn btn-light messenger-link" href="{MESSENGER}" target="_blank" rel="noopener">{MSG_SVG}Message us</a>
        <ul class="aside-facts">
          <li>Mazda 2.2 Skyactiv-D specialists</li>
          <li>Woodchurch, Ashford, Kent TN26 3TQ</li>
          <li>Mon–Fri 09:00–17:00</li>
          <li>The workshop behind the MrNiceGuy YouTube channel</li>
        </ul>
      </div>
    </aside>
  </div>
</div>

<section class="section" aria-labelledby="other-title">
  <div class="container">
    <div class="section-title"><h2 id="other-title">Other Skyactiv-D faults we fix</h2><span class="slashes" aria-hidden="true">//</span></div>
    <ul class="other-services">{others}</ul>
  </div>
</section>

<section class="cta-band cta-photo" aria-labelledby="cta-title">
  <div class="container cta-inner">
    <h2 id="cta-title">{s['cta']}</h2>
    <a class="btn btn-dark" href="{BOOK}" data-book>Book diagnostics</a>
  </div>
</section>

</main>

{footer}

{fab}

<script src="../../script.js" defer></script>
<script>
// Respect "reduce motion": show the still poster instead of the looping icon
if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {{
  document.querySelectorAll('.svc-count video').forEach(function (v) {{ v.removeAttribute('autoplay'); v.pause(); }});
}}
</script>
</body>
</html>
"""


if __name__ == "__main__":
    only = sys.argv[1:] or [s for s in ORDER if SERVICES[s].get("ready")]
    for slug in only:
        out = os.path.join(ROOT, "services", slug, "index.html")
        os.makedirs(os.path.dirname(out), exist_ok=True)
        open(out, "w", encoding="utf-8").write(page(slug, SERVICES[slug]))
        print("built", out)
