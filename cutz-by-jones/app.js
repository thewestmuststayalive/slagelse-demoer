/* Cutz by Jones · app.js
   Part 1  JonesLogic: every text on the page and the ready-made message. Pure, no DOM (tested in Node).
   Part 2  The page: language, reveal on scroll, floating bar, booking request.
   Nothing is stored and nothing is sent anywhere. */

var JonesLogic = (function () {
  "use strict";

  var PHONE = "+4540251250";
  var INSTAGRAM = "https://www.instagram.com/cutzbyjones/";
  var TREATMENTS = ["cut", "cutwash", "fade"];

  // Every text on the page in both languages. The keys match data-i18n in index.html.
  var TEXT = {
    da: {
      title: "Cutz by Jones · Herreklip i Slagelse",
      skip: "Spring til indhold", home: "Cutz by Jones, til toppen", navLabel: "Sektioner", langLabel: "Sprog",
      book: "Book tid", badge: "BOOK TID · BOOK TID · BOOK TID · ",
      eyebrow: "Herreklip · Slagelse",
      lede1: "Herreklip, skin fade", lede2: "og styling i Slagelse.",
      call: "Ring 40 25 12 50",
      s1: "Klip", s2: "Billeder", s3: "Om", s4: "Book tid",
      m_cut: "Herreklip", m_fade: "Skin fade", m_wash: "Hårvask", m_style: "Styling",
      t_cut: "Herreklip", t_cutwash: "Herreklip med hårvask og styling", t_fade: "Skin fade",
      bookThis: "Book denne", priceNote: "Her kommer prislisten.",
      photo: "Her kommer jeres billede", photoNote: "Billeder fra @cutzbyjones kan sættes ind her.",
      quote1: "Herreklip", quote2: "i Slagelse.",
      about: "Cutz by Jones er Benjamin Jones’ herreklip i Slagelse. Tid bestilles på Instagram eller telefon.",
      fact1: "By", fact2: "Tid via", fact3: "Aflys",
      cancel: "Aflyses tiden ikke minimum 5 timer før, betales 50 % af prisen.",
      bookLine1: "Tid bestilles", bookLine2: "på Instagram eller telefon.",
      ring: "Ring", text: "SMS",
      hoursNote: "Her kommer åbningstider og adresse.",
      cookies: "Siden bruger ingen cookies og gemmer ingen oplysninger.",
      barTitle: "Tid via Instagram eller telefon", barSub: "Cutz by Jones · Slagelse",
      // Booking sheet
      step: "Trin {n} af 2", stepDone: "Klar til at sende",
      title1: "Hvad skal du have?", title2: "Din besked",
      back: "Tilbage", close: "Luk", next: "Næste",
      smsLabel: "Besked til Benjamin",
      sendSms: "Send på SMS", insta: "Skriv på Instagram", callInstead: "Ring i stedet",
      fine: "Aflyses tiden ikke minimum 5 timer før, betales 50 % af prisen. Siden gemmer ingen oplysninger om dig.",
      smsName: { cut: "herreklip", cutwash: "herreklip med hårvask og styling", fade: "skin fade" },
      sms: "Hej Benjamin. Jeg vil gerne bestille tid til {what}. Hvornår har du en ledig tid? Mvh "
    },
    en: {
      title: "Cutz by Jones · Men’s haircuts in Slagelse",
      skip: "Skip to content", home: "Cutz by Jones, back to top", navLabel: "Sections", langLabel: "Language",
      book: "Book now", badge: "BOOK NOW · BOOK NOW · BOOK NOW · ",
      eyebrow: "Men’s haircuts · Slagelse",
      lede1: "Men’s cuts, skin fades", lede2: "and styling in Slagelse.",
      call: "Call 40 25 12 50",
      s1: "Cuts", s2: "Photos", s3: "About", s4: "Book now",
      m_cut: "Men’s cuts", m_fade: "Skin fade", m_wash: "Hair wash", m_style: "Styling",
      t_cut: "Men’s haircut", t_cutwash: "Men’s haircut with wash and styling", t_fade: "Skin fade",
      bookThis: "Book this", priceNote: "The price list goes here.",
      photo: "Your photo goes here", photoNote: "Photos from @cutzbyjones can go here.",
      quote1: "Men’s cuts", quote2: "in Slagelse.",
      about: "Cutz by Jones is Benjamin Jones’ barber chair in Slagelse. Appointments are made on Instagram or by phone.",
      fact1: "Town", fact2: "Book via", fact3: "Cancel",
      cancel: "If the appointment is not cancelled at least 5 hours before, 50% of the price is payable.",
      bookLine1: "Appointments are made", bookLine2: "on Instagram or by phone.",
      ring: "Call", text: "Text",
      hoursNote: "Opening hours and address go here.",
      cookies: "This site uses no cookies and stores no information.",
      barTitle: "Book on Instagram or by phone", barSub: "Cutz by Jones · Slagelse",
      step: "Step {n} of 2", stepDone: "Ready to send",
      title1: "What would you like?", title2: "Your message",
      back: "Back", close: "Close", next: "Next",
      smsLabel: "Message to Benjamin",
      sendSms: "Send by text", insta: "Write on Instagram", callInstead: "Call instead",
      fine: "If the appointment is not cancelled at least 5 hours before, 50% of the price is payable. This site stores no information about you.",
      smsName: { cut: "a men’s haircut", cutwash: "a men’s haircut with wash and styling", fade: "a skin fade" },
      sms: "Hello Benjamin. I would like to book {what}. When do you have a free time? Kind regards, "
    }
  };

  // "Hi {name}" + { name: "Ben" } becomes "Hi Ben".
  function fill(text, values) {
    return text.replace(/\{(\w+)\}/g, function (all, key) { return values[key]; });
  }

  // The ready-made SMS. It ends with "Mvh " so the visitor only has to add a name.
  function smsText(treatment, lang) {
    var T = TEXT[lang];
    return fill(T.sms, { what: T.smsName[treatment] });
  }
  function smsHref(treatment, lang) {
    return "sms:" + PHONE + "?&body=" + encodeURIComponent(smsText(treatment, lang));
  }

  return { PHONE: PHONE, INSTAGRAM: INSTAGRAM, TREATMENTS: TREATMENTS, TEXT: TEXT, fill: fill, smsText: smsText, smsHref: smsHref };
})();

if (typeof module !== "undefined" && module.exports) module.exports = JonesLogic;

/* ------------------------------------------------------------------ the page */

if (typeof document !== "undefined") (function () {
  "use strict";

  const L = JonesLogic, root = document.documentElement;
  const still = window.matchMedia("(prefers-reduced-motion: reduce)");
  let lang = "da";

  // The script is loaded in the head, so this class is set before the first paint and nothing flashes.
  root.classList.add("js");

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
    renderSheet();
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

  /* ---------- Reveal on scroll, only for what starts below the fold ----------
     Everything at or above the lower edge of the screen is shown, so a jump to a link further
     down never leaves sections invisible behind it. */

  function initReveal() {
    let pending = $$("[data-reveal]").filter(node => node.getBoundingClientRect().top >= window.innerHeight * .9);
    pending.forEach(node => node.classList.add("pre"));
    if (!pending.length) return;
    let queued = false;
    const check = () => {
      queued = false;
      pending = pending.filter(node => {
        if (node.getBoundingClientRect().top >= window.innerHeight * .92) return true;
        node.classList.remove("pre");
        return false;
      });
      if (!pending.length) { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); }
    };
    const onScroll = () => { if (!queued) { queued = true; requestAnimationFrame(check); } };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
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

  /* ---------- Booking request ----------
     Choose a cut, then send a ready-made message by SMS or Instagram, or call.
     No input fields; nothing leaves the browser. */

  const pick = { treatment: null };
  let sheet, step = 1, opener = null, advance = 0, closing = 0, quietUntil = 0;

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
    goTo(treatment ? 2 : 1);                    // "Book denne" skips the choice
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
    if (next > 1 && !pick.treatment) next = 1;  // never land on a step whose choice is missing
    step = Math.min(next, 2);
    sheet.dataset.dir = isBack ? "back" : "next";
    quietUntil = Date.now() + 350;              // ignore the tail of a double tap
    renderSheet();
    $("#sheet-body").scrollTop = 0;
    $("#sheet-title").focus({ preventScroll: true });
  }

  function link(cls, href, text) {
    const a = el("a", cls, text);
    a.href = href;
    return a;
  }

  function renderSheet() {
    if (!sheet || sheet.hidden) return;
    const view = el("div", "view"), nextBtn = $("#sheet-next");
    sheet.dataset.step = step;
    $("#sheet-count").textContent = step < 2 ? t("step", { n: step }) : t("stepDone");
    $("#sheet-title").textContent = t("title" + step);
    $("#sheet-back").textContent = t(step === 1 ? "close" : "back");
    nextBtn.textContent = t("next");
    nextBtn.hidden = step === 2;
    nextBtn.disabled = !pick.treatment;

    if (step === 1) {
      const list = el("div", "opts");
      L.TREATMENTS.forEach((id, i) => {
        const btn = el("button", "opt");
        btn.type = "button";
        btn.dataset.i = i;
        btn.setAttribute("aria-pressed", String(id === pick.treatment));
        btn.append(el("span", "num", "0" + (i + 1)), el("span", "opt__name", t("t_" + id)), el("span", "opt__mark"));
        list.append(btn);
      });
      view.append(list);
    } else {
      const acts = el("div", "sum__acts");
      acts.append(
        link("btn btn--gold", L.smsHref(pick.treatment, lang), t("sendSms")),
        link("link", L.INSTAGRAM, t("insta")),
        link("link", "tel:" + L.PHONE, t("callInstead"))
      );
      acts.children[1].target = "_blank";
      acts.children[1].rel = "noopener noreferrer";
      view.append(
        el("p", "sum__what", t("t_" + pick.treatment)),
        el("p", "caps sum__label", t("smsLabel")),
        el("p", "sum__sms", L.smsText(pick.treatment, lang).trim()),
        acts,
        el("p", "sum__fine", t("fine"))
      );
    }
    $("#sheet-body").replaceChildren(view);
  }

  function choose(i) {
    pick.treatment = L.TREATMENTS[i];
    $$("[data-i]", sheet).forEach(btn => btn.setAttribute("aria-pressed", String(+btn.dataset.i === i)));
    $("#sheet-next").disabled = false;
    // Move on after a short beat. A double tap restarts the beat instead of skipping a step,
    // and Back or Close cancel it.
    clearTimeout(advance);
    advance = setTimeout(() => { if (step === 1 && sheet.classList.contains("is-open")) goTo(2); }, 320);
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
    initBar();
  });
})();
