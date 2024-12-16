import { fetchImages } from './js/pixabay-api';
import {
  renderGallery,
  clearGallery,
  toggleLoader,
  toggleLoadMoreButton,
} from './js/render-functions';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMoreButton = document.querySelector('.load-more');

let currentPage = 1;
let currentQuery = '';
let totalHits = 0;

form.addEventListener('submit', onFormSubmit);
loadMoreButton.addEventListener('click', onLoadMore);

async function onFormSubmit(event) {
  event.preventDefault();

  const query = event.target.elements.searchQuery.value.trim();
  if (!query) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search query.',
    });
    return;
  }

  currentQuery = query;
  currentPage = 1;
  clearGallery(gallery);
  toggleLoader(loader, true);
  toggleLoadMoreButton(loadMoreButton, false);

  try {
    const data = await fetchImages(currentQuery, currentPage);
    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      iziToast.info({
        title: 'No results',
        message: 'Sorry, there are no images matching your search query.',
      });
      return;
    }

    renderGallery(gallery, data.hits);

    if (data.hits.length < totalHits) {
      toggleLoadMoreButton(loadMoreButton, true);
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'An error occurred while fetching images. Please try again.',
    });
  } finally {
    toggleLoader(loader, false);
  }
}

async function onLoadMore() {
  currentPage += 1;
  toggleLoader(loader, true);
  toggleLoadMoreButton(loadMoreButton, false);

  try {
    const data = await fetchImages(currentQuery, currentPage);

    const galleryCardHeight =
      gallery.firstElementChild?.getBoundingClientRect().height || 0;

    renderGallery(gallery, data.hits);

    // Плавная прокрутка страницы
    window.scrollBy({
      top: galleryCardHeight * 2,
      behavior: 'smooth',
    });

    if (currentPage * 15 >= totalHits) {
      toggleLoadMoreButton(loadMoreButton, false);
      iziToast.info({
        title: 'End of results',
        message: "We're sorry, but you've reached the end of search results.",
      });
    } else {
      toggleLoadMoreButton(loadMoreButton, true);
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'An error occurred while loading more images. Please try again.',
    });
  } finally {
    toggleLoader(loader, false);
  }
}
