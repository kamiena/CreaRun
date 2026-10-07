/* 走れ！クレアちゃん 公式サイト */
(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const STEAM_URL = 'https://store.steampowered.com/app/2547610/';

  /* ---------- ヘッダー / TOPボタン ---------- */
  const header = $('#siteHeader');
  const toTop = $('#toTop');
  let scrollTicking = false;

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 40);
    toTop.classList.toggle('is-visible', y > 640);
    scrollTicking = false;
  };
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(onScroll);
    }
  }, { passive: true });
  onScroll();

  /* ---------- モバイルメニュー ---------- */
  const menuToggle = $('#menuToggle');
  const menuLabel = $('.menu-toggle__label', menuToggle);
  const gnav = $('#gnav');

  const setMenu = (open) => {
    document.body.classList.toggle('is-menu-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuLabel.textContent = open ? 'CLOSE' : 'MENU';
  };
  menuToggle.addEventListener('click', () => {
    setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
  });
  gnav.addEventListener('click', (e) => {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('is-menu-open')) {
      setMenu(false);
      menuToggle.focus();
    }
  });
  window.matchMedia('(min-width: 1080px)').addEventListener('change', (e) => {
    if (e.matches) setMenu(false);
  });

  /* ---------- 表示中のセクションをナビでハイライト ---------- */
  const navLinks = $$('.gnav__link');
  const watched = [$('#top'), ...navLinks.map((a) => $(a.getAttribute('href')))].filter(Boolean);

  /* ---------- スクロールで出現 ---------- */
  const revealEls = $$('[data-reveal]');

  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => {
          a.classList.toggle('is-current', a.getAttribute('href') === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    watched.forEach((el) => navObserver.observe(el));

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- ギャラリー（ライトボックス） ---------- */
  const lightbox = $('#lightbox');
  const lbImg = $('#lightboxImg');
  const lbCap = $('#lightboxCap');
  const shots = $$('.gallery__item');
  let current = 0;
  let swipeStartX = null;
  let swiped = false;

  const showShot = (index) => {
    current = (index + shots.length) % shots.length;
    const btn = shots[current];
    lbImg.src = btn.dataset.full;
    lbImg.alt = $('img', btn).alt;
    lbCap.textContent = $('.gallery__cap', btn.closest('.gallery__cell')).textContent;
  };

  shots.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      if (typeof lightbox.showModal !== 'function') {
        window.open(btn.dataset.full, '_blank', 'noopener');
        return;
      }
      showShot(i);
      lightbox.showModal();
      document.body.classList.add('is-lock');
    });
  });

  lightbox.addEventListener('close', () => document.body.classList.remove('is-lock'));
  lightbox.addEventListener('click', (e) => {
    if (swiped) {
      swiped = false;
      return;
    }
    const dirBtn = e.target.closest('[data-dir]');
    if (dirBtn) {
      showShot(current + Number(dirBtn.dataset.dir));
    } else if (e.target.closest('.lightbox__close') || e.target === lightbox) {
      lightbox.close();
    }
  });
  lightbox.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') showShot(current + 1);
    if (e.key === 'ArrowLeft') showShot(current - 1);
  });
  lightbox.addEventListener('pointerdown', (e) => {
    swipeStartX = e.clientX;
  });
  lightbox.addEventListener('pointerup', (e) => {
    if (swipeStartX === null) return;
    const dx = e.clientX - swipeStartX;
    swipeStartX = null;
    if (Math.abs(dx) > 50) {
      swiped = true;
      showShot(current + (dx < 0 ? 1 : -1));
    }
  });

  /* ---------- ページ内ミニゲーム：★や積み木を集めてスコアを稼ごう ---------- */
  const hud = $('#scoreHud');
  const scoreEl = $('#scoreValue');
  const toast = $('#toast');
  const collectibles = $$('.collect');
  let score = 0;
  let shownScore = 0;
  let collectedCount = 0;
  let scoreRaf = 0;
  let toastTimer = 0;
  let hinted = false;

  const renderScore = () => {
    cancelAnimationFrame(scoreRaf);
    const from = shownScore;
    const to = score;
    const duration = reduceMotion.matches ? 0 : 450;
    const start = performance.now();
    const step = (now) => {
      const p = duration ? Math.min(1, (now - start) / duration) : 1;
      shownScore = Math.round(from + (to - from) * (1 - (1 - p) ** 3));
      scoreEl.textContent = shownScore.toLocaleString('ja-JP');
      if (p < 1) scoreRaf = requestAnimationFrame(step);
    };
    scoreRaf = requestAnimationFrame(step);
    hud.classList.remove('is-bump');
    void hud.offsetWidth; // アニメーションをリスタート
    hud.classList.add('is-bump');
  };

  const showToast = (html, ms = 3400) => {
    toast.innerHTML = html;
    toast.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-show'), ms);
  };

  const popPoint = (x, y, pt) => {
    const el = document.createElement('span');
    el.className = pt >= 50 ? 'pt-pop pt-pop--big' : 'pt-pop';
    el.textContent = `+${pt}`;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    document.body.append(el);
    setTimeout(() => el.remove(), 1000);
  };

  const celebrate = () => {
    if (reduceMotion.matches) return;
    const shapes = ['b-circle', 'b-triangle', 'b-square', 'b-star', 'b-wedge'];
    const rect = hud.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    for (let i = 0; i < 20; i += 1) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      use.setAttribute('href', `#${shapes[i % shapes.length]}`);
      svg.append(use);
      svg.setAttribute('class', 'confetti');
      svg.setAttribute('aria-hidden', 'true');
      const angle = Math.random() * Math.PI * 2;
      const dist = 120 + Math.random() * 220;
      svg.style.left = `${cx - 13}px`;
      svg.style.top = `${cy - 13}px`;
      svg.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
      svg.style.setProperty('--ty', `${Math.abs(Math.sin(angle)) * dist + 80}px`);
      svg.style.setProperty('--tr', `${Math.random() * 720 - 360}deg`);
      document.body.append(svg);
      setTimeout(() => svg.remove(), 1700);
    }
  };

  // 画面幅によって非表示になるものは数えない
  const totalAvailable = () => collectibles
    .filter((el) => el.classList.contains('is-collected') || el.getClientRects().length > 0)
    .length;

  const collect = (el, x, y) => {
    if (el.classList.contains('is-collected')) return;
    el.classList.add('is-collected');
    const pt = Number(el.dataset.pt) || 10;
    score += pt;
    collectedCount += 1;
    popPoint(x, y, pt);
    renderScore();

    const total = totalAvailable();
    if (collectedCount >= total) {
      setTimeout(() => {
        celebrate();
        showToast(`ALL GET！ スコア <strong>${score.toLocaleString('ja-JP')}</strong>pt 達成！<br>ゲーム本編は <a href="${STEAM_URL}" target="_blank" rel="noopener">Steamで無料プレイ</a> できるよ♪`, 7000);
      }, 350);
    } else if (!hinted) {
      hinted = true;
      showToast(`+${pt}pt GET！ ページ内の★や積み木を全部集めてみよう！（${collectedCount}/${total}）`);
    }
  };

  collectibles.forEach((el) => {
    el.addEventListener('click', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX || rect.left + rect.width / 2;
      const y = e.clientY || rect.top + rect.height / 2;
      collect(el, x, y);
    });
  });

  /* ---------- ヒーローの積み木をマウスに合わせてふんわり動かす ---------- */
  const hero = $('.hero');
  const floats = $$('.hero__deco .collect');
  const canParallax = window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduceMotion.matches;

  if (hero && canParallax) {
    let px = 0;
    let py = 0;
    let pending = false;
    hero.addEventListener('pointermove', (e) => {
      const rect = hero.getBoundingClientRect();
      px = (e.clientX - rect.left) / rect.width - 0.5;
      py = (e.clientY - rect.top) / rect.height - 0.5;
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => {
        floats.forEach((el) => {
          const depth = Number(el.style.getPropertyValue('--depth')) || 16;
          el.style.translate = `${(-px * depth).toFixed(1)}px ${(-py * depth).toFixed(1)}px`;
        });
        pending = false;
      });
    });
  }
})();
