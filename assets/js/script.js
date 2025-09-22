/**
 * @copyright 2025 codewithsadee
 * @license Apache-2.0
 */

'use strict';

// add event on multiple elements
const addEventOnElem = function (elements, eventType, callback) {
  for (let i = 0; i < elements.length; i++) {
    elements[i].addEventListener(eventType, callback);
  }
}

const $header = document.querySelector('[data-header]');
const $navbar = document.querySelector('[data-navbar]');
const $navToggler = document.querySelectorAll('[data-nav-toggler]');
const $overlay = document.querySelector('[data-overlay]');
const $dropdownToggler = document.querySelector('[data-dropdown-toggler]');
const $dropdown = document.querySelector('[data-dropdown]');
const $cartToggler = document.querySelector('[data-cart-toggler]');
const $cartModal = document.querySelector('[data-cart-modal]');

const toggleNavbar = function () {
  $navbar.classList.toggle('active');
  $overlay.classList.toggle('active');
  document.body.classList.toggle('active');
}

addEventOnElem($navToggler, 'click', toggleNavbar);

// element toggle function
const toggleElem = function (elem) {
  elem.classList.toggle('active');
}

// toggle dropdown
$dropdownToggler.addEventListener('click', function () {
  toggleElem($dropdown);
});

// toggle cart
$cartToggler.addEventListener('click', function () {
  toggleElem($cartModal);
});

// header active when windows scrollY 50px
const activeHeader = function () {
  window.scrollY > 50 ? $header.classList.add('active') : $header.classList.remove('active');
}

window.addEventListener('scroll', activeHeader);

// Custom slider

const $sliderContainers = document.querySelectorAll('[data-slider-container]');

function sliderInitial($sliderContainer) {
  const $slider = $sliderContainer.querySelector('[data-slider]');
  const $prevBtn = $sliderContainer.querySelector('[data-prev-btn]');
  const $nextBtn = $sliderContainer.querySelector('[data-next-btn]');

  function nextSlide() {
    $slider.appendChild($slider.firstElementChild);
  }
  $nextBtn.addEventListener('click', nextSlide);

  function prevSlide() {
    $slider.prepend($slider.lastElementChild);
  }
  $prevBtn.addEventListener('click', prevSlide);

  let autoSlideIntervalId;

  function autoSlide() {
    autoSlideIntervalId = setInterval(function () {
      nextSlide();
    }, 2000);
  }

  autoSlide();

  function deleteAutoSliding() {
    clearInterval(autoSlideIntervalId);
  }

  // Stop auto sliding when mouseover
  $slider.addEventListener('mouseover', deleteAutoSliding);
  $prevBtn.addEventListener('mouseover', deleteAutoSliding);
  $nextBtn.addEventListener('mouseover', deleteAutoSliding);

  // Resume auto sliding when mouseout
  $slider.addEventListener('mouseout', autoSlide);
  $prevBtn.addEventListener('mouseout', autoSlide);
  $nextBtn.addEventListener('mouseout', autoSlide);
}

for (let i = 0; i < $sliderContainers.length; i++) {
  sliderInitial($sliderContainers[i]);
}

document.addEventListener('DOMContentLoaded', () => {
  const popup = document.getElementById('product-popup');
  const closePopup = document.getElementById('close-popup');

  const compareContainer = document.getElementById('compare-container');
  const overlayImage = document.getElementById('popup-image-overlay');
  const originalImage = document.getElementById('popup-image-original');
  const sliderHandle = document.getElementById('slider-handle');

  const viewButtons = document.querySelectorAll('.view-product-btn');

  // Helper: chờ ảnh load xong
  function waitImageLoad(img) {
    return new Promise(resolve => {
      if (img.complete && img.naturalWidth !== 0) return resolve();
      img.onload = () => resolve();
      img.onerror = () => resolve();
    });
  }

  // Mở popup với chia đôi 50/50
  async function openPopup(origSrc, overlaySrc) {
    originalImage.src = origSrc || '';
    overlayImage.src = overlaySrc || '';

    await Promise.all([waitImageLoad(originalImage), waitImageLoad(overlayImage)]);

    // Reset trạng thái về 50%
    setSlider(50);

    popup.classList.remove('opacity-0', 'pointer-events-none');
    popup.classList.add('opacity-100');
  }

  // Đặt slider và clip-path
  function setSlider(percent) {
    // Giới hạn từ 0% -> 100%
    percent = Math.max(0, Math.min(percent, 100));

    // Clip ảnh overlay: inset(top right bottom left)
    // right = (100 - percent)%
    overlayImage.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;

    // Move handle
    sliderHandle.style.left = `${percent}%`;
  }

  // Gắn event cho các nút mắt
  viewButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const orig = btn.getAttribute('data-image') || '';
      const over = btn.getAttribute('data-overlay') || '';
      openPopup(orig, over);
    });
  });

  // Đóng popup
  function close() {
    popup.classList.add('opacity-0', 'pointer-events-none');
    popup.classList.remove('opacity-100');
  }

  closePopup.addEventListener('click', close);
  popup.addEventListener('click', (e) => { if (e.target === popup) close(); });

  // Kéo handle
  let isDragging = false;

  function handleDrag(clientX) {
    const rect = compareContainer.getBoundingClientRect();
    let offsetX = clientX - rect.left;
    offsetX = Math.max(0, Math.min(offsetX, rect.width));
    const percent = (offsetX / rect.width) * 100;
    setSlider(percent);
  }

  compareContainer.addEventListener('pointerdown', (e) => {
    isDragging = true;
    handleDrag(e.clientX);
    e.preventDefault();
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    handleDrag(e.clientX);
  });

  window.addEventListener('pointerup', () => {
    isDragging = false;
  });

  sliderHandle.addEventListener('pointerdown', (e) => {
    isDragging = true;
    e.preventDefault();
  });
});
document.addEventListener('DOMContentLoaded', function () {
  const cartPopup = document.getElementById('cart-popup');
  const closeCartPopup = document.getElementById('close-cart-popup');
  const cartBtns = document.querySelectorAll('[data-cart-toggler]'); // Nút giỏ hàng
  const formMessage = document.getElementById('form-message');
  const orderForm = document.getElementById('order-form');

  if (!cartPopup || !orderForm) {
    console.error("Popup hoặc form chưa tồn tại trong DOM!");
    return;
  }

  // Mở popup khi nhấn vào bất kỳ icon giỏ hàng nào
  cartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      cartPopup.classList.remove('opacity-0', 'pointer-events-none');
      cartPopup.classList.add('opacity-100');
    });
  });

  // Đóng popup khi nhấn nút ✖
  closeCartPopup.addEventListener('click', () => {
    cartPopup.classList.add('opacity-0', 'pointer-events-none');
    cartPopup.classList.remove('opacity-100');
  });

  // Đóng popup khi click ra ngoài popup
  cartPopup.addEventListener('click', (e) => {
    if (e.target === cartPopup) {
      cartPopup.classList.add('opacity-0', 'pointer-events-none');
      cartPopup.classList.remove('opacity-100');
    }
  });

  // Xử lý gửi form
  orderForm.addEventListener('submit', async function(event) {
    event.preventDefault(); // Ngăn reload trang

    try {
      const response = await fetch(orderForm.action, {
        method: orderForm.method,
        body: new FormData(orderForm),
        headers: {
          'Accept': 'application/json'
        }
      });

      console.log('Formspree Response:', response); // Kiểm tra log trong console

      if (response.ok) {
        // Reset form
        orderForm.reset();

        // Hiện thông báo thành công
        formMessage.classList.remove('hidden');

        // Ẩn thông báo + popup sau 2 giây
        setTimeout(() => {
          formMessage.classList.add('hidden');
          cartPopup.classList.add('opacity-0', 'pointer-events-none');
          cartPopup.classList.remove('opacity-100');
        }, 2000);
      } else {
        const errorData = await response.json();
        console.error('Formspree error:', errorData);
        alert('Có lỗi xảy ra từ Formspree. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Không thể kết nối, vui lòng thử lại sau.');
    }
  });
});

document.querySelectorAll(".view-video-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const videoSrc = this.getAttribute("data-video");
      const videoPopup = document.getElementById("video-popup");
      const popupVideo = document.getElementById("popup-video");

      // Gán nguồn video và tự động phát
      popupVideo.querySelector("source").src = videoSrc;
      popupVideo.load();
      popupVideo.play();

      // Hiển thị popup
      videoPopup.classList.remove("hidden");
      videoPopup.classList.add("flex");
    });
  });

  // Hàm đóng popup
  function closeVideoPopup() {
    const videoPopup = document.getElementById("video-popup");
    const popupVideo = document.getElementById("popup-video");

    // Dừng video và reset thời gian
    popupVideo.pause();
    popupVideo.currentTime = 0;

    // Ẩn popup
    videoPopup.classList.add("hidden");
    videoPopup.classList.remove("flex");
  }

  // Đóng popup khi click ra ngoài video
  document.getElementById("video-popup").addEventListener("click", function (e) {
    if (e.target === this) {
      closeVideoPopup();
    }
  });

