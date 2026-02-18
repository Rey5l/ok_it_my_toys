window.ProductCarousel = (() => {
  const imageEl = document.getElementById('modalProductImage');
  const prevBtn = document.querySelector('.carousel-control.prev');
  const nextBtn = document.querySelector('.carousel-control.next');
  let images = [];
  let index = 0;
  let altBase = '';

  function update() {
    if (!imageEl || !images.length) return;
    const safeIndex = ((index % images.length) + images.length) % images.length;
    index = safeIndex;
    imageEl.src = images[safeIndex];
    imageEl.alt = `${altBase} — фото ${safeIndex + 1}`;
  }

  function setImages(list = [], alt = '') {
    images = list;
    altBase = alt;
    index = 0;
    update();
  }

  prevBtn?.addEventListener('click', () => {
    index -= 1;
    update();
  });

  nextBtn?.addEventListener('click', () => {
    index += 1;
    update();
  });

  return { setImages };
})();
