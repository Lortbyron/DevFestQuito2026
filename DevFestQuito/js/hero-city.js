// Hero: Quito "pocket city" — procedural three.js scene (from Pocket City prototype).
import * as THREE from 'three';

const canvas = document.getElementById('hero-canvas');
if (canvas) boot(canvas);

function boot(canvas) {
  const V3 = THREE.Vector3, V2 = THREE.Vector2;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = matchMedia('(max-width: 760px)').matches;

  // ---------- renderer / scene ----------
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, small ? 1.75 : 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.04;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200);

  scene.add(new THREE.HemisphereLight(0xe4efff, 0xfff0da, 1.45));
  const key = new THREE.DirectionalLight(0xfff3e0, 2.5);
  key.position.set(7, 14, 9);
  key.castShadow = true;
  key.shadow.mapSize.set(small ? 1024 : 2048, small ? 1024 : 2048);
  key.shadow.bias = -0.0004; key.shadow.normalBias = 0.03; key.shadow.radius = 5;
  Object.assign(key.shadow.camera, { left: -11, right: 11, top: 11, bottom: -11, near: 1, far: 50 });
  key.shadow.camera.updateProjectionMatrix();
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xfff4e6, 0.5); fill.position.set(-5, 3, -4); scene.add(fill);
  const rim = new THREE.DirectionalLight(0xcfe0ff, 0.7); rim.position.set(-9, 6, -7); scene.add(rim);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.ShadowMaterial({ opacity: 0.12 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);

  // ---------- materials ----------
  const M = (name, color, r = 0.55, extra = {}) => new THREE.MeshStandardMaterial({ name, color, roughness: r, metalness: 0, ...extra });
  const mat = {
    plinth: M('plinth', 0xf3efe8, 0.85),
    plaster: M('plaster', 0xf7f2e8, 0.7),
    sand: M('sand', 0xf2d59b, 0.7),
    blue: M('blue', 0x1f6fe5, 0.5),
    red: M('red', 0xeb4a2f, 0.5),
    orange: M('orange', 0xf47b20, 0.5),
    yellow: M('yellow', 0xf8b814, 0.5),
    green: M('green', 0x2c9a42, 0.72),
    leaf: M('leaf_dark', 0x1f7f36, 0.75),
    stone: M('stone', 0x8e939b, 0.62),
    arch: M('arch_shadow', 0xc79d74, 0.85),
    snow: M('snow', 0xffffff, 0.6, { side: THREE.DoubleSide, flatShading: true }),
    volcano: M('volcano', 0x2a66dd, 0.6, { flatShading: true }),
    cloud: M('cloud', 0xffffff, 0.85),
    sun: M('sun', 0xffc414, 0.45, { emissive: 0xffa200, emissiveIntensity: 0.22 }),
    grad: M('gradient', 0xffffff, 0.42, { vertexColors: true }),
  };

  // ---------- geometry helpers ----------
  const cache = new Map();
  function rbox(w, h, d, r = 0.1, s = 4) {
    r = Math.min(r, w / 2 - 1e-3, h / 2 - 1e-3, d / 2 - 1e-3);
    const k = [w, h, d, r, s].map(v => v.toFixed(3)).join('|');
    if (cache.has(k)) return cache.get(k);
    const N = 2 * s + 1, g = new THREE.BoxGeometry(1, 1, 1, N, N, N);
    const pos = g.attributes.position, nor = g.attributes.normal, H = [w / 2, h / 2, d / 2];
    const map = (c, hh) => { const i = Math.round((c + 0.5) * N); return i <= s ? -hh + r * (i / s) : hh - r * ((N - i) / s); };
    const cl = (v, a) => Math.max(-a + r, Math.min(a - r, v));
    const dir = new V3();
    for (let i = 0; i < pos.count; i++) {
      const x = map(pos.getX(i), H[0]), y = map(pos.getY(i), H[1]), z = map(pos.getZ(i), H[2]);
      const ix = cl(x, H[0]), iy = cl(y, H[1]), iz = cl(z, H[2]);
      dir.set(x - ix, y - iy, z - iz);
      if (dir.lengthSq() < 1e-12) { pos.setXYZ(i, x, y, z); continue; }
      dir.normalize();
      pos.setXYZ(i, ix + dir.x * r, iy + dir.y * r, iz + dir.z * r);
      nor.setXYZ(i, dir.x, dir.y, dir.z);
    }
    cache.set(k, g);
    return g;
  }
  function coin(R, T, e = T / 2, seg = 64) {
    const pts = [new V2(0.001, -T / 2)], n = 12;
    for (let i = 0; i <= n; i++) { const a = -Math.PI / 2 + Math.PI * i / n; pts.push(new V2(R - e + Math.cos(a) * e, Math.sin(a) * T / 2)); }
    pts.push(new V2(0.001, T / 2));
    return new THREE.LatheGeometry(pts, seg);
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
  function gradient(g, axis, stops, min, max) {
    const p = g.attributes.position, cols = stops.map(h => new THREE.Color(h)), c = new THREE.Color();
    const arr = new Float32Array(p.count * 3), get = 'get' + axis.toUpperCase();
    for (let i = 0; i < p.count; i++) {
      const u = Math.max(0, Math.min(1, (p[get](i) - min) / (max - min))), f = u * (cols.length - 1), k = Math.min(Math.floor(f), cols.length - 2);
      c.copy(cols[k]).lerp(cols[k + 1], f - k); arr[i * 3] = c.r; arr[i * 3 + 1] = c.g; arr[i * 3 + 2] = c.b;
    }
    g.setAttribute('color', new THREE.BufferAttribute(arr, 3));
  }
  const archCache = new Map();
  function archGeo(w, h) {
    const k = w + '|' + h; if (archCache.has(k)) return archCache.get(k);
    const s = new THREE.Shape(), r = w / 2;
    s.moveTo(-r, 0); s.lineTo(r, 0); s.lineTo(r, h - r); s.absarc(0, h - r, r, 0, Math.PI, false); s.lineTo(-r, 0);
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.03, bevelEnabled: false, curveSegments: 14 });
    archCache.set(k, g); return g;
  }
  const SPH = new THREE.SphereGeometry(1, 40, 24);
  const HEMI = new THREE.SphereGeometry(1, 40, 16, 0, Math.PI * 2, 0, Math.PI / 2);

  function mesh(name, geo, m, x = 0, y = 0, z = 0, parent) {
    const o = new THREE.Mesh(geo, m); o.name = name; o.position.set(x, y, z); if (parent) parent.add(o); return o;
  }
  function group(name, x = 0, y = 0, z = 0, parent) { const g = new THREE.Group(); g.name = name; g.position.set(x, y, z); if (parent) parent.add(g); return g; }
  function block(name, parent, x, z, w, h, d, m, r = 0.12, y0 = 0) { return mesh(name, rbox(w, h, d, r), m, x, y0 + h / 2, z, parent); }
  function arch(parent, x, y, zFace, w, h, m = mat.arch) { return mesh('arch', archGeo(w, h), m, x, y, zFace - 0.02, parent); }
  function cross(parent, x, y, z, s = 1) {
    mesh('cross_post', rbox(0.08 * s, 0.44 * s, 0.08 * s, 0.03 * s), mat.orange, x, y + 0.22 * s, z, parent);
    mesh('cross_bar', rbox(0.28 * s, 0.08 * s, 0.08 * s, 0.03 * s), mat.orange, x, y + 0.3 * s, z, parent);
  }
  function dome(parent, x, y, z, r) {
    mesh('dome_drum', new THREE.CylinderGeometry(r * 0.92, r * 0.92, r * 0.35, 40), mat.plaster, x, y + r * 0.175, z, parent);
    const d = mesh('dome', HEMI, mat.blue, x, y + r * 0.35, z, parent); d.scale.setScalar(r);
    cross(parent, x, y + r * 1.3, z, r * 1.4);
  }
  const sway = [], drifters = [];
  const Y0 = 0.5;
  function tree(name, parent, x, z, r, len, m = mat.green) {
    const t = mesh(name, new THREE.CapsuleGeometry(r, len, 10, 32), m, x, Y0 + len / 2 + r * 0.8, z, parent);
    t.userData.ph = Math.random() * 6; sway.push(t); return t;
  }
  function bush(name, parent, x, z, sx, sy, sz, m = mat.green, y = 0) { const b = mesh(name, SPH, m, x, Y0 + y, z, parent); b.scale.set(sx, sy, sz); return b; }
  function cloud(name, parent, x, y, z, s = 1, m = mat.cloud) {
    const g = group(name, x, y, z, parent); g.scale.setScalar(s);
    mesh('cloud_base', rbox(3.0, 0.62, 1.1, 0.3), m, 0, 0.31, 0, g);
    [[0, 0.78, 0, 0.72], [-0.85, 0.52, 0.02, 0.52], [0.82, 0.55, 0, 0.58], [0.3, 1.18, -0.05, 0.5], [-0.35, 0.95, 0.1, 0.5]]
      .forEach(([px, py, pz, r], i) => { const p = mesh('cloud_puff_' + i, SPH, m, px, py, pz, g); p.scale.set(r, r, r * 0.9); });
    return g;
  }

  // ---------- world ----------
  const root = group('quito_pocket_city');
  mesh('plinth', coin(7.2, 0.5, 0.24, 96), mat.plinth, 0, 0.25, 0, root);
  const pokeable = (o) => { o.userData.poke = true; return o; };

  // Centro histórico
  const old = pokeable(group('old_town', -2.8, Y0, -0.2, root));
  block('nave', old, -0.7, -0.35, 2.3, 1.7, 1.4, mat.plaster, 0.1);
  { const s = new THREE.Shape(); s.moveTo(-0.85, 0); s.lineTo(0.85, 0); s.lineTo(0, 0.62); s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: 2.3, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 3 });
    g.translate(0, 0, -1.15); const roof = mesh('nave_roof', g, mat.red, -0.7, 1.68, -0.35, old); roof.rotation.y = Math.PI / 2; }
  [-1.35, -0.75].forEach(x => arch(old, x, 0.55, 0.35, 0.3, 0.72));
  block('bell_tower', old, 0.45, -0.75, 0.95, 3.3, 0.95, mat.plaster, 0.08);
  [0.25, 0.65].forEach(x => arch(old, x, 2.35, -0.275, 0.24, 0.62));
  mesh('tower_cap', rbox(1.08, 0.18, 1.08, 0.06), mat.plaster, 0.45, 3.38, -0.75, old);
  dome(old, 0.45, 3.47, -0.75, 0.42);
  block('chapel', old, 0.1, 0.85, 1.9, 1.45, 1.25, mat.plaster, 0.1);
  { const a = 0.5, w = 1.18;
    const l = mesh('chapel_roof_l', rbox(w, 0.15, 1.42, 0.05), mat.yellow, -0.4, 1.45 + Math.sin(a) * w / 2, 0.85, old); l.rotation.z = a;
    const r = mesh('chapel_roof_r', rbox(w, 0.15, 1.42, 0.05), mat.red, 0.6, 1.45 + Math.sin(a) * w / 2, 0.85, old); r.rotation.z = -a; }
  arch(old, -0.45, 0.3, 1.475, 0.28, 0.72); arch(old, 0.65, 0.3, 1.475, 0.28, 0.72);
  arch(old, 0.1, 0.0, 1.475, 0.36, 0.95, mat.red);
  block('side_chapel', old, 1.55, 0.05, 1.25, 2.05, 1.15, mat.plaster, 0.1);
  mesh('side_cap', rbox(1.35, 0.16, 1.25, 0.05), mat.plaster, 1.55, 2.1, 0.05, old);
  dome(old, 1.55, 2.18, 0.05, 0.5);
  arch(old, 1.3, 0.95, 0.625, 0.24, 0.62); arch(old, 1.8, 0.0, 0.625, 0.3, 0.85, mat.red);

  // El Panecillo
  const hill = pokeable(group('panecillo', -0.6, Y0, -2.7, root));
  bush('hill', hill, 0, 0, 2.3, 1.95, 2.0, mat.green, -Y0 - 0.25).position.set(0, -0.25, 0);
  const hill2 = mesh('hill_front', SPH, mat.leaf, 0.7, -0.25, 1.3, hill); hill2.scale.set(1.5, 1.25, 1.2);
  const angel = group('angel', 0, 1.62, 0, hill);
  mesh('pedestal', rbox(0.95, 0.5, 0.95, 0.06), mat.stone, 0, 0.25, 0, angel);
  mesh('pedestal_top', rbox(0.72, 0.24, 0.72, 0.05), mat.stone, 0, 0.62, 0, angel);
  { const pts = [[0.001, 0], [0.34, 0], [0.31, 0.45], [0.24, 1.0], [0.19, 1.38], [0.12, 1.5], [0.001, 1.52]].map(([x, y]) => new V2(x, y));
    mesh('robe', new THREE.LatheGeometry(pts, 40), mat.stone, 0, 0.74, 0, angel); }
  mesh('head', SPH, mat.stone, 0, 2.43, 0, angel).scale.setScalar(0.17);
  cross(angel, 0, 2.58, 0, 0.9);
  const wings = [-1, 1].map(sd => {
    const w = group(sd < 0 ? 'wing_l' : 'wing_r', sd * 0.14, 2.1, -0.12, angel);
    const s = new THREE.Shape(), P = (x, y) => [sd * x, y];
    s.moveTo(0, 0); s.quadraticCurveTo(...P(0.3, 0.8), ...P(1.05, 1.02));
    s.quadraticCurveTo(...P(1.14, 0.78), ...P(0.92, 0.62)); s.quadraticCurveTo(...P(1.0, 0.38), ...P(0.74, 0.3));
    s.quadraticCurveTo(...P(0.76, 0.05), ...P(0.5, 0.05)); s.quadraticCurveTo(...P(0.42, -0.17), ...P(0.16, -0.12)); s.lineTo(0, 0);
    const wg = new THREE.ExtrudeGeometry(s, { depth: 0.06, bevelEnabled: true, bevelThickness: 0.035, bevelSize: 0.035, bevelSegments: 4, curveSegments: 16 });
    wg.translate(0, 0, -0.03); smoothNormals(wg, 0.4);
    mesh('wing_blade', wg, mat.stone, 0, 0, 0, w);
    w.rotation.z = -sd * 0.1; return w;
  });

  // Cotopaxi + sol
  const volc = pokeable(group('cotopaxi', 3.4, Y0, -3.9, root));
  { const R = 3.3, H = 4.5, f = 0.42;
    const cone = new THREE.ConeGeometry(R, H, 9, 1); cone.translate(0, H / 2, 0);
    const m = mesh('volcano', cone, mat.volcano, 0, 0, 0, volc); m.rotation.y = 0.18;
    const sg = new THREE.CylinderGeometry(0.03, 1, 1, 36, 1, true), p = sg.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const top = p.getY(i) > 0, th = Math.atan2(p.getX(i), p.getZ(i));
      if (top) { p.setXYZ(i, p.getX(i), H * 0.998, p.getZ(i)); continue; }
      const dr = 0.5 + 0.3 * Math.sin(4 * th + 1) + 0.2 * Math.sin(9 * th + 2);
      const t = f * (0.62 + 0.45 * dr), rr = R * t * 1.03;
      p.setXYZ(i, Math.sin(th) * rr, H * (1 - t), Math.cos(th) * rr);
    }
    sg.computeVertexNormals();
    const snow = mesh('snow_cap', sg, mat.snow, 0, 0.004, 0, volc); snow.rotation.y = 0.18; }
  const sun = pokeable(group('sun', 5.4, Y0 + 6.1, -6.3, root));
  mesh('sun_disc', coin(2.1, 0.6, 0.3, 96), mat.sun, 0, 0, 0, sun).rotation.x = Math.PI / 2;
  drifters.push(cloud('cloud_high', root, 1.8, Y0 + 5.0, -4.9, 0.95));

  // Árboles + bloques de ciudad
  const flora = group('greenery', 0, 0, 0, root);
  tree('tree_tall', flora, -5.1, -0.9, 0.62, 1.5);
  tree('tree_mid', flora, -4.2, 0.35, 0.38, 0.35, mat.leaf);
  tree('tree_pillar', flora, 5.7, -1.0, 0.32, 2.4, mat.leaf);
  [[1.5, -1.6, 0.52, 0.7], [2.5, -1.3, 0.62, 0.9], [3.6, -1.6, 0.55, 0.6], [4.5, -1.2, 0.45, 0.4], [2.0, -0.7, 0.4, 0.2], [3.1, -0.6, 0.42, 0.3]]
    .forEach(([x, z, r, l], i) => tree('tree_' + i, flora, x, z, r, l, i % 2 ? mat.leaf : mat.green));
  [[-6.3, 1.9, 0.6, 0.45, 0.55], [-5.5, 3.3, 0.7, 0.5, 0.6], [-6.5, -0.4, 0.5, 0.42, 0.5], [-3.7, 4.6, 0.55, 0.38, 0.5], [6.1, 0.9, 0.55, 0.5, 0.5], [-1.1, 1.3, 0.42, 0.4, 0.42]]
    .forEach(([x, z, a, b, c], i) => bush('bush_' + i, flora, x, z, a, b, c, i % 2 ? mat.green : mat.leaf));
  const city = group('city_blocks', 0, Y0, 0, root);
  [
    [-3.8, -1.7, 1.2, 2.5, 1.0, 'blue'], [-1.9, -1.4, 0.9, 2.0, 0.9, 'blue'], [1.5, -0.4, 1.1, 2.7, 1.0, 'orange', 0.1],
    [0.9, 0.5, 0.9, 1.9, 0.9, 'blue'], [2.3, 0.7, 1.4, 1.4, 1.2, 'plaster'], [3.6, 0.9, 1.1, 1.2, 1.0, 'blue'],
    [4.8, 0.3, 1.5, 1.25, 1.2, 'yellow'], [5.3, -0.2, 0.8, 1.9, 0.8, 'yellow', 0.4], [-4.7, 1.4, 1.5, 1.2, 1.2, 'red'],
    [-3.4, 1.6, 0.8, 1.0, 0.8, 'yellow'], [-5.5, 0.4, 0.9, 1.9, 0.8, 'blue', 0.4], [-4.5, -0.5, 0.8, 1.7, 0.8, 'yellow'],
    [-1.5, 2.45, 1.8, 0.5, 1.0, 'blue'], [-0.9, 3.4, 1.1, 0.34, 0.8, 'green'], [1.1, 2.4, 0.8, 0.5, 0.8, 'red'],
    [-0.2, 1.6, 0.6, 0.9, 0.6, 'blue'], [4.4, 1.6, 1.2, 0.7, 0.9, 'blue', 0.3], [-0.4, 4.3, 0.9, 0.3, 0.7, 'plaster'],
  ].forEach(([x, z, w, h, d, c, r = 0.12], i) => block('block_' + c + '_' + i, city, x, z, w, h, d, mat[c], r));
  [[0, 1.4, 0.5], [1, 1.0, 0.45], [2, 0.6, 0.35]].forEach(([i, s, h], k, arr) => {
    const y = arr.slice(0, k).reduce((a, b) => a + b[2], 0);
    block('terrace_' + i, city, 2.9, -0.35, s, h, s, k === 2 ? mat.sand : mat.plaster, 0.08, y);
  });
  [1.1, 0.8, 0.5].forEach((h, i) => block('white_step_' + i, city, 3.1 + i * 0.42, 1.75, 0.44, h, 0.8, mat.plaster, 0.06));
  for (let i = 0; i < 6; i++) block('stair_' + i, city, 0.25, 2.25 - i * 0.33, 1.2, 0.22 * (i + 1), 0.36, i % 2 ? mat.orange : mat.yellow, 0.05);
  mesh('dome_yellow', HEMI, mat.yellow, -1.9, 0, 3.55, city).scale.set(0.62, 0.7, 0.55);
  [[5.6, 2.8, 0.26, 0.85, 0.5, -0.35, 'yellow'], [6.2, 1.9, 0.24, 0.75, 0.45, -0.6, 'red'], [6.4, 3.0, 0.2, 0.62, 0.4, -0.9, 'leaf'], [4.9, 3.8, 0.28, 0.5, 0.45, 0.2, 'blue']]
    .forEach(([x, z, a, b, c, rz, m], i) => { const p = mesh('petal_' + m, SPH, mat[m], x, b * 0.8, z, city); p.scale.set(a, b, c); p.rotation.set(0, -0.5, rz); p.userData.ph = i; sway.push(p); });

  // Capa digital: chevrons, globo, nube, cinta
  const L = 1.25, T = 0.44;
  function chevron(name, x, z, dir, front, back) {
    const g = pokeable(group(name, x, Y0 + L * Math.SQRT1_2 + T * 0.35, z, root));
    const bars = (m, dz, dx, tag) => [1, -1].forEach(sg => {
      const geo = rbox(L + T * 0.5, T, T, 0.19).clone();
      const mm = new THREE.Matrix4().makeRotationZ(sg * dir * Math.PI / 4);
      mm.premultiply(new THREE.Matrix4().makeTranslation(dir * (L / 2 - T / 4) * Math.SQRT1_2 + dx, sg * (L / 2 - T / 4) * Math.SQRT1_2, dz));
      geo.applyMatrix4(mm);
      if (m === mat.grad) gradient(geo, 'y', [0xeb4a2f, 0xf7a21b, 0xf6d23a, 0x34b86a], -1.1, 1.1);
      mesh(name + '_' + tag + (sg > 0 ? '_upper' : '_lower'), geo, m, 0, 0, 0, g);
    });
    if (back) bars(back, -0.2, 0.14 * dir, 'back');
    bars(front, 0, 0, 'front');
    return g;
  }
  const chevL = chevron('chevron_left', -4.3, 3.3, 1, mat.grad); chevL.rotation.y = 0.3;
  const chevR = chevron('chevron_right', -2.55, 3.55, -1, mat.plaster, mat.blue); chevR.rotation.y = 0.12;
  const globe = pokeable(group('globe', 0.1, Y0 + 1.0, 3.95, root));
  mesh('globe_core', SPH, mat.blue, 0, 0, 0, globe).scale.setScalar(0.9);
  const TOR = (R) => new THREE.TorusGeometry(R, 0.075, 16, 72);
  for (let k = 0; k < 4; k++) mesh('meridian_' + k, TOR(0.97), mat.plaster, 0, 0, 0, globe).rotation.y = k * Math.PI / 4;
  [[0, 0.97], [0.5, 0.83], [-0.5, 0.83]].forEach(([y, R], k) => mesh('parallel_' + k, TOR(R), mat.plaster, 0, y, 0, globe).rotation.x = Math.PI / 2);
  const cloudFront = pokeable(group('cloud_front', 2.35, Y0, 4.15, root));
  cloud('cloud_front_back', cloudFront, 0.38, 0.02, -0.32, 1.03, mat.blue);
  cloud('cloud_front_white', cloudFront, 0, 0, 0, 1);
  const ribbon = pokeable(group('ribbon', 3.6, Y0, 2.75, root));
  { const curve = new THREE.CatmullRomCurve3([[-2.0, 1.5, -0.5], [-1.1, 1.95, -0.4], [-0.2, 1.45, -0.1], [0.5, 0.65, 0.2], [1.2, 0.48, 0.5], [1.75, 0.95, 0.72], [2.1, 0.22, 1.0]].map(p => new V3(...p)));
    const s = new THREE.Shape(), w = 0.17, h = 0.5, r = 0.14;
    s.moveTo(-w + r, -h); s.lineTo(w - r, -h); s.absarc(w - r, -h + r, r, -Math.PI / 2, 0); s.lineTo(w, h - r); s.absarc(w - r, h - r, r, 0, Math.PI / 2);
    s.lineTo(-w + r, h); s.absarc(-w + r, h - r, r, Math.PI / 2, Math.PI); s.lineTo(-w, -h + r); s.absarc(-w + r, -h + r, r, Math.PI, Math.PI * 1.5);
    const g = new THREE.ExtrudeGeometry(s, { steps: 140, bevelEnabled: false, extrudePath: curve, curveSegments: 6 });
    smoothNormals(g, 0.6);
    gradient(g, 'x', [0xeb4a2f, 0xf7931e, 0xf8c21a, 0xf26aa8, 0xa46bf0], -2.0, 2.1);
    mesh('ribbon_body', g, mat.grad, 0, 0, 0, ribbon); }
  drifters.push(cloud('cloud_left', root, -6.1, Y0 - 0.05, 0.9, 0.82));

  root.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  scene.add(root);

  // ---------- framing ----------
  // Encaja la silueta real de la ciudad (proyectada en pantalla) dentro del canvas,
  // con margen para el balanceo y el parallax, sea cual sea la proporción del canvas.
  const target = new V3(0.3, 2.9, -0.6);
  const cityC = new V3(0.4, 2.4, -0.4);   // centro visual de la ciudad (para el dolly al hacer scroll)
  const viewDir = new V3(0.06, 0.25, 1).normalize();
  const camBase = new V3();
  const fitPts = [];
  {
    root.updateMatrixWorld(true);
    const v = new V3(), rot = new THREE.Matrix4();
    const base = [];
    root.traverse(o => {
      if (!o.isMesh) return;
      const p = o.geometry.attributes.position, step = Math.max(1, Math.floor(p.count / 150));
      for (let i = 0; i < p.count; i += step) base.push(v.fromBufferAttribute(p, i).applyMatrix4(o.matrixWorld).clone());
    });
    // rotación máxima que alcanza la ciudad al balancearse (sway + parallax)
    for (const a of [-0.2, 0, 0.2]) { rot.makeRotationY(a); base.forEach(q => fitPts.push(q.clone().applyMatrix4(rot))); }
  }
  const pj = new V3(), right = new V3(), up = new V3();
  function frame() {
    const w = canvas.clientWidth || 1, h = canvas.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    // Región de pantalla (NDC) donde debe quedar la ciudad. En desktop el canvas cubre todo
    // el hero y la ciudad se ubica a la derecha, detrás/junto al texto.
    const wide = getComputedStyle(canvas.parentElement).position === 'absolute' && w > 1024;
    const [ax, bx, ay, by] = wide ? [-0.1, 1.02, -0.8, 0.96] : [-0.99, 0.99, -0.97, 0.97];
    const cx = (ax + bx) / 2, cy = (ay + by) / 2, mx = (bx - ax) / 2, my = (by - ay) / 2;
    target.set(0.3, 2.9, -0.6);
    let dist = 30;
    for (let it = 0; it < 8; it++) {
      camera.position.copy(target).addScaledVector(viewDir, dist);
      camera.lookAt(target);
      camera.updateMatrixWorld();
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      for (const q of fitPts) {
        pj.copy(q).project(camera);
        if (pj.x < x0) x0 = pj.x; if (pj.x > x1) x1 = pj.x;
        if (pj.y < y0) y0 = pj.y; if (pj.y > y1) y1 = pj.y;
      }
      const tanV = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      right.setFromMatrixColumn(camera.matrixWorld, 0); up.setFromMatrixColumn(camera.matrixWorld, 1);
      // centrar la silueta y luego escalar la distancia para que quepa
      target.addScaledVector(right, ((x0 + x1) / 2 - cx) * dist * tanV * camera.aspect)
            .addScaledVector(up, ((y0 + y1) / 2 - cy) * dist * tanV);
      dist *= Math.max((x1 - x0) / (2 * mx), (y1 - y0) / (2 * my));
    }
    camBase.copy(target).addScaledVector(viewDir, dist);
    camera.position.copy(camBase);
    camera.near = dist / 20; camera.far = dist * 4;
    camera.updateProjectionMatrix();
    camera.lookAt(target);
  }
  frame();
  new ResizeObserver(frame).observe(canvas);

  // ---------- interacción: parallax + toques ----------
  const pointer = new V2(), pointerS = new V2();
  addEventListener('pointermove', e => {
    pointer.set((e.clientX / innerWidth) * 2 - 1, (e.clientY / innerHeight) * 2 - 1);
  }, { passive: true });

  const ray = new THREE.Raycaster(), ndc = new V2();
  function pick(e) {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    let o = ray.intersectObject(root, true)[0]?.object;
    while (o && !o.userData.poke) o = o.parent;
    return o || null;
  }
  let hovered = null;
  canvas.addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; hovered = pick(e); canvas.style.cursor = hovered ? 'pointer' : ''; });
  canvas.addEventListener('pointerleave', () => { hovered = null; });
  canvas.addEventListener('click', e => { const o = pick(e); if (o) o.userData.qv = (o.userData.qv || 0) - 5; });

  // ---------- animación ----------
  const targets = []; root.traverse(o => { if (o.userData.poke) { targets.push(o); o.userData.base = o.position.clone(); } });
  drifters.forEach((d, i) => { d.userData.base = d.position.clone(); d.userData.ph = i * 2.1; });

  let visible = true, last = performance.now(), t = 0, intro = reduceMotion || /[?&]still/.test(location.search) ? 1 : 0, sp = 0;
  const html = document.documentElement, look = new V3(), camPos = new V3();
  setTimeout(() => html.classList.add('is-loaded'), 6000); // red de seguridad si motion.js no carga
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; }, { threshold: 0 }).observe(canvas);
  const easeOut = u => 1 - Math.pow(1 - u, 3);

  function tick() {
    const now = performance.now(), dt = Math.min((now - last) / 1000, 0.05); last = now;
    if (!visible || document.hidden) return;
    t += dt;
    // la entrada espera a que termine el preloader (motion.js añade .is-loaded)
    if (intro < 1 && html.classList.contains('is-loaded')) intro = Math.min(1, intro + dt / 2.4);
    const k = easeOut(intro);
    // progreso de scroll del hero (lo publica motion.js con ScrollTrigger)
    sp += ((window.__heroScroll || 0) - sp) * Math.min(1, dt * 6);

    // entrada: la ciudad sube y gira suavemente a su sitio
    root.rotation.y = (1 - k) * -0.5;
    root.position.y = (1 - k) * -1.2;
    root.scale.setScalar(0.86 + 0.14 * k);

    pointerS.lerp(pointer, Math.min(1, dt * 3));
    // cámara: dolly de entrada (desde lejos) + dolly/órbita con el scroll
    const e = sp * sp * (3 - 2 * sp);
    camPos.copy(camBase).sub(cityC).multiplyScalar(1 + (1 - k) * 0.9 - e * 0.2).add(cityC);
    camPos.y += e * 1.6;
    look.copy(target).lerp(cityC, e * 0.85);
    root.rotation.y += e * 0.9;
    if (!reduceMotion) {
      root.rotation.y += Math.sin(t * 0.18) * 0.06 + pointerS.x * 0.12;
      camPos.y -= pointerS.y * 0.6;
    }
    camera.position.copy(camPos);
    camera.lookAt(look);
    if (!reduceMotion) {

      for (const o of targets) {
        const d = o.userData, goal = o === hovered ? 1.045 : 1;
        d.s = d.s ?? 1; d.sv = d.sv ?? 0; d.q = d.q ?? 0; d.qv = d.qv ?? 0;
        d.sv += ((goal - d.s) * 160 - d.sv * 16) * dt; d.s += d.sv * dt;
        d.qv += (-d.q * 140 - d.qv * 7) * dt; d.q += d.qv * dt;
        o.scale.set(d.s - d.q * 0.5, d.s + d.q, d.s - d.q * 0.5);
      }
      sun.position.y = sun.userData.base.y + Math.sin(t * 0.5) * 0.14; sun.rotation.y = Math.sin(t * 0.3) * 0.12;
      globe.rotation.y += dt * 0.45;
      chevL.position.x = chevL.userData.base.x - Math.sin(t * 1.3) * 0.06;
      chevR.position.x = chevR.userData.base.x + Math.sin(t * 1.3) * 0.06;
      ribbon.position.y = ribbon.userData.base.y + Math.sin(t * 0.9) * 0.05;
      cloudFront.position.x = cloudFront.userData.base.x + Math.sin(t * 0.4) * 0.08;
      wings.forEach((w, i) => { w.rotation.z = (i ? 0.1 : -0.1) + (i ? 1 : -1) * Math.sin(t * 1.1) * 0.07; });
      for (const d of drifters) { d.position.x = d.userData.base.x + Math.sin(t * 0.18 + d.userData.ph) * 0.45; d.position.y = d.userData.base.y + Math.sin(t * 0.5 + d.userData.ph) * 0.06; }
      for (const s of sway) s.rotation.x = Math.sin(t * 1.2 + s.userData.ph) * 0.025;
    }
    renderer.render(scene, camera);
  }
  renderer.setAnimationLoop(tick);
  canvas.closest('.hero-visual')?.classList.add('is-ready');
}
