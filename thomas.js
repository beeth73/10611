/* ============================================================
   thomas.js — Thomas the Siberian Husky (decorative mascot)
   - wanders the viewport; flees if the cursor gets inside AVOID px
   - "follow" mode: approaches the cursor but holds a RING px distance
   - can be dismissed; choices persist in localStorage
   - off by default for touch devices and prefers-reduced-motion
   - aria-hidden, pointer-events:none: never blocks or announces anything
   ============================================================ */
(function () {
    "use strict";

    var C = { w: 96, avoid: 130, ring: 230, band: 35, walk: 70, follow: 130, run: 240, m: 8 };
    var H = C.w * 78 / 128;

    var controls = document.getElementById("thomas-controls");
    var btnT = document.getElementById("thomas-toggle");
    var btnF = document.getElementById("thomas-follow");
    if (!controls || !btnT || !btnF) return;

    var reduced  = matchMedia("(prefers-reduced-motion: reduce)").matches;
    var canHover = matchMedia("(any-hover: hover) and (any-pointer: fine)").matches;

    function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
    function put(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }

    var saved   = get("thomas");
    var enabled = saved ? saved === "on" : (!reduced && canHover);
    var follow  = canHover && get("thomasFollow") === "1";

    var SVG =
        '<svg viewBox="0 0 128 78" focusable="false" aria-hidden="true">' +
        '<defs><clipPath id="thomas-clip"><ellipse cx="58" cy="40" rx="34" ry="16"/></clipPath></defs>' +
        '<ellipse cx="58" cy="76" rx="36" ry="2.5" fill="rgba(0,0,0,.18)"/>' +
        '<g class="leg leg-b"><rect x="31" y="46" width="7" height="22" rx="3.5" fill="#6b7480"/><rect x="30" y="63" width="9" height="11" rx="4.5" fill="#e9edf2"/></g>' +
        '<g class="leg leg-a"><rect x="72" y="46" width="7" height="22" rx="3.5" fill="#6b7480"/><rect x="71" y="63" width="9" height="11" rx="4.5" fill="#e9edf2"/></g>' +
        '<g class="thomas-body">' +
          '<g class="tail"><path d="M26 40C12 42 6 30 12 20C16 13 26 13 31 19C26 18 22 22 23 28C24 32 29 34 30 36Z" fill="#8a94a0"/>' +
          '<path d="M9 24C8 18 14 14 20 14C15 17 12 20 12 26Z" fill="#e9edf2"/></g>' +
          '<ellipse cx="58" cy="40" rx="34" ry="16" fill="#8a94a0"/>' +
          '<g clip-path="url(#thomas-clip)"><ellipse cx="54" cy="31" rx="31" ry="9" fill="#6b7480"/>' +
          '<ellipse cx="86" cy="47" rx="10" ry="11" fill="#eef2f6"/><ellipse cx="58" cy="53" rx="30" ry="6" fill="#eef2f6"/></g>' +
          '<path d="M88 22L90 5L100 17Z" fill="#4b5563"/><path d="M100 16L109 4L113 21Z" fill="#4b5563"/>' +
          '<ellipse cx="100" cy="31" rx="15" ry="13" fill="#8a94a0"/>' +
          '<path d="M85 30C84 16 113 13 115.5 28C108 22 94 22 85 30Z" fill="#4b5563"/>' +
          '<ellipse cx="95" cy="39" rx="8" ry="5.5" fill="#fff"/><ellipse cx="109" cy="37" rx="9" ry="6.5" fill="#fff"/>' +
          '<ellipse cx="103.5" cy="28.5" rx="5.5" ry="4.5" fill="#3b4350"/>' +
          '<circle cx="104" cy="28.5" r="3.1" fill="#66d4ff"/><circle cx="104.6" cy="28.5" r="1.5" fill="#0f172a"/>' +
          '<circle cx="105.3" cy="27.6" r=".7" fill="#fff"/>' +
          '<ellipse cx="116.2" cy="34" rx="3" ry="2.4" fill="#111827"/>' +
          '<path d="M108 41Q112 43 116 39" stroke="#374151" stroke-width="1.1" fill="none"/>' +
          '<path class="tongue" d="M111 42C110.5 48 115 49 115.5 43Z" fill="#f472b6"/>' +
        '</g>' +
        '<g class="leg leg-a"><rect x="40" y="46" width="7" height="22" rx="3.5" fill="#8a94a0"/><rect x="39" y="63" width="9" height="11" rx="4.5" fill="#fff"/></g>' +
        '<g class="leg leg-b"><rect x="81" y="46" width="7" height="22" rx="3.5" fill="#8a94a0"/><rect x="80" y="63" width="9" height="11" rx="4.5" fill="#fff"/></g>' +
        '</svg>';

    var el = document.createElement("div");
    el.id = "thomas";
    el.hidden = true;
    el.setAttribute("aria-hidden", "true");
    el.dataset.state = "idle";
    el.dataset.dir = "right";
    el.innerHTML = '<div class="thomas-bubble" hidden></div><div class="thomas-flip">' + SVG + "</div>";
    document.body.appendChild(el);
    var bubble = el.querySelector(".thomas-bubble");

    var b, x = 1e5, y = 1e5, vx = 0, vy = 0, tx = null, ty = 0;
    var pause = 0, last = 0, raf = 0, mouse = null, state = "idle";

    function rand(a, c) { return a + Math.random() * (c - a); }
    function clamp(v, a, c) { return Math.max(a, Math.min(c, v)); }
    function setData(k, v) { if (el.dataset[k] !== v) el.dataset[k] = v; }
    function draw() { el.style.transform = "translate3d(" + x.toFixed(1) + "px," + y.toFixed(1) + "px,0)"; }

    function measure() {
        var f = document.getElementById("site-footer"), fh = f ? f.offsetHeight : 48;
        b = {
            x0: C.m, y0: C.m,
            x1: Math.max(C.m, document.documentElement.clientWidth - C.w - C.m),
            y1: Math.max(C.m, innerHeight - fh - H - C.m)
        };
        x = clamp(x, b.x0, b.x1);
        y = clamp(y, b.y0, b.y1);
    }

    // random wander spot, preferring ones far from the cursor
    function pickTarget() {
        var best = null, bd = -1;
        for (var i = 0; i < 8; i++) {
            var px = rand(b.x0, b.x1), py = rand(b.y0, b.y1);
            var d = mouse ? Math.hypot(px + C.w / 2 - mouse.x, py + H / 2 - mouse.y) : 9999;
            if (d > bd) { bd = d; best = { x: px, y: py }; }
            if (d > C.avoid * 2) break;
        }
        tx = best.x; ty = best.y;
    }

    // nearest on-screen point exactly RING px from the cursor (follow mode)
    function ringTarget() {
        var best = null, bd = 1e9;
        for (var k = 0; k < 16; k++) {
            var a = k * Math.PI / 8;
            var px = mouse.x + Math.cos(a) * C.ring - C.w / 2, py = mouse.y + Math.sin(a) * C.ring - H / 2;
            if (px < b.x0 || px > b.x1 || py < b.y0 || py > b.y1) continue;
            var d = Math.hypot(px - x, py - y);
            if (d < bd) { bd = d; best = { x: px, y: py }; }
        }
        return best;
    }

    function tick(now) {
        raf = requestAnimationFrame(tick);
        var dt = Math.min(0.05, (now - last) / 1000);
        last = now;

        var cx = x + C.w / 2, cy = y + H / 2, dx = 0, dy = 0, d = 0;
        var wx = 0, wy = 0, sp = 0, snap = 8;
        if (mouse) { dx = cx - mouse.x; dy = cy - mouse.y; d = Math.hypot(dx, dy) || 0.001; }

        if (mouse && d < C.avoid) {
            // FLEE: run directly away; if a wall blocks that, slide along it
            var fx = dx / d, fy = dy / d;
            if ((x <= b.x0 + 1 && fx < 0) || (x >= b.x1 - 1 && fx > 0)) fx = 0;
            if ((y <= b.y0 + 1 && fy < 0) || (y >= b.y1 - 1 && fy > 0)) fy = 0;
            if (Math.abs(fx) + Math.abs(fy) < 0.2) {
                // cornered: break sideways toward the open middle of the screen
                var qx = -dy / d, qy = dx / d;
                var s = (qx * ((b.x0 + b.x1) / 2 - x) + qy * ((b.y0 + b.y1) / 2 - y)) >= 0 ? 1 : -1;
                fx = qx * s; fy = qy * s;
            }
            var m = Math.hypot(fx, fy) || 1;
            wx = fx / m; wy = fy / m; sp = C.run; snap = 14; tx = null; pause = 0;
        } else if (follow && mouse) {
            // FOLLOW: approach to RING, back off if closer than RING - band, otherwise sit tight
            var g = d > C.ring + C.band ? ringTarget() : null;
            if (g) {
                var ex = g.x - x, ey = g.y - y, ed = Math.hypot(ex, ey) || 1;
                if (ed > 6) { wx = ex / ed; wy = ey / ed; sp = Math.min(C.follow, ed * 3 + 10); }
            } else if (d < C.ring - C.band) {
                wx = dx / d; wy = dy / d; sp = C.walk;
            }
            tx = null;
        } else if (now >= pause) {
            // WANDER
            if (tx !== null && mouse && Math.hypot(tx + C.w / 2 - mouse.x, ty + H / 2 - mouse.y) < C.avoid * 1.3) tx = null;
            if (tx === null) pickTarget();
            var ux = tx - x, uy = ty - y, ud = Math.hypot(ux, uy);
            if (ud < 6) { tx = null; pause = now + rand(1500, 4500); }
            else { wx = ux / ud; wy = uy / ud; sp = Math.min(C.walk, ud * 2.5 + 12); }
        }

        var k = 1 - Math.exp(-dt * snap);   // frame-rate independent easing
        vx += (wx * sp - vx) * k;
        vy += (wy * sp - vy) * k;
        x += vx * dt;
        y += vy * dt;
        if (x < b.x0) { x = b.x0; vx = 0; } else if (x > b.x1) { x = b.x1; vx = 0; }
        if (y < b.y0) { y = b.y0; vy = 0; } else if (y > b.y1) { y = b.y1; vy = 0; }
        draw();
        placeBubble();

        var v = Math.hypot(vx, vy);
        var next = v > 150 ? "run" : (state === "idle" ? (v > 18 ? "walk" : "idle") : (v < 8 ? "idle" : "walk"));
        if (next !== state) { state = next; setData("state", state); }
        if (Math.abs(vx) > 10) setData("dir", vx > 0 ? "right" : "left");
        else if (state === "idle" && follow && mouse) setData("dir", mouse.x > cx ? "right" : "left");
    }

    function show() {
        measure();
        el.hidden = false;
        last = performance.now();
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(tick);
    }
    function hide() { cancelAnimationFrame(raf); clearTimeout(bubbleTimer); bubble.hidden = true; el.hidden = true; }

    function sync() {
        var label = enabled ? "Dismiss Thomas" : "Call Thomas";
        btnT.setAttribute("aria-label", label);
        btnT.title = label;
        btnT.querySelector(".tc-verb").textContent = enabled ? "dismiss" : "call";
        btnF.hidden = !canHover;
        btnF.disabled = !enabled;
        btnF.setAttribute("aria-pressed", follow ? "true" : "false");
        controls.hidden = false;
    }

    btnT.addEventListener("click", function () {
        enabled = !enabled;
        put("thomas", enabled ? "on" : "off");
        if (enabled) { show(); setTimeout(function () { say("I'm back! Miss me?", 3200); }, 300); } else hide();
        sync();
    });
    btnF.addEventListener("click", function () {
        follow = !follow;
        put("thomasFollow", follow ? "1" : "0");
        sync();
        say(follow ? "I'll tag along, but I'm keeping my distance!" : "Free to roam again!", 3200);
    });

    if (canHover) {
        addEventListener("pointermove", function (e) {
            if (e.pointerType === "mouse") mouse = { x: e.clientX, y: e.clientY };
        }, { passive: true });
        document.documentElement.addEventListener("mouseleave", function () { mouse = null; });
    }
    addEventListener("resize", function () {
        if (!b) return;
        measure();
    });


    /* ── Comic speech bubbles ─────────────────────────────────────
       Decorative flavour text (aria-hidden with the rest of Thomas).
       Add or edit lines in RULES: [regex tested against the item's title, [lines]].
       ─────────────────────────────────────────────────────────── */
    var bubbleTimer = 0;

    function placeBubble() {
        if (bubble.hidden) return;
        var bw = bubble.offsetWidth, bh = bubble.offsetHeight, vw = document.documentElement.clientWidth;
        var mid = x + C.w / 2, left = clamp(mid - bw / 2, 8, vw - bw - 8);
        bubble.style.left = (left - x).toFixed(1) + "px";
        bubble.style.setProperty("--tail-x", clamp(mid - left, 16, bw - 16).toFixed(1) + "px");
        bubble.classList.toggle("below", y < bh + 24);
    }

    function say(text, ms) {
        if (!enabled || el.hidden) return;
        clearTimeout(bubbleTimer);
        bubble.textContent = text;
        bubble.hidden = false;
        bubble.classList.remove("pop");
        void bubble.offsetWidth;
        bubble.classList.add("pop");
        placeBubble();
        ms = ms || Math.min(7000, Math.max(2600, 1800 + text.length * 55));
        pause = performance.now() + ms;   // stands still while talking (fleeing still wins)
        bubbleTimer = setTimeout(function () { bubble.hidden = true; }, ms);
    }

    function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

    var RULES = [
        [/netfortress/,        ["Hardening real login systems? Respect!", "Biometrics AND API security. Clever!"]],
        [/oil and natural gas|ongc/, ["Intrusion detection on 2M+ records. Big dog stuff!", "Catching attackers at ONGC. That's cool!"]],
        [/innovation council|iic/,   ["Patents and big ideas. Very official!"]],
        [/tisd/,               ["A tutor that never leaves your laptop. Privacy first!", "On-device AI for students. That's cool!"]],
        [/gemma/,              ["A whole AI agent on a laptop? That's cool!", "Local AI, zero cloud. Nice!"]],
        [/mendikot/,           ["AlphaZero from scratch for a card game? That's cool!", "It learned by playing itself. Smart pup!"]],
        [/anatomy|cve-2025/,   ["A CVSS 9.8 teardown. That's one serious bug!", "Path traversal, explained properly. Nice!"]],
        [/network intrusion/,  ["Sniffing out zero-days with ML. My kind of work!", "Machine learning on 2M+ records. That's cool!"]],
        [/harvard|cs50/,       ["Harvard CS50! That took effort!"]],
        [/kill chain/,         ["Know every stage of the attack. Smart!"]],
        [/osint/,              ["Sniffing out public info. I'm good at that too!"]],
        [/offensive/,          ["Ethical hacking, the good kind!"]],
        [/recon/,              ["Scout first, act second. Wise!"]],
        [/aws/,                ["An AWS badge? That took effort!", "Cloud architect in training. Nice!"]],
        [/^> languages/,       ["So many languages! I only know woof."]],
        [/^> security/,        ["Kali Linux, Burp Suite... fancy!"]],
        [/^> ai/,              ["Neural nets! Can they fetch?"]],
        [/^> web/,             ["Full stack. Good human!"]],
        [/github/,             ["Fetch the code!", "Where the good code lives!"]],
        [/linkedin/,           ["Say hi, professionally!"]],
        [/^email/,             ["Tell Bhushan that Thomas says hi!"]],
        [/latest post/,        ["Fresh reading!"]],
        [/archive/,            ["So many posts to sniff through!"]],
        [/home/,               ["Back to the blog home!"]],
        [/rss/,                ["Subscribe! Treats for your reader."]]
    ];
    var NAV = ["Off we go!", "Follow me!", "Sniff sniff... this way!"];

    function lineFor(item, key) {
        if (item.matches("nav a")) return /resume/.test(key) ? ["Fetching the r\u00e9sum\u00e9!"] : NAV;
        if (item.matches("#about p")) return ["That's my amigo Bhushan! He builds secure things.", "Good human. Very good human."];
        for (var i = 0; i < RULES.length; i++) if (RULES[i][0].test(key)) return RULES[i][1];
        return null;
    }

    var ITEMS = ".project-item,.certificate-card,.credly-badge-card,.skill-category,.social-links a,nav a,#about p";
    document.addEventListener("click", function (e) {
        var item = e.target.closest ? e.target.closest(ITEMS) : null;
        if (!item || el.hidden) return;
        var t = item.querySelector(".certificate-title, h3");
        var key = (item.getAttribute("data-badge-title") || (t || item).textContent).toLowerCase().replace(/\s+/g, " ").trim();
        var lines = lineFor(item, key);
        if (lines) say(pick(lines));
    });

    // The Credly iframe swallows clicks, so the badge reacts to hover instead
    document.querySelectorAll(".credly-badge-card").forEach(function (card) {
        card.addEventListener("mouseenter", function () {
            if (bubble.hidden) say(pick(["An AWS badge? That took effort!", "Cloud architect in training. Nice!"]));
        });
    });

    function intro() {
        var seen = null;
        try { seen = sessionStorage.getItem("thomasIntro"); sessionStorage.setItem("thomasIntro", "1"); } catch (e) { /* ignore */ }
        if (!seen) setTimeout(function () {
            say("Hello! I'm Thomas, your guide to the portfolio of my amigo Bhushan Ladgaonkar. Click around and I'll comment!", 7000);
        }, 2400);
    }

    sync();
    if (enabled) { show(); intro(); }
})();