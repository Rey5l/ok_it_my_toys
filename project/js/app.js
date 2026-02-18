document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('productsGrid');
  const template = document.getElementById('productCardTemplate');
  const itemsCount = document.getElementById('itemsCount');
  const deliveryButton = document.getElementById('openDeliveryModal');
  const deliveryLink = document.getElementById('openDeliveryFromProduct');
  const priceEl = document.getElementById('modalProductPrice');
  const titleEl = document.getElementById('productModalTitle');
  const descriptionEl = document.getElementById('productModalDescription');
  const sizeWrapper = document.getElementById('sizeSwitcher');
  const detailsEl = document.getElementById('productDetails');
  const optionsEl = document.getElementById('productOptions');
  const preorderBtn = document.getElementById('preorderBtn');
  const filterBtn = document.getElementById('filterBtn');
  const sortBtn = document.getElementById('sortBtn');
  const sortDropdownBtn = document.getElementById('sortDropdownBtn');
  const sortDropdown = document.getElementById('sortDropdown');
  const dropdownWrapper = document.querySelector('.dropdown-wrapper');

  let products = [];
  let filteredProducts = [];
  let currentSort = 'newest';

  async function init() {
    try {
      products = await window.DataLoader.loadProducts();
      filteredProducts = [...products];
      applySorting();
    } catch (error) {
      renderError(error.message);
    }
  }

  function renderProducts(list) {
    const fragment = document.createDocumentFragment();
    list.forEach((product) => {
      const card = template.content.firstElementChild.cloneNode(true);
      const image = card.querySelector('.product-image');
      const title = card.querySelector('.product-title');
      const tag = card.querySelector('.product-tag');
      const price = card.querySelector('.product-price');

      image.src = product.images[0];
      image.alt = product.name;
      title.textContent = product.name;
      tag.textContent = product.tag;
      price.textContent = product.price;

      const openProduct = () => showProduct(product);
      card.addEventListener('click', openProduct);
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openProduct();
        }
      });

      fragment.appendChild(card);
    });

    grid.innerHTML = '';
    grid.appendChild(fragment);
    itemsCount.textContent = `${list.length} товаров`;
  }

  function applySorting() {
    const sorted = [...filteredProducts];
    
    switch (currentSort) {
      case 'newest':
        // По умолчанию - порядок из JSON
        break;
      case 'price-asc':
        sorted.sort((a, b) => {
          const priceA = parseInt(a.price.replace(/\s/g, '').replace('₽', ''));
          const priceB = parseInt(b.price.replace(/\s/g, '').replace('₽', ''));
          return priceA - priceB;
        });
        break;
      case 'price-desc':
        sorted.sort((a, b) => {
          const priceA = parseInt(a.price.replace(/\s/g, '').replace('₽', ''));
          const priceB = parseInt(b.price.replace(/\s/g, '').replace('₽', ''));
          return priceB - priceA;
        });
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name, 'ru'));
        break;
    }
    
    renderProducts(sorted);
  }

  function toggleDropdown() {
    const isActive = dropdownWrapper.classList.contains('active');
    if (isActive) {
      dropdownWrapper.classList.remove('active');
      sortDropdown.hidden = true;
    } else {
      dropdownWrapper.classList.add('active');
      sortDropdown.hidden = false;
    }
  }

  function closeDropdown() {
    dropdownWrapper.classList.remove('active');
    sortDropdown.hidden = true;
  }

  function renderError(message) {
    grid.innerHTML = `<p class="error-state">${message}</p>`;
  }

  function showProduct(product) {
    titleEl.textContent = product.name;
    priceEl.textContent = product.price;
    renderSizes(product.sizes);
    renderDescription(product);
    renderDetails(product);
    renderOptions(product);
    window.ProductCarousel.setImages(product.images, product.name);
    window.ModalManager.open('productModal');
  }

  preorderBtn?.addEventListener('click', () => {
    const productName = titleEl.textContent;
    alert(`Спасибо за интерес к "${productName}"! Пожалуйста, свяжитесь с нами через мессенджеры или соцсети для оформления предзаказа.`);
  });

  function renderSizes(sizes = []) {
    sizeWrapper.innerHTML = '';
    sizes.forEach((size, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `pill-btn${index === 0 ? ' active' : ''}`;
      button.textContent = size;
      button.addEventListener('click', () => {
        [...sizeWrapper.children].forEach((child) => child.classList.remove('active'));
        button.classList.add('active');
      });
      sizeWrapper.appendChild(button);
    });
  }

  function renderDescription(product) {
    if (product.description) {
      descriptionEl.innerHTML = `<p>${product.description}</p>`;
    } else {
      descriptionEl.innerHTML = '';
    }
  }

  function renderDetails(product) {
    const details = [];
    
    if (product.dimensions) {
      details.push({
        label: 'Размеры игрушки',
        value: product.dimensions
      });
    }
    
    if (product.care) {
      details.push({
        label: 'Рекомендации по уходу',
        value: product.care,
        isItalic: true
      });
    }
    
    if (product.material) {
      details.push({
        label: 'Материал',
        value: product.material
      });
    }
    
    if (product.age) {
      details.push({
        label: 'Рекомендуемый возраст',
        value: product.age
      });
    }

    if (details.length > 0) {
      detailsEl.innerHTML = details.map(detail => `
        <div class="detail-item">
          <strong>${detail.label}:</strong> ${detail.isItalic ? `<em>${detail.value}</em>` : detail.value}
        </div>
      `).join('');
    } else {
      detailsEl.innerHTML = '';
    }

    if (product.note) {
      const noteEl = document.createElement('div');
      noteEl.className = 'product-note';
      noteEl.innerHTML = `<p>${product.note}</p>`;
      if (detailsEl.nextSibling && detailsEl.nextSibling.className === 'product-note') {
        detailsEl.nextSibling.remove();
      }
      detailsEl.after(noteEl);
    }
  }

  function renderOptions(product) {
    if (product.addons && product.addons.length > 0) {
      optionsEl.innerHTML = product.addons.map(addon => `
        <button class="option-btn" type="button" data-addon="${addon.id}">
          <span class="option-icon">+</span>
          ${addon.name}
          ${addon.price ? `<span class="option-price">+${addon.price}</span>` : ''}
        </button>
      `).join('');
    } else if (product.canAddRattle) {
      optionsEl.innerHTML = `
        <button class="option-btn" type="button" data-addon="rattle">
          <span class="option-icon">+</span>
          Можно добавить погремушку
        </button>
      `;
    } else {
      optionsEl.innerHTML = '';
    }
  }

  // Обработчики фильтрации и сортировки
  filterBtn?.addEventListener('click', () => {
    // TODO: Добавить модальное окно фильтров
    console.log('Фильтры - функционал в разработке');
  });

  sortBtn?.addEventListener('click', () => {
    // TODO: Добавить модальное окно сортировки
    console.log('Сортировка - функционал в разработке');
  });

  sortDropdownBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDropdown();
  });

  sortDropdown?.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const sortType = btn.dataset.sort;
      currentSort = sortType;
      const textSpan = sortDropdownBtn.querySelector('span:not(.dropdown-arrow)');
      if (textSpan) {
        textSpan.textContent = btn.textContent;
      }
      applySorting();
      closeDropdown();
    });
  });

  // Закрытие выпадающего списка при клике вне его
  document.addEventListener('click', (e) => {
    if (!dropdownWrapper.contains(e.target)) {
      closeDropdown();
    }
  });

  // Закрытие по ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dropdownWrapper.classList.contains('active')) {
      closeDropdown();
    }
  });

  deliveryButton?.addEventListener('click', () => window.ModalManager.open('deliveryModal'));
  deliveryLink?.addEventListener('click', () => window.ModalManager.open('deliveryModal'));

  init();
});
