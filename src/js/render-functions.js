import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let lightbox;

export function createImageCard({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `
      <div class="image-card">
        <a href="${largeImageURL}" class="image-link">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" class="img"/>
        </a>
        <div class="info">
          <p><b>Likes:</b> ${likes}</p>
          <p><b>Views:</b> ${views}</p>
          <p><b>Comments:</b> ${comments}</p>
          <p><b>Downloads:</b> ${downloads}</p>
        </div>
      </div>`;
}

export function renderGallery(gallery, images) {
  const markup = images.map(createImageCard).join('');
  gallery.insertAdjacentHTML('beforeend', markup);
  initLightbox();
}

export function clearGallery(gallery) {
  gallery.innerHTML = '';
}

export function initLightbox() {
  if (lightbox) {
    lightbox.destroy();
  }
  lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
}

export function toggleLoader(loader, isVisible) {
  loader.style.display = isVisible ? 'block' : 'none';
}

export function toggleLoadMoreButton(button, isVisible) {
  button.style.display = isVisible ? 'block' : 'none';
}
