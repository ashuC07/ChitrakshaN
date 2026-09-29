/* =============================================
   CHITRAKSHA — PREMIUM 3D DSLR SCROLL ANIMATION
   camera-3d.js  — add AFTER script.js
   ============================================= */

(function initCamera3D() {

    /* ─── MODEL ───
       "PENTAX K-1 DSLR" by tuma_youzyo / T_Y - CC BY 4.0 (credit is shown in the
       section label and must also stay on your site).
       https://sketchfab.com/3d-models/pentax-k-1-dslr-19d8c0bf6c814424a6a0dd54d726e475
       Keep pentax_k-1_dslr.glb next to index.html (served by server.js).
       Set MODEL_URL = '' to use the built-in procedural DSLR instead. */
    const MODEL_URL = 'pentax_k-1_dslr.glb';
    const MODEL_YAW = 0;        // extra turn if the lens points away from you: Math.PI
    const MODEL_SIZE = 3.6;     // longest side (lens axis), in scene units

    function loadScript(src, cb, alreadyLoaded) {
        if (alreadyLoaded && alreadyLoaded()) { cb(); return; }
        const s = document.createElement('script');
        s.src = src;
        s.onload = cb;
        s.onerror = () => console.warn('[camera-3d] failed to load ' + src);
        document.head.appendChild(s);
    }

    loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', () => {
        if (!MODEL_URL) { buildSection(); return; }
        loadScript('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js',
            buildSection, () => window.THREE && window.THREE.GLTFLoader);
    }, () => window.THREE);

    /* ─────────────────────────────────────────
       STAGE TEXT CONTENT
    ───────────────────────────────────────────*/
    const STAGES = [
        {
            id: 0, from: 0, to: 0.14,
            eyebrow: 'The Instrument',
            title: 'BUILT FOR\nSTORYTELLERS',
            sub: 'Every great frame starts with the right tool. Crafted for precision, designed for passion.',
            specs: [],
        },
        {
            id: 1, from: 0.14, to: 0.38,
            eyebrow: 'Optics',
            title: 'K-MOUNT\nOPTICS',
            sub: 'Pentax K bayonet: decades of glass, sharp from edge to edge.',
            specs: [
                { key: 'Mount',       value: 'Pentax K bayonet' },
                { key: 'Stabiliser',  value: '5-axis in-body SR' },
                { key: 'Body',        value: 'Weather-sealed' },
            ],
        },
        {
            id: 2, from: 0.38, to: 0.58,
            eyebrow: 'Control',
            title: 'EVERY\nSETTING.\nINSTANT.',
            sub: 'Customisable dials, programmable buttons — your muscle memory, your workflow.',
            specs: [
                { key: 'Pixel Shift',   value: 'Resolution mode' },
                { key: 'Burst Rate',     value: '4.4 fps continuous' },
                { key: 'Shutter',        value: '1/8000s — 30s' },
            ],
        },
        {
            id: 3, from: 0.58, to: 0.78,
            eyebrow: 'Sensor',
            title: 'FULL\nFRAME.\nZERO\nCOMPROMISE.',
            sub: 'Every photon, captured. Built for the golden hour, the blue hour, and everything between.',
            specs: [
                { key: 'Resolution', value: '36.4 Megapixels' },
                { key: 'ISO Range',  value: '100 — 204,800' },
                { key: 'Sensor',    value: 'Full frame CMOS' },
            ],
        },
        {
            id: 4, from: 0.78, to: 1.0,
            eyebrow: 'Chitraksha',
            title: 'YOUR\nSTORY.\nOUR LENS.',
            sub: 'The camera is just the beginning. The vision, the frame, the moment — that\'s you.',
            specs: [],
        },
    ];

    /* ─────────────────────────────────────────
       CALLOUT CONFIG
    ───────────────────────────────────────────*/
    const CALLOUTS = [
        { id: 'lens',   anchor: [-0.18, 0.02, 2.06],  title: 'K-Mount',   sub: 'Lens & Bayonet',   showFrom: 0.16, showTo: 0.36 },
        { id: 'grip',   anchor: [1.45, -0.1, 0.56],   title: 'Grip',      sub: 'Ergonomic Rubber',  showFrom: 0.38, showTo: 0.56 },
        { id: 'dial',   anchor: [1.0, 0.93, -0.1],    title: 'Mode Dial', sub: 'PASM + Custom',     showFrom: 0.40, showTo: 0.56 },
        { id: 'sensor', anchor: [0.0, 0.05, 0.3],     title: '36MP CMOS', sub: 'Full Frame Sensor', showFrom: 0.60, showTo: 0.76 },
        { id: 'lcd',    anchor: [-0.18, -0.1, -0.575],title: 'Flex LCD',  sub: '3.2" Tilt Monitor',     showFrom: 0.60, showTo: 0.76 },
    ];

    /* ─────────────────────────────────────────
       SCROLL KEYFRAMES
       Each defines model rotation/position at
       a given scroll progress (0–1)
    ───────────────────────────────────────────*/
    const KF = [
        { p: 0.00,  rx: 0.08,  ry: -0.65, rz:  0.0,   px: 0,    py: -0.25, cz: 9.0,  sc: 0.82 },
        { p: 0.10,  rx: 0.04,  ry: -0.12, rz:  0.0,   px: 0,    py:  0.0,  cz: 7.2,  sc: 1.0  },
        { p: 0.22,  rx: 0.02,  ry:  0.05, rz:  0.0,   px: 0,    py:  0.0,  cz: 6.8,  sc: 1.05 },
        { p: 0.38,  rx: 0.0,   ry:  1.25, rz:  0.0,   px: 0.3,  py:  0.0,  cz: 7.0,  sc: 1.0  },
        { p: 0.52,  rx: 0.0,   ry:  1.45, rz:  0.0,   px: 0.3,  py:  0.0,  cz: 7.2,  sc: 1.0  },
        { p: 0.62,  rx: -0.52, ry:  1.55, rz:  0.04,  px: 0,    py:  0.4,  cz: 7.5,  sc: 0.95 },
        { p: 0.76,  rx: -0.48, ry:  1.65, rz:  0.04,  px: 0,    py:  0.3,  cz: 7.2,  sc: 0.95 },
        { p: 0.85,  rx:  0.08, ry:  3.12, rz:  0.0,   px: 0,    py:  0.0,  cz: 7.0,  sc: 1.0  },
        { p: 1.00,  rx:  0.06, ry:  3.55, rz:  0.0,   px: 0,    py:  0.0,  cz: 6.5,  sc: 1.05 },
    ];

    /* ─────────────────────────────────────────
       SECTION HTML INJECTION
    ───────────────────────────────────────────*/
    function buildSection() {
        const stage = document.createElement('section');
        stage.id = 'cam3d-stage';

        stage.innerHTML = `
        <div class="cam3d-sticky">

            <canvas id="cam3d-canvas"></canvas>
            <div class="cam3d-bg-gradient"></div>
            <div class="cam3d-grain"></div>

            <!-- Stage texts -->
            <div class="cam3d-texts">
                ${STAGES.map(s => `
                <div class="cam3d-text-block" data-stage="${s.id}">
                    <div class="stg-eyebrow">${s.eyebrow}</div>
                    <div class="stg-title">${s.title.replace(/\n/g,'<br>')}</div>
                    <p class="stg-sub">${s.sub}</p>
                    ${s.specs.length ? `<div class="stg-spec">${s.specs.map(r =>
                        `<div class="spec-row"><span class="spec-key">${r.key}</span><span class="spec-value">${r.value}</span></div>`
                    ).join('')}</div>` : ''}
                </div>`).join('')}
            </div>

            <!-- Callout annotations -->
            ${CALLOUTS.map(c => `
            <div class="cam3d-callout" data-callout="${c.id}" style="left:0;top:0;">
                <div class="callout-dot"></div>
                <div class="callout-line"></div>
                <div class="callout-body">
                    <span class="callout-title">${c.title}</span>
                    <span class="callout-sub">${c.sub}</span>
                </div>
            </div>`).join('')}

            <!-- Progress rail -->
            <div class="cam3d-progress-rail">
                <div class="cam3d-progress-track">
                    <div class="cam3d-progress-fill" id="cam3dFill"></div>
                </div>
                <div class="cam3d-progress-dots">
                    ${STAGES.map((_, i) => `<div class="cpd" data-dot="${i}"></div>`).join('')}
                </div>
                <span class="cam3d-progress-label">scroll</span>
            </div>

            <!-- Scroll hint -->
            <div class="cam3d-scroll-hint" id="cam3dHint">
                <div class="scroll-hint-wheel"></div>
                <span>Scroll to explore</span>
            </div>

            <!-- Bottom label -->
            <div class="cam3d-section-label">
                <span>PENTAX K-1 · 3D MODEL BY TUMA_YOUZYO (CC BY 4.0) · CHITRAKSHA</span>
            </div>

        </div>`;

        /* Insert between hero and marquee */
        const marquee = document.querySelector('.marquee-wrap');
        if (marquee) marquee.parentElement.insertBefore(stage, marquee);
        else document.body.appendChild(stage);

        initThree(stage);
    }

    /* ─────────────────────────────────────────
       UTILITIES
    ───────────────────────────────────────────*/
    function lerp(a, b, t) { return a + (b - a) * t; }

    function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

    function ease(t) {
        // Cubic ease in-out
        return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;
    }

    function getKFValue(progress, key) {
        let k0 = KF[0], k1 = KF[KF.length - 1];
        for (let i = 0; i < KF.length - 1; i++) {
            if (progress >= KF[i].p && progress <= KF[i+1].p) {
                k0 = KF[i]; k1 = KF[i+1]; break;
            }
        }
        const range = k1.p - k0.p;
        if (range === 0) return k0[key];
        const t = ease(clamp((progress - k0.p) / range, 0, 1));
        return lerp(k0[key], k1[key], t);
    }

    /* ─────────────────────────────────────────
       THREE.JS INIT
    ───────────────────────────────────────────*/
    function initThree(stage) {
        const T = window.THREE;
        const canvas = stage.querySelector('#cam3d-canvas');
        const sticky = stage.querySelector('.cam3d-sticky');

        let W = sticky.offsetWidth || window.innerWidth;
        let H = sticky.offsetHeight || window.innerHeight;

        /* Renderer */
        const renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setSize(W, H);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = T.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.5;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = T.PCFSoftShadowMap;
        renderer.outputEncoding = T.sRGBEncoding;

        /* Scene */
        const scene = new T.Scene();
        scene.background = null;

        /* Camera (viewer) */
        const cam = new T.PerspectiveCamera(42, W / H, 0.1, 100);
        cam.position.set(0, 0.3, 9);
        cam.lookAt(0, 0, 0);

        /* Build DSLR model */
        const dslr = new T.Group();            // animated by scroll
        const fallback = buildDSLR(T);         // built-in model, shown until/unless the online one loads
        dslr.add(fallback);
        scene.add(dslr);
        let useProcedural = true;

const modelAnchors = {};
        if (MODEL_URL && T.GLTFLoader) {
            new T.GLTFLoader().load(MODEL_URL, gltf => {
                const model = gltf.scene;
                model.traverse(o => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; o.frustumCulled = false; } });
                model.updateMatrixWorld(true);

                /* real vertex positions, skinning included */
                const pts = [], tmp = new T.Vector3();
                model.traverse(o => {
                    if (!o.isMesh) return;
                    if (o.skeleton) o.skeleton.update();
                    const n = o.geometry.attributes.position.count;
                    for (let i = 0; i < n; i += 4) {
                        if (o.isSkinnedMesh) o.boneTransform(i, tmp);
                        else tmp.fromBufferAttribute(o.geometry.attributes.position, i);
                        pts.push(tmp.clone().applyMatrix4(o.matrixWorld));
                    }
                });
                const c  = new T.Box3().setFromPoints(pts).getCenter(new T.Vector3());
                const sz = new T.Box3().setFromPoints(pts).getSize(new T.Vector3());

                /* longest axis becomes the lens axis (Z) */
                const q = new T.Quaternion();
                if (sz.x >= sz.y && sz.x >= sz.z) q.setFromAxisAngle(new T.Vector3(0, 1, 0), Math.PI / 2);
                else if (sz.y >= sz.x && sz.y >= sz.z) q.setFromAxisAngle(new T.Vector3(1, 0, 0), Math.PI / 2);
                const place = () => pts.map(p => p.clone().sub(c).applyQuaternion(q));
                let rp = place();
                let rb = new T.Box3().setFromPoints(rp);

                /* narrower end = lens -> must face +Z (towards the viewer) */
                const z0 = rb.min.z, zl = rb.max.z - rb.min.z;
                const endSize = (lo, hi) => new T.Box3()
                    .setFromPoints(rp.filter(p => p.z >= lo && p.z <= hi)).getSize(new T.Vector3());
                const e0 = endSize(z0, z0 + zl * 0.2), e1 = endSize(z0 + zl * 0.8, z0 + zl);
                if (e0.x * e0.y < e1.x * e1.y) {
                    q.premultiply(new T.Quaternion().setFromAxisAngle(new T.Vector3(0, 1, 0), Math.PI));
                    rp = place(); rb = new T.Box3().setFromPoints(rp);
                }
                q.premultiply(new T.Quaternion().setFromAxisAngle(new T.Vector3(0, 1, 0), MODEL_YAW));

                const size = rb.getSize(new T.Vector3());
                const k = MODEL_SIZE / Math.max(size.x, size.y, size.z);
                model.position.sub(c);
                const inner = new T.Group();
                inner.add(model);
                const holder = new T.Group();
                holder.add(inner);
                holder.quaternion.copy(q);
                holder.scale.setScalar(k);
                dslr.remove(fallback);
                dslr.add(holder);
                useProcedural = false;

                /* callouts on points that are safe on any DSLR; hide the rest */
                const S = size.clone().multiplyScalar(k);
                modelAnchors.lens   = [0, 0, S.z / 2];
                modelAnchors.lcd    = [0, -0.05 * S.y, -S.z / 2];
                modelAnchors.sensor = [0, 0.05 * S.y, -S.z / 2 + S.z * 0.3];
                stage.querySelectorAll('.cam3d-callout').forEach(el => {
                    if (!modelAnchors[el.dataset.callout]) el.style.display = 'none';
                });
            }, undefined, err => console.warn('[camera-3d] model failed, using built-in DSLR', err));
        }
        dslr.rotation.y = -0.65;
        dslr.position.y = -0.25;
        dslr.scale.setScalar(0.82);

        /* Lights */
        setupLights(T, scene, dslr);

        /* Shadow plane (ground) */
        const shadowGeo = new T.PlaneGeometry(20, 20);
        const shadowMat = new T.ShadowMaterial({ opacity: 0.25 });
        const shadowPlane = new T.Mesh(shadowGeo, shadowMat);
        shadowPlane.receiveShadow = true;
        shadowPlane.rotation.x = -Math.PI / 2;
        shadowPlane.position.y = -2.2;
        scene.add(shadowPlane);

        /* Resize */
        window.addEventListener('resize', () => {
            W = sticky.offsetWidth || window.innerWidth;
            H = sticky.offsetHeight || window.innerHeight;
            renderer.setSize(W, H);
            cam.aspect = W / H;
            cam.updateProjectionMatrix();
        });

        /* ─── SCROLL TRACKING ─── */
        function getProgress() {
            const rect  = stage.getBoundingClientRect();
            const total = stage.offsetHeight - window.innerHeight;
            if (total <= 0) return 0;
            return clamp(-rect.top / total, 0, 1);
        }

        /* ─── RENDER LOOP ─── */
        let prevProgress = -1;

        /* Pause rendering when the section is off-screen */
        let running = true;
        new IntersectionObserver(e => { running = e[0].isIntersecting; },
            { rootMargin: '100px' }).observe(stage);

        /* Callouts follow real points on the model */
        const calloutEls = CALLOUTS.map(c => ({
            c, el: stage.querySelector(`[data-callout="${c.id}"]`),
            v: new T.Vector3(...c.anchor), flipped: null,
        }));
        function placeCallouts() {
            calloutEls.forEach(o => {
                if (!o.el || !o.el.offsetWidth) return;
                const anc = useProcedural ? o.c.anchor : modelAnchors[o.c.id];
                if (!anc) return;
                const p = dslr.localToWorld(o.v.clone().set(anc[0], anc[1], anc[2])).project(cam);
                const sx = (p.x * 0.5 + 0.5) * W;
                const sy = (-p.y * 0.5 + 0.5) * H;
                const bodyLeft = sx < W / 2;           // label sits on the outer side
                if (o.flipped !== bodyLeft) {
                    o.flipped = bodyLeft;
                    o.el.classList.toggle('left', bodyLeft);
                    o.el.querySelector('.callout-line').classList.toggle('left', bodyLeft);
                }
                const w = o.el.offsetWidth, h = o.el.offsetHeight;
                const x = bodyLeft ? sx - w + 2.5 : sx - 2.5;
                o.el.style.transform = `translate(${x.toFixed(1)}px, ${(sy - h / 2).toFixed(1)}px)`;
            });
        }

        function tick() {
            requestAnimationFrame(tick);
            if (!running) return;

            const progress = getProgress();

            /* Apply keyframe values to model */
            dslr.rotation.x = getKFValue(progress, 'rx');
            dslr.rotation.y = getKFValue(progress, 'ry');
            dslr.rotation.z = getKFValue(progress, 'rz');
            dslr.position.x = getKFValue(progress, 'px');
            dslr.position.y = getKFValue(progress, 'py');
            cam.position.z  = getKFValue(progress, 'cz');
            const sc = getKFValue(progress, 'sc');
            dslr.scale.setScalar(sc);

            /* Animate lens glass emissive (breathing glow) */
            const glow = 0.2 + 0.15 * Math.sin(Date.now() * 0.0018);
            if (useProcedural && fallback.userData.frontGlass) {
                fallback.userData.frontGlass.material.emissiveIntensity = glow;
            }

            /* Animate rim light color/intensity */
            if (scene.userData.rimLight) {
                scene.userData.rimLight.intensity = 2.0 + 0.8 * Math.sin(Date.now() * 0.0012);
            }

            /* Update UI only when progress changes meaningfully */
            if (Math.abs(progress - prevProgress) > 0.002) {
                updateUI(progress);
                prevProgress = progress;
            }

            dslr.updateMatrixWorld(true);
            cam.updateMatrixWorld(true);
            placeCallouts();
            renderer.render(scene, cam);
        }
        tick();

        /* ─── UI UPDATES ─── */
        function updateUI(progress) {
            /* Progress fill */
            const fill = stage.querySelector('#cam3dFill');
            if (fill) fill.style.height = (progress * 100) + '%';

            /* Progress dots */
            let activeDot = 0;
            STAGES.forEach((s, i) => {
                if (progress >= s.from) activeDot = i;
            });
            stage.querySelectorAll('.cpd').forEach((d, i) => {
                d.classList.toggle('active', i === activeDot);
            });

            /* Stage texts */
            stage.querySelectorAll('.cam3d-text-block').forEach(block => {
                const id = parseInt(block.dataset.stage);
                const s  = STAGES[id];
                const vis = progress >= s.from && progress < s.to;
                const exiting = !vis && progress >= s.to && progress < s.to + 0.06;
                block.classList.toggle('visible', vis);
                block.classList.toggle('exiting', exiting);
            });

            /* Callouts */
            stage.querySelectorAll('.cam3d-callout').forEach(el => {
                const id = el.dataset.callout;
                const c  = CALLOUTS.find(x => x.id === id);
                if (!c) return;
                const vis = progress >= c.showFrom && progress <= c.showTo;
                el.classList.toggle('visible', vis);
            });

            /* Scroll hint */
            const hint = stage.querySelector('#cam3dHint');
            if (hint) hint.classList.toggle('hidden', progress > 0.05);
        }
    }

    /* ─────────────────────────────────────────
       BUILD DSLR MODEL
    ───────────────────────────────────────────*/
    function buildDSLR(T) {
        const group = new T.Group();

        /* ── MATERIALS ── */
        const bodyMat = new T.MeshStandardMaterial({
            color: 0x1b1b20, roughness: 0.5, metalness: 0.35,
        });
        const gripMat = new T.MeshStandardMaterial({
            color: 0x111116, roughness: 0.92, metalness: 0.06,
        });
        const metalMat = new T.MeshStandardMaterial({
            color: 0x2e2e36, roughness: 0.18, metalness: 0.95,
        });
        const chromeMat = new T.MeshStandardMaterial({
            color: 0x888898, roughness: 0.05, metalness: 1.0,
        });
        const frontGlassMat = new T.MeshPhysicalMaterial({
            color: 0x1a2f50, roughness: 0.0, metalness: 0.05,
            transmission: 0.82, transparent: true, ior: 1.52,
            emissive: new T.Color(0x0a1f40), emissiveIntensity: 0.2,
        });
        const glassMat = new T.MeshPhysicalMaterial({
            color: 0x182840, roughness: 0.0, metalness: 0.1,
            transmission: 0.75, transparent: true, ior: 1.5,
        });
        const lcdMat = new T.MeshStandardMaterial({
            color: 0x080810, roughness: 0.04, metalness: 0.15,
            emissive: new T.Color(0x000820), emissiveIntensity: 0.2,
        });
        const accentMat = new T.MeshStandardMaterial({
            color: 0xe8ff47, roughness: 0.3, metalness: 0.5,
            emissive: new T.Color(0xe8ff47), emissiveIntensity: 0.35,
        });
        const redMat = new T.MeshStandardMaterial({
            color: 0xff3c6e, roughness: 0.3, metalness: 0.4,
            emissive: new T.Color(0xff3c6e), emissiveIntensity: 0.5,
        });
        const cyanMat = new T.MeshStandardMaterial({
            color: 0x00d4ff, roughness: 0.35, metalness: 0.5,
            emissive: new T.Color(0x00d4ff), emissiveIntensity: 0.2,
        });

        /* Cylinder helper — creates cylinder along Z-axis */
        function cyl(rT, rB, h, mat, segs) {
            const geo  = new T.CylinderGeometry(rT, rB, h, segs || 64);
            const mesh = new T.Mesh(geo, mat);
            mesh.rotation.x = Math.PI / 2;
            mesh.castShadow = true;
            return mesh;
        }

        /* Vertical-axis (Y) and horizontal-axis (X) cylinders */
        function cylY(rT, rB, h, mat, segs) {
            const m = new T.Mesh(new T.CylinderGeometry(rT, rB, h, segs || 48), mat);
            m.castShadow = true;
            return m;
        }
        function cylX(rT, rB, h, mat, segs) {
            const m = cylY(rT, rB, h, mat, segs);
            m.rotation.z = Math.PI / 2;
            return m;
        }

        function box(w, h, d, mat) {
            const mesh = new T.Mesh(new T.BoxGeometry(w, h, d), mat);
            mesh.castShadow = true;
            return mesh;
        }

        function add(mesh, x, y, z) {
            mesh.position.set(x, y, z);
            group.add(mesh);
            return mesh;
        }

        /* ── BODY ── */
        add(box(2.2, 1.55, 1.1, bodyMat),   0,     0,      0);
        // Grip (right side, slightly larger)
        add(box(0.6, 1.68, 1.1, gripMat),   1.4,  -0.04,   0);
        // Pentaprism hump (top, left of center)
        add(box(1.1, 0.38, 0.82, bodyMat),  0.16,  0.965, -0.03);
        // Slight shoulder bevel on left top
        const shoulder = box(0.55, 0.18, 0.82, bodyMat);
        shoulder.rotation.z = 0.35;
        add(shoulder, -0.9, 0.86, -0.03);

        /* ── LENS ASSEMBLY ── */
        const lensGroup = new T.Group();
        lensGroup.position.set(-0.18, 0.02, 0);
        group.add(lensGroup);

        function lc(rT, rB, h, mat, z, segs) {
            const m = cyl(rT, rB, h, mat, segs);
            m.position.z = z;
            lensGroup.add(m);
            return m;
        }

        // Mount ring & bayonet
        lc(0.57, 0.57, 0.09, metalMat, 0.60);
        lc(0.59, 0.59, 0.035, chromeMat, 0.645);
        // Accent ring (Chitraksha yellow)
        lc(0.516, 0.516, 0.035, accentMat, 0.73);

        // Barrel 1 (widest)
        lc(0.52, 0.52, 0.50, metalMat, 0.92);
        lc(0.525, 0.525, 0.012, chromeMat, 0.67); // edge highlight
        lc(0.525, 0.525, 0.012, chromeMat, 1.17);

        // Focus ring (rubber)
        lc(0.535, 0.535, 0.30, gripMat, 1.20);
        // Groove lines on focus ring
        [-0.1,-0.04,0,0.04,0.1].forEach(dz =>
            lc(0.538, 0.538, 0.01, chromeMat, 1.20 + dz)
        );

        // Barrel 2 (middle)
        lc(0.475, 0.475, 0.36, metalMat, 1.50);
        lc(0.478, 0.478, 0.012, chromeMat, 1.32);
        lc(0.478, 0.478, 0.012, chromeMat, 1.68);

        // Barrel 3 (front)
        lc(0.445, 0.455, 0.40, metalMat, 1.80);
        // Filter thread ring
        lc(0.458, 0.458, 0.04, chromeMat, 2.01);

        // Front glass element
        const fg = lc(0.38, 0.38, 0.06, frontGlassMat, 2.06);
        group.userData.frontGlass = fg;

        // Inner glass (recessed element)
        lc(0.27, 0.27, 0.04, glassMat, 2.02);

        // Cyan inner element (aperture feel)
        const innerRing = lc(0.14, 0.14, 0.02, cyanMat, 2.04);

        /* ── TOP DECK ── (hump top is y = 1.155) */
        add(box(0.52, 0.04, 0.28, chromeMat), 0.16, 1.19, -0.04);
        [-0.24, 0.24].forEach(dx =>
            add(box(0.04, 0.06, 0.28, chromeMat), 0.16 + dx, 1.22, -0.04)
        );
        add(box(0.28, 0.02, 0.06, chromeMat), 0.16, 1.225, -0.04);

        // Mode dial (on the grip-side shoulder, axis vertical)
        add(cylY(0.245, 0.245, 0.14, metalMat, 32), 1.0, 0.86, -0.1);
        add(cylY(0.25, 0.25, 0.08, gripMat, 32),    1.0, 0.86, -0.1);
        add(cylY(0.04, 0.04, 0.01, chromeMat, 16),  1.0, 0.935, -0.1);

        // ON/OFF ring + shutter button
        add(cylY(0.125, 0.125, 0.05, chromeMat, 32), 1.25, 0.82, 0.3);
        add(cylY(0.078, 0.088, 0.05, chromeMat, 32), 1.25, 0.87, 0.3);

        // Sub-command dial (front of grip, axis sideways)
        add(cylX(0.125, 0.125, 0.055, metalMat, 32), 1.72, 0.5, 0.28);

        /* ── STRAP LUGS ── */
        [{ x: -1.24, y: 0.52 }, { x: 1.74, y: 0.38 }].forEach(({ x, y }) => {
            add(box(0.1, 0.28, 0.09, metalMat), x, y, 0);
            add(cylX(0.052, 0.052, 0.13, gripMat, 16), x, y, 0);
        });

        /* ── FRONT FACE DETAILS ── */
        // Red brand dot
        const rd = new T.Mesh(new T.SphereGeometry(0.04, 16, 16), redMat);
        add(rd, -0.52, 0.35, 0.56);

        // AF illuminator
        add(box(0.065, 0.045, 0.02, new T.MeshStandardMaterial({
            color: 0xff5500, emissive: new T.Color(0xff3300), emissiveIntensity: 0.4,
        })), -0.85, 0.05, 0.565);

        // Lens release button
        const lr = cyl(0.062, 0.062, 0.025, chromeMat, 16);
        lr.position.set(0.45, 0.08, 0.565);
        group.add(lr);

        // DoF preview button
        const dof = cyl(0.048, 0.048, 0.022, metalMat, 12);
        dof.position.set(0.55, -0.32, 0.565);
        group.add(dof);

        // Front grip contour detail
        add(box(0.03, 1.2, 0.08, gripMat), 1.72, 0, 0.42);

        /* ── BACK PANEL ── */
        // LCD bezel
        add(box(1.12, 0.88, 0.022), -0.18, -0.1, -0.564); // bodyMat
        // LCD screen
        const lcd = new T.Mesh(new T.BoxGeometry(1.02, 0.78, 0.025), lcdMat);
        lcd.castShadow = false;
        add(lcd, -0.18, -0.1, -0.573);

        // Viewfinder eyepiece barrel
        const vf = cyl(0.14, 0.14, 0.09, bodyMat, 32);
        vf.position.set(0.16, 0.95, -0.49);
        group.add(vf);
        const vfGlass = cyl(0.11, 0.11, 0.04, glassMat, 32);
        vfGlass.position.set(0.16, 0.95, -0.535);
        group.add(vfGlass);

        // Back buttons (6 small)
        [[0.82, 0.52],[0.82, 0.22],[0.82,-0.10],[0.82,-0.40],[0.50,-0.60],[0.12,-0.60]].forEach(([bx,by]) => {
            const btn = cyl(0.042, 0.042, 0.024, metalMat, 12);
            btn.position.set(bx, by, -0.572);
            group.add(btn);
        });

        // Thumb wheel (back top-right)
        add(cylX(0.1, 0.1, 0.05, metalMat, 32), 0.9, 0.7, -0.5);
        add(cylX(0.102, 0.102, 0.042, gripMat, 32), 0.9, 0.7, -0.5);

        // AEL button
        const ael = cyl(0.055, 0.055, 0.022, accentMat, 12);
        ael.position.set(0.5, 0.62, -0.572);
        group.add(ael);

        /* ── MEMORY CARD DOOR (right side) ── */
        add(box(0.04, 0.58, 0.72, metalMat), 1.74, -0.28, -0.08);
        // Door seam
        add(box(0.05, 0.01, 0.72, gripMat), 1.74, 0.01, -0.08);
        add(box(0.05, 0.01, 0.72, gripMat), 1.74, -0.56, -0.08);

        /* ── BOTTOM ── */
        add(box(2.2, 0.04, 1.1, metalMat), 0, -0.795, 0);
        // Tripod socket
        add(cylY(0.1, 0.1, 0.04, chromeMat, 32), 0.05, -0.815, 0.12);
        // Battery door
        add(box(0.85, 0.04, 0.55, metalMat), -0.4, -0.8, -0.08);

        /* ── APPLY SHADOWS ── */
        group.traverse(obj => {
            if (obj.isMesh) {
                obj.castShadow    = true;
                obj.receiveShadow = true;
            }
        });

        return group;
    }

    /* ─────────────────────────────────────────
       SETUP LIGHTS
    ───────────────────────────────────────────*/
    function setupLights(T, scene, dslr) {
        // Ambient (cinematic low fill)
        scene.add(new T.AmbientLight(0x10101a, 1.5));

        // Key light (warm, top-front-right)
        const key = new T.DirectionalLight(0xfff5e8, 4.0);
        key.position.set(5, 9, 7);
        key.castShadow = true;
        key.shadow.mapSize.width  = 2048;
        key.shadow.mapSize.height = 2048;
        key.shadow.camera.near = 1;
        key.shadow.camera.far  = 40;
        key.shadow.camera.left = key.shadow.camera.bottom = -8;
        key.shadow.camera.right = key.shadow.camera.top  =  8;
        key.shadow.bias = -0.001;
        scene.add(key);

        // Cool fill (left side)
        const fill = new T.DirectionalLight(0x8899cc, 1.1);
        fill.position.set(-7, 2, 5);
        scene.add(fill);

        // Back rim light (accent yellow-green — catches lens edges)
        const rim1 = new T.PointLight(0xe8ff47, 3.0, 22);
        rim1.position.set(-5, -0.5, -7);
        scene.add(rim1);
        scene.userData.rimLight = rim1;

        // Cyan accent (right back)
        const rim2 = new T.PointLight(0x00d4ff, 2.2, 18);
        rim2.position.set(6, 3, -5);
        scene.add(rim2);

        // Warm ground fill (bottom)
        const ground = new T.PointLight(0xff6633, 0.7, 14);
        ground.position.set(0, -6, 3);
        scene.add(ground);

        // Subtle front light (keeps front from being too dark)
        const front = new T.DirectionalLight(0xffffff, 0.5);
        front.position.set(0, 1, 10);
        scene.add(front);

        // Pink accent
        const pink = new T.PointLight(0xff3c6e, 1.2, 16);
        pink.position.set(-3, 4, -8);
        scene.add(pink);
    }

})();
