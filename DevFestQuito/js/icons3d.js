// 3D icons (IA, Web, Cloud, Startups, Comunidad) from the "Iconos 3D" prototype.
// One shared WebGL renderer draws every icon into its own 2D <canvas data-icon="…">,
// so the page never holds more than one extra WebGL context.
import * as THREE from 'three';

const canvases = [...document.querySelectorAll('canvas[data-icon]')];
if (canvases.length) boot();

function boot() {
  const V2 = THREE.Vector2, V3 = THREE.Vector3, D = Math.PI / 180;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dpr = Math.min(devicePixelRatio || 1, 2);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(1);
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.05;
  let rw = 0, rh = 0;
  const ensureSize = (w, h) => { if (w > rw || h > rh) { rw = Math.max(rw, w); rh = Math.max(rh, h); renderer.setSize(rw, rh, false); } };

  // ---------- helpers ----------
  function rbox(w, h, d, r = 0.1, s = 5) {
    r = Math.min(r, w / 2 - 1e-3, h / 2 - 1e-3, d / 2 - 1e-3);
    const N = 2 * s + 1, g = new THREE.BoxGeometry(1, 1, 1, N, N, N);
    const pos = g.attributes.position, nor = g.attributes.normal, H = [w / 2, h / 2, d / 2];
    const map = (c, hh) => { const i = Math.round((c + 0.5) * N); return i <= s ? -hh + r * (i / s) : hh - r * ((N - i) / s); };
    const cl = (v, a) => Math.max(-a + r, Math.min(a - r, v)), dir = new V3();
    for (let i = 0; i < pos.count; i++) {
      const x = map(pos.getX(i), H[0]), y = map(pos.getY(i), H[1]), z = map(pos.getZ(i), H[2]);
      const ix = cl(x, H[0]), iy = cl(y, H[1]), iz = cl(z, H[2]);
      dir.set(x - ix, y - iy, z - iz);
      if (dir.lengthSq() < 1e-12) { pos.setXYZ(i, x, y, z); continue; }
      dir.normalize(); pos.setXYZ(i, ix + dir.x * r, iy + dir.y * r, iz + dir.z * r); nor.setXYZ(i, dir.x, dir.y, dir.z);
    }
    return g;
  }
  function smoothNormals(g, th = 0.5) {
    g.computeVertexNormals();
    const p = g.attributes.position, n = g.attributes.normal, groups = new Map();
    for (let i = 0; i < p.count; i++) {
      const k = Math.round(p.getX(i) * 1e4) + ',' + Math.round(p.getY(i) * 1e4) + ',' + Math.round(p.getZ(i) * 1e4);
      (groups.get(k) || groups.set(k, []).get(k)).push(i);
    }
    const out = new Float32Array(n.count * 3), a = new V3(), b = new V3(), s = new V3();
    for (const idx of groups.values()) for (const i of idx) {
      a.fromBufferAttribute(n, i); s.set(0, 0, 0);
      for (const j of idx) { b.fromBufferAttribute(n, j); if (a.dot(b) > th) s.add(b); }
      s.normalize(); out[i * 3] = s.x; out[i * 3 + 1] = s.y; out[i * 3 + 2] = s.z;
    }
    n.array.set(out); n.needsUpdate = true;
  }
  const ramp = (stops) => { const cs = stops.map(([u, h]) => [u, new THREE.Color(h)]); return (u, out = new THREE.Color()) => {
    u = Math.max(0, Math.min(1, u));
    for (let i = 0; i < cs.length - 1; i++) if (u <= cs[i + 1][0]) return out.copy(cs[i][1]).lerp(cs[i + 1][1], (u - cs[i][0]) / (cs[i + 1][0] - cs[i][0]));
    return out.copy(cs[cs.length - 1][1]);
  }; };
  function colorize(geo, fn, matrix) {
    const p = geo.attributes.position, arr = new Float32Array(p.count * 3), v = new V3();
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); if (matrix) v.applyMatrix4(matrix); const c = fn(v); arr[i * 3] = c.r; arr[i * 3 + 1] = c.g; arr[i * 3 + 2] = c.b; }
    geo.setAttribute('color', new THREE.BufferAttribute(arr, 3));
  }
  const M = (name, color, r = 0.32, extra = {}) => new THREE.MeshStandardMaterial({ name, color, roughness: r, metalness: 0, ...extra });
  const mesh = (name, geo, m, x = 0, y = 0, z = 0, parent) => { const o = new THREE.Mesh(geo, m); o.name = name; o.position.set(x, y, z); parent && parent.add(o); return o; };
  const lathe = (pts, seg = 64) => new THREE.LatheGeometry(pts.map(([x, y]) => new V2(x, y)), seg);

  // ---------- icons ----------
  function buildAI() {
    const g = new THREE.Group();
    const tips = [[0, 1.3], [1.0, 0], [0, -1.3], [-1.0, 0]], ri = 0.34, zA = 0.56;
    const inner = [45, -45, -135, 135].map(a => [Math.cos(a * D) * ri, Math.sin(a * D) * ri]);
    const ring = ramp([[0, '#ffc53d'], [0.17, '#ff8a2e'], [0.3, '#ff4f6a'], [0.44, '#c24ef0'], [0.58, '#7a5cff'], [0.72, '#2aa6ff'], [0.86, '#35d0c0'], [1, '#ffc53d']]);
    const pos = [], col = [], c = new THREE.Color(), white = new THREE.Color('#ffffff');
    const angU = (x, y) => ((Math.atan2(y, x) / (2 * Math.PI)) + 1) % 1;
    const push = (pts, lightApex) => pts.forEach(([x, y, z]) => {
      pos.push(x, y, z);
      if (x === 0 && y === 0) { const m = pts.filter(p => p[0] || p[1]); ring(angU(m[0][0] + m[1][0], m[0][1] + m[1][1]), c).lerp(white, lightApex); }
      else ring(angU(x, y), c);
      col.push(c.r, c.g, c.b);
    });
    for (let i = 0; i < 4; i++) {
      const T = [...tips[i], 0], I = [...inner[i], 0], Ip = [...inner[(i + 3) % 4], 0], A = [0, 0, zA], B = [0, 0, -zA];
      push([T, A, I], 0.45); push([T, Ip, A], 0.45);
      push([T, I, B], 0.1); push([T, B, Ip], 0.1);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    geo.computeVertexNormals();
    mesh('sparkle', geo, M('sparkle_gradient', 0xffffff, 0.28, { vertexColors: true, flatShading: true }), 0, 0, 0, g);
    g.rotation.set(0.12, -0.2, -0.12);
    return { obj: g, view: new V3(0, 0.05, 1) };
  }
  function buildWeb() {
    const g = new THREE.Group();
    const cols = { blue: M('blue', 0x1f6fe5), red: M('red', 0xeb4a2f), yellow: M('yellow', 0xf8b814), green: M('green', 0x2c9a42) };
    const pal = ['blue', 'blue', 'red', 'blue', 'yellow', 'blue', 'green'], bands = [0, 59, 90, 121, 180].map(a => a * D);
    for (let i = 0; i < 8; i++) for (let j = 0; j < 4; j++) {
      const k = pal[(i * 3 + j * 5) % 7];
      mesh(`panel_${i}_${j}`, new THREE.SphereGeometry(0.94, 12, 8, i * Math.PI / 4, Math.PI / 4, bands[j], bands[j + 1] - bands[j]), cols[k], 0, 0, 0, g);
    }
    const white = M('lattice_white', 0xf7f4ee, 0.3), T = (R) => new THREE.TorusGeometry(R, 0.078, 20, 96);
    for (let k = 0; k < 4; k++) mesh('meridian_' + k, T(0.97), white, 0, 0, 0, g).rotation.y = k * Math.PI / 4;
    [[0, 0.97], [0.5, 0.83], [-0.5, 0.83]].forEach(([y, R], k) => mesh('parallel_' + k, T(R), white, 0, y, 0, g).rotation.x = Math.PI / 2);
    g.rotation.set(0.28, 0.35, -0.28);
    return { obj: g, view: new V3(0, 0.1, 1), spin: true };
  }
  function buildCloud() {
    const g = new THREE.Group();
    const m = M('cloud_gradient', 0xffffff, 0.35, { vertexColors: true });
    const grad = ramp([[0, '#ffb81c'], [0.22, '#ffd35a'], [0.48, '#fff7ec'], [0.66, '#d9e8ff'], [0.82, '#4f8ff2'], [1, '#1f5fe0']]);
    const fn = (p) => grad((p.x + 1.55) / 3.1 + (p.y - 0.8) * -0.04 + p.z * 0.05);
    [
      ['cloud_base', rbox(2.7, 0.9, 1.3, 0.45), 0, 0.45, 0, [1, 1, 1]],
      ['puff_left', new THREE.SphereGeometry(1, 48, 32), -0.82, 0.62, 0.02, [0.62, 0.62, 0.6]],
      ['puff_top', new THREE.SphereGeometry(1, 48, 32), 0.02, 1.05, -0.02, [0.86, 0.86, 0.72]],
      ['puff_right', new THREE.SphereGeometry(1, 48, 32), 0.82, 0.75, -0.05, [0.66, 0.66, 0.62]],
    ].forEach(([n, geo, x, y, z, s]) => { const o = mesh(n, geo, m, x, y, z, g); o.scale.set(...s); o.updateMatrix(); colorize(geo, fn, o.matrix); });
    g.rotation.set(0.12, -0.3, 0);
    return { obj: g, view: new V3(0, 0.08, 1) };
  }
  function buildRocket() {
    const g = new THREE.Group();
    const white = M('rocket_white', 0xf7f4ee, 0.3), blue = M('rocket_blue', 0x1f6fe5, 0.3), green = M('fin_green', 0x22b35e, 0.32), orange = M('window_orange', 0xf57d1f, 0.28);
    const r = new THREE.Group(); g.add(r);
    mesh('body', lathe([[0.001, 0], [0.3, 0.02], [0.43, 0.25], [0.51, 0.7], [0.52, 1.1], [0.49, 1.45], [0.001, 1.45]]), white, 0, 0, 0, r);
    mesh('nose', lathe([[0.001, 1.44], [0.49, 1.44], [0.44, 1.72], [0.33, 1.98], [0.17, 2.18], [0.001, 2.26]]), blue, 0, 0, 0, r);
    mesh('window_ring', new THREE.TorusGeometry(0.2, 0.065, 20, 64), white, 0, 1.05, 0.5, r);
    mesh('window', new THREE.SphereGeometry(0.19, 40, 24), orange, 0, 1.05, 0.49, r).scale.z = 0.55;
    mesh('nozzle', lathe([[0.001, 0.02], [0.26, 0.02], [0.3, -0.16], [0.001, -0.16]], 48), blue, 0, 0, 0, r);
    const flameGeo = lathe([[0.001, -0.12], [0.22, -0.15], [0.23, -0.32], [0.16, -0.6], [0.07, -0.85], [0.001, -0.95]], 48);
    const fr = ramp([[0, '#e8341f'], [0.45, '#ff7a1a'], [1, '#ffc93a']]);
    colorize(flameGeo, p => fr((p.y + 0.95) / 0.83));
    const flame = mesh('flame', flameGeo, M('flame_gradient', 0xffffff, 0.35, { vertexColors: true, emissive: 0xff5a00, emissiveIntensity: 0.18 }), 0, 0, 0, r);
    [[1, blue], [-1, green]].forEach(([sd, m]) => {
      const s = new THREE.Shape(), P = (x, y) => [sd * x, y];
      s.moveTo(...P(0, 0.72)); s.quadraticCurveTo(...P(0.55, 0.35), ...P(0.62, -0.18)); s.quadraticCurveTo(...P(0.64, -0.36), ...P(0.46, -0.3));
      s.quadraticCurveTo(...P(0.3, -0.12), ...P(0, 0.02)); s.lineTo(...P(0, 0.72));
      const geo = new THREE.ExtrudeGeometry(s, { depth: 0.1, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.05, bevelSegments: 5, curveSegments: 18 });
      geo.translate(0, 0, -0.05); smoothNormals(geo, 0.35);
      mesh('fin', geo, m, sd * 0.38, 0.18, 0, r);
    });
    r.rotation.z = -0.72; r.rotation.y = -0.35;
    g.rotation.x = 0.1;
    return { obj: g, view: new V3(0, 0.05, 1), tick: (t) => { flame.scale.set(1 + Math.sin(t * 17) * 0.03, 1 + Math.sin(t * 13) * 0.08, 1); } };
  }
  function buildPeople() {
    const g = new THREE.Group();
    const body = (R, H) => { const pts = [[0.001, 0], [R - 0.06, 0], [R, 0.06], [R, H * 0.4]]; const n = 16;
      for (let i = 1; i <= n; i++) { const a = (Math.PI / 2) * i / n; pts.push([Math.max(0.001, R * Math.cos(a)), H * 0.4 + (H * 0.6) * Math.sin(a)]); }
      return lathe(pts, 64); };
    const person = (x, z, R, H, bodyM, headM, hr) => {
      const p = new THREE.Group(); p.position.set(x, 0, z); g.add(p);
      mesh('body', body(R, H), bodyM, 0, 0, 0, p).scale.z = 0.78;
      mesh('head', new THREE.SphereGeometry(hr, 48, 32), headM, 0, H + hr * 0.95, 0, p);
      return p;
    };
    const red = M('red', 0xe8412f, 0.3), blue = M('blue', 0x1f6fe5, 0.3), green = M('green', 0x22a35a, 0.3), yellow = M('yellow', 0xf8b01a, 0.3), amber = M('amber', 0xf9a81c, 0.3);
    const ppl = [person(-0.95, -0.25, 0.55, 0.85, red, red, 0.36), person(0.95, -0.2, 0.5, 0.78, yellow, amber, 0.33), person(0, 0.12, 0.75, 1.05, blue, green, 0.46)];
    g.rotation.set(0.08, -0.12, 0);
    return { obj: g, view: new V3(0, 0.16, 1), tick: (t) => ppl.forEach((p, i) => { p.position.y = Math.max(0, Math.sin(t * 2.2 + i * 2.1)) * 0.05; }) };
  }
  const builders = { ai: buildAI, web: buildWeb, cloud: buildCloud, rocket: buildRocket, people: buildPeople };

  // ---------- one scene per canvas ----------
  const easeOut = u => 1 - Math.pow(1 - u, 3);
  const views = canvases.map((canvas, idx) => {
    const build = builders[canvas.dataset.icon];
    if (!build) return null;
    const scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xeef4ff, 0xfff3e4, 1.55));
    const key = new THREE.DirectionalLight(0xffffff, 2.3);
    key.position.set(3, 6, 5); key.castShadow = true; key.shadow.mapSize.set(512, 512);
    key.shadow.radius = 6; key.shadow.normalBias = 0.02; key.shadow.bias = -0.0002;
    Object.assign(key.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4, near: 0.5, far: 30 });
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xfff4e6, 0.5); fill.position.set(-5, 3, -4); scene.add(fill);
    const rim = new THREE.DirectionalLight(0xd8e6ff, 0.9); rim.position.set(-4, 3, -3); scene.add(rim);

    const { obj, view, spin, tick } = build();
    const pivot = new THREE.Group();
    const box = new THREE.Box3().setFromObject(obj), c = box.getCenter(new V3());
    obj.position.sub(c); pivot.add(obj);
    pivot.position.y = box.getSize(new V3()).y / 2;
    scene.add(pivot);
    pivot.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    const withShadow = canvas.dataset.shadow !== 'off';
    if (withShadow) {
      const ground = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: 0.1 }));
      ground.rotation.x = -Math.PI / 2; ground.position.y = -0.06; ground.receiveShadow = true; scene.add(ground);
    }
    const sphere = new THREE.Box3().setFromObject(pivot).getBoundingSphere(new THREE.Sphere());
    const camera = new THREE.PerspectiveCamera(35, 1, 0.05, 100);
    const ctx = canvas.getContext('2d');
    const v = { canvas, ctx, scene, camera, pivot, obj, spin, tick, sphere, view, w: 0, h: 0, visible: false, t: 0, spinAt: -9, ph: idx * 1.3, baseY: pivot.position.y, baseRy: pivot.rotation.y, dirty: true };

    const host = canvas.closest('[data-icon-host]') || canvas;
    host.addEventListener('pointerenter', () => { if (v.t - v.spinAt > 1.2) v.spinAt = v.t; });
    return v;
  }).filter(Boolean);

  function fit(v) {
    const w = Math.max(1, Math.round(v.canvas.clientWidth * dpr)), h = Math.max(1, Math.round(v.canvas.clientHeight * dpr));
    if (w === v.w && h === v.h) return;
    v.w = w; v.h = h; v.canvas.width = w; v.canvas.height = h;
    v.camera.aspect = w / h;
    const vh = v.camera.fov * D / 2, hh = Math.atan(Math.tan(vh) * v.camera.aspect);
    const pad = parseFloat(v.canvas.dataset.pad || '1.05');
    const dist = v.sphere.radius / Math.sin(Math.min(vh, hh)) * pad;
    v.camera.position.copy(v.sphere.center).add(v.view.clone().normalize().multiplyScalar(dist));
    v.camera.near = dist / 20; v.camera.far = dist * 4;
    v.camera.updateProjectionMatrix();
    v.camera.lookAt(v.sphere.center);
    ensureSize(w, h);
  }

  addEventListener('resize', () => views.forEach(v => { v.dirty = true; }), { passive: true });

  let last = performance.now();
  function frame() {
    const now = performance.now(), dt = Math.min((now - last) / 1000, 0.05); last = now;
    if (document.hidden) return;
    const vh = innerHeight, vw = innerWidth;
    for (const v of views) {
      const r = v.canvas.getBoundingClientRect();
      const vis = r.width > 0 && r.bottom > -80 && r.top < vh + 80 && r.right > 0 && r.left < vw;
      if (vis && !v.visible) v.dirty = true;
      v.visible = vis;
      if (!v.visible) continue;
      if (reduceMotion && !v.dirty) continue;
      if (v.dirty) { fit(v); v.dirty = false; }
      v.t += dt;
      if (!reduceMotion) {
        const su = (v.t - v.spinAt) / 1.2, extra = su >= 0 && su < 1 ? easeOut(su) * Math.PI * 2 : 0;
        v.pivot.position.y = v.baseY + Math.sin(v.t * 1.3 + v.ph) * 0.05;
        v.pivot.rotation.y = v.baseRy + Math.sin(v.t * 0.6 + v.ph) * 0.22 + extra;
        if (v.spin) v.obj.rotation.y += dt * 0.35;
        v.tick && v.tick(v.t);
      }
      renderer.setViewport(0, 0, v.w, v.h);
      renderer.setScissor(0, 0, v.w, v.h);
      renderer.setScissorTest(true);
      renderer.render(v.scene, v.camera);
      v.ctx.clearRect(0, 0, v.w, v.h);
      // el viewport de WebGL arranca abajo-izquierda; el canvas 2D arriba-izquierda
      v.ctx.drawImage(renderer.domElement, 0, rh - v.h, v.w, v.h, 0, 0, v.w, v.h);
    }
  }
  renderer.setAnimationLoop(frame);
}
