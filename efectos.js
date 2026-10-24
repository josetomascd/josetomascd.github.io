/* Efectos de "Más allá del trabajo". Solo se carga en ordenador (ver index.html). */
(function () {
  var section = document.querySelector('.beyond');
  if (!section) return;
  var card = {
    sport: section.querySelector('[data-fx="sport"]'),
    art: section.querySelector('[data-fx="art"]'),
    tech: section.querySelector('[data-fx="tech"]'),
    travel: section.querySelector('[data-fx="travel"]')
  };
  var es = function () { return document.documentElement.lang === 'es'; };

  /* ---------- estilos ---------- */
  var css = document.createElement('style');
  css.textContent = [
    '.beyond{position:relative;overflow-x:clip;overflow-y:visible}',
    '.beyond>.wrap{position:relative}',
    '#education,#family{position:relative;z-index:1}',
    '.fx-balls{position:absolute;inset:0;overflow:visible;pointer-events:none;z-index:0}',
    '.fx-ball{position:absolute;left:0;top:0;will-change:transform}',
    '.fx-ball svg,.fx-peek svg,.fx-robot svg,.fx-vehicle svg{display:block;width:100%;height:100%}',
    '.fx-dim{position:fixed;inset:0;pointer-events:none;z-index:60;opacity:0;transition:opacity .35s ease}',
    '.fx-dim.on{opacity:1}',
    '.fx-dim canvas{position:absolute;inset:0;width:100%;height:100%}',
    '.fx-lift{z-index:70!important}',
    '.fx-peek{position:fixed;z-index:62;pointer-events:none;width:clamp(300px,25vw,400px);aspect-ratio:240/400;will-change:transform}',
    '.fx-tag{position:fixed;z-index:63;pointer-events:none;background:rgba(29,29,31,.88);color:#fff;font:600 14px/1 -apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif;letter-spacing:0;padding:9px 15px;border-radius:980px;opacity:0;transform:translateY(8px);transition:opacity .3s ease,transform .4s cubic-bezier(.2,.7,.2,1)}',
    '.fx-tag.on{opacity:1;transform:none}',
    '.fx-robot{position:fixed;bottom:0;left:6vw;height:86vh;aspect-ratio:320/420;z-index:62;pointer-events:none;will-change:transform}',
    '.fx-robot #fxarm{transform-box:view-box;transform-origin:268px 230px;animation:fxwave .45s ease-in-out infinite alternate}',
    '@keyframes fxwave{from{transform:rotate(-16deg)}to{transform:rotate(14deg)}}',
    '.fx-vehicle{position:fixed;left:0;z-index:65;pointer-events:none;will-change:transform;transition:opacity .3s ease}',
    '.fx-ship-bob{animation:fxbob 1.6s ease-in-out infinite alternate;transform-origin:50% 80%}',
    '@keyframes fxbob{from{transform:translateY(0) rotate(-1deg)}to{transform:translateY(8px) rotate(1deg)}}',
    '.fx-water,.fx-rails{position:fixed;left:0;right:0;pointer-events:none;overflow:hidden;will-change:transform}',
    '.fx-wv{display:flex;width:200%;height:100%;animation:fxflow 6s linear infinite}',
    '.fx-wv.slow{animation-duration:9s}.fx-wv.rev{animation-direction:reverse;animation-duration:4.5s}',
    '.fx-wv svg{width:50%;height:100%;flex:none;display:block}',
    '@keyframes fxflow{to{transform:translateX(-50%)}}'
  ].join('\n');
  document.head.appendChild(css);

  var INK = '#3a2a20', SKIN = '#f2c9a4';
  var G = function (inner) { return '<g stroke="' + INK + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">' + inner + '</g>'; };
  var eyes = function (y) {
    return '<circle cx="104" cy="' + y + '" r="4.5" fill="' + INK + '" stroke="none"/><circle cx="138" cy="' + y + '" r="4.5" fill="' + INK + '" stroke="none"/>' +
      '<circle cx="105.5" cy="' + (y - 1.5) + '" r="1.4" fill="#fff" stroke="none"/><circle cx="139.5" cy="' + (y - 1.5) + '" r="1.4" fill="#fff" stroke="none"/>';
  };
  var hand = function (x, y) { return '<circle cx="' + x + '" cy="' + y + '" r="14" fill="' + SKIN + '"/>'; };
  var svg = function (vb, inner) { return '<svg viewBox="' + vb + '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + inner + '</svg>'; };

  /* ---------- pelotas ---------- */
  function soccer() {
    var c = 100, s = '', P = function (cx, cy, r, rot) {
      var pts = [];
      for (var i = 0; i < 5; i++) { var a = (rot + i * 72) * Math.PI / 180; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
      return pts;
    };
    var path = function (pts) { return 'M' + pts.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join('L') + 'Z'; };
    var center = P(c, c, 26, -90), outers = [];
    for (var i = 0; i < 5; i++) {
      var a = (-90 + 36 + i * 72) * Math.PI / 180;
      outers.push(P(c + 82 * Math.cos(a), c + 82 * Math.sin(a), 24, -90 + 36 + i * 72 + 180));
    }
    s += '<defs><clipPath id="fxsc"><circle cx="100" cy="100" r="94"/></clipPath></defs>';
    s += '<circle cx="100" cy="100" r="94" fill="#fff" stroke="#1d1d1f" stroke-width="4"/>';
    s += '<g clip-path="url(#fxsc)" stroke="#1d1d1f" stroke-width="3" fill="#1d1d1f">';
    center.forEach(function (v, i) {
      var a = (-90 + i * 72) * Math.PI / 180, mid = [c + 58 * Math.cos(a), c + 58 * Math.sin(a)];
      s += '<path d="M' + v[0].toFixed(1) + ' ' + v[1].toFixed(1) + 'L' + mid[0].toFixed(1) + ' ' + mid[1].toFixed(1) + '" fill="none"/>';
      [outers[i], outers[(i + 4) % 5]].forEach(function (o) {
        var best = o.reduce(function (b, p) { var d = Math.hypot(p[0] - mid[0], p[1] - mid[1]); return d < b.d ? { d: d, p: p } : b; }, { d: 1e9 });
        s += '<path d="M' + mid[0].toFixed(1) + ' ' + mid[1].toFixed(1) + 'L' + best.p[0].toFixed(1) + ' ' + best.p[1].toFixed(1) + '" fill="none"/>';
      });
    });
    s += '<path d="' + path(center) + '"/>';
    outers.forEach(function (o) { s += '<path d="' + path(o) + '"/>'; });
    s += '</g>';
    return svg('0 0 200 200', s);
  }
  var BALLS = [
    { r: 1, k: 1, svg: soccer() },
    { r: 380 / 230, k: .74, svg: svg('0 0 380 230',
        '<ellipse cx="190" cy="115" rx="184" ry="109" fill="#8b4a2b" stroke="#4a2414" stroke-width="5"/>' +
        '<path d="M70 52 C110 30 150 24 190 24 M70 178 C110 200 150 206 190 206" fill="none" stroke="#f4f2ec" stroke-width="12"/>' +
        '<path d="M310 52 C270 30 230 24 190 24 M310 178 C270 200 230 206 190 206" fill="none" stroke="#f4f2ec" stroke-width="12"/>' +
        '<path d="M120 115 H260" stroke="#f4f2ec" stroke-width="6" stroke-linecap="round"/>' +
        [140, 160, 180, 200, 220, 240].map(function (x) { return '<path d="M' + x + ' 103 V127" stroke="#f4f2ec" stroke-width="5" stroke-linecap="round"/>'; }).join('')) },
    { r: 1, k: .8, mode: 'bounce', svg: svg('0 0 200 200',
        '<circle cx="100" cy="100" r="94" fill="#e8772e" stroke="#3a1d0e" stroke-width="4"/>' +
        '<g fill="none" stroke="#3a1d0e" stroke-width="4"><path d="M100 6 V194 M6 100 H194"/>' +
        '<path d="M34 30 C66 64 66 136 34 170"/><path d="M166 30 C134 64 134 136 166 170"/></g>') },
    { r: 1, k: .86, mode: 'rain', svg: svg('0 0 200 200',
        '<circle cx="100" cy="100" r="94" fill="#d4e94a" stroke="#8aa021" stroke-width="3"/>' +
        '<g fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"><path d="M28 40 C70 70 70 130 28 160"/><path d="M172 40 C130 70 130 130 172 160"/></g>') }
  ];

  var ballLayer = document.createElement('div');
  ballLayer.className = 'fx-balls';
  section.insertBefore(ballLayer, section.firstChild);
  var bi = 0, rolling = false;
  card.sport && card.sport.addEventListener('mouseenter', function () {
    if (rolling) return;
    rolling = true;
    var d = BALLS[bi]; bi = (bi + 1) % BALLS.length;
    if (d.mode === 'rain') { tennisRain(d.svg); return; }
    var D = Math.max(460, Math.min(innerHeight * .8, 780));   // tamaño grande, según la pantalla
    d.h = D * d.k; d.w = d.h * d.r;
    var el = document.createElement('div');
    el.className = 'fx-ball'; el.style.width = d.w + 'px'; el.style.height = d.h + 'px'; el.innerHTML = d.svg;
    ballLayer.appendChild(el);
    var a = d.w / 2, b = d.h / 2, reff = (a + b) / 2;
    var W = section.clientWidth, ground = section.clientHeight + 50, dist = W + d.w * 2, dur = d.mode === 'bounce' ? 6000 : 4200, t0 = null;
    function frame(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1), travelled = dist * p, x = -d.w + travelled, th = travelled / reff;
      if (d.mode === 'bounce') {   // basket: bota despacio de izquierda a derecha
        var nb = 3, f = (p * nb) % 1, H = Math.min(section.clientHeight * .45, 360), y = H * (1 - Math.pow(2 * f - 1, 2));
        var sq = f < .06 || f > .94 ? .93 : 1;
        el.style.transform = 'translate(' + (x - a) + 'px,' + (ground - 2 * b - y) + 'px) rotate(' + (th * .5) + 'rad) scale(' + (2 - sq) + ',' + sq + ')';
        if (p < 1) requestAnimationFrame(frame); else { el.remove(); rolling = false; }
        return;
      }
      var h = Math.sqrt(a * a * Math.pow(Math.sin(th), 2) + b * b * Math.pow(Math.cos(th), 2)); // óvalo: el centro sube y baja al rodar
      el.style.transform = 'translate(' + (x - a) + 'px,' + (ground - h - b) + 'px) rotate(' + th + 'rad)';
      if (p < 1) requestAnimationFrame(frame); else { el.remove(); rolling = false; }
    }
    requestAnimationFrame(frame);
  });

  /* ---------- pintores ---------- */
  var face = function (y) { return '<ellipse cx="120" cy="' + y + '" rx="45" ry="53" fill="' + SKIN + '"/>'; };
  var nose = function (y) { return '<path d="M120 ' + y + ' q-6 16 2 20" fill="none"/>'; };
  var PAINTERS = [
    { name: 'Leonardo da Vinci', svg: svg('0 0 240 400', G(
        '<path d="M8 400 L14 290 C22 218 66 197 120 197 C174 197 218 218 226 290 L232 400Z" fill="#7a2e2e"/>' +
        '<path d="M16 262 C-2 312 4 356 30 378 L56 364 C44 336 44 300 56 262Z" fill="#64221f"/><circle cx="36" cy="384" r="14" fill="' + SKIN + '"/>' +
        '<rect x="60" y="306" width="120" height="14" rx="5" fill="#3a2a20"/><rect x="111" y="303" width="18" height="20" rx="3" fill="#d4a62a"/>' +
        '<path d="M88 332 C86 360 88 384 92 400 M152 332 C154 360 152 384 148 400" fill="none" stroke-width="2.5" opacity=".45"/>' +
        '<path d="M62 118 C54 176 62 228 84 254 L156 254 C178 228 186 176 178 118 C172 70 68 70 62 118Z" fill="#e7e3da"/>' +
        face(130) +
        '<path d="M66 104 C66 56 174 56 174 104 C154 94 86 94 66 104Z" fill="#3d3550"/>' +
        '<path d="M76 140 C78 204 98 252 120 266 C142 252 162 204 164 140 C152 166 136 170 120 170 C104 170 88 166 76 140Z" fill="#f4f2ec"/>' +
        '<path d="M98 156 C108 148 132 148 142 156 C132 162 108 162 98 156Z" fill="#f4f2ec"/>' +
        '<path d="M92 116 q12 -8 22 -2 M126 114 q10 -6 22 2" fill="none" stroke="#cfc9bb" stroke-width="6"/>' +
        eyes(128) + nose(128) +
        '<path d="M198 248 L222 150" stroke="#8b5a2b" stroke-width="7"/><path d="M222 150 L228 128" stroke="#c0392b" stroke-width="9"/>' + hand(198, 248))),
      style: { left: '0', bottom: '0' }, origin: 'left bottom',
      from: 'translate(-105%,75%) rotate(30deg)', to: 'translate(-4%,13%) rotate(10deg)', tag: { left: 'calc(clamp(300px,25vw,400px) + 10px)', bottom: '40px' } },
    { name: 'Donatello', svg: svg('0 0 240 400', G(
        '<path d="M8 400 L14 290 C22 218 66 197 120 197 C174 197 218 218 226 290 L232 400Z" fill="#56703f"/>' +
        '<path d="M16 262 C-2 312 4 356 30 378 L56 364 C44 336 44 300 56 262Z" fill="#465c33"/><circle cx="36" cy="384" r="14" fill="' + SKIN + '"/>' +
        '<rect x="60" y="306" width="120" height="14" rx="5" fill="#3a2a20"/><rect x="111" y="303" width="18" height="20" rx="3" fill="#d4a62a"/>' +
        '<path d="M88 332 C86 360 88 384 92 400 M152 332 C154 360 152 384 148 400" fill="none" stroke-width="2.5" opacity=".45"/>' +
        '<path d="M58 146 C50 64 190 64 182 146 C186 196 170 210 120 210 C70 210 54 196 58 146Z" fill="#b5392d"/>' +
        face(134) +
        '<path d="M66 120 C70 70 170 70 174 120 C156 104 84 104 66 120Z" fill="#b5392d"/>' +
        '<path d="M80 150 C84 192 102 204 120 204 C138 204 156 192 160 150 C148 170 134 174 120 174 C106 174 92 170 80 150Z" fill="#6b4226"/>' +
        '<path d="M100 160 q20 -10 40 0 q-20 7 -40 0Z" fill="#6b4226"/>' +
        '<path d="M92 122 q12 -6 22 0 M126 122 q10 -6 22 0" fill="none" stroke="#6b4226" stroke-width="5"/>' +
        eyes(134) + nose(134) +
        '<path d="M192 256 L214 186" stroke="#8b5a2b" stroke-width="7"/><rect x="194" y="170" width="42" height="22" rx="4" fill="#8a8f98" transform="rotate(-18 215 181)"/>' + hand(192, 254))),
      style: { right: '0', top: '16vh' }, origin: '50% 50%',
      from: 'translateX(140%) rotate(-90deg)', to: 'translateX(10%) rotate(-82deg)', tag: { right: '70px', top: 'calc(16vh + 520px)' } },
    { name: { es: 'Rafael', en: 'Raphael' }, svg: svg('0 0 240 400', G(
        '<path d="M8 400 L14 290 C22 218 66 197 120 197 C174 197 218 218 226 290 L232 400Z" fill="#1f1f22"/>' +
        '<path d="M16 262 C-2 312 4 356 30 378 L56 364 C44 336 44 300 56 262Z" fill="#2c2c31"/><circle cx="36" cy="384" r="14" fill="' + SKIN + '"/>' +
        '<rect x="60" y="306" width="120" height="14" rx="5" fill="#3a2a20"/><rect x="111" y="303" width="18" height="20" rx="3" fill="#d4a62a"/>' +
        '<path d="M88 332 C86 360 88 384 92 400 M152 332 C154 360 152 384 148 400" fill="none" stroke-width="2.5" opacity=".45"/>' +
        '<path d="M92 200 L120 228 L148 200" fill="none" stroke="#f4f2ec" stroke-width="6"/>' +
        '<path d="M62 132 C56 66 184 66 178 132 C184 182 180 214 160 216 L80 216 C60 214 56 182 62 132Z" fill="#3b2618"/>' +
        '<rect x="106" y="170" width="28" height="30" fill="' + SKIN + '"/>' + face(130) +
        '<path d="M76 116 C80 80 160 74 166 112 C150 98 130 104 120 96 C108 106 92 104 76 116Z" fill="#3b2618"/>' +
        '<ellipse cx="114" cy="80" rx="64" ry="20" fill="#1d1d1f" transform="rotate(-10 114 80)"/><circle cx="116" cy="60" r="5" fill="#1d1d1f"/>' +
        '<path d="M94 118 q10 -5 20 0 M128 118 q10 -5 20 0" fill="none" stroke-width="4"/>' +
        eyes(130) + nose(130) +
        '<path d="M104 158 q16 12 32 0" fill="none"/><circle cx="92" cy="150" r="8" fill="#f2a0a0" stroke="none" opacity=".45"/><circle cx="150" cy="150" r="8" fill="#f2a0a0" stroke="none" opacity=".45"/>' +
        '<ellipse cx="200" cy="236" rx="34" ry="24" fill="#d9b382"/><circle cx="186" cy="228" r="5" fill="#c0392b" stroke="none"/><circle cx="202" cy="222" r="5" fill="#2f6fd0" stroke="none"/><circle cx="216" cy="232" r="5" fill="#f1c40f" stroke="none"/><circle cx="204" cy="246" r="5" fill="#27ae60" stroke="none"/>')),
      style: { right: '0', bottom: '0' }, origin: 'right bottom',
      from: 'translate(105%,75%) rotate(-30deg)', to: 'translate(4%,13%) rotate(-10deg)', tag: { right: 'calc(clamp(300px,25vw,400px) + 10px)', bottom: '40px' } },
    { name: { es: 'Miguel Ángel', en: 'Michelangelo' }, svg: svg('0 0 240 400', G(
        '<path d="M8 400 L14 290 C22 218 66 197 120 197 C174 197 218 218 226 290 L232 400Z" fill="#55565c"/>' +
        '<path d="M16 262 C-2 312 4 356 30 378 L56 364 C44 336 44 300 56 262Z" fill="#45464b"/><circle cx="36" cy="384" r="14" fill="' + SKIN + '"/>' +
        '<rect x="60" y="306" width="120" height="14" rx="5" fill="#3a2a20"/><rect x="111" y="303" width="18" height="20" rx="3" fill="#d4a62a"/>' +
        '<path d="M88 332 C86 360 88 384 92 400 M152 332 C154 360 152 384 148 400" fill="none" stroke-width="2.5" opacity=".45"/>' +
        '<rect x="106" y="172" width="28" height="30" fill="' + SKIN + '"/>' + face(134) +
        [[82, 100], [96, 86], [114, 80], [132, 80], [150, 86], [162, 100], [170, 116], [72, 116]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="14" fill="#2b2018"/>'; }).join('') +
        [[82, 158], [90, 174], [104, 186], [120, 190], [136, 186], [150, 174], [158, 158]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="12" fill="#2b2018"/>'; }).join('') +
        '<path d="M100 162 q20 -9 40 0 q-20 6 -40 0Z" fill="#2b2018"/>' +
        '<path d="M92 118 L114 125 M148 118 L126 125" fill="none" stroke="#2b2018" stroke-width="6"/>' +
        eyes(134) + '<path d="M118 124 Q128 136 121 142 Q131 148 117 154" fill="none"/>' +
        '<path d="M196 258 L222 182" stroke="#8a8f98" stroke-width="7"/><path d="M222 182 L226 168" stroke="#5b5f66" stroke-width="5"/>' + hand(196, 256))),
      style: { right: '8vw', top: '0' }, origin: '50% 50%',
      from: 'translateY(-125%) rotate(180deg)', to: 'translateY(-24%) rotate(176deg)', tag: { right: '24px', top: '338px' } }
  ];
  var pi = 0, curPeek = null;
  function hidePeek() {
    if (!curPeek) return;
    var c = curPeek; curPeek = null;
    c.tag.classList.remove('on');
    var an = c.el.animate([{ transform: c.def.to }, { transform: c.def.from }], { duration: 380, easing: 'cubic-bezier(.4,0,.7,.2)', fill: 'forwards' });
    an.onfinish = function () { c.el.remove(); c.tag.remove(); };
  }
  if (card.art) {
    card.art.addEventListener('mouseenter', function () {
      hidePeek();
      var d = PAINTERS[pi]; pi = (pi + 1) % PAINTERS.length;
      var el = document.createElement('div'); el.className = 'fx-peek'; el.innerHTML = d.svg;
      Object.keys(d.style).forEach(function (k) { el.style[k] = d.style[k]; });
      el.style.transformOrigin = d.origin; el.style.transform = d.from;
      var tag = document.createElement('div'); tag.className = 'fx-tag';
      tag.textContent = typeof d.name === 'string' ? d.name : d.name[es() ? 'es' : 'en'];
      Object.keys(d.tag).forEach(function (k) { tag.style[k] = d.tag[k]; });
      document.body.appendChild(el); document.body.appendChild(tag);
      el.animate([{ transform: d.from }, { transform: d.to }], { duration: 700, easing: 'cubic-bezier(.34,1.3,.64,1)', fill: 'forwards' });
      setTimeout(function () { tag.classList.add('on'); }, 250);
      curPeek = { el: el, tag: tag, def: d };
    });
    card.art.addEventListener('mouseleave', hidePeek);
  }

  /* ---------- lluvia de pelotas de tenis (3D) ---------- */
  function tennisRain(svgStr) {
    var lay = document.createElement('div');
    lay.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:62;overflow:hidden';
    document.body.appendChild(lay);
    var Wv = innerWidth, Hv = innerHeight, cx = Wv / 2, line = Hv * .8, N = Wv < 1100 ? 22 : 30, list = [];
    for (var i = 0; i < N; i++) {
      var size = 44 + Math.random() * 46, x = Wv * (.04 + .92 * (i + Math.random() * .8) / N);
      var el = document.createElement('div');
      el.style.cssText = 'position:absolute;left:0;top:0;width:' + size + 'px;height:' + size + 'px;will-change:transform';
      el.innerHTML = svgStr; lay.appendChild(el);
      var dx = (x - cx) / cx;                        // -1 izquierda … 1 derecha
      list.push({ el: el, s: size, x: x, dx: dx, delay: Math.random() * 900, fall: 900 + Math.random() * 300,
        vx: dx * (Wv * .55), grow: 1 + (1 - Math.abs(dx)) * 2.4, spin: (Math.random() - .5) * 14 });
    }
    var t0 = null, total = 3400;
    function frame(ts) {
      if (t0 === null) t0 = ts;
      var t = ts - t0, alive = false;
      list.forEach(function (b) {
        var u = t - b.delay, x = b.x, y = -b.s * 2, sc = .55, rot = 0;
        if (u > 0) {
          if (u < b.fall) {                           // cae acelerando
            var q = u / b.fall; y = -b.s * 2 + (line + b.s * 2) * q * q; sc = .55 + .45 * q; rot = b.spin * q;
          } else {                                    // rebota: lados hacia fuera, centro hacia el espectador
            var k = (u - b.fall) / 1000;
            x = b.x + b.vx * k;
            y = line - Hv * .55 * k + Hv * 1.6 * k * k;
            sc = 1 + (b.grow - 1) * Math.min(k * 1.4, 1);
            rot = b.spin * (1 + k * 2);
          }
        }
        if (y < Hv + b.s * b.grow && x > -b.s * 4 && x < Wv + b.s * 4) alive = true;
        b.el.style.transform = 'translate(' + (x - b.s / 2) + 'px,' + (y - b.s / 2) + 'px) scale(' + sc + ') rotate(' + rot + 'rad)';
      });
      if ((alive || t < 1200) && t < total + 2000) requestAnimationFrame(frame); else { lay.remove(); rolling = false; }
    }
    requestAnimationFrame(frame);
  }

  /* ---------- tecnología ---------- */
  var ROBOT = svg('0 0 320 420', G(
    '<path d="M160 22 V60" stroke="#5b6b7c" stroke-width="6"/><circle cx="160" cy="18" r="13" fill="#e74c3c"/>' +
    '<rect x="62" y="98" width="20" height="44" rx="8" fill="#9fb3c8"/><rect x="238" y="98" width="20" height="44" rx="8" fill="#9fb3c8"/>' +
    '<rect x="80" y="60" width="160" height="122" rx="30" fill="#c9d6e3" stroke="#5b6b7c" stroke-width="5"/>' +
    '<circle cx="125" cy="114" r="21" fill="#fff" stroke="#5b6b7c" stroke-width="4"/><circle cx="195" cy="114" r="21" fill="#fff" stroke="#5b6b7c" stroke-width="4"/>' +
    '<circle cx="128" cy="116" r="9" fill="#1d1d1f" stroke="none"/><circle cx="198" cy="116" r="9" fill="#1d1d1f" stroke="none"/>' +
    '<circle cx="131" cy="112" r="3" fill="#fff" stroke="none"/><circle cx="201" cy="112" r="3" fill="#fff" stroke="none"/>' +
    '<circle cx="100" cy="150" r="9" fill="#f2a0a0" stroke="none" opacity=".6"/><circle cx="220" cy="150" r="9" fill="#f2a0a0" stroke="none" opacity=".6"/>' +
    '<path d="M134 148 Q160 168 186 148" fill="none" stroke="#5b6b7c" stroke-width="5"/>' +
    '<rect x="140" y="182" width="40" height="18" fill="#9fb3c8" stroke="#5b6b7c"/>' +
    '<rect x="34" y="214" width="38" height="124" rx="19" fill="#b6c6d6" stroke="#5b6b7c" stroke-width="4"/><circle cx="53" cy="346" r="22" fill="#9fb3c8" stroke="#5b6b7c" stroke-width="4"/>' +
    '<g id="fxarm"><rect x="249" y="112" width="38" height="124" rx="19" fill="#b6c6d6" stroke="#5b6b7c" stroke-width="4"/><circle cx="268" cy="104" r="23" fill="#9fb3c8" stroke="#5b6b7c" stroke-width="4"/></g>' +
    '<rect x="70" y="198" width="180" height="210" rx="32" fill="#b6c6d6" stroke="#5b6b7c" stroke-width="5"/>' +
    '<rect x="112" y="240" width="96" height="74" rx="14" fill="#eef3f8" stroke="#5b6b7c" stroke-width="4"/>' +
    '<circle cx="136" cy="262" r="8" fill="#e74c3c" stroke="none"/><circle cx="160" cy="262" r="8" fill="#f1c40f" stroke="none"/><circle cx="184" cy="262" r="8" fill="#2ecc71" stroke="none"/>' +
    '<path d="M128 292 H192" stroke="#9fb3c8" stroke-width="6"/>' +
    '<circle cx="92" cy="220" r="5" fill="#5b6b7c" stroke="none"/><circle cx="228" cy="220" r="5" fill="#5b6b7c" stroke="none"/>'));
  var ti = 0, techBusy = false, techEnd = null;
  function lift(c, on) { c.classList.toggle('fx-lift', on); }
  function matrix() {
    techBusy = true; lift(card.tech, true);
    var dim = document.createElement('div'); dim.className = 'fx-dim'; dim.style.background = 'rgba(0,0,0,.86)';
    var cv = document.createElement('canvas'); dim.appendChild(cv); document.body.appendChild(dim);
    var dpr = window.devicePixelRatio || 1, w = innerWidth, h = innerHeight; cv.width = w * dpr; cv.height = h * dpr;
    var ctx = cv.getContext('2d'); ctx.scale(dpr, dpr);
    var fs = 18, cols = Math.ceil(w / fs), rows = Math.ceil(h / fs) + 30, drops = [], speed = [], grid = [];
    for (var i = 0; i < cols; i++) {
      drops.push(-Math.random() * rows * 0.6); speed.push(0.25 + Math.random() * 0.45);
      var g = []; for (var r = 0; r < rows; r++) g.push(Math.random() < 0.5 ? '0' : '1'); grid.push(g);
    }
    ctx.font = '600 ' + fs + 'px ui-monospace,Menlo,monospace'; ctx.textAlign = 'center';
    var raf, alive = true, TRAIL = 16;
    (function loop() {
      if (!alive) return;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < cols; i++) {
        var head = Math.floor(drops[i]);
        for (var k = 0; k < TRAIL; k++) {
          var row = head - k; if (row < 0 || row >= rows) continue;
          if (Math.random() < 0.015) grid[i][row] = grid[i][row] === '0' ? '1' : '0';
          ctx.fillStyle = k === 0 ? 'rgba(210,255,220,1)' : 'rgba(0,255,65,' + (1 - k / TRAIL).toFixed(2) + ')';
          ctx.fillText(grid[i][row], i * fs + fs / 2, row * fs);
        }
        drops[i] += speed[i];
        if ((drops[i] - TRAIL) * fs > h) drops[i] = -Math.random() * 10;
      }
      raf = requestAnimationFrame(loop);
    })();
    requestAnimationFrame(function () { dim.classList.add('on'); });
    var timer = setTimeout(end, 3000);
    function end() {
      if (!alive) return; alive = false; clearTimeout(timer); techEnd = null;
      dim.classList.remove('on');
      setTimeout(function () { cancelAnimationFrame(raf); dim.remove(); lift(card.tech, false); techBusy = false; }, 360);
    }
    techEnd = end;
  }
  function robot() {
    techBusy = true;
    var el = document.createElement('div'); el.className = 'fx-robot'; el.innerHTML = ROBOT;
    document.body.appendChild(el);
    var from = 'translateY(100%)', to = 'translateY(30%)';
    el.style.transform = from;
    el.animate([{ transform: from }, { transform: to }], { duration: 750, easing: 'cubic-bezier(.34,1.25,.64,1)', fill: 'forwards' });
    techEnd = function () {
      techEnd = null;
      var an = el.animate([{ transform: to }, { transform: from }], { duration: 420, easing: 'cubic-bezier(.4,0,.7,.2)', fill: 'forwards' });
      an.onfinish = function () { el.remove(); techBusy = false; };
    };
  }
  if (card.tech) {
    card.tech.addEventListener('mouseenter', function () {
      if (techBusy) return;
      (ti % 2 === 0 ? matrix : robot)(); ti++;
    });
    card.tech.addEventListener('mouseleave', function () { if (techEnd) techEnd(); });
  }

  /* ---------- viajes ---------- */
  var planeWin = ''; for (var x = 190; x <= 500; x += 22) planeWin += '<rect x="' + x + '" y="102" width="11" height="14" rx="5" fill="#1d2b4a" stroke="none"/>';
  var PLANE = svg('0 0 640 220',
    '<g stroke="#c7ccd3" stroke-width="3" stroke-linejoin="round">' +
    '<path d="M70 92 L38 18 L88 18 L156 90Z" fill="#0066cc"/>' +
    '<path d="M60 112 L18 96 L50 94 L118 112Z" fill="#dfe3e8"/>' +
    '<path d="M40 120 C40 96 70 88 120 88 L520 88 C580 88 620 104 632 120 C620 136 580 142 520 142 L120 142 C70 142 40 136 40 120Z" fill="#fff"/>' +
    '<path d="M120 126 H600" stroke="#0066cc" stroke-width="6"/>' +
    '<path d="M560 100 C584 100 604 106 616 114 L572 114Z" fill="#1d2b4a" stroke="none"/>' +
    planeWin +
    '<path d="M290 130 L236 208 L290 208 L396 132Z" fill="#dfe3e8"/>' +
    '<rect x="276" y="150" width="62" height="24" rx="12" fill="#c7ccd3"/></g>');
  var trainWin = ''; for (var tx = 60; tx <= 600; tx += 46) trainWin += '<rect x="' + tx + '" y="62" width="32" height="26" rx="6" fill="#1d2b4a" stroke="none"/>';
  var trainWheels = [80, 120, 300, 340, 520, 560, 760, 800].map(function (x) { return '<circle cx="' + x + '" cy="152" r="12" fill="#3a3a3c" stroke="none"/>'; }).join('');
  var TRAIN = svg('0 0 900 175',
    trainWheels +
    '<path d="M10 40 H640 C760 40 850 80 890 132 V148 H10Z" fill="#fff" stroke="#c7ccd3" stroke-width="3" stroke-linejoin="round"/>' +
    '<path d="M10 110 H862 C870 116 878 122 884 128 H10Z" fill="#c0392b"/>' + trainWin +
    '<path d="M660 52 C740 54 800 80 836 104 L700 104 C690 90 674 70 660 52Z" fill="#1d2b4a"/>' +
    '<path d="M300 40 V148 M600 40 V148" stroke="#c7ccd3" stroke-width="3"/>' +
    '<path d="M200 40 L220 16 L250 16 M500 40 L520 16 L550 16" fill="none" stroke="#3a3a3c" stroke-width="3"/>');
  var waves = 'M0 262'; for (var wx = 0; wx < 800; wx += 50) waves += ' q25 -12 50 0';
  var hullHoles = ''; for (var hx = 110; hx <= 720; hx += 30) hullHoles += '<circle cx="' + hx + '" cy="206" r="5" fill="#fff" opacity=".85"/>';
  var deckWin = function (y, x0, x1) { var s = ''; for (var x = x0; x <= x1; x += 22) s += '<rect x="' + x + '" y="' + y + '" width="12" height="10" rx="3" fill="#7fb2e5"/>'; return s; };
  var SHIP = svg('0 0 800 300',
    '<g class="fx-ship-bob">' +
    '<path d="M380 24 H440 L452 76 H368Z" fill="#c0392b"/><rect x="380" y="24" width="60" height="12" fill="#1d1d1f"/>' +
    '<rect x="230" y="74" width="360" height="32" rx="6" fill="#fff" stroke="#c7ccd3" stroke-width="3"/>' + deckWin(85, 245, 570) +
    '<rect x="170" y="104" width="500" height="38" rx="6" fill="#fff" stroke="#c7ccd3" stroke-width="3"/>' + deckWin(118, 185, 650) +
    '<rect x="120" y="140" width="600" height="42" rx="6" fill="#fff" stroke="#c7ccd3" stroke-width="3"/>' + deckWin(156, 135, 700) +
    '<path d="M30 180 H790 L750 262 H80Z" fill="#1d2b4a"/><path d="M62 236 H762 L750 262 H80Z" fill="#c0392b"/>' + hullHoles + '</g>');
  function waveSvg(color, top, amp) {
    var d = 'M0 ' + top; for (var x = 0; x < 800; x += 100) d += ' q25 ' + (-amp) + ' 50 0 q25 ' + amp + ' 50 0';
    return '<svg viewBox="0 0 800 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="' + d + ' V100 H0Z" fill="' + color + '"/></svg>';
  }
  function layer(cls, css, inner) {
    var el = document.createElement('div'); el.className = cls; el.style.cssText = css; el.innerHTML = inner; return el;
  }
  function waterLayers() {
    var back = layer('fx-water', 'bottom:0;height:24vh;z-index:64', '<div class="fx-wv slow">' + waveSvg('#7fb2e5', 22, 14) + waveSvg('#7fb2e5', 22, 14) + '</div>');
    var front = layer('fx-water', 'bottom:0;height:11vh;z-index:66', '<div class="fx-wv rev">' + waveSvg('#4f95d6', 20, 12) + waveSvg('#4f95d6', 20, 12) + '</div>');
    return [back, front];
  }
  function railsLayer(trainEl, trainBottom) {
    var H = trainEl.getBoundingClientRect().height, wheelLift = 11 * H / 175;           // las ruedas apoyan sobre el riel
    var sleepers = ''; for (var x = 0; x < 1400; x += 40) sleepers += '<rect x="' + x + '" y="26" width="14" height="22" fill="#6b4a32"/>';
    var inner = '<svg viewBox="0 0 1400 56" preserveAspectRatio="none" style="display:block;width:100%;height:100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<path d="M0 20 H1400 V56 H0Z" fill="#cfc9bd"/>' + sleepers + '<rect x="0" y="14" width="1400" height="7" fill="#8e8e93"/><rect x="0" y="14" width="1400" height="2.5" fill="#c7c7cc"/></svg>';
    var bottom = Math.max(0, trainBottom + wheelLift - 42);
    return layer('fx-rails', 'bottom:' + bottom + 'px;height:56px;z-index:64', inner);
  }
  var VEHICLES = [
    { svg: PLANE, width: '72vw', pos: { top: '12vh' }, dur: 3000, frames: function (W) { return [{ transform: 'translate(' + (-W) + 'px,60px) rotate(-4deg)' }, { transform: 'translate(' + innerWidth + 'px,-60px) rotate(-6deg)' }]; } },
    { svg: TRAIN, width: '110vw', pos: { bottom: '36px' }, dur: 3200, rails: true, frames: function (W) { return [{ transform: 'translateX(' + (-W) + 'px)' }, { transform: 'translateX(' + innerWidth + 'px)' }]; } },
    { svg: SHIP, width: '78vw', pos: { bottom: '2vh' }, dur: 4600, water: true, frames: function (W) { return [{ transform: 'translateX(' + (-W) + 'px)' }, { transform: 'translateX(' + innerWidth + 'px)' }]; } }
  ];
  var vi = 0, travelBusy = false, travelEnd = null;
  if (card.travel) {
    card.travel.addEventListener('mouseenter', function () {
      if (travelBusy) return;
      travelBusy = true; lift(card.travel, true);
      var d = VEHICLES[vi]; vi = (vi + 1) % VEHICLES.length;
      var dim = document.createElement('div'); dim.className = 'fx-dim'; dim.style.background = 'rgba(245,245,247,.82)';
      var el = document.createElement('div'); el.className = 'fx-vehicle'; el.innerHTML = d.svg; el.style.width = d.width;
      Object.keys(d.pos).forEach(function (k) { el.style[k] = d.pos[k]; });
      document.body.appendChild(dim); document.body.appendChild(el);
      var W = el.getBoundingClientRect().width, f = d.frames(W);
      el.style.transform = f[0].transform; el.style.opacity = '0';
      var extras = d.water ? waterLayers() : d.rails ? [railsLayer(el, parseFloat(d.pos.bottom))] : [];
      extras.forEach(function (x) { x.style.transform = 'translateY(100%)'; document.body.appendChild(x); });
      requestAnimationFrame(function () { dim.classList.add('on'); });
      // 1) primero aparece el suelo (agua o vías) de abajo hacia arriba
      extras.forEach(function (x) { x.animate([{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }], { duration: 520, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' }); });
      // 2) luego pasa el vehículo
      var an, started = false, done = false;
      var startTimer = setTimeout(function () {
        if (done) return; started = true; el.style.opacity = '1';
        an = el.animate(f, { duration: d.dur, easing: 'cubic-bezier(.45,.05,.55,.95)', fill: 'forwards' });
        an.onfinish = end;
      }, extras.length ? 380 : 0);
      // 3) al terminar, el suelo se va hacia abajo
      function end() {
        if (done) return; done = true; travelEnd = null; clearTimeout(startTimer);
        dim.classList.remove('on');
        el.style.opacity = '0';
        extras.forEach(function (x) { x.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(100%)' }], { duration: 520, easing: 'cubic-bezier(.5,0,.8,.3)', fill: 'forwards' }); });
        setTimeout(function () { if (an) an.cancel(); el.remove(); dim.remove(); extras.forEach(function (x) { x.remove(); }); lift(card.travel, false); travelBusy = false; }, extras.length ? 560 : 360);
      }
      travelEnd = end;
    });
    card.travel.addEventListener('mouseleave', function () { if (travelEnd) travelEnd(); });
  }
})();
