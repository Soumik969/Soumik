/* detail-links.js
   Re-usable hyperlink + “More details” infrastructure for your site.

   HOW TO USE (quick):
   1. Include this file after your main HTML (end of body) OR with defer in <head>.
      <script src="assets/js/detail-links.js" defer></script>
   2. For any element you want to act as a “detail” trigger, add:
        class="detail-link"
        data-detail-id="UNIQUE_KEY"
        data-detail-mode="modal" | "external" | "inline"
      (default mode = modal)
   3. Define the data for that UNIQUE_KEY in detailData below (URL or rich content).
   4. That’s it. Clicking will open a modal (or external link, or inline expansion).
*/

(function () {
  'use strict';

  /******************************************************************
   * 1. CONFIGURATION SECTION
   ******************************************************************/

  // Map each detailId to either:
  //  - { mode: 'external', url: 'https://...' }
  //  - { mode: 'modal', title: '...', html: '...rich HTML...' }
  //  - { mode: 'inline', html: '...' }  (creates an inline expandable panel)
  //
  // If a trigger element sets data-detail-mode explicitly, that overrides this object’s mode.
  // Fill in real links / descriptions for your projects, achievements, etc.
  const detailData = {
    // Example: Quantum Transport / NEGF project
    'project-negf': {
      mode: 'modal',
      title: 'Quantum Transport Simulator (NEGF)',
      html: `
        <p class="leading-relaxed text-gray-300 mb-4">
          Implementation of Non-Equilibrium Green's Function (NEGF) formalism to study
          electron transport in low-dimensional nanoscale systems. Features custom
          Hamiltonian builders, self-energy calculations, and current–voltage (I–V) curve extraction.
        </p>
        <ul class="list-disc list-inside text-sm text-cyan-300 mb-4 space-y-1">
          <li>Recursive Green's Function algorithm</li>
          <li>Energy grid integration with adaptive refinement</li>
          <li>Contact self-energy via surface Green's functions</li>
          <li>Python (NumPy/SciPy), optional GPU (CuPy)</li>
        </ul>
        <a href="https://github.com/USERNAME/REPO" target="_blank"
           class="inline-block mt-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 px-4 py-2 rounded nav-link">
           View Repository <i class="fas fa-arrow-up-right-from-square ml-1"></i>
        </a>
      `
    },

    // Example external link
    'paper-pinn': {
      mode: 'external',
      url: 'https://arxiv.org/abs/XXXX.XXXXX'
    },

    // Example inline expansion
    'achievement-jee': {
      mode: 'inline',
      html: `
        <div class="p-4 mt-3 rounded-lg bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30">
          <p class="text-sm text-gray-300">
            Ranked in the top 1% of JEE Advanced among 0.18 million candidates, demonstrating
            problem-solving speed, conceptual clarity, and perseverance under timed pressure.
          </p>
        </div>
      `
    }
  };

  // Selector for clickable detail triggers
  const DETAIL_TRIGGER_SELECTOR = '.detail-link';

  // Classes for accessibility / styles
  const ACTIVE_CLASS = 'detail-inline-open';

  // Auto-close modal when pressing ESC
  const ENABLE_ESCAPE = true;

  /******************************************************************
   * 2. MODAL SYSTEM (created only if needed)
   ******************************************************************/
  function ensureModalRoot() {
    let modal = document.getElementById('dynamic-detail-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'dynamic-detail-modal';
      modal.className = 'modal';
      modal.innerHTML = `
        <div class="modal-content max-w-2xl relative">
          <button type="button" class="absolute top-4 right-4 text-2xl text-gray-400 hover:text-white nav-link"
                  data-modal-close aria-label="Close detail modal">
            <i class="fas fa-times"></i>
          </button>
          <h2 id="detail-modal-title"
              class="text-2xl font-bold gradient-text mb-4">Details</h2>
          <div id="detail-modal-body" class="space-y-4 text-sm"></div>
        </div>
      `;
      document.body.appendChild(modal);

      // Basic show/hide styling (leveraging existing .modal classes in your CSS)
      if (!modal.classList.contains('show')) {
        modal.style.display = 'none';
        modal.style.opacity = '0';
      }

      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
      });

      modal.querySelector('[data-modal-close]').addEventListener('click', () => closeModal(modal));
    }
    return modal;
  }

  function openModalWithContent(title, html) {
    const modal = ensureModalRoot();
    const titleEl = modal.querySelector('#detail-modal-title');
    const bodyEl = modal.querySelector('#detail-modal-body');

    if (titleEl) titleEl.textContent = title || 'Details';
    if (bodyEl) bodyEl.innerHTML = html || '<p class="text-gray-400">No additional information.</p>';

    modal.classList.add('show');
    modal.style.display = 'flex';
    requestAnimationFrame(() => { modal.style.opacity = '1'; });

    // Manage focus for accessibility
    trapFocus(modal);
  }

  function closeModal(modal) {
    modal.classList.remove('show');
    modal.style.opacity = '0';
    setTimeout(() => { modal.style.display = 'none'; }, 300);
    releaseFocus();
  }

  /******************************************************************
   * 3. INLINE EXPANSION
   ******************************************************************/
  function toggleInlineExpansion(trigger, html) {
    let panel = trigger.nextElementSibling;
    const alreadyOpen = panel && panel.dataset.inlinePanel === 'true';

    if (alreadyOpen) {
      panel.remove();
      trigger.classList.remove(ACTIVE_CLASS);
      trigger.setAttribute('aria-expanded', 'false');
      return;
    }

    // Create panel
    panel = document.createElement('div');
    panel.dataset.inlinePanel = 'true';
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-label', 'Additional details');
    panel.innerHTML = html;
    trigger.insertAdjacentElement('afterend', panel);
    trigger.classList.add(ACTIVE_CLASS);
    trigger.setAttribute('aria-expanded', 'true');
  }

  /******************************************************************
   * 4. LINK HANDLER
   ******************************************************************/
  function handleDetailTrigger(e, trigger) {
    e.preventDefault();

    const id = trigger.getAttribute('data-detail-id');
    if (!id) {
      console.warn('[detail-links] Missing data-detail-id on element:', trigger);
      return;
    }

    // Resolve config (element attribute overrides)
    const overrideMode = trigger.getAttribute('data-detail-mode');
    let config = detailData[id];

    if (!config) {
      // Fallback: treat as external anchor if an href present
      const href = trigger.getAttribute('href');
      if (href) {
        window.open(href, '_blank', 'noopener');
        return;
      }
      console.warn(`[detail-links] No config found for "${id}".`);
      openModalWithContent('Details', `<p class="text-gray-400 text-sm">No configuration found for <code>${id}</code>.</p>`);
      return;
    }

    const mode = overrideMode || config.mode || 'modal';

    switch (mode) {
      case 'external':
        if (config.url) {
          window.open(config.url, '_blank', 'noopener');
        } else {
          console.warn(`[detail-links] external mode but no url for "${id}".`);
        }
        break;

      case 'inline':
        toggleInlineExpansion(trigger, config.html || '<p class="text-gray-400 text-sm">No content provided.</p>');
        break;

      case 'modal':
      default:
        openModalWithContent(config.title || 'Details', config.html || '<p class="text-gray-400 text-sm">No content provided.</p>');
        break;
    }
  }

  /******************************************************************
   * 5. EVENT BINDING
   ******************************************************************/
  function initDetailLinks(root = document) {
    const triggers = root.querySelectorAll(DETAIL_TRIGGER_SELECTOR);
    triggers.forEach(el => {
      // Make non-anchor elements keyboard accessible
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
      if (!el.hasAttribute('role')) el.setAttribute('role', 'button');
      el.setAttribute('aria-expanded', 'false');

      // Prevent duplicate bindings
      if (el.dataset.detailBound === 'true') return;
      el.dataset.detailBound = 'true';

      el.addEventListener('click', (e) => handleDetailTrigger(e, el));
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
            handleDetailTrigger(e, el);
        }
      });
    });
  }

  /******************************************************************
   * 6. FOCUS TRAP (for modal accessibility)
   ******************************************************************/
  let previousFocus = null;
  function trapFocus(container) {
    previousFocus = document.activeElement;
    const focusable = container.querySelectorAll('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])');
    if (focusable.length) focusable[0].focus();

    function onKey(e) {
      if (ENABLE_ESCAPE && e.key === 'Escape') {
        closeModal(container);
      }
      if (e.key !== 'Tab') return;
      const list = Array.from(focusable).filter(el => !el.disabled && el.offsetParent !== null);
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    container.addEventListener('keydown', onKey);
    container._focusTrapHandler = onKey;
  }

  function releaseFocus() {
    const modal = document.getElementById('dynamic-detail-modal');
    if (modal && modal._focusTrapHandler) {
      modal.removeEventListener('keydown', modal._focusTrapHandler);
      delete modal._focusTrapHandler;
    }
    if (previousFocus && typeof previousFocus.focus === 'function') {
      previousFocus.focus();
    }
  }

  /******************************************************************
   * 7. PUBLIC API (optional)
   ******************************************************************/
  window.DetailLinks = {
    register(id, config) {
      detailData[id] = config;
    },
    init: initDetailLinks,
    open(id) {
      const config = detailData[id];
      if (!config) {
        console.warn(`[detail-links] No config for ${id}`);
        return;
      }
      const mode = config.mode || 'modal';
      if (mode === 'external' && config.url) {
        window.open(config.url, '_blank', 'noopener');
      } else if (mode === 'inline') {
        console.warn('[detail-links] open() does not support inline mode directly. Use a trigger element.');
      } else {
        openModalWithContent(config.title || 'Details', config.html || '');
      }
    }
  };

  /******************************************************************
   * 8. AUTO INIT
   ******************************************************************/
  document.addEventListener('DOMContentLoaded', () => {
    initDetailLinks();
  });

})();
