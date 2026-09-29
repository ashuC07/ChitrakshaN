/* =============================================
   CHITRAKSHA — College Media Club
   script.js
   ============================================= */

// ─────────────────────────────────────────────
// PRELOADER
// ─────────────────────────────────────────────
window.scrollTo(0, 0);
document.body.style.overflow = 'hidden'; // Ensure no scrolling while loading
document.documentElement.style.overflow = 'hidden';
const preloader = document.getElementById('preloader');
const progressText = document.getElementById('progress-text');
const loaderCircleFg = document.getElementById('loader-circle-fg');
const loadingTexts = ["SYSTEM_INIT.EXE", "LOADING_ASSETS...", "DECODING_DATA...", "INITIALIZING_UI..."];
let currentTextIndex = 0;
const glitchTextEl = document.querySelector('.glitch-text');

let progress = 0;
const duration = 4800; // ms
const startTime = performance.now();

function playEntrySound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const t = audioCtx.currentTime;

        // 1. Deep Cinematic Sub Hit
        const subOsc = audioCtx.createOscillator();
        const subGain = audioCtx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(120, t);
        subOsc.frequency.exponentialRampToValueAtTime(30, t + 0.5);

        subGain.gain.setValueAtTime(0, t);
        subGain.gain.linearRampToValueAtTime(0.5, t + 0.05); // quick punch
        subGain.gain.exponentialRampToValueAtTime(0.001, t + 1.5);

        subOsc.connect(subGain);
        subGain.connect(audioCtx.destination);
        subOsc.start(t);
        subOsc.stop(t + 2);

        // 2. High-Tech Digital Sweep/Ping
        const pingOsc = audioCtx.createOscillator();
        const pingGain = audioCtx.createGain();
        pingOsc.type = 'square';
        pingOsc.frequency.setValueAtTime(2500, t);
        pingOsc.frequency.exponentialRampToValueAtTime(800, t + 0.15);

        pingGain.gain.setValueAtTime(0, t);
        pingGain.gain.linearRampToValueAtTime(0.05, t + 0.02);
        pingGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

        const pingFilter = audioCtx.createBiquadFilter();
        pingFilter.type = 'bandpass';
        pingFilter.frequency.value = 1500;

        pingOsc.connect(pingFilter);
        pingFilter.connect(pingGain);
        pingGain.connect(audioCtx.destination);
        pingOsc.start(t);
        pingOsc.stop(t + 0.5);

        // 3. Lush, Expensive Evolving Pad (Cmaj9)
        const chordFreqs = [261.63, 392.00, 587.33, 659.25]; // C4, G4, D5, E5

        chordFreqs.forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            const filter = audioCtx.createBiquadFilter();

            // Triangle waves feel smooth and glassy
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t);

            // Slight randomized detune for analog warmth
            osc.detune.value = (Math.random() - 0.5) * 8;

            // Filter envelope: opens up slightly and then closes
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(400, t);
            filter.frequency.exponentialRampToValueAtTime(2500, t + 0.6);
            filter.frequency.exponentialRampToValueAtTime(300, t + 2.5);

            // Volume envelope: smooth fade in, long fade out
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.08, t + 0.2 + (i * 0.08));
            gain.gain.exponentialRampToValueAtTime(0.001, t + 3);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(t);
            osc.stop(t + 3.5);
        });

    } catch (e) {
        console.log("Audio play blocked by browser policy. Interaction needed.");
    }
}

function updateLoader(currentTime) {
    const elapsed = currentTime - startTime;
    progress = Math.min((elapsed / duration) * 100, 100);

    // Non-linear easing for techy feel (jumpy)
    let displayProgress = progress;
    if (progress > 10 && progress < 30) displayProgress = 15;
    else if (progress > 45 && progress < 60) displayProgress = 52;
    else if (progress > 70 && progress < 85) displayProgress = 76;
    else displayProgress = Math.floor(progress);

    if (progressText) progressText.textContent = displayProgress;

    if (loaderCircleFg) {
        // stroke-dasharray is 283
        const offset = 283 - (displayProgress / 100) * 283;
        loaderCircleFg.style.strokeDashoffset = offset;
    }

    if (progress < 100) {
        requestAnimationFrame(updateLoader);

        // Change text occasionally
        if (Math.random() > 0.98 && glitchTextEl) {
            currentTextIndex = (currentTextIndex + 1) % loadingTexts.length;
            glitchTextEl.textContent = loadingTexts[currentTextIndex];
            glitchTextEl.setAttribute('data-text', loadingTexts[currentTextIndex]);
        }
    } else {
        // Play the sound right when it hits 100%
        playEntrySound();

        setTimeout(() => {
            if (preloader) preloader.classList.add('loaded');
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }, 300);
    }
}
requestAnimationFrame(updateLoader);


// ─────────────────────────────────────────────
// CUSTOM CURSOR
// ─────────────────────────────────────────────
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';

    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;

    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';

    requestAnimationFrame(animateCursor);
}
animateCursor();


// ─────────────────────────────────────────────
// SCROLL PROGRESS BAR
// ─────────────────────────────────────────────
const progressBar = document.getElementById('progressBar');

window.addEventListener('scroll', () => {
    const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    progressBar.style.transform = `scaleX(${scrolled})`;
});


// ─────────────────────────────────────────────
// MARQUEE TICKER
// ─────────────────────────────────────────────
const marqueeItems = [
    'Reels', 'Shorts', 'Documentaries', 'Campus Life',
    'Cultural Fests', 'Behind the Scenes', 'Photography',
    'Visual Stories', 'Chitraksha'
];

const marqueeTrack = document.getElementById('marqueeTrack');

// Duplicate items for seamless infinite loop
[...marqueeItems, ...marqueeItems].forEach(text => {
    const span = document.createElement('span');
    span.className = 'marquee-item';
    span.innerHTML = `${text} <span class="dot">✦</span>`;
    marqueeTrack.appendChild(span);
});


// ─────────────────────────────────────────────
// PARALLAX — SCROLL + MOUSE
// ─────────────────────────────────────────────
const parallaxFloat1 = document.getElementById('pf1');
const parallaxFloat2 = document.getElementById('pf2');

window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (parallaxFloat1) parallaxFloat1.style.transform = `translateY(${y * 0.15}px)`;
    if (parallaxFloat2) parallaxFloat2.style.transform = `translateY(${-y * 0.08}px)`;
});

document.addEventListener('mousemove', e => {
    const cx = e.clientX / window.innerWidth - 0.5;
    const cy = e.clientY / window.innerHeight - 0.5;
    if (parallaxFloat1) {
        parallaxFloat1.style.transform +=
            ` translate(${cx * 20}px, ${cy * 20}px)`;
    }
});


// ─────────────────────────────────────────────
// SCROLL REVEAL — INTERSECTION OBSERVER
// ─────────────────────────────────────────────
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.12 });

revealElements.forEach(el => revealObserver.observe(el));


// ─────────────────────────────────────────────
// GALLERY — POPULATE & UPLOAD
// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// GALLERY — GOOGLE SHEETS CMS
// ─────────────────────────────────────────────
// 🔧 SETUP: Replace the URL below with YOUR published Google Sheet CSV link.
// See setup-guide.html for step-by-step instructions.
// ─────────────────────────────────────────────

const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTA5DOppmnONhXm3KnJuTueqVlZVFjIC0o1Yd_e-lVaEpu28am6lJF-z-byyb1zw-i-AejgvDVWZGGb/pub?gid=0&single=true&output=csv';

// ── Column names expected in your Google Sheet (row 1 headers) ──
// Title | Category | Type | FileID | Description
//
// Type must be either: photo  OR  video
// FileID can be a Google Drive file ID or a full share link.

const galleryGrid = document.getElementById('galleryGrid');
const galleryRail = document.getElementById('galleryRail');
const galleryRailTrack = document.getElementById('galleryRailTrack');
const DRIVE_FOLDER_IMAGES = [
    ['0N5A1025.JPG', '1eTPQ0MHO65LJxbnbUVHZ2InYlZDLkctM'],
    ['0N5A1026.JPG', '1Klq4UblzWd4zUZoQEUftA__V10qw5NxK'],
    ['0N5A1029.JPG', '1ivbmuFdnkr3M4f_i5Vk2SQoinYAKnwTG'],
    ['0N5A1171.JPG', '10Wk12A7G7WxHeVeXglZRqoa_PhBfsRil'],
    ['0N5A1174.JPG', '1QuK3o9STHkWm29Jmz-RXobnykat3AVM5'],
    ['0N5A1178.JPG', '1pfZampNsg3wwxBMpfb7nInjnhhRydVpo'],
    ['0N5A1191.JPG', '1jUDAr22Yr242okRASukGpurfNwbcyn8b'],
    ['0N5A1194.JPG', '1IwIW0ceGlHQl7abRKFRtYIulx3i_s6zD'],
    ['0N5A1197.JPG', '1aLUWU1XndAWK02tuOdSGGEnfiwMtLgWU'],
    ['0N5A1200.JPG', '1igin_hv0z8TtS27NI96fsv-0OVuMnz1t'],
    ['0N5A1202.JPG', '1KbQbJHWnxS0KFidkJ2tf4y2QZ3JY8O50'],
    ['0N5A1203.JPG', '19R9HthYaLLrNcoZGYlm3ufXEjMaObzGw'],
    ['0N5A1204.JPG', '17ohgddCszND26LHJx1NVF2pbXX530_AQ'],
    ['0N5A1207.JPG', '1hXvih07gGdHDs3bHICjWeFm3oa-pnm4l'],
    ['0N5A1208.JPG', '1HYW9yjDpQb1N0VJ-m87SmYIDfVniJyfO'],
    ['0N5A1210.JPG', '1vzwIel4paR_6VuqDdILytDeommt4IXiY'],
    ['0N5A1212.JPG', '1iyTnV7EO3phk6ngmFiBXS5KJdRszFSfV'],
    ['0N5A1213.JPG', '1inwgdQsM0-bqlP_Zy4zkFA3jSSOR7vSo'],
    ['0N5A1214.JPG', '1VLed2WjTqDRhSX91H5I-9X_MXKsuHl5U'],
    ['0N5A1216.JPG', '1Xr3q3rIklqvdemiDtfAp1-V9_S71pK-Q'],
    ['0N5A1217.JPG', '17OfyKtN8oC8DSkn9DhorO9zdksbGlQxH'],
    ['0N5A1218.JPG', '1vXGa-bkXlfC_uBeS9D2ampzelk4JGHtG'],
    ['0N5A1219.JPG', '1P2ljPC9iVmH_VPmPN4-8nRnwCt3jUzfI'],
    ['0N5A1220.JPG', '1gDBRFyUx3aMU_nNdhrjaCxsXmnQIRig5'],
    ['0N5A1223.JPG', '15ScF4y7981eAAjdisEwpp_jvZlZOeNhY'],
    ['0N5A1224.JPG', '1KTgptmmCXEaIOca0liwoRdmNqSsIVHhC'],
    ['0N5A1226.JPG', '182WugQ_gyAszk7HCvUcyL4MsvRuHDoMF'],
    ['0N5A1227.JPG', '1hFUmI_XMoZU1UQGyCV3stW0mGSdn7Wwd'],
    ['0N5A1232.JPG', '1y8T05ZvnTtM4uc-ZayjwpOU9idxenPM_'],
    ['0N5A1233.JPG', '1TdgxTLqlSlwPT2jqb1Zf0xVToNEGNjad'],
    ['0N5A1234.JPG', '105SzGtsAO83cU9LXOaJTBKoR2hXhgUcR'],
    ['0N5A1249.JPG', '1kwcQXDsfMjA29-vHCwE0hogYlbxzqXOT'],
    ['0N5A1254.JPG', '1QQ6JMH7_dLU-VFUsy8CxTyYOpl8Gdxpe'],
    ['0N5A1256.JPG', '19pB-daD6gMejh89LIwRwPAWQONy14L0G'],
    ['0N5A1259.JPG', '1QGuj5PtgDgsUopH4YqQ1Lskwk9CvVsXs'],
    ['0N5A1261.JPG', '1PIbJ1XK-SeqTBmAg01MjKV2I20TZS4lc'],
    ['0N5A4696.JPG', '1ZaaPt1gIe804IB6tbNYhiNT2fSyRUdWZ'],
    ['0N5A4697.JPG', '1EPtqNfRWVRqLDlYEXNMjwnZzptXYkkKW'],
    ['0N5A4698.JPG', '1wNqRLrZK5_cEa-2UL7pz7xBKC09CxByU'],
    ['0N5A4699.JPG', '1uPe1r4FDEWTJhL0iKSI55AgcX25dDrZE'],
    ['0N5A4701.JPG', '1PvRjKN6T6u-hPgwlMG_lv3y2Fj52xs3H'],
    ['0N5A4709.JPG', '1jwmjYElQfHNn-yXqrurfpRKzR9LZrFGH'],
    ['0N5A4714.JPG', '1pfpWzllNYlHDyDGIZs0VqXw3fNPqiQ6v'],
    ['0N5A4718.JPG', '1wEYRx3K18OER_IV9zKumudR7lAzazHXv'],
    ['0N5A4719.JPG', '12cC8TAdCcMiazyyKOjku76OYFQp_03OI'],
    ['0N5A4724.JPG', '11dn6zOuIOLvhFhP_OXfhXSMT6BXX8RQ_'],
    ['0N5A4725.JPG', '1VnVldISue0MXIQjWW_KSxMY5JTzzy6D6'],
    ['0N5A4728.JPG', '1Y4nKuB64UZnYB4-rcmXao1et5YS2kNY2'],
    ['0N5A4732.JPG', '1-D_kbl6Z9Gu2DChz-uZv5s-uWLH1bqQB'],
    ['0N5A4738.JPG', '1vNHuX8Q_wQ360k7SvwNo-uYJENleTDeF'],
    ['0N5A4739.JPG', '1hmonVhN518JrDJS6QoHT9TtmJZKKMLXJ'],
    ['0N5A4747.JPG', '1-m7lD4LD76jcjKq_qwsao8ZeLjOEu-6Y'],
    ['0N5A4752.JPG', '1YmMpupQHX22CBNupZkO6t4TlMVmGl2Kz'],
    ['0N5A4755.JPG', '1-yY5s4ABl1AmgYXt4ZC3tMtkpUxE1rZ4'],
    ['0N5A4757.JPG', '1DdBzyub7HlQMngFTyBO5eAeDCCT0nSbR'],
    ['0N5A4759.JPG', '15ZUQW_ltD3WOxYb78jDk3uWreMXO2R_r'],
    ['0N5A4761.JPG', '1X9CJwdxakjJ2-bBJuuNVxEHQjD9O1uJg'],
    ['0N5A4763.JPG', '1UJy6unp4LHOjYxh6pAwT8jts4m2fLD_9'],
    ['0N5A4770.JPG', '1mzbMUYv3nSAtfP86d9qcsYWW20nIDmpf'],
    ['0N5A4771.JPG', '1tv9rl8Xaq9_QBi_Qehi7D-hWRLD8pehr'],
    ['0N5A4778.JPG', '1p6lSOX5vN9infnub4zj5XSSXXq9KvEfM'],
    ['0N5A4783.JPG', '1h4-x4w8d2lFwAe-l224JYg60cUurn8is'],
    ['0N5A4785.JPG', '1HDHp1fZilaNOrLEWkOA0aw5u2sd_era3'],
    ['0N5A4789.JPG', '1KqKbFJmB0Dl2BErWl57xF1_v-uIvnvqx'],
    ['0N5A4790.JPG', '1xIPpkzQC5vGOcu4cVblWGQgtuBfONcyJ'],
    ['0N5A4791.JPG', '1dSr22-VqhnW-eIuxELDk43lOPtyc5VRb'],
    ['0N5A4794.JPG', '1ejQNwopOtXyn9QgJiba-BBbKpJSS8HMo'],
    ['0N5A4795.JPG', '126SmxmVAHM_wVRNXFUdwzSLMmJTu4umC'],
    ['0N5A4796.JPG', '10J4MFc3O7O3YOvFfseAcishMHGOJBi0c'],
    ['0N5A4797.JPG', '1-VpeM8_ItcJJ6kAer3cYJOdU0GUgNM2-'],
    ['0N5A4798.JPG', '1smXdCVMXRp_JNVSHO8JuQdyAIXBwwuxp'],
    ['0N5A4799.JPG', '1m_1EQoRW0p-nP_kNPS9erGwyWXpmqtqK'],
    ['0N5A4800.JPG', '1PHw0lm86NH_3DNipWl3USJzFayFEv5uG'],
    ['0N5A4803.JPG', '1UuBN06Utr-c-o0xTxtOFMjqzGaMNL-wx'],
    ['0N5A4804.JPG', '1BMBcMAMl5Z_FupJPe0DYyB2KGTmokWBO']
].map(([title, fileId], index) => ({
    Title: title,
    Category: `FRAME ${String(index + 1).padStart(2, '0')}`,
    Type: 'photo',
    FileID: fileId,
    Description: ''
}));

document.getElementById('viewAllPhotos').addEventListener('click', () => {
    sessionStorage.setItem('chitrakshaDrivePhotos', JSON.stringify(DRIVE_FOLDER_IMAGES));
});

function renderGalleryRail(items) {
    galleryRailTrack.innerHTML = '';
    galleryRail.hidden = items.length === 0;
    if (!items.length) return;

    const itemWidth = 246;
    const copiesPerSet = Math.max(1, Math.ceil((galleryRail.clientWidth + itemWidth) / (items.length * itemWidth)));

    [false, true].forEach(isDuplicate => {
        const set = document.createElement('div');
        set.className = 'gallery-rail-set';
        if (isDuplicate) set.setAttribute('aria-hidden', 'true');

        for (let copy = 0; copy < copiesPerSet; copy++) {
            items.forEach(item => {
                const title = field(item, 'Title');
                const category = field(item, 'Category');
                const type = field(item, 'Type').toLowerCase() || 'photo';
                const fileId = field(item, 'FileID');
                const desc = field(item, 'Description');
                const isInteractive = !isDuplicate && copy === 0;
                const tile = document.createElement('button');
                tile.type = 'button';
                tile.className = 'gallery-rail-item';
                tile.tabIndex = isInteractive ? 0 : -1;
                tile.setAttribute('aria-label', `View ${title}`);
                if (!isInteractive) tile.setAttribute('aria-hidden', 'true');
                const image = document.createElement('img');
                image.src = getDriveThumb(fileId);
                image.alt = '';
                image.loading = 'lazy';
                image.addEventListener('error', () => {
                    tile.classList.add('gallery-rail-item-unavailable');
                    tile.disabled = true;
                }, { once: true });

                const caption = document.createElement('span');
                caption.textContent = `${category || 'CHITRAKSHA'} · ${title.replace(/\.[^.]+$/, '')}`;
                tile.append(image, caption);
                if (isInteractive) {
                    tile.addEventListener('click', () => openLightbox({ title, category, type, fileId, desc }));
                }
                set.appendChild(tile);
            });
        }

        galleryRailTrack.appendChild(set);
    });
}

// ── Skeleton loader while fetching ──────────────────────────────
function showGallerySkeletons(count = 6) {
    galleryGrid.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const el = document.createElement('div');
        el.className = 'gallery-item gallery-skeleton';
        el.innerHTML = `<div class="skeleton-shimmer"></div>`;
        galleryGrid.appendChild(el);
    }
}

// ── CSV parser (handles quoted fields with commas inside) ────────
function parseCSV(text) {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    return lines.slice(1).map(line => {
        const values = [];
        let current = '';
        let inQuotes = false;
        for (const char of line) {
            if (char === '"') { inQuotes = !inQuotes; }
            else if (char === ',' && !inQuotes) { values.push(current.trim()); current = ''; }
            else { current += char; }
        }
        values.push(current.trim());
        const row = Object.fromEntries(headers.map((h, i) => [h, (values[i] || '').replace(/^"|"$/g, '')]));
        return row;
    }).filter(row => row.Title || row.title); // skip empty rows
}

// ── Helper: normalise field names (case-insensitive) ────────────
function field(row, key) {
    return row[key] || row[key.toLowerCase()] || row[key.toUpperCase()] || '';
}

// ── Google Drive URL helpers ─────────────────────────────────────
function getDriveFileId(fileIdOrUrl) {
    const value = String(fileIdOrUrl || '').trim();
    const match = value.match(/\/d\/([^/?]+)|[?&]id=([^&]+)/);
    return decodeURIComponent(match?.[1] || match?.[2] || value);
}

function getDriveThumb(fileIdOrUrl) {
    return `https://drive.google.com/thumbnail?id=${getDriveFileId(fileIdOrUrl)}&sz=w600`;
}

// ── Google Drive full image URL ──────────────────────────────────
function getDriveView(fileIdOrUrl) {
    return `https://drive.google.com/thumbnail?id=${getDriveFileId(fileIdOrUrl)}&sz=w1600`;
}

// ── Google Drive video URL ───────────────────────────────────────
function getDriveVideo(fileIdOrUrl) {
    return `https://drive.google.com/file/d/${getDriveFileId(fileIdOrUrl)}/preview`;
}

// ── Render gallery with optional category filter ─────────────────
function renderGallery(items, activeFilter = 'All') {
    // Build/refresh filter bar
    const categories = ['All', ...new Set(items.map(i => field(i, 'Category')).filter(Boolean))];
    let filterBar = document.getElementById('galleryFilterBar');
    if (!filterBar) {
        filterBar = document.createElement('div');
        filterBar.id = 'galleryFilterBar';
        filterBar.className = 'gallery-filter-bar';
        galleryGrid.parentElement.insertBefore(filterBar, galleryRail);
    }
    filterBar.innerHTML = categories.map(cat =>
        `<button class="gallery-filter-btn${cat === activeFilter ? ' active' : ''}" data-cat="${cat}">${cat}</button>`
    ).join('');
    filterBar.querySelectorAll('.gallery-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => renderGallery(items, btn.dataset.cat));
    });

    // Filter
    const filtered = activeFilter === 'All'
        ? items
        : items.filter(i => field(i, 'Category') === activeFilter);

    galleryGrid.innerHTML = '';

    if (filtered.length === 0) {
        galleryGrid.innerHTML = `<p class="gallery-empty">No items in this category yet.</p>`;
        return;
    }

    filtered.forEach((item, idx) => {
        const title    = field(item, 'Title');
        const category = field(item, 'Category');
        const type     = field(item, 'Type').toLowerCase() || 'photo';
        const fileId   = field(item, 'FileID');
        const desc     = field(item, 'Description');

        const el = document.createElement('div');
        el.className = 'gallery-item reveal';
        el.style.animationDelay = `${idx * 0.04}s`;

        const isVideo = type === 'video';

        el.innerHTML = `
            <img
                src="${getDriveThumb(fileId)}"
                alt="${title}"
                class="gallery-img"
                loading="lazy"
                onerror="this.style.display='none'; this.parentElement.querySelector('.gallery-placeholder-icon').style.display='flex';"
            >
            <div class="gallery-placeholder-icon" style="display:none;">${isVideo ? '🎬' : '📸'}</div>
            ${isVideo ? '<div class="gallery-video-badge"><span>▶</span> VIDEO</div>' : ''}
            <div class="gallery-item-overlay">
                <div class="gallery-item-tag">${category}</div>
                <div class="gallery-item-title">${title}</div>
                ${desc ? `<div class="gallery-item-desc">${desc}</div>` : ''}
            </div>`;

        el.addEventListener('click', () => openLightbox({ title, category, type, fileId, desc }));
        galleryGrid.appendChild(el);

        if (typeof revealObserver !== 'undefined') revealObserver.observe(el);
    });
}

renderGalleryRail(DRIVE_FOLDER_IMAGES);

// ── Lightbox ─────────────────────────────────────────────────────
function openLightbox({ title, category, type, fileId, desc }) {
    const lb = document.createElement('div');
    lb.id = 'galleryLightbox';

    const mediaHTML = type === 'video'
        ? `<iframe src="${getDriveVideo(fileId)}" allowfullscreen class="lb-video"></iframe>`
        : `<img src="${getDriveView(fileId)}" alt="${title}" class="lb-img">`;

    lb.innerHTML = `
        <div class="lb-backdrop"></div>
        <div class="lb-inner">
            <button class="lb-close" aria-label="Close">✕</button>
            <div class="lb-media">${mediaHTML}</div>
            <div class="lb-caption">
                <span class="lb-tag">${category}</span>
                <span class="lb-title">${title}</span>
                ${desc ? `<span class="lb-desc">${desc}</span>` : ''}
            </div>
        </div>`;

    document.body.appendChild(lb);
    setTimeout(() => lb.classList.add('active'), 10);

    const close = () => {
        lb.classList.remove('active');
        setTimeout(() => lb.remove(), 350);
    };
    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.querySelector('.lb-backdrop').addEventListener('click', close);
    document.addEventListener('keydown', function escFn(e) {
        if (e.key === 'Escape') { close(); document.removeEventListener('keydown', escFn); }
    });
}

// ── Init: fetch Sheet → parse → render ──────────────────────────
showGallerySkeletons(6);

fetch(SHEET_CSV_URL)
    .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
    })
    .then(csv => {
        const items = parseCSV(csv);
        if (!items.length) throw new Error('Sheet is empty or headers are wrong.');
        renderGallery(items);
    })
    .catch(err => {
        console.error('[Chitraksha Gallery]', err);
        galleryGrid.innerHTML = '';
    });



// ─────────────────────────────────────────────
// STORIES / REELS — POPULATE
// ─────────────────────────────────────────────
const storiesData = [
    {
        // DWBI-xpjk7_
        iframe: `<blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/reel/DWBI-xpjk7_/" data-instgrm-version="14" style="background:#FFF; border:0; margin:0; padding:0; width:100%; min-width:100%;"></blockquote>`
    },
    {
        // DVtI9OMkh2q
        iframe: `<blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/reel/DVtI9OMkh2q/" data-instgrm-version="14" style="background:#FFF; border:0; margin:0; padding:0; width:100%; min-width:100%;"></blockquote>`
    },
    {
        // DV-_VkND2Dz
        iframe: `<blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/reel/DV-_VkND2Dz/" data-instgrm-version="14" style="background:#FFF; border:0; margin:0; padding:0; width:100%; min-width:100%;"></blockquote>`
    }
];

const storiesGrid = document.getElementById('storiesGrid');

storiesData.forEach((story, i) => {
    const el = document.createElement('div');
    el.className = 'story-card reveal' + (i > 0 ? ` reveal-delay-${i}` : '');

    // Allow the inner card to shrink/grow as needed for the embed
    el.style.padding = '0';
    el.style.overflow = 'hidden';

    if (story.iframe) {
        el.innerHTML = story.iframe;
    } else {
        el.innerHTML = `
        <div class="story-card-bg">${story.emoji}</div>
        <div class="story-card-content">
          <div class="story-card-tag">${story.tag}</div>
          <div class="story-card-title">${story.title}</div>
          <div class="story-card-meta">${story.date}</div>
        </div>
        <div class="story-card-play">▶</div>`;
    }

    storiesGrid.appendChild(el);
    if (typeof revealObserver !== 'undefined') {
        revealObserver.observe(el);
    }
});

// Load the official Instagram embed script to unlock inline playback
const instagramScript = document.createElement('script');
instagramScript.src = "//www.instagram.com/embed.js";
instagramScript.async = true;
document.body.appendChild(instagramScript);

if (window.instgrm) {
    window.instgrm.Embeds.process();
}


// ─────────────────────────────────────────────
// TEAM — POPULATE
// ─────────────────────────────────────────────
const teamData = [
    { name: 'Aditya Chalak', role: 'Media Secretary', init: 'AC', bio: 'Mastering the art of campus communication.' },
    { name: 'Suhani Malviya', role: 'Student Main Coordinator', init: 'SM', bio: 'Leading the crew, framing the vision.' },
    { name: 'Yash Patil', role: 'CVE', init: 'YP', bio: 'Digital storyteller and visual architect.' },
    { name: 'Gitesh Joshi', role: 'Videography Main Coordinator', init: 'GJ', bio: 'Directing cinematic movements on campus.' },
    { name: 'Nayan Wankhede', role: 'Photography Head', init: 'NW', bio: 'Capturing moments before they fade.' },
    { name: 'Suyash Maske', role: 'Director Of Photography', init: 'SM', bio: 'Curating the college heartbeat online.' },
];

const teamGrid = document.getElementById('teamGrid');

teamData.forEach((member, i) => {
    const el = document.createElement('div');
    el.className = `team-card reveal reveal-delay-${(i % 4) + 1}`;
    el.innerHTML = `
        <div class="team-card-inner">
            <div class="team-avatar-wrap">
                <div class="team-avatar-ring"></div>
                <div class="team-avatar">${member.init}</div>
            </div>
            <div class="team-info">
                <h3 class="team-name">${member.name}</h3>
                <div class="team-role">${member.role}</div>
                <p class="team-bio">${member.bio}</p>
                <div class="team-socials">
                    <a href="#" title="Instagram"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
                    <a href="#" title="LinkedIn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-11h4v1.76"></path><path d="M4 11h4v11H4z"></path><circle cx="6" cy="6" r="2"></circle></svg></a>
                </div>
            </div>
        </div>
        <div class="team-card-glow"></div>
    `;
    teamGrid.appendChild(el);

    if (typeof revealObserver !== 'undefined') {
        revealObserver.observe(el);
    }

    // Interactive 3D Tilt Effect
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -12; // Max 12 deg
        const rotateY = ((x - centerX) / centerX) * 12;

        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

        const glow = el.querySelector('.team-card-glow');
        if (glow) {
            glow.style.left = `${x}px`;
            glow.style.top = `${y}px`;
            glow.style.opacity = '1';
        }
    });

    el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        const glow = el.querySelector('.team-card-glow');
        if (glow) {
            glow.style.opacity = '0';
        }
    });
});


// ─────────────────────────────────────────────
// HERO — SPLIT CHARACTER ANIMATION
// ─────────────────────────────────────────────
document.querySelectorAll('.hero-title .accent-word').forEach(el => {
    el.innerHTML = [...el.textContent]
        .map((char, i) =>
            `<span class="split-char" style="animation-delay:${0.05 * i + 0.3}s">${char}</span>`
        )
        .join('');
});

// ─────────────────────────────────────────────
// MOBILE MENU TOGGLE
// ─────────────────────────────────────────────
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-links');

if (mobileMenu && navLinks) {
    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('is-active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('is-active');
            navLinks.classList.remove('active');
        });
    });
}
/* =============================================
   CHITRAKSHA — 3D DEPTH CAMERA PARALLAX
   parallax3d.js  — add AFTER script.js
   ============================================= */

(function init3DParallax() {

    const hero = document.getElementById('hero');
    if (!hero) return;

    /* ─────────────────────────────────────────
       DEPTH LAYER CONFIG
       strength = how much each layer moves (px)
       negative = moves opposite to mouse (recedes)
       positive = moves same as mouse (comes forward)
    ───────────────────────────────────────────*/
    const layers = [
        { selector: '.hero-grid-bg', strengthX: -18, strengthY: -12, zShift: -5 },
        { selector: '.hero-glow', strengthX: -14, strengthY: -10, zShift: 0 },
        { selector: '.hero-glow2', strengthX: -10, strengthY: -8, zShift: 0 },
        { selector: '#pf1', strengthX: -8, strengthY: -6, zShift: 0 },
        { selector: '#pf2', strengthX: -6, strengthY: -4, zShift: 0 },
        { selector: '.hero-eyebrow', strengthX: 4, strengthY: 3, zShift: 0 },
        { selector: '.hero-title', strengthX: 10, strengthY: 7, zShift: 0 },
        { selector: '.hero-sub', strengthX: 14, strengthY: 9, zShift: 0 },
        { selector: '.hero-ctas', strengthX: 20, strengthY: 12, zShift: 0 },
        { selector: '.hero-scroll-hint', strengthX: 6, strengthY: 4, zShift: 0 },
    ];

    /* ─────────────────────────────────────────
       BUILD RETICLE
    ───────────────────────────────────────────*/
    const reticle = document.createElement('div');
    reticle.id = 'hero-reticle';
    reticle.innerHTML = `
        <div class="reticle-corner tl"></div>
        <div class="reticle-corner tr"></div>
        <div class="reticle-corner bl"></div>
        <div class="reticle-corner br"></div>
    `;
    hero.appendChild(reticle);

    /* ─────────────────────────────────────────
       BUILD DEPTH INDICATOR (right edge pips)
    ───────────────────────────────────────────*/
    const depthInd = document.createElement('div');
    depthInd.id = 'depth-indicator';
    depthInd.innerHTML = `
        <div class="depth-pip p1"></div>
        <div class="depth-pip p2"></div>
        <div class="depth-pip p3"></div>
        <div class="depth-pip p4"></div>
        <div class="depth-pip p5"></div>
        <span>depth</span>
    `;
    hero.appendChild(depthInd);

    /* ─────────────────────────────────────────
       DEPTH FOG
    ───────────────────────────────────────────*/
    const fog = document.createElement('div');
    fog.id = 'hero-depth-fog';
    hero.appendChild(fog);

    /* ─────────────────────────────────────────
       RESOLVE ELEMENTS
    ───────────────────────────────────────────*/
    const resolved = layers.map(l => ({
        ...l,
        el: hero.querySelector(l.selector)
    })).filter(l => l.el);

    /* ─────────────────────────────────────────
       STATE
    ───────────────────────────────────────────*/
    let targetX = 0, targetY = 0;   // normalised -1 to 1
    let currentX = 0, currentY = 0; // smoothed
    let rafId = null;
    let isHovering = false;

    const LERP_FACTOR = 0.07; // lower = smoother / more lag

    /* ─────────────────────────────────────────
       MOUSE TRACKING
    ───────────────────────────────────────────*/
    hero.addEventListener('mousemove', e => {
        const rect = hero.getBoundingClientRect();
        // -1 (left/top)  to  +1 (right/bottom)
        targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

        // Move reticle
        reticle.style.left = (e.clientX - rect.left) + 'px';
        reticle.style.top = (e.clientY - rect.top) + 'px';

        // Fog follows opposite (depth effect)
        const fogX = (50 + targetX * -15).toFixed(1);
        const fogY = (50 + targetY * -15).toFixed(1);
        fog.style.setProperty('--fog-x', fogX + '%');
        fog.style.setProperty('--fog-y', fogY + '%');
    });

    hero.addEventListener('mouseenter', () => {
        isHovering = true;
        if (!rafId) rafId = requestAnimationFrame(tick);
    });

    hero.addEventListener('mouseleave', () => {
        isHovering = false;
        targetX = 0;
        targetY = 0;
    });

    /* ─────────────────────────────────────────
       ANIMATION LOOP
    ───────────────────────────────────────────*/
    function lerp(a, b, t) { return a + (b - a) * t; }

    function updateDepthPips(nx) {
        // -1 to 1 → pip index 0-4
        const pip = Math.round((nx + 1) / 2 * 4);
        depthInd.querySelectorAll('.depth-pip').forEach((p, i) => {
            p.classList.toggle('active', i === pip);
        });
    }

    function tick() {
        // Smooth interpolation
        currentX = lerp(currentX, targetX, LERP_FACTOR);
        currentY = lerp(currentY, targetY, LERP_FACTOR);

        // Expose as CSS variables for shadow trick
        hero.style.setProperty('--tilt-x', currentX.toFixed(3));
        hero.style.setProperty('--tilt-y', currentY.toFixed(3));

        // Apply transforms per layer
        resolved.forEach(layer => {
            const tx = currentX * layer.strengthX;
            const ty = currentY * layer.strengthY;
            layer.el.style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px)`;
            layer.el.style.willChange = 'transform';
        });

        // Update depth pips
        updateDepthPips(currentX);

        // Keep running while hovering OR while returning to rest
        const atRest = Math.abs(currentX) < 0.001 && Math.abs(currentY) < 0.001;
        if (!atRest || isHovering) {
            rafId = requestAnimationFrame(tick);
        } else {
            rafId = null;
            // Reset all transforms cleanly
            resolved.forEach(layer => {
                layer.el.style.transform = '';
            });
        }
    }

    /* ─────────────────────────────────────────
       GYROSCOPE SUPPORT (mobile)
       — uses device orientation as mouse proxy
    ───────────────────────────────────────────*/
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', e => {
            if (!e.gamma && !e.beta) return;
            // gamma = left/right tilt (-90 to 90)
            // beta  = front/back tilt (-180 to 180)
            targetX = Math.max(-1, Math.min(1, e.gamma / 30));
            targetY = Math.max(-1, Math.min(1, (e.beta - 30) / 30));

            if (!rafId) rafId = requestAnimationFrame(tick);
        });
    }

    /* ─────────────────────────────────────────
       SUBTLE IDLE DRIFT
       — gentle float when mouse is not on hero
    ───────────────────────────────────────────*/
    let idleT = 0;
    function idleDrift() {
        if (isHovering) {
            idleT += 0.008;
            requestAnimationFrame(idleDrift);
            return;
        }
        idleT += 0.008;
        // Slow lissajous figure
        targetX = Math.sin(idleT * 0.7) * 0.18;
        targetY = Math.sin(idleT * 0.5) * 0.12;

        if (!rafId) rafId = requestAnimationFrame(tick);
        requestAnimationFrame(idleDrift);
    }
    requestAnimationFrame(idleDrift);

})();
/* =============================================
   CHITRAKSHA — SHOCKWAVE CLICK EFFECT
   shockwave.js  — add AFTER script.js
   ============================================= */

(function initShockwave() {

    const hero = document.getElementById('hero');
    if (!hero) return;

    /* ─────────────────────────────────────────
       CANVAS SETUP
    ───────────────────────────────────────────*/
    const canvas = document.createElement('canvas');
    canvas.id = 'shockwave-canvas';
    hero.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    /* ─────────────────────────────────────────
       FLASH OVERLAY
    ───────────────────────────────────────────*/
    const flash = document.createElement('div');
    flash.id = 'shockwave-flash';
    hero.appendChild(flash);

    /* ─────────────────────────────────────────
       CLICK COUNTER
    ───────────────────────────────────────────*/
    const counter = document.createElement('div');
    counter.id = 'shock-counter';
    counter.innerHTML = `<span class="counter-label">SHOTS FIRED</span><span id="shock-num">000</span>`;
    hero.appendChild(counter);

    let shotCount = 0;

    function updateCounter() {
        shotCount++;
        const el = document.getElementById('shock-num');
        if (el) el.textContent = String(shotCount).padStart(3, '0');
        counter.classList.remove('fired');
        void counter.offsetWidth; // reflow to restart animation
        counter.classList.add('fired');
        setTimeout(() => counter.classList.remove('fired'), 400);
    }

    /* ─────────────────────────────────────────
       WAVE POOL
    ───────────────────────────────────────────*/
    const waves = [];

    /*
      Each wave has multiple rings expanding at
      slightly different speeds — a primary
      shockwave, a secondary slower ring, and a
      thin hot-white inner burst.
    */
    function spawnWave(x, y) {
        const palette = [
            { r: 232, g: 255, b: 71 },   // accent yellow-green
            { r: 0, g: 212, b: 255 },   // cyan
            { r: 255, g: 60, b: 110 },   // pink
        ];
        // Pick a colour, slightly randomised each click
        const col = palette[shotCount % palette.length];

        waves.push({
            x, y,
            rings: [
                // Primary shockwave ring
                {
                    radius: 0,
                    maxRadius: Math.max(canvas.width, canvas.height) * 0.75,
                    speed: 7,
                    lineWidth: 2.5,
                    alpha: 1,
                    col,
                    done: false,
                },
                // Secondary slower, thinner ring
                {
                    radius: 0,
                    maxRadius: Math.max(canvas.width, canvas.height) * 0.55,
                    speed: 4.5,
                    lineWidth: 1,
                    alpha: 0.5,
                    col,
                    done: false,
                },
                // Inner hot burst (white core)
                {
                    radius: 0,
                    maxRadius: 60,
                    speed: 12,
                    lineWidth: 4,
                    alpha: 1,
                    col: { r: 255, g: 255, b: 255 },
                    done: false,
                },
                // Outermost ghost ring — slowest
                {
                    radius: 0,
                    maxRadius: Math.max(canvas.width, canvas.height) * 0.9,
                    speed: 3,
                    lineWidth: 0.6,
                    alpha: 0.25,
                    col,
                    done: false,
                },
            ],
            age: 0,
        });
    }

    /* ─────────────────────────────────────────
       SPARK BURST (DOM particles)
    ───────────────────────────────────────────*/
    function spawnSparks(x, y) {
        const COUNT = 16;
        const COLORS = ['#e8ff47', '#00d4ff', '#ff3c6e', '#ffffff'];

        for (let i = 0; i < COUNT; i++) {
            const spark = document.createElement('div');
            spark.className = 'shock-spark';

            const angle = (Math.PI * 2 / COUNT) * i + (Math.random() - 0.5) * 0.5;
            const dist = 40 + Math.random() * 80;
            const tx = Math.cos(angle) * dist;
            const ty = Math.sin(angle) * dist;
            const dur = (0.4 + Math.random() * 0.45).toFixed(2);
            const color = COLORS[Math.floor(Math.random() * COLORS.length)];

            spark.style.cssText = `
                left: ${x}px;
                top:  ${y}px;
                --tx: ${tx.toFixed(1)}px;
                --ty: ${ty.toFixed(1)}px;
                --dur: ${dur}s;
                --spark-color: ${color};
            `;

            hero.appendChild(spark);
            setTimeout(() => spark.remove(), parseFloat(dur) * 1000 + 50);
        }
    }

    /* ─────────────────────────────────────────
       SCREEN SHAKE
    ───────────────────────────────────────────*/
    function shake() {
        hero.classList.remove('shaking');
        void hero.offsetWidth;
        hero.classList.add('shaking');
        setTimeout(() => hero.classList.remove('shaking'), 350);
    }

    /* ─────────────────────────────────────────
       EDGE FLASH
    ───────────────────────────────────────────*/
    function triggerFlash(x, y) {
        const px = ((x / canvas.width) * 100).toFixed(1) + '%';
        const py = ((y / canvas.height) * 100).toFixed(1) + '%';
        flash.style.setProperty('--fx', px);
        flash.style.setProperty('--fy', py);
        flash.classList.remove('flash-active');
        void flash.offsetWidth;
        flash.classList.add('flash-active');
    }

    /* ─────────────────────────────────────────
       DRAW LOOP
    ───────────────────────────────────────────*/
    function drawWaves() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let wi = waves.length - 1; wi >= 0; wi--) {
            const wave = waves[wi];
            wave.age++;
            let allDone = true;

            wave.rings.forEach(ring => {
                if (ring.done) return;
                allDone = false;

                ring.radius += ring.speed;

                // Alpha fades as it expands
                const progress = ring.radius / ring.maxRadius;
                const alpha = ring.alpha * (1 - progress);

                if (alpha <= 0 || ring.radius >= ring.maxRadius) {
                    ring.done = true;
                    return;
                }

                const { r, g, b } = ring.col;

                // Outer glow pass
                ctx.beginPath();
                ctx.arc(wave.x, wave.y, ring.radius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(${r},${g},${b},${(alpha * 0.25).toFixed(3)})`;
                ctx.lineWidth = ring.lineWidth * 6;
                ctx.stroke();

                // Sharp ring
                ctx.beginPath();
                ctx.arc(wave.x, wave.y, ring.radius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
                ctx.lineWidth = ring.lineWidth;
                ctx.stroke();
            });

            if (allDone) waves.splice(wi, 1);
        }

        requestAnimationFrame(drawWaves);
    }
    drawWaves();

    /* ─────────────────────────────────────────
       CLICK SOUND (SHOCKWAVE)
    ───────────────────────────────────────────*/
    let shockAudioCtx = null;
    function playShockSound() {
        try {
            if (!shockAudioCtx) shockAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (shockAudioCtx.state === 'suspended') shockAudioCtx.resume();
            
            const t = shockAudioCtx.currentTime;

            // 1. Synth Laser/Zap Drop (Sawtooth wave rapidly dropping in pitch)
            const osc = shockAudioCtx.createOscillator();
            const oscGain = shockAudioCtx.createGain();
            osc.type = 'sawtooth';
            // Start very high (1500Hz) and drop to bass (40Hz) in just 150ms for the "pew/zap" effect
            osc.frequency.setValueAtTime(1500, t);
            osc.frequency.exponentialRampToValueAtTime(40, t + 0.15);
            
            oscGain.gain.setValueAtTime(0, t);
            oscGain.gain.linearRampToValueAtTime(0.6, t + 0.01);
            oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
            
            osc.connect(oscGain);
            oscGain.connect(shockAudioCtx.destination);
            osc.start(t);
            osc.stop(t + 0.3);

            // 2. White Noise 'Explosive Burst' (Simulates the gunshot blast)
            const bufferSize = shockAudioCtx.sampleRate * 0.25;
            const buffer = shockAudioCtx.createBuffer(1, bufferSize, shockAudioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

            const noise = shockAudioCtx.createBufferSource();
            noise.buffer = buffer;

            // Lowpass filter closing rapidly (simulates the blast decaying)
            const noiseFilter = shockAudioCtx.createBiquadFilter();
            noiseFilter.type = 'lowpass';
            noiseFilter.frequency.setValueAtTime(8000, t);
            noiseFilter.frequency.exponentialRampToValueAtTime(300, t + 0.15);
            
            const noiseGain = shockAudioCtx.createGain();
            noiseGain.gain.setValueAtTime(0, t);
            noiseGain.gain.linearRampToValueAtTime(0.7, t + 0.01); 
            noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

            noise.connect(noiseFilter);
            noiseFilter.connect(noiseGain);
            noiseGain.connect(shockAudioCtx.destination);
            noise.start(t);
            noise.stop(t + 0.25);

        } catch(e) {}
    }

    /* ─────────────────────────────────────────
       CLICK HANDLER
    ───────────────────────────────────────────*/
    hero.addEventListener('click', e => {
        const rect = hero.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        spawnWave(x, y);
        spawnSparks(x, y);
        triggerFlash(x, y);
        shake();
        updateCounter();
        
        if (!e.target.closest('a, button, .btn-primary, .btn-ghost')) {
            playShockSound();
        }
    });

    /* ─────────────────────────────────────────
       DOUBLE-CLICK — double shockwave
    ───────────────────────────────────────────*/
    hero.addEventListener('dblclick', e => {
        const rect = hero.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        // Spawn a second delayed wave for the double-hit feel
        setTimeout(() => spawnWave(x, y), 120);
    });

})();
/* =============================================
   CHITRAKSHA — CONTACT SECTION ENHANCEMENT
   contact-enhanced.js  — add AFTER script.js
   ============================================= */

(function enhanceContact() {

    const section = document.getElementById('contact');
    if (!section) return;

    /* ─────────────────────────────────────────
       REBUILD SECTION HTML
    ───────────────────────────────────────────*/
    section.innerHTML = `

        <!-- Background layers -->
        <div id="contact-grid-bg"></div>
        <div class="contact-glow"></div>
        <div class="contact-glow2"></div>

        <div class="contact-layout">

            <!-- ── LEFT COLUMN ── -->
            <div class="contact-left reveal">

                <div class="contact-inner">
                    <div class="section-label" style="justify-content:flex-start;">Get In Touch</div>

                    <div class="contact-big">
                        <span>LET'S</span><br>
                        <span class="outline">CREATE</span><br>
                        <span>TOGETHER</span>
                    </div>
                </div>

                <p style="color:var(--muted); line-height:1.9; font-size:0.95rem; max-width:420px;">
                    Want us to cover your event? Collaborate on a project?
                    Or just want to join the team? We'd love to hear from you.
                </p>

                <!-- Info rows -->
                <div class="contact-info-rows reveal reveal-delay-1">
                    <a href="mailto:media@sggs.ac.in" class="contact-info-row">
                        <span class="row-label">Email</span>
                        <span class="row-value">media@sggs.ac.in</span>
                        <span class="row-arrow">↗</span>
                    </a>
                    <a href="https://www.instagram.com/teamchitraksha?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" class="contact-info-row">
                        <span class="row-label">Instagram</span>
                        <span class="row-value">@chitraksha_official</span>
                        <span class="row-arrow">↗</span>
                    </a>
                    <a href="#" class="contact-info-row">
                        <span class="row-label">Location</span>
                        <span class="row-value">SGGSIE&T, Nanded</span>
                        <span class="row-arrow">↗</span>
                    </a>
                    <div class="contact-info-row" style="cursor:default;">
                        <span class="row-label">Response</span>
                        <span class="row-value">Within 24–48 hours</span>
                        <span class="row-arrow" style="color:var(--accent); font-size:0.7rem; letter-spacing:0.1em;">●&nbsp;ACTIVE</span>
                    </div>
                </div>

                <!-- Social icons -->
                <div class="contact-socials reveal reveal-delay-2">
                    <a href="https://www.instagram.com/teamchitraksha?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" class="social-link" title="Instagram">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                    </a>
                    <a href="https://youtube.com/@teamchitraksha?si=ECHBOUCR_RyqkESb" class="social-link" title="YouTube">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
                        </svg>
                    </a>
                    <a href="https://www.linkedin.com/company/team-chitraksha" class="social-link" title="LinkedIn">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                    </a>
                    <a href="https://www.facebook.com/Team-Chitraksha-110353188153504/?_rdr" class="social-link" title="Twitter / X">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.261 5.636 5.903-5.636zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                    </a>
                </div>

            </div>

            <!-- ── RIGHT COLUMN — FORM ── -->
            <div class="contact-form-wrap reveal reveal-delay-2">

                <div class="form-header">
                    <div class="form-header-dot"></div>
                    <span class="form-header-label">New Message</span>
                </div>

                <form class="contact-form" id="contactForm" novalidate>

                    <div class="form-row">
                        <div class="form-field">
                            <label for="cf-name">Your Name</label>
                            <input type="text" id="cf-name" name="name"
                                placeholder="Ashutosh Chandgude" autocomplete="off">
                            <div class="field-line"></div>
                        </div>
                        <div class="form-field">
                            <label for="cf-email">Email Address</label>
                            <input type="email" id="cf-email" name="email"
                                placeholder="you@college.edu" autocomplete="off">
                            <div class="field-line"></div>
                        </div>
                    </div>

                    <div class="form-field">
                        <label for="cf-type">What's this about?</label>
                        <select id="cf-type" name="type">
                            <option value="" disabled selected>— Select a reason —</option>
                            <option value="event">Cover my Event</option>
                            <option value="collab">Collaboration</option>
                            <option value="join">Join the Team</option>
                            <option value="reel">Commission a Reel</option>
                            <option value="other">Something Else</option>
                        </select>
                        <div class="field-line"></div>
                    </div>

                    <div class="form-field" style="position:relative;">
                        <label for="cf-msg">Message</label>
                        <textarea id="cf-msg" name="message" rows="5"
                            placeholder="Tell us what you have in mind…"
                            maxlength="400"></textarea>
                        <div class="field-line"></div>
                        <span class="char-counter" id="charCount">0 / 400</span>
                    </div>

                    <div class="form-submit-wrap">
                        <button type="submit" class="btn-submit" id="formSubmitBtn">
                            Send Message
                        </button>
                        <span class="form-note">We reply within 24–48 hrs</span>
                    </div>

                    <div class="form-success" id="formSuccess">
                        ✓ &nbsp; MESSAGE RECEIVED — we'll be in touch soon.
                    </div>

                </form>
            </div>

        </div>
    `;

    /* ─────────────────────────────────────────
       RE-OBSERVE REVEAL ELEMENTS
    ───────────────────────────────────────────*/
    const revealObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    section.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

    /* ─────────────────────────────────────────
       CHARACTER COUNTER
    ───────────────────────────────────────────*/
    const msgArea = document.getElementById('cf-msg');
    const charCount = document.getElementById('charCount');
    const MAX_CHARS = 400;

    if (msgArea && charCount) {
        msgArea.addEventListener('input', () => {
            const len = msgArea.value.length;
            charCount.textContent = `${len} / ${MAX_CHARS}`;
            charCount.classList.toggle('near-limit', len > MAX_CHARS * 0.8);
        });
    }

    /* ─────────────────────────────────────────
       FORM SUBMIT (demo — no backend)
    ───────────────────────────────────────────*/
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('formSubmitBtn');
    const successMsg = document.getElementById('formSuccess');

    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();

            const name = document.getElementById('cf-name').value.trim();
            const email = document.getElementById('cf-email').value.trim();
            const msg = document.getElementById('cf-msg').value.trim();

            // Basic validation
            if (!name || !email || !msg) {
                // Shake empty fields
                [document.getElementById('cf-name'),
                document.getElementById('cf-email'),
                document.getElementById('cf-msg')].forEach(f => {
                    if (!f.value.trim()) {
                        f.style.borderColor = 'var(--accent2)';
                        f.style.animation = 'fieldShake 0.35s ease';
                        setTimeout(() => {
                            f.style.borderColor = '';
                            f.style.animation = '';
                        }, 400);
                    }
                });
                return;
            }

            // Send using Web3Forms API
            submitBtn.textContent = 'Sending…';
            submitBtn.disabled = true;

            // Optional: get 'type' from field if available
            const typeSelect = document.getElementById('cf-type');
            const typeValue = typeSelect ? typeSelect.value : 'General';

            const payload = {
                // IMPORTANT: Replace this with your actual Web3Forms access key
                access_key: "8b0a4307-0828-45e5-9c7e-82b1b2257317",
                name: name,
                email: email,
                subject: `New Contact Submission: ${typeValue}`,
                message: msg
            };

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            })
                .then(async (response) => {
                    let json = await response.json();
                    if (response.status == 200) {
                        submitBtn.textContent = '✓ Sent';
                        submitBtn.classList.add('sent');
                        if (successMsg) successMsg.classList.add('visible');
                        form.reset();
                        if (charCount) charCount.textContent = '0 / 400';
                    } else {
                        console.log(response);
                        alert("Error: " + json.message);
                        submitBtn.textContent = 'Send Message';
                        submitBtn.disabled = false;
                    }
                })
                .catch(error => {
                    console.log(error);
                    alert("Something went wrong!");
                    submitBtn.textContent = 'Send Message';
                    submitBtn.disabled = false;
                });
        });
    }

    if (!document.getElementById('field-shake-style')) {
        const s = document.createElement('style');
        s.id = 'field-shake-style';
        s.textContent = `
            @keyframes fieldShake {
                0%,100% { transform: translateX(0); }
                20%      { transform: translateX(-6px); }
                40%      { transform: translateX(6px); }
                60%      { transform: translateX(-4px); }
                80%      { transform: translateX(4px); }
            }
        `;
        document.head.appendChild(s);
    }

    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
        position:absolute; inset:0; pointer-events:none;
        z-index:0; opacity:0.25;
    `;
    section.insertBefore(canvas, section.firstChild);
    const ctx = canvas.getContext('2d');
    let W, H;

    function resize() {
        W = canvas.width = section.offsetWidth;
        H = canvas.height = section.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const pts = Array.from({ length: 35 }, () => ({
        x: Math.random() * 1000,
        y: Math.random() * 800,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.2 + 0.3,
    }));

    function drawContactParticles() {
        ctx.clearRect(0, 0, W, H);
        pts.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
            if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(232,255,71,0.4)';
            ctx.fill();
        });

        for (let i = 0; i < pts.length; i++) {
            for (let j = i + 1; j < pts.length; j++) {
                const dx = pts[i].x - pts[j].x;
                const dy = pts[i].y - pts[j].y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < 130) {
                    ctx.beginPath();
                    ctx.moveTo(pts[i].x, pts[i].y);
                    ctx.lineTo(pts[j].x, pts[j].y);
                    ctx.strokeStyle = `rgba(232,255,71,${((1 - d / 130) * 0.08).toFixed(3)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(drawContactParticles);
    }
    drawContactParticles();

})();

/* =============================================
   CHITRAKSHA GLOBAL CLICK SOUND
   ============================================= */
(function initGlobalClickSound() {
    let audioCtx = null;

    function playShutterSound() {
        try {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }

            function playClick(timeOffset, freq, duration, type = 'highpass', vol = 0.5) {
                const bufferSize = audioCtx.sampleRate * duration;
                const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = Math.random() * 2 - 1; // White noise
                }

                const noiseSource = audioCtx.createBufferSource();
                noiseSource.buffer = buffer;

                const filter = audioCtx.createBiquadFilter();
                filter.type = type;
                filter.frequency.value = freq;
                if (type === 'bandpass') {
                    filter.Q.value = 2.0;
                }

                const gainNode = audioCtx.createGain();
                const t = audioCtx.currentTime + timeOffset;

                gainNode.gain.setValueAtTime(0, t);
                gainNode.gain.linearRampToValueAtTime(vol, t + 0.005);
                gainNode.gain.exponentialRampToValueAtTime(0.001, t + duration);

                noiseSource.connect(filter);
                filter.connect(gainNode);
                gainNode.connect(audioCtx.destination);

                noiseSource.start(t);
                noiseSource.stop(t + duration);
            }

            // 1. Mirror Slap Up (sharp, bright click)
            playClick(0, 4000, 0.04, 'highpass', 0.2);
            // 2. Midrange mechanical clack
            playClick(0.015, 1200, 0.06, 'bandpass', 0.3);
            // 3. Mirror Slap Down / Shutter Closing (deep clack)
            playClick(0.08, 400, 0.08, 'bandpass', 0.4);

        } catch (e) {
            console.error("Audio API not supported or blocked", e);
        }
    }

    document.addEventListener('click', (e) => {
        const interactiveEl = e.target.closest('a, button, .btn-primary, .btn-ghost, .social-link, .gallery-item, .story-card, .team-card');
        if (interactiveEl) {
            playShutterSound();
        }
    });

})();
