/* script.js · middle-east-power-trap */
'use strict';

document.documentElement.classList.add('js');

var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var isPhone = function () { return window.matchMedia('(max-width: 767px)').matches; };

/* ─── شريط التقدم (حبل) والترويسة والحلقة الأخيرة ─── */
var ropeFill = document.getElementById('rope-progress-fill');
var siteNav = document.getElementById('site-nav');
var coil = document.getElementById('coil');
var finale = document.getElementById('finale');
var fab = document.querySelector('.drawer-fab');
var footer = document.querySelector('.site-footer');

function onScroll() {
  var max = document.documentElement.scrollHeight - window.innerHeight;
  var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  ropeFill.style.width = pct.toFixed(2) + '%';
  siteNav.classList.toggle('scrolled', window.scrollY > 60);

  /* الحبل يُحكَم: الحلقة تنقبض وتدور كلما نزل القارئ في الخلاصة */
  if (coil && !reduceMotion && !isPhone()) {
    var r = finale.getBoundingClientRect();
    var t = 1 - Math.min(Math.max((r.bottom) / (window.innerHeight + r.height), 0), 1);
    var scale = 1.35 - t * 0.35;
    var turn = -14 + t * 14;
    coil.style.transform = 'scale(' + scale.toFixed(3) + ') rotate(' + turn.toFixed(2) + 'deg)';
  }

  /* الزر العائم يختفي فوق الذيل */
  if (fab && footer) {
    fab.classList.toggle('is-hidden', footer.getBoundingClientRect().top < window.innerHeight - 40);
  }
}

var ticking = false;
window.addEventListener('scroll', function () {
  if (!ticking) {
    requestAnimationFrame(function () { onScroll(); ticking = false; });
    ticking = true;
  }
}, { passive: true });
window.addEventListener('resize', onScroll);
onScroll();

/* ─── الظهور عند التمرير ─── */
var revealObs = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(function (el) { revealObs.observe(el); });

/* ─── الأقسام الغامرة: كل خطوة تُبدّل طبقة الخلفية ─── */
document.querySelectorAll('[data-scrolly]').forEach(function (section) {
  var layers = section.querySelectorAll('.stage-layer');
  var cards = section.querySelectorAll('.step-card');
  var caption = section.querySelector('.stage-caption');
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var i = Number(e.target.dataset.step);
      cards.forEach(function (c) { c.classList.toggle('is-active', c === e.target); });
      layers.forEach(function (l) {
        var active = Number(l.dataset.layer) === i;
        l.classList.toggle('is-active', active);
        if (active && caption) caption.textContent = l.dataset.caption || '';
      });
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  cards.forEach(function (c) { obs.observe(c); });
  if (cards[0]) cards[0].classList.add('is-active');
});

/* ─── القسم الجانبي: الصورة ثابتة، والإطار والتقدّم يتبعان النص ─── */
document.querySelectorAll('[data-pinned]').forEach(function (section) {
  var steps = section.querySelectorAll('.pinned-step');
  var bar = section.querySelector('.pinned-progress span');
  section.setAttribute('data-focus', '0');
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var i = Number(e.target.dataset.step);
      section.setAttribute('data-focus', String(i));
      steps.forEach(function (s) { s.classList.toggle('is-active', s === e.target); });
      if (bar) bar.style.width = ((i + 1) / steps.length * 100) + '%';
    });
  }, { rootMargin: '-40% 0px -40% 0px' });
  steps.forEach(function (s) { obs.observe(s); });
  if (steps[0]) steps[0].classList.add('is-active');
});

/* ─── خريطة النفوذ: كل طرف يعرض الجملة التي ذكرته في النص ─── */
var netQuotes = {
  washington: { peak: ['واشنطن', 'علّمتنا السياسة الأمريكية أن واشنطن قد تترك الحبل طويلاً لبعض القوى الإقليمية.'],
                after: ['واشنطن', 'قُتل سليماني بضربة أمريكية.'] },
  tehran:     { peak: ['طهران', 'حتى بدت طهران وكأنها تمسك بأوراق المنطقة.'],
                after: ['طهران', 'اليوم تجد إيران نفسها في مواجهة مباشرة، بينما تتعرض شبكة نفوذها لضربات قاسية.'] },
  soleimani:  { peak: ['قاسم سليماني ورجاله', 'على مدى سنوات، وصل قاسم سليماني ورجاله إلى عمق سوريا وقرب الحدود.'],
                after: ['قاسم سليماني', 'قُتل سليماني بضربة أمريكية.'] },
  hezbollah:  { peak: ['حزب الله', 'وتعاظمت قوة حزب الله ونفوذه في لبنان والعراق واليمن.'],
                after: ['حزب الله', 'وقُتل نصرالله وعدد كبير من قادة الحزب بضربات متتالية.'] },
  syria:      { peak: ['سوريا', 'وصل قاسم سليماني ورجاله إلى عمق سوريا وقرب الحدود.'] },
  lebanon:    { peak: ['لبنان', 'وتعاظمت قوة حزب الله ونفوذه في لبنان والعراق واليمن.'] },
  iraq:       { peak: ['العراق', 'وتعاظمت قوة حزب الله ونفوذه في لبنان والعراق واليمن.'] },
  yemen:      { peak: ['اليمن', 'وتعاظمت قوة حزب الله ونفوذه في لبنان والعراق واليمن.'] }
};
var netWrap = document.querySelector('.network-wrap');

/* على الهاتف تُرسم الخريطة طولية حتى تُقرأ أسماؤها */
var netSvg = document.querySelector('.net-svg');
var netLayouts = {
  wide: {
    box: '0 0 900 560',
    nodes: { washington: [150, 110], tehran: [450, 270], soleimani: [250, 360], hezbollah: [650, 360],
             syria: [150, 480], lebanon: [560, 490], iraq: [700, 500], yemen: [820, 470] },
    edges: ['M150 110 C 300 110, 360 250, 450 270', 'M450 270 L 250 360', 'M450 270 L 650 360',
            'M250 360 L 150 480', 'M650 360 L 560 490', 'M650 360 L 700 500', 'M650 360 L 820 470',
            'M150 110 C 170 230, 200 300, 250 360', 'M150 110 L 450 270']
  },
  tall: {
    box: '0 0 400 640',
    nodes: { washington: [95, 70], tehran: [230, 215], soleimani: [105, 375], hezbollah: [300, 365],
             syria: [80, 545], lebanon: [205, 540], iraq: [300, 580], yemen: [362, 480] },
    edges: ['M95 70 C 160 80, 210 140, 230 215', 'M230 215 L 105 375', 'M230 215 L 300 365',
            'M105 375 L 80 545', 'M300 365 L 205 540', 'M300 365 L 300 580', 'M300 365 L 362 480',
            'M95 70 C 40 190, 50 300, 105 375', 'M95 70 L 230 215']
  }
};
function layoutNetwork() {
  var L = isPhone() ? netLayouts.tall : netLayouts.wide;
  netSvg.setAttribute('viewBox', L.box);
  document.querySelectorAll('.net-svg .node').forEach(function (n) {
    var xy = L.nodes[n.dataset.node];
    n.setAttribute('transform', 'translate(' + xy[0] + ' ' + xy[1] + ')');
  });
  document.querySelectorAll('.net-svg .edge').forEach(function (e, i) { e.setAttribute('d', L.edges[i]); });
}
layoutNetwork();
window.addEventListener('resize', layoutNetwork);
var netName = document.getElementById('net-panel-name');
var netQuote = document.getElementById('net-panel-quote');
var netNodes = document.querySelectorAll('.node');
var selectedNode = 'tehran';

function showNode(key) {
  selectedNode = key;
  var state = netWrap.dataset.net;
  var q = netQuotes[key][state] || netQuotes[key].peak;
  netName.textContent = q[0];
  netQuote.textContent = q[1];
  netNodes.forEach(function (n) { n.classList.toggle('is-selected', n.dataset.node === key); });
}
netNodes.forEach(function (n) {
  n.addEventListener('click', function () { showNode(n.dataset.node); });
  n.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showNode(n.dataset.node); }
  });
});
document.querySelectorAll('.network-toggle button').forEach(function (b, _, all) {
  b.addEventListener('click', function () {
    netWrap.dataset.net = b.dataset.state;
    all.forEach(function (x) {
      var on = x === b;
      x.classList.toggle('is-on', on);
      x.setAttribute('aria-pressed', String(on));
    });
    showNode(selectedNode);
  });
});
showNode('tehran');

/* ─── درج الخرائط والمراجع ─── */
var drawer = document.getElementById('drawer');
var backdrop = document.querySelector('.drawer-backdrop');
var openers = document.querySelectorAll('[data-open-drawer]');
var lastOpener = null;

function openDrawer(from) {
  lastOpener = from || null;
  drawer.removeAttribute('inert');
  drawer.setAttribute('aria-hidden', 'false');
  drawer.classList.add('is-open');
  backdrop.hidden = false;
  openers.forEach(function (o) { o.setAttribute('aria-expanded', 'true'); });
  drawer.querySelector('.drawer-close').focus();
}
function closeDrawer(restore) {
  drawer.classList.remove('is-open');
  drawer.setAttribute('aria-hidden', 'true');
  drawer.setAttribute('inert', '');
  backdrop.hidden = true;
  openers.forEach(function (o) { o.setAttribute('aria-expanded', 'false'); });
  if (restore !== false && lastOpener) lastOpener.focus();
}
openers.forEach(function (o) { o.addEventListener('click', function () { openDrawer(o); }); });
document.querySelectorAll('[data-close-drawer]').forEach(function (c) {
  c.addEventListener('click', function () { closeDrawer(!c.matches('a')); });
});

/* ─── العارض: يُغلق بـEsc، والأسهم تتنقّل، واليمين للسابق ─── */
var lightbox = document.getElementById('lightbox');
var lbImg = document.getElementById('lb-img');
var lbTitle = document.getElementById('lb-title');
var lbDesc = document.getElementById('lb-desc');
var items = Array.prototype.slice.call(document.querySelectorAll('.drawer-item'));
var lbIndex = 0;
var lbReturn = null;

function renderLightbox() {
  var it = items[lbIndex];
  var img = it.querySelector('img');
  lbImg.src = img.getAttribute('src');
  lbImg.alt = img.alt;
  lbTitle.textContent = it.dataset.title;
  lbDesc.textContent = it.dataset.desc;
}
function openLightbox(i, from) {
  lbIndex = i;
  lbReturn = from;
  renderLightbox();
  lightbox.hidden = false;
  lightbox.querySelector('.lb-close').focus();
}
function closeLightbox() {
  lightbox.hidden = true;
  if (lbReturn) lbReturn.focus();
}
function step(d) {
  lbIndex = (lbIndex + d + items.length) % items.length;
  renderLightbox();
}
items.forEach(function (it, i) { it.addEventListener('click', function () { openLightbox(i, it); }); });
lightbox.querySelector('.lb-close').addEventListener('click', closeLightbox);
lightbox.querySelector('.lb-prev').addEventListener('click', function () { step(-1); });
lightbox.querySelector('.lb-next').addEventListener('click', function () { step(1); });
lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });

document.addEventListener('keydown', function (e) {
  if (!lightbox.hidden) {
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowRight') step(-1);
    else if (e.key === 'ArrowLeft') step(1);
    return;
  }
  if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer();
});

/* ─── المشاركة ─── */
var pageUrl = 'https://kakramah.github.io/middle-east-power-trap/';
var pageTitle = 'كيف وقعت إيران في الشباك الأمريكية';
var shareConfirm = document.getElementById('share-confirm');
function confirmShare(msg) {
  shareConfirm.textContent = msg;
  setTimeout(function () { shareConfirm.textContent = ''; }, 3000);
}
var nativeBtn = document.getElementById('btn-share-native');
if (navigator.share) {
  nativeBtn.addEventListener('click', function () {
    navigator.share({ title: pageTitle, url: pageUrl }).catch(function () {});
  });
} else {
  nativeBtn.hidden = true;
}
document.getElementById('btn-copy').addEventListener('click', function () {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(pageUrl)
      .then(function () { confirmShare('نُسخ الرابط.'); })
      .catch(function () { confirmShare('تعذّر النسخ، انسخ الرابط من شريط العنوان.'); });
  } else {
    confirmShare('المتصفح لا يسمح بالنسخ، انسخ الرابط من شريط العنوان.');
  }
});

/* ─── نموذج التواصل ─── */
var form = document.getElementById('contact-form');
var submitBtn = document.getElementById('contact-submit');
var feedback = document.getElementById('form-feedback');
var lastSent = 0;
form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (!form.checkValidity()) {
    feedback.textContent = 'اكتب اسمك وبريدك ورسالتك، ثم أرسل.';
    return;
  }
  if (Date.now() - lastSent < 30000) {
    feedback.textContent = 'انتظر نصف دقيقة قبل رسالة أخرى.';
    return;
  }
  submitBtn.disabled = true;
  feedback.textContent = 'يُرسل الآن…';
  fetch('https://api.web3forms.com/submit', { method: 'POST', body: new FormData(form) })
    .then(function (r) { return r.json(); })
    .then(function (d) {
      if (d.success) {
        feedback.textContent = 'وصلت رسالتك إلى خلدون. شكراً.';
        form.reset();
        lastSent = Date.now();
      } else {
        feedback.textContent = 'لم تصل الرسالة. أعد المحاولة بعد قليل.';
      }
    })
    .catch(function () { feedback.textContent = 'لا اتصال بالإنترنت. أعد المحاولة حين يعود.'; })
    .finally(function () { submitBtn.disabled = false; });
});
