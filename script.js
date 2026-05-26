/* ============================================================
   BHUSHAN LADGAONKAR — script.js
   Sections:
   1. QUOTES  ← Edit your quotes here
   2. TIMEZONE CONFIG  ← Change your timezone here
   3. Loader
   4. Theme Toggler
   5. Modal
   6. Footer Clock
   7. Footer Quotes
   8. Keyboard accessibility for certificate cards
   ============================================================ */


/* ── 1. QUOTES ───────────────────────────────────────────────────
   Add or remove quotes freely. Format: { text: "...", source: "..." }
   source is optional — leave it as "" to show no attribution.
   ─────────────────────────────────────────────────────────────── */
const QUOTES = [
    // — Star Wars —
    { text: "May the Force be with you.",                           source: "Star Wars" },
    { text: "This is the way.",                                     source: "The Mandalorian" },
    { text: "Do. Or do not. There is no try.",                      source: "Yoda" },
    { text: "I find your lack of faith disturbing.",                source: "Darth Vader" },
    { text: "The Force will be with you. Always.",                  source: "Obi-Wan Kenobi" },
    { text: "In my experience, there is no such thing as luck.",    source: "Obi-Wan Kenobi" },
    { text: "I am one with the Force. The Force is with me.",       source: "Rogue One" },
    { text: "Never tell me the odds.",                              source: "Han Solo" },
    { text: "I've got a bad feeling about this.",                   source: "Star Wars" },
    { text: "Your focus determines your reality.",                  source: "Qui-Gon Jinn" },

    // — Dune —
    { text: "I must not fear. Fear is the mind-killer.",            source: "Frank Herbert, Dune" },
    { text: "The mystery of life isn't a problem to solve, but a reality to experience.", source: "Frank Herbert, Dune" },
    { text: "He who controls the spice controls the universe.",     source: "Frank Herbert, Dune" },

    // — Blade Runner —
    { text: "All those moments will be lost in time, like tears in rain.", source: "Roy Batty, Blade Runner" },
    { text: "More human than human is our motto.",                  source: "Blade Runner" },

    // — Hacker / Engineering culture —
    { text: "There is no place like 127.0.0.1.",                   source: "" },
    { text: "It works on my machine.",                             source: "Every developer, ever" },
    { text: "sudo make me a sandwich.",                            source: "xkcd" },
    { text: "The quieter you become, the more you are able to hear.", source: "Kali Linux" },
    { text: "With great power comes great responsibility... and root access.", source: "" },
    { text: "Talk is cheap. Show me the code.",                    source: "Linus Torvalds" },
    { text: "Real programmers count from 0.",                      source: "" },
    { text: "Any sufficiently advanced technology is indistinguishable from magic.", source: "Arthur C. Clarke" },

    // ── ADD YOUR OWN BELOW THIS LINE ──────────────────────────
    // { text: "Your quote here.",  source: "Attribution" },
    // { text: "Another quote.",    source: "" },
];

/* Interval between quote rotations, in milliseconds */
const QUOTE_INTERVAL_MS = 8000;


/* ── 2. TIMEZONE CONFIG ──────────────────────────────────────────
   MY_TIMEZONE: IANA timezone string for YOUR location.
   Change this one string if you ever move:
     India (IST)         → "Asia/Kolkata"
     UK (GMT/BST)        → "Europe/London"
     US East (ET)        → "America/New_York"
     US West (PT)        → "America/Los_Angeles"
     Singapore (SGT)     → "Asia/Singapore"
     UAE (GST)           → "Asia/Dubai"
   Full list: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
   ─────────────────────────────────────────────────────────────── */
const MY_TIMEZONE   = "Asia/Kolkata";   // ← only line you ever need to change
const MY_LABEL      = "BHU / IST";      // label shown under your clock


/* ── 3. LOADER ───────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", function () {

    const loader  = document.getElementById("loader");
    const header  = document.querySelector("header");
    const main    = document.querySelector("main");

    // Respect reduced-motion preference
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const loaderDelay   = reducedMotion ? 0 : 1500;
    const fadeDuration  = reducedMotion ? 0 : 500;

    setTimeout(() => {
        loader.style.opacity = "0";
        setTimeout(() => {
            loader.style.display  = "none";
            loader.setAttribute("aria-hidden", "true");
            header.classList.remove("unloaded");
            main.classList.remove("unloaded");
        }, fadeDuration);
    }, loaderDelay);


    /* ── 4. THEME TOGGLER ────────────────────────────────────── */
    const toggleSwitch = document.querySelector("#theme-toggle");
    const body         = document.body;

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        body.classList.toggle("dark-mode", savedTheme === "dark-mode");
        toggleSwitch.checked = savedTheme === "dark-mode";
    } else {
        // Default: dark mode
        body.classList.add("dark-mode");
        toggleSwitch.checked = true;
    }

    toggleSwitch.addEventListener("change", function (e) {
        const isDark = e.target.checked;
        body.classList.toggle("dark-mode", isDark);
        localStorage.setItem("theme", isDark ? "dark-mode" : "light-mode");
    });


    /* ── 5. MODAL ────────────────────────────────────────────── */
    const modal     = document.getElementById("modal");
    const modalImg  = modal.querySelector(".modal-image");
    const modalTitle= modal.querySelector(".modal-title");
    const modalDesc = modal.querySelector(".modal-description");
    const closeBtn  = modal.querySelector(".modal-close");

    // Track element that opened the modal so we can return focus on close
    let modalOpener = null;

    function openModal(title, description, imageSrc, opener) {
        modalTitle.textContent = title;
        modalDesc.textContent  = description;
        if (imageSrc) {
            modalImg.src              = imageSrc;
            modalImg.style.display    = "block";
            modalImg.alt              = title;
        } else {
            modalImg.style.display    = "none";
        }
        modal.classList.add("visible");
        modal.removeAttribute("aria-hidden");
        closeBtn.focus();          // move focus into modal
        modalOpener = opener;
    }

    function closeModal() {
        modal.classList.remove("visible");
        modal.setAttribute("aria-hidden", "true");
        if (modalOpener) modalOpener.focus();  // return focus
    }

    // Certificate cards
    document.querySelectorAll(".certificate-card").forEach(card => {
        card.addEventListener("click", () => {
            const img   = card.querySelector("img");
            const title = card.querySelector(".certificate-title").innerText;
            const desc  = img.getAttribute("data-description") || "";
            openModal(title, desc, img.src, card);
        });
        // Also openable via Enter/Space for keyboard users
        card.addEventListener("keydown", e => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                card.click();
            }
        });
    });

    // Project images
    document.querySelectorAll(".project-item img.project-item-image").forEach(img => {
        img.addEventListener("click", e => {
            e.stopPropagation();
            const parent = img.closest(".project-item");
            const title  = parent.querySelector("h3").innerText;
            const desc   = parent.querySelector("p").innerText;
            openModal(title, desc, img.src, img);
        });
    });

    closeBtn.addEventListener("click", closeModal);

    // Close on backdrop click
    modal.addEventListener("click", e => {
        if (e.target === modal) closeModal();
    });

    // Close on Escape key
    document.addEventListener("keydown", e => {
        if (e.key === "Escape" && modal.classList.contains("visible")) closeModal();
    });

    // Trap focus inside modal when open
    modal.addEventListener("keydown", e => {
        if (e.key !== "Tab" || !modal.classList.contains("visible")) return;
        const focusable = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last  = focusable[focusable.length - 1];
        if (e.shiftKey) {
            if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
            if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
        }
    });


    /* ── 6. FOOTER CLOCK ─────────────────────────────────────── */
    const elMyTime    = document.getElementById("clock-my-time");
    const elUserTime  = document.getElementById("clock-user-time");
    const elDelta     = document.getElementById("clock-delta");

    function pad(n) { return String(n).padStart(2, "0"); }

    function formatTime(date, timezone) {
        return date.toLocaleTimeString("en-GB", {
            timeZone:    timezone,
            hour:        "2-digit",
            minute:      "2-digit",
            second:      "2-digit",
            hour12:      false,
        });
    }

    function getOffsetMinutes(date, timezone) {
        // Parse the locale string to extract offset via date arithmetic
        const utc  = Date.UTC(
            date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
            date.getUTCHours(),    date.getUTCMinutes()
        );
        const local = new Date(date.toLocaleString("en-US", { timeZone: timezone }));
        return Math.round((local - new Date(
            Date.UTC(local.getFullYear(), local.getMonth(), local.getDate(),
                     local.getHours(),   local.getMinutes())
        )) / 60000);
    }

    function updateClocks() {
        const now      = new Date();
        const userTZ   = Intl.DateTimeFormat().resolvedOptions().timeZone;

        if (elMyTime)   elMyTime.textContent   = formatTime(now, MY_TIMEZONE);
        if (elUserTime) elUserTime.textContent  = formatTime(now, userTZ);

        if (elDelta) {
            const myOff   = getOffsetMinutes(now, MY_TIMEZONE);
            const userOff = getOffsetMinutes(now, userTZ);
            const diff    = myOff - userOff;
            const sign    = diff >= 0 ? "+" : "−";
            const h       = Math.floor(Math.abs(diff) / 60);
            const m       = Math.abs(diff) % 60;
            elDelta.textContent = diff === 0
                ? "same TZ"
                : `${sign}${h}h${m > 0 ? pad(m) + "m" : ""}`;
        }
    }

    // Run immediately, then every second
    updateClocks();
    setInterval(updateClocks, 1000);


    /* ── 7. FOOTER QUOTES ────────────────────────────────────── */
    const quoteEl = document.getElementById("footer-quote");

    if (quoteEl && QUOTES.length > 0) {
        // Shuffle once on load so order is random each visit
        const shuffled = [...QUOTES].sort(() => Math.random() - 0.5);
        let index = 0;

        function setQuote(q) {
            const src = q.source ? ` — ${q.source}` : "";
            quoteEl.textContent = `"${q.text}"${src}`;
            // Update accessible live region text
            quoteEl.setAttribute("aria-label", `Quote: ${q.text}${src}`);
        }

        // Set first quote immediately
        setQuote(shuffled[0]);

        function rotateQuote() {
            const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

            if (reducedMotion) {
                // No fade — just swap
                index = (index + 1) % shuffled.length;
                setQuote(shuffled[index]);
            } else {
                quoteEl.classList.add("fading");
                setTimeout(() => {
                    index = (index + 1) % shuffled.length;
                    setQuote(shuffled[index]);
                    quoteEl.classList.remove("fading");
                }, 650); // matches CSS transition duration
            }
        }

        setInterval(rotateQuote, QUOTE_INTERVAL_MS);
    }


    /* ── 8. DYNAMIC TERMINAL DIMENSIONS ──────────────────────── */
    const terminalBody = document.querySelector(".terminal-body");
    const dimensionsSpan = document.getElementById("terminal-dimensions");

    function updateTerminalDimensions() {
        if (!terminalBody || !dimensionsSpan) return;

        // Get the computed style to account for padding, etc.
        const rect = terminalBody.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(terminalBody);
        const padding = parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
        const paddingY = parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);

        // Create a temporary element to measure monospace character size
        const test = document.createElement("span");
        test.style.fontFamily = "'Fira Code', monospace";
        test.style.fontSize = computedStyle.fontSize;
        test.style.visibility = "hidden";
        test.style.position = "absolute";
        test.textContent = "M"; // Monospace 'M' is typically the widest character
        document.body.appendChild(test);

        const charWidth = test.getBoundingClientRect().width;
        
        // Handle lineHeight: if it's "normal", calculate from font-size
        let charHeight = parseFloat(computedStyle.lineHeight);
        if (isNaN(charHeight) || computedStyle.lineHeight === "normal") {
            charHeight = parseFloat(computedStyle.fontSize) * 1.5; // standard 1.5x multiplier for "normal"
        }
        
        document.body.removeChild(test);

        // Calculate columns and rows
        const width = rect.width - padding;
        const height = rect.height - paddingY;
        const cols = Math.floor(width / charWidth);
        const rows = Math.floor(height / charHeight);

        // Update display (ensure minimum reasonable values)
        dimensionsSpan.textContent = `${Math.max(cols, 20)}x${Math.max(rows, 10)}`;
    }

    // Update on page load and whenever window resizes
    updateTerminalDimensions();
    window.addEventListener("resize", updateTerminalDimensions);

    // Also use ResizeObserver for terminal-specific changes
    if (window.ResizeObserver) {
        const observer = new ResizeObserver(updateTerminalDimensions);
        observer.observe(terminalBody);
    }


    /* ── 9. KEYBOARD ACCESSIBILITY FOR CERTIFICATE CARDS ─────── */
    // Cards need tabindex="0" to be reachable by keyboard.
    // We add it in JS (progressive enhancement) so it degrades
    // gracefully if JS is off.
    document.querySelectorAll(".certificate-card").forEach(card => {
        card.setAttribute("tabindex", "0");
        card.setAttribute("role", "button");
    });

}); // end DOMContentLoaded
