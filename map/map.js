// Customer map (Double D's app, Business Rules 24). Reads approved pins from the workshop app and draws them
// on a MapTiler map. Needs Leaflet and Leaflet.markercluster loaded first, and <div data-customer-map> on the page.
(function () {
  var root = document.querySelector('[data-customer-map]');
  if (!root || !window.L) return;

  var params = new URLSearchParams(location.search);
  var API = params.get('source') === 'test' ? 'https://double-ds-app-test.vercel.app' : 'https://app.doubledsautomotive.co.uk';
  var KEY = 'RZZuCgTi0LsI2BLTu6mW'; // MapTiler browser key, only works on our own websites
  var YEARS = [{ y: 2024, c: '#FF5A5F' }, { y: 2025, c: '#60A5FA' }, { y: 2026, c: '#FAC775' }, { y: 2027, c: '#4ADE80' }];
  var NOW = new Date().getFullYear();
  var yIdx = function (y) { var i = YEARS.findIndex(function (o) { return o.y === y; }); return i < 0 ? YEARS.length - 1 : i; };
  var YL = YEARS.map(function (o) { return o.y === NOW ? 'This year' : String(o.y); });
  var SHOWN = YEARS.map(function (o, i) { return i; }).filter(function (i) { return YEARS[i].y <= NOW; });
  var BOUNDS = { uk: [[49.8, -8.4], [58.8, 2.2]], eu: [[41, -11], [59.5, 19]], intl: [[-45, -179], [70, 179]] };
  var GARAGE = '<svg viewBox="0 0 34 34" aria-hidden="true"><path d="M3 15 L17 4 L31 15 V31 H3 Z" fill="#D3111C" stroke="#fff" stroke-width="2" stroke-linejoin="round"/><rect x="8.5" y="16" width="17" height="15" fill="#0B0B0C" stroke="#fff" stroke-width="1.5"/><path d="M9.5 19.5h15M9.5 22.5h15M9.5 25.5h15M9.5 28.5h15" stroke="#C4C4C8" stroke-width="1.3"/></svg>';
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var fmt = function (n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); };
  var hm = function (m) { var h = Math.floor(m / 60), mm = Math.round((m % 60) / 5) * 5; if (mm === 60) { h++; mm = 0; } return (h ? h + 'h' : '') + (mm ? (h ? ' ' : '') + mm + 'm' : (h ? '' : '5m')); };
  var crow = function (a, b) { var R = 3958.8, t = Math.PI / 180, h = Math.pow(Math.sin((b[0] - a[0]) * t / 2), 2) + Math.cos(a[0] * t) * Math.cos(b[0] * t) * Math.pow(Math.sin((b[1] - a[1]) * t / 2), 2); return 2 * R * Math.asin(Math.sqrt(h)); };

  root.innerHTML =
    '<p class="cm-stats" aria-live="polite"></p>' +
    '<div class="cm-controls"><div class="cm-tabs" role="tablist" aria-label="Region"></div><div class="cm-years"><span class="cm-ylabel">Year</span></div>' +
    '<label class="cm-ysel"><span class="sr">Year</span><select aria-label="Year"></select></label></div>' +
    '<div class="cm-row"><div class="cm-mapcol"><div class="cm-mapbox"><div class="cm-map" role="region" aria-label="Map of where our customers travel from"></div>' +
    '<div class="cm-hint"></div><div class="cm-back"><button type="button">‹ Show all customers</button></div>' +
    '<div class="cm-sheet" role="dialog" aria-label="Customer details"></div></div>' +
    '<div class="cm-legend"><span class="ly"></span><span><i class="dot" style="background:#141416;border:2px solid #fff;width:16px;height:16px"></i>Group: click to zoom in</span><span><span style="width:18px;height:18px;display:inline-block">' + GARAGE + '</span>Our workshop</span></div></div>' +
    '<aside class="cm-panel" aria-live="polite"><p class="muted">Loading the map…</p></aside></div>';
  var lb = document.createElement('div');
  lb.className = 'cm-lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-label', 'Photo');
  lb.innerHTML = '<button type="button" aria-label="Close photo">✕</button><img alt="">';
  document.body.appendChild(lb);
  var $ = function (s) { return root.querySelector(s); };
  var panel = $('.cm-panel'), hint = $('.cm-hint'), back = $('.cm-back'), sheet = $('.cm-sheet'), stats = $('.cm-stats');
  // Phones (22 Nov 2026 mockup): bigger map, region bar on the map, years in a dropdown, a pin opens a bottom sheet.
  var phoneQ = matchMedia('(max-width: 700px)');
  var phone = function () { return phoneQ.matches; };
  var mapbox = $('.cm-mapbox'), tabsBox = $('.cm-tabs'), controls = $('.cm-controls');
  function placeTabs() { if (phone()) mapbox.appendChild(tabsBox); else controls.insertBefore(tabsBox, controls.firstChild); }
  placeTabs();
  (phoneQ.addEventListener ? phoneQ.addEventListener.bind(phoneQ, 'change') : phoneQ.addListener.bind(phoneQ))(function () { placeTabs(); if (state.data) { renderControls(); draw(); renderPanel(); } setTimeout(function () { map.invalidateSize(); }, 50); });

  var map = L.map($('.cm-map'), { zoomSnap: 0.5, minZoom: 2, maxZoom: 13, scrollWheelZoom: false, worldCopyJump: true }).fitBounds(BOUNDS.uk);
  L.tileLayer('https://api.maptiler.com/maps/streets-v2-dark/256/{z}/{x}/{y}.png?key=' + KEY, {
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank" rel="noopener">© MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">© OpenStreetMap contributors</a>',
    crossOrigin: true, maxZoom: 13,
  }).addTo(map);
  var touch = matchMedia('(pointer:coarse)').matches;
  hint.textContent = touch ? 'Pinch to zoom · tap a pin' : 'Click the map, then scroll to zoom · or use + and −';
  if (touch) map.on('zoomstart movestart', function () { hint.style.opacity = 0; });
  map.on('click focus', function () { map.scrollWheelZoom.enable(); hint.style.opacity = 0; });
  map.getContainer().addEventListener('mouseleave', function () { map.scrollWheelZoom.disable(); hint.style.opacity = 1; });

  var state = { year: -1, region: 'uk', sel: null, data: null, shop: [51.07, 0.77] };
  var routeL = L.layerGroup().addTo(map);
  var count = function (p) { return state.year < 0 || yIdx(p.year) === state.year; };
  function clusterGroup(dim) {
    return L.markerClusterGroup({
      maxClusterRadius: function (z) { return z >= 10 ? 28 : phone() ? 36 : 46; }, showCoverageOnHover: false, zoomToBoundsOnClick: false, spiderfyOnMaxZoom: true,
      spiderLegPolylineOptions: { color: '#F4F4F5', weight: 1, opacity: 0.6 },
      iconCreateFunction: function (c) {
        var n = c.getChildCount(), s = phone() ? Math.round(22 + Math.sqrt(n) * 3.5) : Math.round(28 + Math.sqrt(n) * 5);
        if (dim && state.sel) s = Math.round(20 + Math.sqrt(n) * 3.5);
        return L.divIcon({ className: '', html: '<div class="clu' + (state.sel ? (dim ? ' dim' : ' sel') : '') + '" style="width:' + s + 'px;height:' + s + 'px;font-size:' + (s > 40 ? 15 : s < 26 ? 11 : 13) + 'px">' + n + '</div>', iconSize: [s, s] });
      },
    }).on('clusterclick', function (e) {
      var towns = {};
      e.layer.getAllChildMarkers().forEach(function (m) { towns[m.options.townKey] = 1; });
      if (Object.keys(towns).length === 1) e.layer.spiderfy(); else e.layer.zoomToBounds({ padding: [40, 40] });
    });
  }
  var others = clusterGroup(true).addTo(map), chosen = clusterGroup(false).addTo(map);

  L.marker(state.shop, { interactive: false, keyboard: false, zIndexOffset: 2000, icon: L.divIcon({ className: '', html: '<div class="shop"><span class="garage">' + GARAGE + '</span><span class="lab">Our workshop</span></div>', iconSize: [0, 0], iconAnchor: [14, 24] }) }).addTo(map);
  map.on('click', function () { if (state.sel) clearSel(); });

  function townKey(p) { return (p.town || '').toLowerCase().trim() + '|' + p.region; }
  function icon(p, dim) {
    if (dim) return L.divIcon({ className: '', html: '<div class="pin dim"></div>', iconSize: [12, 12] });
    return L.divIcon({ className: '', html: '<div class="pin' + (p.wall ? ' wall' : '') + '" style="background:' + YEARS[yIdx(p.year)].c + '"></div>', iconSize: p.wall ? [16, 16] : [22, 22] });
  }
  function draw() {
    others.clearLayers(); chosen.clearLayers();
    var all = state.data.items.filter(count);
    var mk = function (p, dim) {
      var m = L.marker([p.lat, p.lng], { icon: icon(p, dim), keyboard: true, title: p.town + (p.wall ? '' : (p.firstName ? ' – ' + p.firstName : '')), townKey: townKey(p), zIndexOffset: dim ? -500 : 500 });
      m.on('click', function (ev) { L.DomEvent.stopPropagation(ev); select(townKey(p)); });
      return m;
    };
    others.addLayers(all.filter(function (p) { return !state.sel || townKey(p) !== state.sel; }).map(function (p) { return mk(p, !!state.sel); }));
    if (state.sel) chosen.addLayers(all.filter(function (p) { return townKey(p) === state.sel; }).map(function (p) { return mk(p, false); }));
  }

  function select(key) {
    state.sel = key; draw(); routeL.clearLayers();
    var group = state.data.items.filter(function (p) { return townKey(p) === key; });
    var first = group[0];
    var withRoute = group.filter(function (p) { return !p.wall && p.hasRoute; })[0] || group.filter(function (p) { return p.wall && p.routeId; })[0];
    var flew = group.some(function (p) { return p.flewOut || p.region === 'intl'; });
    var drawLine = function (line, dashed) {
      L.polyline(line, { color: '#0B0B0C', weight: 8, opacity: 0.9, interactive: false }).addTo(routeL);
      L.polyline(line, { color: '#FF5A5F', weight: 4, dashArray: dashed ? '8 8' : null, interactive: false }).addTo(routeL);
      map.flyToBounds(L.latLngBounds(line).pad(0.15), { duration: 0.8, maxZoom: 10 });
    };
    var straight = [[first.lat, first.lng], state.shop];
    if (withRoute) {
      fetch(API + '/api/map/route/' + (withRoute.wall ? withRoute.routeId : withRoute.id)).then(function (r) { return r.ok ? r.json() : null; }).then(function (g) {
        if (state.sel !== key) return;
        drawLine(g && g.coordinates ? g.coordinates.map(function (c) { return [c[1], c[0]]; }) : straight, !g);
      }, function () { drawLine(straight, true); });
    } else drawLine(straight, true);
    back.classList.add('on');
    renderPanel();
  }
  function clearSel() { state.sel = null; routeL.clearLayers(); draw(); back.classList.remove('on'); closeSheet(); renderPanel(); }
  function closeSheet() { sheet.classList.remove('on', 'up'); sheet.innerHTML = ''; }
  // Bottom sheet: swipe (or tap the handle) up for photos and jobs, down to shrink it, down again to close.
  var y0 = null;
  sheet.addEventListener('touchstart', function (e) { y0 = e.touches[0].clientY; }, { passive: true });
  sheet.addEventListener('touchend', function (e) {
    if (y0 == null) return;
    var dy = e.changedTouches[0].clientY - y0; y0 = null;
    if (dy < -30) sheet.classList.add('up');
    else if (dy > 30 && sheet.scrollTop <= 0) { if (sheet.classList.contains('up')) sheet.classList.remove('up'); else clearSel(); }
  });
  back.querySelector('button').onclick = clearSel;
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { if (lb.classList.contains('on')) closeLb(); else if (state.sel) clearSel(); } });

  function regionCount(r) { return state.data.items.filter(function (p) { return p.region === r && count(p); }).length; }
  function renderControls() {
    var tabs = $('.cm-tabs');
    tabs.innerHTML = '';
    [['uk', 'UK'], ['eu', 'Europe'], ['intl', 'International']].forEach(function (t) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'cm-tab'; b.setAttribute('role', 'tab'); b.setAttribute('aria-selected', state.region === t[0]);
      b.innerHTML = t[1] + ' <span class="n">' + regionCount(t[0]) + '</span>';
      b.onclick = function () { state.region = t[0]; if (state.sel) clearSel(); map.flyToBounds(BOUNDS[t[0]], { duration: 0.8 }); renderControls(); renderPanel(); };
      tabs.appendChild(b);
    });
    var ys = $('.cm-years');
    ys.querySelectorAll('.cm-chip').forEach(function (c) { c.remove(); });
    [[-1, 'All years']].concat(SHOWN.map(function (i) { return [i, YL[i]]; })).forEach(function (y) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'cm-chip'; b.setAttribute('aria-pressed', state.year === y[0]);
      b.innerHTML = (y[0] >= 0 ? '<i class="dot" style="background:' + YEARS[y[0]].c + '"></i>' : '') + y[1];
      b.onclick = function () { state.year = y[0]; draw(); renderControls(); renderPanel(); };
      ys.appendChild(b);
    });
    var sel = $('.cm-ysel select');
    sel.innerHTML = [[-1, 'All years']].concat(SHOWN.map(function (i) { return [i, YL[i]]; })).map(function (y) { return '<option value="' + y[0] + '"' + (state.year === y[0] ? ' selected' : '') + '>' + esc(y[1]) + '</option>'; }).join('');
    sel.onchange = function () { state.year = Number(sel.value); if (state.sel) clearSel(); draw(); renderControls(); renderPanel(); };
    tabs.querySelectorAll('.cm-tab').forEach(function (b, k) { if (phone()) b.firstChild.textContent = ['UK', 'Europe', 'Intl'][k] + ' '; });
    $('.ly').innerHTML = SHOWN.map(function (i) { return '<span style="display:flex;gap:6px;align-items:center"><i class="dot" style="background:' + YEARS[i].c + ';width:12px;height:12px"></i>' + YL[i] + '</span>'; }).join('');
  }

  function renderPanel() {
    var items = state.data.items;
    if (!state.sel) {
      var list = items.filter(function (p) { return p.region === state.region && count(p); });
      var towns = {}; list.forEach(function (p) { towns[townKey(p)] = p; });
      var far = null;
      var road = {}; list.forEach(function (p) { if (p.miles != null) road[townKey(p)] = p.miles; });
      Object.keys(towns).forEach(function (k) { var p = towns[k]; var d = road[k] != null ? road[k] : crow([p.lat, p.lng], state.shop); if (!far || d > far.d) far = { d: d, p: p, road: road[k] != null }; });
      var name = { uk: 'Customers from around the UK', eu: 'Customers from Europe', intl: 'International' }[state.region];
      stats.textContent = list.length + (list.length === 1 ? ' customer' : ' customers') + ' · ' + Object.keys(towns).length + (Object.keys(towns).length === 1 ? ' town' : ' towns') + (far ? ' · furthest ' + fmt(far.d) + ' miles' : '');
      closeSheet();
      panel.innerHTML = '<p class="ptitle cm-ov" style="font-size:24px">' + name + (state.year >= 0 ? ' · ' + esc(YL[state.year]) : '') + '</p>' +
        '<div class="grid2 cm-ov"><div class="stat"><b>' + list.length + '</b><small>customers</small></div><div class="stat"><b>' + Object.keys(towns).length + '</b><small>towns and cities</small></div></div>' +
        (far ? '<div class="cm-ov" style="display:flex;flex-direction:column;gap:4px"><span class="cm-ylabel">Furthest</span><span>' + esc(far.p.town) + ' · ' + fmt(far.d) + (far.road ? ' miles by road' : ' miles away') + '</span></div>' : '') +
        '<p class="muted cm-ov" style="margin:0;font-size:14px;line-height:1.5">Zoom in or click a group to split it into single customers. Click a pin to see their journey. While one is open, click a grey pin to switch, or an empty bit of the map to see everyone again.</p>' +
        '<div class="cta"><span class="cm-ylabel" style="color:var(--text);font-size:18px">Been to see us?</span><span class="muted" style="font-size:14px;line-height:1.5">After your visit we email you a personal link to add your pin and photos of your car. Only real customers can add one, and David checks every pin and photo before it shows.</span></div>';
      return;
    }
    var group = items.filter(function (p) { return townKey(p) === state.sel && count(p); });
    var any = items.filter(function (p) { return townKey(p) === state.sel; })[0];
    var named = group.filter(function (p) { return !p.wall; });
    var wall = group.filter(function (p) { return p.wall; });
    var best = named.filter(function (p) { return p.miles != null; })[0] || items.filter(function (p) { return p.wall && townKey(p) === state.sel && p.miles != null; })[0];
    var flew = items.some(function (p) { return townKey(p) === state.sel && (p.flewOut || p.region === 'intl'); });
    var miles = best ? best.miles : crow([any.lat, any.lng], state.shop);
    var h = '<div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start"><div style="display:flex;flex-direction:column;gap:4px"><p class="ptitle">' + esc(any.town) + '</p><span class="muted" style="font-size:14px">' + group.length + (group.length === 1 ? ' customer' : ' customers') + (state.year >= 0 ? (YEARS[state.year].y === NOW ? ' this year' : ' in ' + YEARS[state.year].y) : '') + '</span></div><button type="button" class="x" aria-label="Close">✕</button></div>';
    h += '<div class="grid2"><div class="stat"><b class="red">' + fmt(miles) + '</b><small>' + (best ? 'miles by road' : flew ? 'miles away' : 'miles as the crow flies') + '</small></div>' +
      (best && best.minutes != null ? '<div class="stat"><b class="red" style="text-transform:none">' + hm(best.minutes) + '</b><small>by car' + (best.crossing ? ', incl. the sea crossing' : '') + '</small></div>' : flew ? '<div class="stat"><b class="red" style="font-size:24px">We flew</b><small>out to fix it there</small></div>' : '') + '</div>';
    named.forEach(function (p) {
      h += '<div class="card"><div style="display:flex;justify-content:space-between;gap:8px;align-items:center"><span style="font-weight:600">' + esc(p.firstName || 'A customer') + '</span>' +
        (p.year ? '<span class="ytag" style="background:' + YEARS[yIdx(p.year)].c + '">' + esc(YL[yIdx(p.year)]) + '</span>' : '') + '</div>' +
        (p.car ? '<span class="muted" style="font-size:14px">' + esc(p.car) + '</span>' : '') +
        '<div class="jobs">' + p.jobs.map(function (j) { return '<span class="job">' + esc(j) + '</span>'; }).join('') + '</div>' +
        (p.photos.length ? '<div class="gal">' + p.photos.map(function (id, i) { return '<button type="button" data-photo="' + esc(id) + '" aria-label="Open photo ' + (i + 1) + '"><img loading="lazy" src="' + API + '/api/map/photo/' + esc(id) + '" alt="Photo from ' + esc(p.firstName || 'the customer') + '"></button>'; }).join('') + '</div>' : '') +
        '</div>';
    });
    if (wall.length) {
      var by = SHOWN.map(function (i) { return wall.filter(function (p) { return yIdx(p.year) === i; }).length; });
      h += '<div class="card dash"><span style="font-weight:600">' + wall.length + (wall.length === 1 ? ' pin' : ' pins') + ' from our workshop wall</span><div class="jobs">' +
        by.map(function (c, k) { var i = SHOWN[k]; return c ? '<span class="ytag" style="background:' + YEARS[i].c + '">' + c + ' × ' + esc(YL[i]) + '</span>' : ''; }).join('') +
        '</div><span class="muted" style="font-size:12px;line-height:1.4">From the pin map on our workshop wall, so no names, jobs or photos.</span></div>';
    }
    var box = panel;
    if (phone()) {
      box = sheet;
      var more = named.length || wall.length;
      sheet.innerHTML = '<button type="button" class="grab" aria-label="Show photos and jobs"></button>' + h.replace('<div class="card', (more ? '<p class="swipe">Swipe up for photos and jobs</p>' : '') + '<div class="card');
      sheet.classList.add('on'); sheet.classList.remove('up'); sheet.scrollTop = 0;
      sheet.querySelector('.grab').onclick = function () { sheet.classList.toggle('up'); };
    } else panel.innerHTML = h;
    var panelEl = box;
    panelEl.querySelector('.x').onclick = clearSel;
    panelEl.querySelectorAll('[data-photo]').forEach(function (b) { b.onclick = function () { openLb(API + '/api/map/photo/' + b.getAttribute('data-photo'), b.querySelector('img').alt); }; });
  }
  function openLb(src, alt) { var img = lb.querySelector('img'); img.src = src; img.alt = alt; lb.classList.add('on'); lb.querySelector('button').focus(); }
  function closeLb() { lb.classList.remove('on'); }
  lb.querySelector('button').onclick = closeLb;
  lb.onclick = function (e) { if (e.target === lb) closeLb(); };

  fetch(API + '/api/map/data').then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(function (d) {
    if (d.workshop) state.shop = [d.workshop.lat, d.workshop.lng];
    var items = d.pins.map(function (p) { return Object.assign({ wall: false }, p); })
      .concat(d.wall.map(function (w) { return { wall: true, town: w.town, region: w.region, lat: w.lat, lng: w.lng, year: w.year, jobs: [], photos: [], routeId: w.routeId || null, miles: w.miles == null ? null : w.miles, minutes: w.minutes == null ? null : w.minutes, crossing: !!w.crossing, flewOut: !!w.flewOut }; }));
    state.data = { items: items };
    renderControls(); draw(); renderPanel();
  }).catch(function () {
    panel.innerHTML = '<p class="cm-empty">The map couldn’t load just now. Please try again in a minute.</p>';
  });
})();
