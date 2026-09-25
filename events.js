/* ===== CLINICS & EVENTS =====
   To add an event, copy one block in EVENTS below and change the details.
   - date / endDate: YYYY-MM-DD. Events disappear automatically the day after they finish.
   - If there are no upcoming events, the whole section and its menu link hide themselves.
   - book.type: "whatsapp" (opens a chat with Joe) or "link" (any URL, e.g. Calendly).
*/
const EVENTS = [
  {
    title: "Bitting & Dressage Assessment Clinic",
    with: "With Gill Batt & Joe Bright",
    type: "Clinic",
    date: "2026-10-28",
    endDate: "",
    time: "One-hour individual sessions",
    location: "Cork Farm, near Chilham, Kent",
    price: "£90 per session",
    summary: "A one-hour session for you and your horse. Gill looks at the bit and bridle, Joe looks at the way of going, and you leave with a written report.",
    includes: [
      "Static assessment: Gill checks your horse's mouth, facial anatomy, bridle and bit fit",
      "Ridden warm-up in your usual kit while Gill and Joe assess contact, comfort and way of going",
      "Bit adjustment: Gill fits a different bit or adjusts your current setup",
      "Dressage lesson with Joe while Gill evaluates the horse's response",
      "Written report of the assessment, changes made and recommendations"
    ],
    partners: [
      { name: "Horse Bit Advice", url: "https://horsebitadvice.com/" },
      { name: "Quantum Bridle", url: "https://quantumbridle.com/" }
    ],
    book: {
      type: "whatsapp",
      label: "WhatsApp Joe to Book",
      number: "447771365693",
      message: "Hi Joe, I'd like to book a session at the Bitting & Dressage Assessment Clinic on 28 October."
    }
  }
];

(function () {
  const section = document.getElementById("events");
  const list = document.getElementById("events-list");
  if (!section || !list) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const parse = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const upcoming = EVENTS
    .filter((e) => parse(e.endDate || e.date) >= today)
    .sort((a, b) => parse(a.date) - parse(b.date));
  const past = EVENTS
    .filter((e) => parse(e.endDate || e.date) < today)
    .sort((a, b) => parse(b.date) - parse(a.date));

  const navLinks = document.querySelectorAll('a[href="#events"]');
  if (!upcoming.length && !past.length) {
    section.hidden = true;
    navLinks.forEach((a) => { (a.closest("li") || a).hidden = true; });
    return;
  }

  const fmtDay = (d) => d.toLocaleDateString("en-GB", { weekday: "long" });
  const fmtFull = (d) => d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const upcomingHtml = upcoming.map((e) => {
    const start = parse(e.date);
    const end = e.endDate ? parse(e.endDate) : null;
    const when = end ? `${fmtFull(start)} to ${fmtFull(end)}` : `${fmtDay(start)} ${fmtFull(start)}`;
    const href = e.book.type === "whatsapp"
      ? `https://wa.me/${e.book.number}?text=${encodeURIComponent(e.book.message || "")}`
      : e.book.url;
    const partners = (e.partners || []).map((p) => `<a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.name)}</a>`).join(" and ");

    return `
<article class="event-card">
  <div class="event-date" aria-hidden="true">
    <span class="event-day">${start.getDate()}</span>
    <span class="event-month">${start.toLocaleDateString("en-GB", { month: "short" })}</span>
  </div>
  <div class="event-body">
    <p class="event-type">${esc(e.type)}</p>
    <h3>${esc(e.title)}</h3>
    ${e.with ? `<p class="event-with">${esc(e.with)}</p>` : ""}
    <ul class="event-facts">
      <li><span class="fact-key">When</span><span class="fact-val">${esc(when)}</span></li>
      ${e.time ? `<li><span class="fact-key">Format</span><span class="fact-val">${esc(e.time)}</span></li>` : ""}
      <li><span class="fact-key">Where</span><span class="fact-val">${esc(e.location)}</span></li>
      <li><span class="fact-key">Price</span><span class="fact-val">${esc(e.price)}</span></li>
    </ul>
    <p class="event-summary">${esc(e.summary)}</p>
    ${e.includes && e.includes.length ? `<details class="event-includes"><summary>What each session includes</summary><ol>${e.includes.map((i) => `<li>${esc(i)}</li>`).join("")}</ol></details>` : ""}
    ${partners ? `<p class="event-partners">In partnership with ${partners}</p>` : ""}
    <a href="${esc(href)}" class="btn-primary event-book" target="_blank" rel="noopener">${esc(e.book.label)}</a>
  </div>
</article>`;
  }).join("");

  const fmtShort = (d) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const pastHtml = past.length ? `
<details class="events-past"${upcoming.length ? "" : " open"}>
  <summary>Past clinics &amp; events <span>(${past.length})</span></summary>
  <ul class="events-past-list">
    ${past.map((e) => `<li><span class="past-date">${esc(fmtShort(parse(e.date)))}</span><span class="past-title">${esc(e.title)}${e.with ? ` <em>${esc(e.with.replace(/^With /, "with "))}</em>` : ""}</span><span class="past-type">${esc(e.type)}</span></li>`).join("")}
  </ul>
</details>` : "";

  const noneHtml = upcoming.length ? "" : `<p class="events-none">No dates announced just now. <a href="https://wa.me/447771365693" target="_blank" rel="noopener">Message Joe</a> to hear about the next clinic first.</p>`;

  list.innerHTML = noneHtml + upcomingHtml + pastHtml;
})();
