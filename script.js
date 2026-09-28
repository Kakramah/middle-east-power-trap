/* script.js — middle-east-power-trap */
'use strict';

/* ─── شريط التقدم ─────────────────────────────────────────── */
const progressBar = document.getElementById('progress-bar');

function updateProgress() {
  const scrollTop  = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct.toFixed(1) + '%';
}

/* ─── التنقل: إضافة scrolled ──────────────────────────────── */
const siteNav = document.getElementById('site-nav');

function updateNav() {
  if (window.scrollY > 60) {
    siteNav.classList.add('scrolled');
  } else {
    siteNav.classList.remove('scrolled');
  }
}

/* ─── ظهور العناصر عند التمرير ────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach(function(el) { revealObserver.observe(el); });

/* ─── المشاركة ────────────────────────────────────────────── */
const shareConfirm  = document.getElementById('share-confirm');
const pageUrl       = 'https://kakramah.github.io/middle-east-power-trap/';
const shareTitle    = 'كيف وقعت إيران في الشباك الأمريكية';

function showConfirm(msg) {
  shareConfirm.textContent = msg;
  setTimeout(function() { shareConfirm.textContent = ''; }, 3000);
}

/* زر المشاركة الأصلي */
var nativeBtn = document.getElementById('btn-share-native');
if (nativeBtn) {
  if (navigator.share) {
    nativeBtn.addEventListener('click', function() {
      navigator.share({ title: shareTitle, url: pageUrl })
        .catch(function() {});
    });
  } else {
    nativeBtn.style.display = 'none';
  }
}

/* زر نسخ الرابط */
var copyBtn = document.getElementById('btn-copy');
if (copyBtn) {
  copyBtn.addEventListener('click', function() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(pageUrl)
        .then(function() { showConfirm('تم نسخ الرابط.'); })
        .catch(function() { showConfirm('تعذّر النسخ.'); });
    } else {
      showConfirm('المتصفح لا يدعم النسخ التلقائي.');
    }
  });
}

/* ─── نموذج التواصل ───────────────────────────────────────── */
var contactForm    = document.getElementById('contact-form');
var submitBtn      = document.getElementById('contact-submit-btn');
var formFeedback   = document.getElementById('form-feedback');
var lastSubmitTime = 0;

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    /* مهلة 30 ثانية بين إرسالين */
    var now = Date.now();
    if (now - lastSubmitTime < 30000) {
      formFeedback.textContent = 'يُرجى الانتظار قبل إرسال رسالة أخرى.';
      return;
    }

    submitBtn.disabled = true;
    formFeedback.textContent = '';

    var formData = new FormData(contactForm);

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    })
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (data.success) {
          formFeedback.className = 'form-feedback success-message';
          formFeedback.textContent = 'وصلت رسالتك. شكراً.';
          contactForm.reset();
          lastSubmitTime = Date.now();
        } else {
          formFeedback.className = 'form-feedback';
          formFeedback.textContent = 'حدث خطأ. حاول مرة أخرى.';
        }
      })
      .catch(function() {
        formFeedback.className = 'form-feedback';
        formFeedback.textContent = 'تعذّر الاتصال. تحقق من الإنترنت.';
      })
      .finally(function() {
        submitBtn.disabled = false;
      });
  });
}

/* ─── التنقل بالأسهم بين المشاهد ────────────────────────── */
var scenes = document.querySelectorAll('.scene-block, #finale, #hero');
var currentSceneIndex = 0;

document.addEventListener('keydown', function(e) {
  if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    if (currentSceneIndex < scenes.length - 1) {
      currentSceneIndex++;
      scenes[currentSceneIndex].scrollIntoView({ behavior: 'smooth' });
    }
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    if (currentSceneIndex > 0) {
      currentSceneIndex--;
      scenes[currentSceneIndex].scrollIntoView({ behavior: 'smooth' });
    }
  }
});

/* ─── تجميع أحداث التمرير ─────────────────────────────────── */
var ticking = false;

window.addEventListener('scroll', function() {
  if (!ticking) {
    requestAnimationFrame(function() {
      updateProgress();
      updateNav();
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

/* تشغيل أولي */
updateProgress();
updateNav();
