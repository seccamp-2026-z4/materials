/* =========================================================
   Z4 コマ1 座学資料 — 共通スクリプト
   ========================================================= */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.Z4 = window.Z4 || {};
  window.Z4.reduceMotion = reduceMotion;

  /* ---------- 読了プログレスバー ---------- */
  const bar = document.querySelector('.readbar');
  if (bar) {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? Math.min(1, window.scrollY / h) : 0;
      bar.style.width = (p * 100).toFixed(2) + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
  }

  /* ---------- スクロール出現 ---------- */
  const targets = document.querySelectorAll('.rv');
  if (reduceMotion) {
    targets.forEach((el) => el.classList.add('in'));
  } else if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.06 }
    );
    targets.forEach((el) => io.observe(el));
  } else {
    targets.forEach((el) => el.classList.add('in'));
  }

  /* ---------- タブ ---------- */
  document.querySelectorAll('[data-tabs]').forEach((group) => {
    const btns = group.querySelectorAll('.tabs button');
    const panels = group.querySelectorAll('.tabpanel');
    btns.forEach((b, i) => {
      b.addEventListener('click', () => {
        btns.forEach((x) => x.classList.remove('is-on'));
        panels.forEach((x) => x.classList.remove('is-on'));
        b.classList.add('is-on');
        if (panels[i]) panels[i].classList.add('is-on');
        if (window.mermaid) {
          try { window.mermaid.run({ querySelector: '.tabpanel.is-on .mermaid' }); } catch (e) { /* noop */ }
        }
      });
    });
  });

  /* ---------- ヘルパ ---------- */
  window.Z4.sleep = (ms) => new Promise((r) => setTimeout(r, reduceMotion ? 0 : ms));

  window.Z4.seg = function (root, onPick) {
    const btns = root.querySelectorAll('button');
    btns.forEach((b) => {
      b.addEventListener('click', () => {
        btns.forEach((x) => x.classList.remove('is-on'));
        b.classList.add('is-on');
        onPick(b.dataset.v, b);
      });
    });
  };

  /* 実行中フラグつきのアニメーション実行器（多重起動防止） */
  window.Z4.runner = function () {
    let token = 0;
    return {
      start(fn) {
        const my = ++token;
        const alive = () => my === token;
        return fn(alive);
      },
      stop() { token++; }
    };
  };
})();
