document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. 三頁共用導覽列捲動顯示/隱藏與漢堡選單邏輯
  // ==========================================
  const header = document.querySelector('header');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-links a');

  let lastScrollY = window.scrollY;

  const closeMenu = () => {
    if (navToggle && navMenu) {
      navToggle.classList.remove('is-active');
      navMenu.classList.remove('is-active');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', '開啟導覽選單');
    }
  };

  if (header) {
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;

      if (navMenu && navMenu.classList.contains('is-active')) {
        header.classList.remove('nav-hidden');
        lastScrollY = currentScrollY;
        return;
      }

      if (currentScrollY <= 10) {
        header.classList.remove('nav-hidden');
      } else if (currentScrollY > lastScrollY) {
        header.classList.add('nav-hidden');
      } else {
        header.classList.remove('nav-hidden');
      }

      lastScrollY = currentScrollY;
    });
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-active');
      navToggle.classList.toggle('is-active');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      navToggle.setAttribute('aria-label', isOpen ? '關閉導覽選單' : '開啟導覽選單');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  // ==========================================
  // 2. JSON 資料讀取與動態渲染 (自動相容 index.html 與 courses.html)
  // ==========================================
  const heroTitle = document.getElementById('hero-title');
  const modulesContainer = document.getElementById('modules-container');

  // 當頁面存在首頁元素或課程介紹頁元素時，才發送 Fetch 請求
  if (heroTitle || modulesContainer) {
    fetch('data/website-content.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('無法讀取 JSON 資料，HTTP 狀態碼: ' + response.status);
        }
        return response.json();
      })
      .then(data => {
        renderContent(data);
      })
      .catch(error => {
        console.error('資料載入失敗:', error);
      });

    function renderContent(data) {
      // ----- 渲染首頁 (index.html) -----
      if (heroTitle && data.hero) {
        const heroKicker = document.getElementById('hero-kicker');
        const heroSubtitle = document.getElementById('hero-subtitle');
        const heroCta = document.getElementById('hero-cta');

        if (heroKicker) heroKicker.textContent = data.hero.kicker || 'AI 協作課程';
        heroTitle.textContent = data.hero.title || '';
        if (heroSubtitle) heroSubtitle.innerHTML = data.hero.subtitle || '';
        if (heroCta && data.hero.cta) heroCta.textContent = data.hero.cta;
      }

      const featuresTitle = document.getElementById('features-title');
      const featuresContainer = document.getElementById('features-container');

      if (featuresTitle && data.featuresTitle) {
        featuresTitle.textContent = data.featuresTitle;
      }

      if (featuresContainer && Array.isArray(data.features)) {
        featuresContainer.innerHTML = '';
        data.features.forEach(item => {
          const card = document.createElement('div');
          card.className = 'feature-card';
          card.innerHTML = `
            ${item.imageUrl ? `<img class="feature-image" src="${escapeHTML(item.imageUrl)}" alt="${escapeHTML(item.imageAlt || item.title)}">` : ''}
            <div class="feature-content">
              <h3>${escapeHTML(item.title)}</h3>
              <p>${escapeHTML(item.description)}</p>
            </div>
          `;
          featuresContainer.appendChild(card);
        });
      }

      const faqTitle = document.getElementById('faq-title');
      const faqContainer = document.getElementById('faq-container');

      if (faqTitle && data.faqTitle) {
        faqTitle.textContent = data.faqTitle;
      }

      if (faqContainer && Array.isArray(data.faq)) {
        faqContainer.innerHTML = '';
        data.faq.forEach(item => {
          const faqItem = document.createElement('div');
          faqItem.className = 'faq-item';
          faqItem.innerHTML = `
            <h3>Q. ${escapeHTML(item.question)}</h3>
            <p>${escapeHTML(item.answer)}</p>
          `;
          faqContainer.appendChild(faqItem);
        });
      }

      const contactTitle = document.getElementById('contact-title');
      const contactDescription = document.getElementById('contact-description');

      if (contactTitle && data.contact?.title) {
        contactTitle.textContent = data.contact.title;
      }
      if (contactDescription && data.contact?.description) {
        contactDescription.textContent = data.contact.description;
      }

      // ----- 渲染課程介紹頁 (courses.html) -----
      const modulesTitle = document.getElementById('modules-title');
      const modulesDescription = document.getElementById('modules-description');

      if (modulesTitle && data.modulesTitle) {
        modulesTitle.textContent = data.modulesTitle;
      }

      if (modulesDescription && data.modulesDescription) {
        modulesDescription.textContent = data.modulesDescription;
      }

      if (modulesContainer && Array.isArray(data.modules)) {
        modulesContainer.innerHTML = '';
        data.modules.forEach(item => {
          const card = document.createElement('div');
          card.className = 'module-card';

          const tagsHTML = Array.isArray(item.tags)
            ? item.tags.map(tag => `<span class="tag">${escapeHTML(tag)}</span>`).join('')
            : '';

          card.innerHTML = `
            <div class="module-number">${escapeHTML(item.id || '')}</div>
            <div class="module-content">
              <h3>${escapeHTML(item.title || '')}</h3>
              <p>${escapeHTML(item.description || '')}</p>
              ${tagsHTML ? `<div class="module-tags">${tagsHTML}</div>` : ''}
            </div>
          `;
          modulesContainer.appendChild(card);
        });
      }

      // ----- 渲染頁尾 Footer -----
      const footerCopyright = document.getElementById('footer-copyright');
      if (footerCopyright && data.footer) {
        footerCopyright.textContent = data.footer;
      }
    }

    function escapeHTML(str) {
      if (!str) return '';
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
  }
});