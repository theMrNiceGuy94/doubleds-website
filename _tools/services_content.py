# Content for the service pages. Text may contain simple HTML (<p>, <strong>, <a>).
# "ready": True means the page gets built. No prices anywhere on these pages.

ORDER = [
    "diagnostics", "carbon-cleaning", "exhaust-camshaft", "oil-strainer-rod-bearings",
    "head-gasket", "turbo", "timing-chain", "vacuum-pump", "exhaust-pressure-sensor", "dpf",
]

SERVICES = {
    # ------------------------------------------------------------------ #
    "exhaust-camshaft": {
        "ready": True,
        "short": "Exhaust camshaft",
        "schema_name": "Mazda 2.2 Skyactiv-D exhaust camshaft replacement",
        "title": "Mazda 2.2 Diesel Exhaust Camshaft Replacement | Double D's",
        "description": "Worn exhaust camshaft on a Mazda 2.2 Skyactiv-D? The symptoms, how we diagnose it and how we fix it. 136+ replaced since 2024 in Woodchurch, Kent.",
        "h1": 'Exhaust camshaft <span class="red">replacement</span>',
        "lead": "A ticking top end and a lumpy idle on a Mazda 2.2 diesel often means a worn exhaust camshaft. We find out for sure, then fix the cause as well as the part.",
        "icon": "camshaft",
        "count": 136,
        "count_label": "Exhaust camshafts replaced",
        "photo": "real-camshaft.jpg",
        "photo_alt": "Mazda 2.2 camshafts and timing gears laid out on the workshop bench",
        "photo_caption": "Camshafts out on the bench at our Woodchurch workshop.",
        "video": None,  # DRAFT: David to send the YouTube link
        "what_title": "Why the 2.2 Skyactiv-D wears its exhaust cam",
        "what": """<p>The exhaust camshaft opens the exhaust valves through roller rockers (finger followers) sitting on hydraulic lash adjusters. On the Skyactiv-D, Mazda added a trick to the exhaust side: when the engine is cold, the exhaust valves open slightly a second time during the intake stroke. That pulls some hot exhaust gas back into the cylinder, which helps the low-compression engine start and run cleanly from cold.</p>
<p>All of that depends on a good film of clean oil between the cam lobes and the rollers, and the 2.2 gives its oil a hard life. Every DPF regeneration adds extra fuel late in the combustion cycle, and some of it ends up in the sump. Short trips that keep interrupting regenerations make it worse. The oil level creeps up, the oil gets thinner, and it stops protecting the metal.</p>
<p>The result is wear on the exhaust cam lobes and the rockers. Once the surface starts to break up, the metal particles travel round the engine with the oil, which is why <strong>a worn exhaust camshaft and a blocked <a href="../oil-strainer-rod-bearings/">oil strainer or worn rod bearings</a> often turn up together</strong>.</p>""",
        "symptoms_intro": "These are the signs our customers usually notice first. None of them proves it's the camshaft on its own, which is why we diagnose before we quote.",
        "symptoms": [
            ("Ticking from the top end", "A tapping or ticking noise from the top of the engine, often easiest to hear at idle."),
            ("Rough or lumpy idle", "The engine shakes or hunts at idle, sometimes worse from cold."),
            ("Loss of power", "Flat pick-up and the car doesn't pull the way it used to."),
            ("Warning light", "Engine management light, sometimes with misfire or airflow-related fault codes."),
            ("Hard or rough starting", "Longer cranking or rough running for the first minutes after a cold start."),
            ("Rising oil level", "Oil level going up between services, or oil that smells of diesel. That's a cause rather than a symptom, but a warning sign worth acting on."),
        ],
        "diagnose": [
            ("Your car's history", "We ask about servicing, oil changes, how often the DPF regenerates and the kind of driving the car does. Short trips and long oil intervals matter here."),
            ("Fault codes & live data", "We read the fault codes and check live data, including DPF soot load and regeneration history, to see how hard the oil has been working."),
            ("Listen & check the oil", "We pin down where the noise is coming from and check the oil level, condition and smell, and look for metal in it."),
            ("Look at the camshaft", "With the cam cover off we inspect the exhaust cam lobes and rockers directly. That's the only way to know for sure, and we photograph what we find for your report."),
        ],
        "fix": """<p>If the camshaft is worn, we <strong>replace the exhaust camshaft together with the rockers and hydraulic lash adjusters</strong> where they're worn too. Putting a new camshaft onto worn rockers just wears the new one out. We also check the inlet camshaft while we're in there.</p>
<p>The engine gets fresh oil of the correct specification and a new filter. Because metal from the cam ends up in the sump, we'll tell you if the oil strainer and bearings need looking at as well.</p>
<p class="callout">A new camshaft in an engine that keeps diluting its oil will wear out again. So we also look at why it happened, whether that's DPF regenerations, driving pattern or oil change intervals, and tell you how to stop it coming back.</p>
<p>Every car gets our final checks before it goes home: a test drive, a fault code scan and a live data check.</p>""",
        "faq": [
            ("Can I keep driving with a worn exhaust camshaft?",
             "We wouldn't for long. The metal coming off the cam goes round the engine with the oil and can block the oil strainer and damage the rod bearings. Catching it early is far cheaper than an engine rebuild."),
            ("Is the ticking definitely the camshaft?",
             "Not always. Injectors and leaking injector washers can make a similar noise. That's why we diagnose before we replace anything, rather than guessing from a noise."),
            ("Do you replace just the camshaft?",
             "We replace whatever is worn. Usually that's the exhaust camshaft plus the rockers and lash adjusters, because fitting a new cam onto worn rockers shortens its life."),
            ("Why does the Mazda 2.2 diesel get this problem?",
             "Mostly oil. DPF regenerations can put diesel into the sump, which thins the oil and stops it protecting the cam lobes. Short trips and long service intervals make it worse."),
            ("How can I stop it happening again?",
             "Change the oil more often than the maximum interval, use the correct specification, keep an eye on the oil level, and let the DPF finish its regenerations with a decent run now and then. We'll give you advice for your car after the repair."),
        ],
        "aside_title": "Ticking? Get it checked before it spreads",
        "cta": "Ticking top end? Let's find out why.",
    },

    # ------------------------------------------------------------------ #
    "carbon-cleaning": {
        "ready": True,
        "short": "Carbon cleaning",
        "schema_name": "Mazda 2.2 Skyactiv-D carbon cleaning and walnut blasting",
        "title": "Mazda 2.2 Skyactiv-D Carbon Cleaning | Double D's Automotive",
        "description": "Carbon build-up choking your Mazda 2.2 Skyactiv-D? The symptoms, how we diagnose it and how we strip and clean the intake. 216+ done since 2024 in Kent.",
        "h1": 'Carbon <span class="red">cleaning</span>',
        "lead": "Soot and oil bake into the intake of every Mazda 2.2 diesel until the engine can't breathe. We strip it down, clean it properly and walnut-blast the ports.",
        "icon": "carbon-cleaning",
        "count": 216,
        "count_label": "Carbon cleans done",
        "photo": "real-carbon-cleaning.jpg",
        "photo_alt": "A Mazda 2.2 diesel throttle body caked in carbon, before cleaning",
        "photo_caption": "What we find inside: a Skyactiv-D throttle body caked in carbon.",
        "video": ("1IymlgZPvxI", "Mazda 2.2 – carbon cleaning (diesel intake)"),
        "what_title": "Why the 2.2 Skyactiv-D carbons up",
        "what": """<p>To keep emissions down, the Skyactiv-D sends part of its exhaust gas back into the intake through the EGR system. That exhaust gas carries soot. At the same time, the crankcase breather feeds oil mist into the intake. Soot plus oil makes a sticky paste that coats the throttle body, the EGR valve, the intake manifold and the inlet ports, then bakes hard.</p>
<p>The 2.2 runs a low compression ratio and leans heavily on EGR, so it builds up carbon faster than many diesels. Short trips and low-rev driving speed it up, because the engine rarely gets hot enough to burn anything off.</p>
<p>Over time the passages narrow, the engine gets less air than it asks for, and it makes more soot, which then loads up the <a href="../dpf/">DPF</a> faster. It feeds itself.</p>""",
        "symptoms_intro": "Carbon builds up slowly, so many owners get used to the car feeling a bit flat. These are the signs we see most often.",
        "symptoms": [
            ("Loss of power", "The car feels flat and sluggish, especially pulling away and up hills."),
            ("Limp mode", "Power suddenly cuts out and the engine runs in a reduced-power mode until it's restarted."),
            ("Warning lights", "Engine management light, often with EGR, airflow or boost-related fault codes."),
            ("Frequent DPF regenerations", "The DPF regenerates more often than it should, or the DPF light comes on."),
            ("Rough idle & hesitation", "Uneven idle and a stumble or flat spot when you put your foot down."),
            ("More smoke, worse economy", "More visible smoke under load and fuel economy dropping off."),
        ],
        "diagnose": [
            ("Fault codes & live data", "We read the fault codes, then compare the air the engine is actually getting with what it's asking for, along with boost and EGR valve position."),
            ("DPF check", "We check the DPF soot load and how often it's regenerating. Heavy carbon usually shows up here too."),
            ("Rule out the alternatives", "Boost leaks, faulty sensors and turbo problems can look the same on the road, so we check them before blaming carbon."),
            ("Look inside", "Where it helps, we inspect the intake directly so you can see the build-up for yourself in your report."),
        ],
        "fix": """<p>There's no shortcut for baked-on carbon. <strong>We take the intake apart and clean it by hand</strong>:</p>
<p>The intake manifold, throttle body, EGR valve and EGR pipework come off and are cleaned until they're back to bare metal. The inlet ports and valves are then <strong>walnut-blasted</strong>: crushed walnut shells are blasted into the ports. They're hard enough to strip the carbon but soft enough not to damage the metal, and every last shell is vacuumed out before the engine goes back together.</p>
<p>Everything goes back with new gaskets and seals. Then we reset the adaptations and do our final checks before the car goes home: a test drive, a fault code scan and a live data check.</p>
<p class="callout">Additives and "engine decarbonising" machines can't shift hard carbon from the manifold and ports. If the intake is badly blocked, the only proper fix is to take it apart.</p>""",
        "faq": [
            ("Will a fuel additive or engine decarb machine do the same job?",
             "Not on carbon this hard. The build-up sits in the intake, where additives in the fuel never reach, and it's baked on. Stripping and cleaning is the only way to get the intake back to bare metal."),
            ("What is walnut blasting?",
             "Crushed walnut shells blasted into the inlet ports. They're hard enough to remove the carbon from the ports and valves but soft enough not to damage the metal. We vacuum every shell out afterwards."),
            ("Will a carbon clean fix my DPF problems?",
             "It often helps, because a blocked intake makes more soot. But a DPF that's already badly loaded may need its own attention. We check both during diagnostics and tell you what each one needs."),
            ("How often does a Mazda 2.2 diesel need a carbon clean?",
             "It depends a lot on how the car is driven. Short trips and town driving build carbon much faster than regular motorway runs. Rather than going by mileage, we go by symptoms and what the live data shows."),
            ("Why does the Skyactiv-D get so much carbon?",
             "It recirculates a lot of sooty exhaust gas through the EGR system, and the crankcase breather adds oil mist. Together they make a sticky deposit that bakes onto the intake."),
        ],
        "aside_title": "Feeling flat? Let's check the intake",
        "cta": "Flat, smoky or in limp mode? Let's find out why.",
    },

    # ---- stubs for the remaining pages (written in stage 2) ---------- #
    "diagnostics": {"short": "Diagnostics"},
    "oil-strainer-rod-bearings": {"short": "Oil strainer & rod bearings"},
    "head-gasket": {"short": "Head gasket"},
    "turbo": {"short": "Turbo"},
    "timing-chain": {"short": "Timing chain"},
    "vacuum-pump": {"short": "Vacuum pump"},
    "exhaust-pressure-sensor": {"short": "Exhaust pressure sensor"},
    "dpf": {"short": "DPF"},
}
