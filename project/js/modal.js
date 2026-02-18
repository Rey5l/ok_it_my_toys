window.ModalManager = (() => {
  const overlay = document.getElementById('modalOverlay');
  const focusableSelector =
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

  let activeModal = null;
  let previousFocus = null;

  function open(id) {
    const modal = document.getElementById(id);
    if (!modal) return;

    const hadActive = Boolean(activeModal);
    if (hadActive) {
      hideModal(activeModal);
    } else {
      previousFocus = document.activeElement;
      overlay.hidden = false;
      requestAnimationFrame(() => overlay.classList.add('active'));
      document.addEventListener('keydown', handleKeydown);
    }

    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    activeModal = modal;

    trapFocus();
  }

  function close() {
    if (!activeModal) return;
    hideModal(activeModal);
    activeModal = null;

    overlay.classList.remove('active');
    const handleTransitionEnd = () => {
      if (!activeModal) {
        overlay.hidden = true;
      }
    };
    overlay.addEventListener('transitionend', handleTransitionEnd, { once: true });
    setTimeout(handleTransitionEnd, 320);

    document.removeEventListener('keydown', handleKeydown);
    previousFocus?.focus();
  }

  function trapFocus() {
    if (!activeModal) return;
    const focusables = activeModal.querySelectorAll(focusableSelector);
    if (focusables.length) {
      focusables[0].focus();
    } else {
      activeModal.setAttribute('tabindex', '-1');
      activeModal.focus();
    }
  }

  function hideModal(modal) {
    modal.setAttribute('aria-hidden', 'true');
    modal.hidden = true;
  }

  function handleKeydown(event) {
    if (!activeModal) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === 'Tab') {
      const focusables = Array.from(activeModal.querySelectorAll(focusableSelector));
      if (!focusables.length) {
        event.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  function initTriggers() {
    document.querySelectorAll('.modal').forEach((modal) => {
      modal.setAttribute('aria-hidden', 'true');
    });

    document.querySelectorAll('[data-open-modal]').forEach((trigger) => {
      trigger.addEventListener('click', () => open(trigger.dataset.openModal));
    });

    document.querySelectorAll('[data-close-modal]').forEach((button) => {
      button.addEventListener('click', close);
    });

    overlay?.addEventListener('click', close);
  }

  document.addEventListener('DOMContentLoaded', initTriggers);

  return { open, close };
})();
