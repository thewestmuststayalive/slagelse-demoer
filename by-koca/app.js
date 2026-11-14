/* by Koca · app.js
   Part 1  KocaLogic: opening hours, booking times and every text. Pure, no DOM (tested in Node).
   Part 2  The page: language, live status, accordion, before/after slider, booking sheet.
   Nothing is stored and nothing is sent anywhere. */

var KocaLogic = (function () {
  "use strict";

  var TZ = "Europe/Copenhagen";
  var PHONE = "+4571681348";
  var ADDRESS = "Jernbanegade 7A, 4200 Slagelse";
  // Opening hours in minutes after midnight. Index 0 is Sunday; null means closed.
  var HOURS = [null, null, [600, 1020], [600, 1020], [600, 1020], [600, 1020], [600, 840]];
  var SLOT = 30;  // minutes between bookable times; the last one is SLOT before closing
  var LEAD = 60;  // today, a time must be at least this many minutes away
  var VISIT = 60; // minutes blocked in the calendar entry
  var TREATMENTS = ["dameklip", "herreklip", "farve", "balayage", "permanent", "kur"];
  var LOCALE = { da: "da-DK", en: "en-GB" };

  // Every text on the page in both languages. The keys match data-i18n in index.html.
  var TEXT = {
    da: {
      title: "Hair Academy Slagelse by Koca · Frisør i Slagelse",
      skip: "Spring til indhold", home: "by Koca, til toppen", navLabel: "Sektioner", langLabel: "Sprog",
      book: "Book tid", badge: "BOOK TID · BOOK TID · BOOK TID · ",
      lede1: "Klip, farve og balayage", lede2: "med international erfaring.",
      call: "Ring 71 68 13 48",
      s1: "Behandlinger", s2: "Før & efter", s3: "Salonen", s4: "Besøg os",
      t_dameklip: "Dameklip", d_dameklip: "Klip og styling, tilpasset dit hår og din stil.",
      t_herreklip: "Herreklip", d_herreklip: "Klassisk eller moderne. Skarpt og præcist.",
      t_farve: "Farve", d_farve: "Helfarve, toning og dækning af grå hår.",
      t_balayage: "Balayage", d_balayage: "Bløde, naturlige overgange med lys og glød.",
      t_permanent: "Permanent", d_permanent: "Fylde og krøller, der holder.",
      t_kur: "Hårkur & styling", d_kur: "Pleje til tørt eller behandlet hår, og styling til fest.",
      bookThis: "Book denne",
      pricesTitle: "Prisliste", p_herre: "Herreklip", p_skaeg: "Skægklip", p_herreSkaeg: "Herreklip + skægklip",
      p_dame: "Dameklip", p_permFarve: "Permanent, krøller og farvning", askPrice: "Spørg for pris",
      before: "Før", after: "Efter", compareLabel: "Sammenlign før og efter",
      compareValue: "{a} % før, {b} % efter",
      compareNote: "Eksempel på funktionen. Her kommer jeres egne før- og efterbilleder.",
      quote1: "Godt håndværk.", quote2: "Og at du går glad herfra.",
      credit: "Foto: by Koca", altWall: "Salonen med BY KOCA malet i rødt på væggen",
      altTools: "Sakse og føntørrer ved arbejdspladsen", altProducts: "Væg med hårplejeprodukter fra L'Oréal",
      about: "Hair Academy Slagelse by Koca ligger på Jernbanegade, få minutters gang fra stationen. Bag stolen står en frisør med erfaring fra hele verden.",
      fact1: "tirs–fre", fact2: "lørdag", google: "Topkarakter på Google",
      hoursTitle: "Åbningstider", closed: "Lukket", todayTag: "I dag",
      mapTitle: "Kort over Jernbanegade 7A i Slagelse",
      walk: "Få minutters gang fra Slagelse station.",
      route: "Find vej", ring: "Ring", text: "SMS",
      cookies: "Siden bruger ingen cookies og gemmer ingen oplysninger.",
      // Live status
      openNow: "Åbent nu", closedNow: "Lukket",
      closes: "lukker kl. {t}", opens: "åbner {when} kl. {t}",
      openLine: "Lige nu har vi åbent.", closesLine: "Vi lukker kl. {t}.",
      closedLine: "Lige nu har vi lukket.", opensLine: "Vi åbner {when} kl. {t}.",
      today: "i dag", tomorrow: "i morgen", onDay: "{d}",
      // Booking sheet
      step: "Trin {n} af 3", stepDone: "Klar til at sende",
      title1: "Vælg behandling", title2: "Vælg dag", title3: "Vælg tidspunkt", title4: "Din forespørgsel",
      dayHint: "Salonen har lukket mandag og søndag.",
      back: "Tilbage", close: "Luk", next: "Næste",
      at: "kl. {t}", date: "{w} den {d}. {m}",
      smsLabel: "SMS til salonen",
      sendSms: "Send på SMS", callInstead: "Ring i stedet", addCal: "Tilføj til kalender",
      fine: "Salonen bekræfter tiden på SMS. Siden gemmer ingen oplysninger om dig.",
      sms: "Hej Koca. Jeg vil gerne booke {what} {date} kl. {time}. Mvh ",
      icsSummary: "Frisør: {what} hos by Koca (afventer bekræftelse)",
      icsNote: "Forespørgsel sendt på SMS. Tiden gælder først, når salonen har bekræftet den. Telefon 71 68 13 48."
    },
    en: {
      title: "Hair Academy Slagelse by Koca · Hairdresser in Slagelse",
      skip: "Skip to content", home: "by Koca, back to top", navLabel: "Sections", langLabel: "Language",
      book: "Book now", badge: "BOOK NOW · BOOK NOW · BOOK NOW · ",
      lede1: "Cuts, colour and balayage", lede2: "with international experience.",
      call: "Call 71 68 13 48",
      s1: "Treatments", s2: "Before & after", s3: "The salon", s4: "Visit us",
      t_dameklip: "Ladies’ cut", d_dameklip: "Cut and styling, tailored to your hair and your style.",
      t_herreklip: "Men’s cut", d_herreklip: "Classic or modern. Sharp and precise.",
      t_farve: "Colour", d_farve: "Full colour, toning and grey coverage.",
      t_balayage: "Balayage", d_balayage: "Soft, natural transitions with light and glow.",
      t_permanent: "Perm", d_permanent: "Volume and curls that last.",
      t_kur: "Hair treatment & styling", d_kur: "Care for dry or treated hair, and styling for special occasions.",
      bookThis: "Book this",
      pricesTitle: "Prices", p_herre: "Men’s cut", p_skaeg: "Beard trim", p_herreSkaeg: "Men’s cut + beard trim",
      p_dame: "Ladies’ cut", p_permFarve: "Perm, curls and colour", askPrice: "Ask for a price",
      before: "Before", after: "After", compareLabel: "Compare before and after",
      compareValue: "{a}% before, {b}% after",
      compareNote: "An example of the feature. Your own before and after photos go here.",
      quote1: "Good craftsmanship.", quote2: "And that you leave happy.",
      credit: "Photo: by Koca", altWall: "The salon, with BY KOCA painted in red on the wall",
      altTools: "Scissors and a hairdryer at the workstation", altProducts: "Wall of L’Oréal hair care products",
      about: "Hair Academy Slagelse by Koca is on Jernbanegade, a few minutes’ walk from the station. Behind the chair is a hairdresser with experience from around the world.",
      fact1: "Tue–Fri", fact2: "Saturday", google: "Top rating on Google",
      hoursTitle: "Opening hours", closed: "Closed", todayTag: "Today",
      mapTitle: "Map of Jernbanegade 7A in Slagelse",
      walk: "A few minutes’ walk from Slagelse station.",
      route: "Get directions", ring: "Call", text: "Text",
      cookies: "This site uses no cookies and stores no information.",
      openNow: "Open now", closedNow: "Closed",
      closes: "closes at {t}", opens: "opens {when} at {t}",
      openLine: "We are open right now.", closesLine: "We close at {t}.",
      closedLine: "We are closed right now.", opensLine: "We open {when} at {t}.",
      today: "today", tomorrow: "tomorrow", onDay: "on {d}",
      step: "Step {n} of 3", stepDone: "Ready to send",
      title1: "Choose a treatment", title2: "Choose a day", title3: "Choose a time", title4: "Your request",
      dayHint: "The salon is closed on Mondays and Sundays.",
      back: "Back", close: "Close", next: "Next",
      at: "at {t}", date: "{w} {d} {m}",
      smsLabel: "Text to the salon",
      sendSms: "Send by text", callInstead: "Call instead", addCal: "Add to calendar",
      fine: "The salon confirms the time by text. This site stores no information about you.",
      sms: "Hello Koca. I would like to book {what} on {date} at {time}. Regards, ",
      smsName: { dameklip: "a ladies' cut", herreklip: "a men's cut", farve: "a colour", balayage: "a balayage", permanent: "a perm", kur: "a hair treatment and styling" },
      icsSummary: "Hairdresser: {what} at by Koca (awaiting confirmation)",
      icsNote: "Request sent by text. The time only applies once the salon has confirmed it. Phone +45 71 68 13 48."
    }
  };

  // "Hi {name}" + { name: "Koca" } becomes "Hi Koca".
  function fill(text, values) {
    return text.replace(/\{(\w+)\}/g, function (all, key) { return values[key]; });
  }

  function two(n) { return (n < 10 ? "0" : "") + n; }

  // A calendar day as plain numbers. Overflow is fine: day(2026, 11, 31) is 1 December. dow 0 is Sunday.
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

  // Open or closed at a Copenhagen wall-clock time, and when that changes next.
  function status(wall) {
    var now = HOURS[wall.dow];
    if (now && wall.mins >= now[0] && wall.mins < now[1]) return { open: true, at: now[1], inDays: 0, dow: wall.dow };
    for (var i = 0; i < 8; i++) {
      var dow = (wall.dow + i) % 7, hours = HOURS[dow];
      if (hours && (i > 0 || wall.mins < hours[0])) return { open: false, at: hours[0], inDays: i, dow: dow };
    }
  }

  // 1020 becomes "17.00" in Danish and "17:00" in English.
  function clock(mins, lang) {
    return two(Math.floor(mins / 60)) + (lang === "en" ? ":" : ".") + two(mins % 60);
  }

  // One part of a date in words through Intl, e.g. part(d, "da", "weekday", "long") is "tirsdag".
  var formats = {};
  function part(d, lang, field, style) {
    var key = lang + field + style, options = { timeZone: "UTC" };
    options[field] = style;
    formats[key] = formats[key] || new Intl.DateTimeFormat(LOCALE[lang], options);
    return formats[key].format(new Date(Date.UTC(d.y, d.m - 1, d.d))).replace(".", "");
  }
  function weekday(dow, lang) { return part(day(2026, 1, 4 + dow), lang, "weekday", "long"); } // 4 January 2026 is a Sunday

  // "tirsdag den 17. november" or "Tuesday 17 November".
  function dateText(d, lang) {
    return fill(TEXT[lang].date, { w: part(d, lang, "weekday", "long"), d: d.d, m: part(d, lang, "month", "long") });
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

  // Bookable times for a day: every half hour from opening until half an hour before closing.
  // For today, only times at least LEAD minutes from now.
  function slots(d, wall) {
    var hours = HOURS[d.dow], list = [];
    if (!hours) return list;
    var isToday = d.y === wall.y && d.m === wall.m && d.d === wall.d;
    for (var t = hours[0]; t <= hours[1] - SLOT; t += SLOT) {
      if (!isToday || t >= wall.mins + LEAD) list.push(t);
    }
    return list;
  }

  // The next `count` days that still have a bookable time, starting with today.
  function days(wall, count) {
    var list = [];
    for (var i = 0; list.length < count && i < 60; i++) {
      var d = day(wall.y, wall.m, wall.d + i);
      if (slots(d, wall).length) list.push(d);
    }
    return list;
  }

  // The ready-made SMS. It ends with "Mvh " so the visitor only has to add a name.
  // A booking is { treatment: "dameklip", day: {y, m, d}, time: 600 }.
  function smsText(b, lang) {
    var T = TEXT[lang];
    return fill(T.sms, {
      what: T.smsName ? T.smsName[b.treatment] : T["t_" + b.treatment].toLowerCase(),
      date: dateText(b.day, lang),
      time: clock(b.time, lang)
    });
  }
  function smsHref(b, lang) {
    return "sms:" + PHONE + "?&body=" + encodeURIComponent(smsText(b, lang));
  }

  // Calendar file (iCalendar). Times are "floating": no Z and no time zone, so 10.00 stays 10.00.
  function icsText(b, lang, now) {
    var T = TEXT[lang];
    var date = "" + b.day.y + two(b.day.m) + two(b.day.d);
    var time = function (mins) { return date + "T" + two(Math.floor(mins / 60)) + two(mins % 60) + "00"; };
    var escape = function (s) { return s.replace(/\\/g, "\\\\").replace(/([,;])/g, "\\$1"); };
    // Lines longer than 75 bytes are folded onto a new line that starts with a space.
    var fold = function (line) {
      var out = "", bytes = 0;
      for (var i = 0; i < line.length; i++) {
        var size = line.charCodeAt(i) < 128 ? 1 : line.charCodeAt(i) < 2048 ? 2 : 3;
        if (bytes + size > 75) { out += "\r\n "; bytes = 1; }
        out += line.charAt(i);
        bytes += size;
      }
      return out;
    };
    return [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//by Koca//Booking request//" + lang.toUpperCase(),
      "BEGIN:VEVENT",
      "UID:" + time(b.time) + "-" + now.getTime() + "@by-koca",
      "DTSTAMP:" + now.toISOString().replace(/[-:]|\.\d+/g, ""),
      "DTSTART:" + time(b.time),
      "DTEND:" + time(b.time + VISIT),
      "SUMMARY:" + escape(fill(T.icsSummary, { what: T["t_" + b.treatment] })),
      "LOCATION:" + escape(ADDRESS),
      "DESCRIPTION:" + escape(T.icsNote),
      "END:VEVENT",
      "END:VCALENDAR"
    ].map(fold).join("\r\n") + "\r\n";
  }
  function icsHref(b, lang, now) {
    return "data:text/calendar;charset=utf-8," + encodeURIComponent(icsText(b, lang, now));
  }

  return {
    TZ: TZ, PHONE: PHONE, ADDRESS: ADDRESS, HOURS: HOURS, TREATMENTS: TREATMENTS, TEXT: TEXT,
    fill: fill, day: day, wallClock: wallClock, status: status, statusText: statusText, clock: clock,
    part: part, weekday: weekday, dateText: dateText, slots: slots, days: days,
    smsText: smsText, smsHref: smsHref, icsText: icsText, icsHref: icsHref
  };
})();

if (typeof module !== "undefined" && module.exports) module.exports = KocaLogic;

/* ------------------------------------------------------------------ the page */

if (typeof document !== "undefined") (function () {
  "use strict";

  const L = KocaLogic, root = document.documentElement;
  const still = window.matchMedia("(prefers-reduced-motion: reduce)");
  let lang = "da";

  // The script is loaded in the head, so this class is set before the first paint and nothing flashes.
  root.classList.add("js");

  const $ = (sel, from) => (from || document).querySelector(sel);
  const $$ = (sel, from) => Array.from((from || document).querySelectorAll(sel));
  const t = (key, values) => L.fill(L.TEXT[lang][key], values || {});
  const now = () => L.wallClock(new Date());
  const same = (a, b) => !!a && !!b && a.y === b.y && a.m === b.m && a.d === b.d;

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
    renderSheet();
    showCompare();
  }

  /* ---------- Live open status: Copenhagen time, refreshed every 30 seconds ---------- */

  function renderStatus() {
    const wall = now(), words = L.statusText(L.status(wall), lang);
    const put = (key, text) => $$('[data-st="' + key + '"]').forEach(node => { node.textContent = text; });
    root.dataset.open = L.status(wall).open;   // colours the status dots (see .dot in style.css)
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
      row.lastElementChild.textContent = hours ? L.clock(hours[0], lang) + "–" + L.clock(hours[1], lang) : t("closed");
      row.classList.toggle("is-today", isToday);
    });
  }

  /* ---------- Hero: the entrance starts when the display font has arrived ---------- */

  function initHero() {
    const start = () => { root.classList.add("is-ready"); fitWordmark(); };
    const fonts = document.fonts;
    window.addEventListener("resize", fitWordmark);
    if (!fonts || !fonts.load) return start();
    fonts.addEventListener("loadingdone", fitWordmark);
    Promise.race([
      Promise.all([fonts.load('1em "Bodoni Moda"'), fonts.load('italic 500 1em "Bodoni Moda"')]),
      new Promise(done => setTimeout(done, 1500))   // never wait long for a slow connection
    ]).then(start, start);
  }

  // A fallback serif is wider than Bodoni Moda: shrink the wordmark if it does not fit.
  function fitWordmark() {
    const word = $(".hero__koca"), title = word.parentNode;
    title.style.setProperty("--fit", 1);
    if (word.scrollWidth > word.clientWidth) title.style.setProperty("--fit", (word.clientWidth / word.scrollWidth).toFixed(3));
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

  /* ---------- Treatments accordion: one row open at a time ---------- */

  function initAccordion() {
    const rows = $$(".acc__row");
    const set = (row, open) => {
      row.classList.toggle("is-open", open);
      $(".acc__btn", row).setAttribute("aria-expanded", String(open));
    };
    rows.forEach((row, i) => {
      set(row, i === 0);
      $(".acc__btn", row).addEventListener("click", () => {
        const open = !row.classList.contains("is-open");
        rows.forEach(other => set(other, other === row && open));
      });
    });
  }

  /* ---------- Before / after slider ----------
     There are no photos yet, so the same 90 hair strands are drawn twice:
     flat brown ("before") and with a balayage gradient ("after"). */

  // Small seeded random generator (mulberry32), so the drawing is the same on every visit.
  function seeded(a) {
    return () => {
      a = a + 0x6D2B79F5 | 0;
      let n = Math.imul(a ^ a >>> 15, 1 | a);
      n = n + Math.imul(n ^ n >>> 7, 61 | n) ^ n;
      return ((n ^ n >>> 14) >>> 0) / 4294967296;
    };
  }

  // Strands hang in nine locks. A lock shares one wave; each strand adds a little of its own.
  function hairStrands() {
    const rnd = seeded(7), locks = [], strands = [];
    for (let l = 0; l < 9; l++) {
      locks.push({ lean: (rnd() - .5) * 44, amp: 8 + rnd() * 11, freq: 4.2 + rnd() * 1.6, phase: l * .55 + rnd() * .6 });
    }
    for (let i = 0; i < 90; i++) {
      const u = (i + rnd() * .8) / 90, lock = locks[Math.min(8, Math.floor(u * 9))];
      const across = u * 9 % 1 - .5;                      // -0.5 to 0.5: where in the lock
      const thin = i % 3 === 2, own = rnd() * 6.28, wobble = 2 + rnd() * 5;
      let d = "", px = 0, py = 0;
      for (let k = 0; k <= 10; k++) {
        const v = k / 10, y = -30 + v * 560;
        const x = -24 + u * 448 - across * 24 * v           // strands gather towards the tip
          + lock.lean * v + Math.sin(v * lock.freq + lock.phase) * lock.amp * (.15 + v)
          + Math.sin(v * 7 + own) * wobble * v;
        // Smooth curve: each point is a control point, the curve passes through the midpoints.
        d += k ? " Q" + px.toFixed(1) + " " + py + " " + ((px + x) / 2).toFixed(1) + " " + (py + y) / 2 : "M" + x.toFixed(1) + " " + y;
        px = x; py = y;
      }
      strands.push({
        d: d,
        width: thin ? .8 + rnd() * 1.3 : 5 + rnd() * 5,
        opacity: thin ? .35 + rnd() * .4 : .78 + rnd() * .22,
        tone: thin ? 2 : Math.abs(across) < .17 ? 2 : Math.abs(across) < .36 ? 1 : 0   // 0 shadow, 2 light
      });
    }
    return strands.sort((a, b) => b.width - a.width);       // fine strands on top
  }

  function hairSvg(strands, after) {
    const browns = ["#23170f", "#2f2016", "#3c2a1c"];
    const stops = [   // roots to ends: lowlight, base, highlight
      ["#1b120c", "#33221a 40%", "#6b4a29 68%", "#a87d45"],
      ["#20150e", "#3a2718 28%", "#7b552d 50%", "#b98a48 72%", "#e3c88c"],
      ["#2a1c13", "#5a3d22 22%", "#b0803f 45%", "#dcb872 68%", "#f4e6bf"]
    ];
    const defs = stops.map((list, i) => '<linearGradient id="hair' + i + '" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="500">' +
      list.map(stop => { const s = stop.split(" "); return '<stop offset="' + (s[1] || (stop === list[0] ? "0%" : "100%")) + '" stop-color="' + s[0] + '"/>'; }).join("") +
      "</linearGradient>").join("");
    return '<svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" focusable="false">' +
      (after ? "<defs>" + defs + "</defs>" : "") +
      '<rect width="400" height="500" fill="#130c08"/><g fill="none" stroke-linecap="round">' +
      strands.map(s => '<path d="' + s.d + '" stroke="' + (after ? "url(#hair" + s.tone + ")" : browns[s.tone]) +
        '" stroke-width="' + s.width.toFixed(1) + '" opacity="' + s.opacity.toFixed(2) + '"/>').join("") +
      "</g></svg>";
  }

  let compare, range;
  function showCompare() {
    if (!compare) return;
    const v = +range.value;
    compare.style.setProperty("--v", v / 100);
    range.setAttribute("aria-valuetext", t("compareValue", { a: Math.round(v), b: Math.round(100 - v) }));
  }

  function initCompare() {
    compare = $("#compare");
    range = $(".compare__range", compare);
    const strands = hairStrands();
    let touched = false, drag = null;
    $(".compare__before", compare).innerHTML = hairSvg(strands, false);
    $(".compare__after", compare).innerHTML = hairSvg(strands, true);

    range.addEventListener("input", showCompare);
    // Arrow keys move in clear steps (the range itself is fine-grained for smooth dragging).
    range.addEventListener("keydown", e => {
      const step = { ArrowLeft: -5, ArrowDown: -5, ArrowRight: 5, ArrowUp: 5 }[e.key];
      touched = true;
      if (!step) return;
      e.preventDefault();
      range.value = +range.value + step;
      showCompare();
    });

    // iOS only moves a native range when the touch starts on its thumb, so sideways drags anywhere
    // on the picture are handled here. Vertical drags still scroll the page (touch-action: pan-y).
    range.addEventListener("pointerdown", e => {
      touched = true;
      drag = e.pointerType === "mouse" ? null : { x: e.clientX, y: e.clientY, on: false };
    });
    range.addEventListener("pointermove", e => {
      if (!drag) return;
      const dx = Math.abs(e.clientX - drag.x), dy = Math.abs(e.clientY - drag.y);
      if (!drag.on && dx > 8 && dx > dy) drag.on = true;
      if (!drag.on) return;
      const box = compare.getBoundingClientRect(), grip = parseFloat(getComputedStyle(compare).getPropertyValue("--grip")) || 48;
      range.value = (e.clientX - box.left - grip / 2) / (box.width - grip) * 100;
      showCompare();
    });
    ["pointerup", "pointercancel"].forEach(type => range.addEventListener(type, () => { drag = null; }));
    showCompare();

    // Wiggle once when the slider first scrolls into view, to show that it moves.
    if (still.matches || !("IntersectionObserver" in window)) return;
    const seen = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      seen.disconnect();
      setTimeout(() => {
        const t0 = performance.now();
        (function frame(time) {
          const p = Math.min((time - t0) / 1700, 1);
          if (touched) return;                              // the visitor has taken over
          range.value = 50 + Math.sin(p * Math.PI * 2) * 15 * (1 - p);
          showCompare();
          if (p < 1) requestAnimationFrame(frame);
        })(t0);
      }, 500);
    }, { threshold: .6 });
    seen.observe(compare);
  }

  /* ---------- Floating bottom bar: slides in when the hero buttons are out of view ---------- */

  let pastHero = false, atFoot = false;
  function updateBar() {
    $("#bar").classList.toggle("is-on", pastHero && !atFoot && !sheet.classList.contains("is-open"));
  }
  function initBar() {
    if (!("IntersectionObserver" in window)) return;
    new IntersectionObserver(entries => {
      pastHero = !entries[0].isIntersecting && entries[0].boundingClientRect.top < 0;
      updateBar();
    }).observe($(".hero__cta"));
    new IntersectionObserver(entries => { atFoot = entries[0].isIntersecting; updateBar(); }, { threshold: .2 }).observe($(".foot"));
  }

  /* ---------- Booking request sheet ----------
     Three choices, then a ready-made SMS. No input fields; nothing leaves the browser. */

  const pick = { treatment: null, day: null, time: null };
  let sheet, step = 1, options = [], opener = null, advance = 0, closing = 0, quietUntil = 0;

  function initSheet() {
    sheet = $("#sheet");
    document.addEventListener("click", e => {
      const btn = e.target.closest("[data-book]");
      if (btn) openSheet(btn, btn.dataset.book);
    });
    $$("[data-close]", sheet).forEach(node => node.addEventListener("click", closeSheet));
    $("#sheet-back").addEventListener("click", () => step > 1 ? goTo(step - 1, true) : closeSheet());
    $("#sheet-next").addEventListener("click", () => goTo(step + 1));
    $("#sheet-body").addEventListener("click", e => {
      const btn = e.target.closest("[data-i]");
      if (btn && Date.now() > quietUntil) choose(+btn.dataset.i);
    });
    document.addEventListener("keydown", onSheetKey);
    // iOS: keep the page behind still. Only the sheet body may scroll, and only if it has to.
    sheet.addEventListener("touchmove", e => {
      const body = $("#sheet-body");
      if (!body.contains(e.target) || body.scrollHeight <= body.clientHeight) e.preventDefault();
    }, { passive: false });
  }

  function openSheet(from, treatment) {
    clearTimeout(closing);
    opener = from;
    if (treatment) pick.treatment = treatment;
    lockPage(true);
    sheet.hidden = false;
    sheet.getBoundingClientRect();              // flush styles so the slide-in runs
    sheet.classList.add("is-open");
    updateBar();
    goTo(treatment ? 2 : 1);                    // "Book denne" skips the treatment step
  }

  function closeSheet() {
    if (!sheet.classList.contains("is-open")) return;
    clearTimeout(advance);
    sheet.classList.remove("is-open");
    lockPage(false);
    updateBar();
    if (opener) opener.focus({ preventScroll: true });
    closing = setTimeout(() => { sheet.hidden = true; }, still.matches ? 0 : 450);
  }

  // The page behind must not scroll or jump, and must be out of reach for keyboard and screen reader.
  function lockPage(on) {
    const scrollbar = window.innerWidth - root.clientWidth;   // 0 on phones
    root.classList.toggle("is-locked", on);
    document.body.style.paddingRight = on && scrollbar ? scrollbar + "px" : "";
    $$("body > *").forEach(node => { if (node !== sheet) node.inert = on; });
  }

  function goTo(next, isBack) {
    clearTimeout(advance);
    // Drop choices that are no longer possible (the clock moves while the sheet is open).
    const wall = now();
    if (pick.day && !L.days(wall, 12).some(d => same(d, pick.day))) pick.day = null;
    if (!pick.day || L.slots(pick.day, wall).indexOf(pick.time) < 0) pick.time = null;
    // Never land on a step whose earlier choice is missing.
    if (next > 1 && !pick.treatment) next = 1;
    else if (next > 2 && !pick.day) next = 2;
    else if (next > 3 && pick.time == null) next = 3;
    step = next;
    sheet.dataset.dir = isBack ? "back" : "next";
    quietUntil = Date.now() + 350;              // ignore the tail of a double tap
    renderSheet();
    $("#sheet-body").scrollTop = 0;
    $("#sheet-title").focus({ preventScroll: true });
  }

  // A selectable button. data-i is its index in `options`.
  function option(i, on, cls, text) {
    const btn = el("button", cls, text);
    btn.type = "button";
    btn.dataset.i = i;
    btn.setAttribute("aria-pressed", String(on));
    return btn;
  }

  function link(cls, href, text) {
    const a = el("a", cls, text);
    a.href = href;
    return a;
  }

  function renderSheet() {
    if (!sheet || sheet.hidden) return;
    const wall = now(), view = el("div", "view"), nextBtn = $("#sheet-next");
    sheet.dataset.step = step;
    $("#sheet-count").textContent = step < 4 ? t("step", { n: step }) : t("stepDone");
    $("#sheet-title").textContent = t("title" + step);
    $("#sheet-back").textContent = t(step === 1 ? "close" : "back");
    nextBtn.textContent = t("next");
    nextBtn.hidden = step === 4;
    nextBtn.disabled = [pick.treatment, pick.day, pick.time][step - 1] == null;

    if (step === 1) {
      options = L.TREATMENTS;
      const list = el("div", "opts");
      options.forEach((id, i) => {
        const btn = option(i, id === pick.treatment, "opt");
        btn.append(el("span", "num", "0" + (i + 1)), el("span", "opt__name", t("t_" + id)), el("span", "opt__mark"));
        list.append(btn);
      });
      view.append(list);
    } else if (step === 2) {
      options = L.days(wall, 12);
      const grid = el("div", "cells");
      options.forEach((d, i) => {
        const btn = option(i, same(d, pick.day), "cell cell--day" + (same(d, wall) ? " is-today" : ""));
        btn.setAttribute("aria-label", L.dateText(d, lang) + (same(d, wall) ? ", " + t("today") : ""));
        btn.append(el("span", "caps", L.part(d, lang, "weekday", "short")), el("b", "", d.d), el("span", "caps", L.part(d, lang, "month", "short")));
        grid.append(btn);
      });
      view.append(grid, el("p", "view__hint", t("dayHint")));
    } else if (step === 3) {
      options = L.slots(pick.day, wall);
      const grid = el("div", "cells");
      options.forEach((mins, i) => grid.append(option(i, mins === pick.time, "cell", L.clock(mins, lang))));
      view.append(el("p", "caps view__date", L.dateText(pick.day, lang)), grid);
    } else {
      options = [];
      const acts = el("div", "sum__acts"), calendar = link("link", L.icsHref(pick, lang, new Date()), t("addCal"));
      calendar.download = "by-koca.ics";
      acts.append(link("btn btn--gold", L.smsHref(pick, lang), t("sendSms")), link("link", "tel:" + L.PHONE, t("callInstead")), calendar);
      view.append(
        el("p", "sum__what", t("t_" + pick.treatment)),
        el("p", "sum__when", L.dateText(pick.day, lang) + " " + t("at", { t: L.clock(pick.time, lang) })),
        el("p", "caps sum__label", t("smsLabel")),
        el("p", "sum__sms", L.smsText(pick, lang).trim()),
        acts,
        el("p", "sum__fine", t("fine"))
      );
    }
    $("#sheet-body").replaceChildren(view);
  }

  function choose(i) {
    const at = step, value = options[i];
    if (at === 1) pick.treatment = value;
    if (at === 2) pick.day = value;
    if (at === 3) pick.time = value;
    $$("[data-i]", sheet).forEach(btn => btn.setAttribute("aria-pressed", String(+btn.dataset.i === i)));
    $("#sheet-next").disabled = false;
    // Move on after a short beat. A double tap restarts the beat instead of skipping a step,
    // and Back or Close cancel it.
    clearTimeout(advance);
    advance = setTimeout(() => { if (step === at && sheet.classList.contains("is-open")) goTo(at + 1); }, 320);
  }

  function onSheetKey(e) {
    if (!sheet.classList.contains("is-open")) return;
    if (e.key === "Escape") { e.preventDefault(); closeSheet(); }
    if (e.key !== "Tab") return;
    // Keep focus inside the sheet.
    const stops = $$("button:not([disabled]):not([hidden]), a[href]", sheet);
    const first = stops[0], last = stops[stops.length - 1], current = document.activeElement;
    if (e.shiftKey && (current === first || stops.indexOf(current) < 0)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && current === last) { e.preventDefault(); first.focus(); }
  }

  /* ---------- Start ---------- */

  document.addEventListener("DOMContentLoaded", () => {
    $$(".lang__btn").forEach(btn => btn.addEventListener("click", () => setLang(btn.dataset.lang)));
    initSheet();
    initHero();
    initReveal();
    initAccordion();
    initCompare();
    initBar();
    renderStatus();
    setInterval(renderStatus, 30000);
    document.addEventListener("visibilitychange", () => { if (!document.hidden) renderStatus(); });
  });
})();
