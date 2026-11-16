/* Pancake'Z · app.js
   Part 1  CafeLogic: opening hours and every text. Pure, no DOM (tested in Node).
   Part 2  The page: language, live status, menu filter, floating bar.
   Nothing is stored and nothing is sent anywhere. */

var CafeLogic = (function () {
  "use strict";

  var TZ = "Europe/Copenhagen";
  // Opening hours in minutes after midnight, index 0 is Sunday. From the café's Wolt page.
  var HOURS = [[900, 1320], [900, 1320], [900, 1320], [900, 1320], [900, 1320], [840, 1380], [840, 1380]];
  var LOCALE = { da: "da-DK", en: "en-GB" };

  // Every text on the page in both languages. Keys match data-i18n in index.html.
  var TEXT = {
    da: {
      title: "Pancake'Z Café · Pandekager, vafler og desserter i Slagelse",
      skip: "Spring til indhold", home: "Pancake'Z, til toppen", navLabel: "Sektioner", langLabel: "Sprog", catLabel: "Kategori",
      order: "Bestil på Wolt", orderShort: "Bestil", seeMenu: "Se menuen",
      eyebrow: "Café · Rosengade 11B · Slagelse",
      h1a: "Pandekager,", h1b: "vafler og", h1c: "desserter.",
      lede: "Når livet byder på hygge, har vi desserten klar.",
      fromMenu: "Fra menuen", woltPrices: "Priser fra Wolt.",
      s1: "Menu", s2: "I caféen", s3: "Besøg os",
      m_pancake: "Pandekager", m_waffle: "Vafler", m_crepe: "Crepes", m_churros: "Churros", m_cookie: "Cookie dough", m_cheese: "Cheesecake",
      menuSub: "Et udvalg fra menukortet. Priserne er fra Wolt.",
      c_all: "Alle", g_build: "Byg selv", g_dessert: "Desserter", g_cake: "Kager", g_drink: "Drikke",
      h_build: "Du sammensætter selv.",
      h_drink: "Flere drikke på Wolt: milkshakes, saft, varme drikke og mælkedrikke.",
      i_fluffy: "Fluffy pancake", i_mini: "Mini pandekager", i_waffle: "Belgisk vaffel", i_crepe: "Crepe",
      i_churros: "Churros", i_oreo: "Oreo Love", i_choco: "Choco Loco", i_cookie: "Triple chocolate cookie dough", i_soft: "Softice med drys",
      i_cheese: "Dagens cheesecake", i_cake: "Dagens kage",
      i_cappu: "Cappuccino", s_cappu: "0,24 l", i_iced: "Iskaffe", s_iced: "0,4 l", i_cloudy: "Cloudy Mint", s_cloudy: "0,4 l", i_water: "Kildevand", s_water: "0,5 l",
      orderText: "Få det leveret med Wolt.",
      photo: "Her kommer jeres billede", photoNote: "Billeder fra caféens egen Instagram kan sættes ind her.",
      hoursTitle: "Åbningstider", woltHours: "Åbningstider fra Wolt.", todayTag: "I dag",
      route: "Find vej", ring: "Ring",
      mapTitle: "Kort over Rosengade 11B i Slagelse", mapNote: "Midt i Slagelse.",
      cookies: "Siden bruger ingen cookies og gemmer ingen oplysninger.",
      openNow: "Åbent nu", closedNow: "Lukket",
      closes: "lukker kl. {t}", opens: "åbner {when} kl. {t}",
      openLine: "Lige nu har vi åbent.", closesLine: "Vi lukker kl. {t}.",
      closedLine: "Lige nu har vi lukket.", opensLine: "Vi åbner {when} kl. {t}.",
      today: "i dag", tomorrow: "i morgen", onDay: "{d}"
    },
    en: {
      title: "Pancake'Z Café · Pancakes, waffles and desserts in Slagelse",
      skip: "Skip to content", home: "Pancake'Z, back to top", navLabel: "Sections", langLabel: "Language", catLabel: "Category",
      order: "Order on Wolt", orderShort: "Order", seeMenu: "See the menu",
      eyebrow: "Café · Rosengade 11B · Slagelse",
      h1a: "Pancakes,", h1b: "waffles and", h1c: "desserts.",
      lede: "When life calls for something cosy, the dessert is ready.",
      fromMenu: "From the menu", woltPrices: "Prices from Wolt.",
      s1: "Menu", s2: "In the café", s3: "Visit us",
      m_pancake: "Pancakes", m_waffle: "Waffles", m_crepe: "Crêpes", m_churros: "Churros", m_cookie: "Cookie dough", m_cheese: "Cheesecake",
      menuSub: "A selection from the menu. Prices are from Wolt.",
      c_all: "All", g_build: "Build your own", g_dessert: "Desserts", g_cake: "Cakes", g_drink: "Drinks",
      h_build: "You put it together yourself.",
      h_drink: "More drinks on Wolt: milkshakes, squash, hot drinks and milk drinks.",
      i_fluffy: "Fluffy pancake", i_mini: "Mini pancakes", i_waffle: "Belgian waffle", i_crepe: "Crêpe",
      i_churros: "Churros", i_oreo: "Oreo Love", i_choco: "Choco Loco", i_cookie: "Triple chocolate cookie dough", i_soft: "Soft ice cream with sprinkles",
      i_cheese: "Cheesecake of the day", i_cake: "Cake of the day",
      i_cappu: "Cappuccino", s_cappu: "0.24 l", i_iced: "Iced coffee", s_iced: "0.4 l", i_cloudy: "Cloudy Mint", s_cloudy: "0.4 l", i_water: "Spring water", s_water: "0.5 l",
      orderText: "Get it delivered with Wolt.",
      photo: "Your photo goes here", photoNote: "Photos from the café’s own Instagram can go here.",
      hoursTitle: "Opening hours", woltHours: "Opening hours from Wolt.", todayTag: "Today",
      route: "Get directions", ring: "Call",
      mapTitle: "Map of Rosengade 11B in Slagelse", mapNote: "In the centre of Slagelse.",
      cookies: "This site uses no cookies and stores no information.",
      openNow: "Open now", closedNow: "Closed",
      closes: "closes at {t}", opens: "opens {when} at {t}",
      openLine: "We are open right now.", closesLine: "We close at {t}.",
      closedLine: "We are closed right now.", opensLine: "We open {when} at {t}.",
      today: "today", tomorrow: "tomorrow", onDay: "on {d}"
    }
  };

  function fill(text, values) { return text.replace(/\{(\w+)\}/g, function (all, key) { return values[key]; }); }
  function two(n) { return (n < 10 ? "0" : "") + n; }

  // A calendar day as plain numbers. dow 0 is Sunday.
  function day(y, m, d, mins) {
    var utc = new Date(Date.UTC(y, m - 1, d));
    return { y: utc.getUTCFullYear(), m: utc.getUTCMonth() + 1, d: utc.getUTCDate(), dow: utc.getUTCDay(), mins: mins || 0 };
  }

  // The wall clock in Copenhagen for any Date, wherever the visitor is.
  var clockParts;
  function wallClock(date) {
    clockParts = clockParts || new Intl.DateTimeFormat("en-GB", {
      timeZone: TZ, hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric"
    });
    var p = {};
    clockParts.formatToParts(date).forEach(function (part) { p[part.type] = parseInt(part.value, 10); });
    return day(p.year, p.month, p.day, (p.hour % 24) * 60 + p.minute);
  }

  // Open or closed at a wall-clock time, and when that changes next.
  function status(wall) {
    var now = HOURS[wall.dow];
    if (now && wall.mins >= now[0] && wall.mins < now[1]) return { open: true, at: now[1], inDays: 0, dow: wall.dow };
    for (var i = 0; i < 8; i++) {
      var dow = (wall.dow + i) % 7, hours = HOURS[dow];
      if (hours && (i > 0 || wall.mins < hours[0])) return { open: false, at: hours[0], inDays: i, dow: dow };
    }
  }

  // 1320 becomes "22.00" in Danish and "22:00" in English.
  function clock(mins, lang) { return two(Math.floor(mins / 60)) + (lang === "en" ? ":" : ".") + two(mins % 60); }

  function weekday(dow, lang) {
    return new Intl.DateTimeFormat(LOCALE[lang], { weekday: "long", timeZone: "UTC" }).format(new Date(Date.UTC(2026, 0, 4 + dow))); // 4 Jan 2026 is a Sunday
  }

  // The status in words: a short label, what happens next, and two full sentences.
  function statusText(st, lang) {
    var T = TEXT[lang], t = clock(st.at, lang);
    if (st.open) return { label: T.openNow, next: fill(T.closes, { t: t }), line1: T.openLine, line2: fill(T.closesLine, { t: t }) };
    var name = weekday(st.dow, lang);
    var soon = st.inDays === 0 ? T.today : st.inDays === 1 ? T.tomorrow : "";
    return {
      label: T.closedNow,
      next: fill(T.opens, { when: soon || name, t: t }),
      line1: T.closedLine,
      line2: fill(T.opensLine, { when: soon || fill(T.onDay, { d: name }), t: t })
    };
  }

  return { TZ: TZ, HOURS: HOURS, TEXT: TEXT, fill: fill, day: day, wallClock: wallClock, status: status, statusText: statusText, clock: clock, weekday: weekday };
})();

if (typeof module !== "undefined" && module.exports) module.exports = CafeLogic;

/* ------------------------------------------------------------------ the page */

if (typeof document !== "undefined") (function () {
  "use strict";

  const L = CafeLogic, root = document.documentElement;
  let lang = "da";
  root.classList.add("js");   // set before the first paint, so nothing flashes

  const $ = (sel, from) => (from || document).querySelector(sel);
  const $$ = (sel, from) => Array.from((from || document).querySelectorAll(sel));
  const t = (key, values) => L.fill(L.TEXT[lang][key], values || {});

  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  /* ---------- Language. Not stored: a reload starts in Danish again. ---------- */

  function setLang(next) {
    lang = next;
    root.lang = lang;
    document.title = t("title");
    $$("[data-i18n]").forEach(node => { node.textContent = t(node.dataset.i18n); });
    // data-i18n-attr="aria-label:key" translates an attribute instead of the text.
    $$("[data-i18n-attr]").forEach(node => node.dataset.i18nAttr.split(";").forEach(pair => {
      const bits = pair.split(":");
      node.setAttribute(bits[0], t(bits[1]));
    }));
    $$(".lang__btn").forEach(btn => btn.setAttribute("aria-pressed", String(btn.dataset.lang === lang)));
    renderStatus();
  }

  /* ---------- Live open status: Copenhagen time, refreshed every 30 seconds ---------- */

  function renderStatus() {
    const wall = L.wallClock(new Date()), st = L.status(wall), words = L.statusText(st, lang);
    const put = (key, text) => $$('[data-st="' + key + '"]').forEach(node => { node.textContent = text; });
    root.dataset.open = st.open;               // colours the status dots (see .dot in style.css)
    put("pill", words.label + " · " + words.next);
    put("label", words.label);
    put("next", words.next);
    put("line1", words.line1);
    put("line2", words.line2);
    $$("[data-status]").forEach(node => { node.hidden = false; });

    // Opening hours list: names and times in the current language, today highlighted.
    $$("#hours [data-dow]").forEach(row => {
      const dow = +row.dataset.dow, hours = L.HOURS[dow], name = L.weekday(dow, lang);
      const isToday = dow === wall.dow;
      row.firstElementChild.textContent = name.charAt(0).toUpperCase() + name.slice(1);
      if (isToday) row.firstElementChild.append(el("span", "caps hours__tag", t("todayTag")));
      row.lastElementChild.textContent = L.clock(hours[0], lang) + "–" + L.clock(hours[1], lang);
      row.classList.toggle("is-today", isToday);
    });
  }

  /* ---------- Menu: filter by category. Without JavaScript every group is shown. ---------- */

  function initMenu() {
    const chips = $$(".chip"), groups = $$(".group");
    chips.forEach(chip => chip.addEventListener("click", () => {
      chips.forEach(other => other.setAttribute("aria-pressed", String(other === chip)));
      groups.forEach(group => { group.hidden = chip.dataset.cat !== "all" && group.dataset.group !== chip.dataset.cat; });
    }));
  }

  /* ---------- Reveal on scroll, only for what starts below the fold ---------- */

  function initReveal() {
    if (!("IntersectionObserver" in window)) return;
    const seen = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove("pre");
      seen.unobserve(entry.target);
    }), { rootMargin: "0px 0px -8% 0px", threshold: .08 });
    $$("[data-reveal]").forEach(node => {
      if (node.getBoundingClientRect().top < window.innerHeight * .9) return;
      node.classList.add("pre");
      seen.observe(node);
    });
  }

  /* ---------- Floating bar: slides in when the hero buttons are out of view, hides at the footer ---------- */

  function initBar() {
    if (!("IntersectionObserver" in window)) return;
    let pastHero = false, atFoot = false;
    const update = () => $("#bar").classList.toggle("is-on", pastHero && !atFoot);
    new IntersectionObserver(entries => {
      pastHero = !entries[0].isIntersecting && entries[0].boundingClientRect.top < 0;
      update();
    }).observe($(".hero__cta"));
    new IntersectionObserver(entries => { atFoot = entries[0].isIntersecting; update(); }, { threshold: .2 }).observe($(".foot"));
  }

  /* ---------- Start ---------- */

  document.addEventListener("DOMContentLoaded", () => {
    $$(".lang__btn").forEach(btn => btn.addEventListener("click", () => setLang(btn.dataset.lang)));
    initMenu();
    initReveal();
    initBar();
    renderStatus();
    // The entrance starts when the display font has arrived (never wait more than 1.5 seconds).
    const go = () => root.classList.add("is-ready");
    if (document.fonts && document.fonts.load) {
      Promise.race([document.fonts.load("1em Fraunces"), new Promise(done => setTimeout(done, 1500))]).then(go, go);
    } else go();
    setInterval(renderStatus, 30000);
    document.addEventListener("visibilitychange", () => { if (!document.hidden) renderStatus(); });
  });
})();
