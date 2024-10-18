/*
 * Copyright (c) 2024 NusaTheme
 * Author: NusaTheme
 * This file is made for CURRENT TEMPLATE
*/

window.addEventListener('load', function () {
  platformDetection();
  preloader();
  stickyHeader();
  pageCursor();
  initSlider();
  initPageNav();
  mobileMenu();
  initBackToTop();
  contactForm();
  initTyped();
  Splitting();
});
window.addEventListener('resize', function () {
  platformDetection();
})
window.addEventListener('scroll', function () {
  stickyHeader();
})


// -----------------------------------------------------
// ---------------   FUNCTIONS    ----------------------
// -----------------------------------------------------

function platformDetection() {
  const html = document.querySelector('html');
  var mobileTest;
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) || window.innerWidth < 992) {
    mobileTest = true;
    html.classList.add("mobile");
  }
  else {
    mobileTest = false;
    html.classList.remove("mobile");
  }
}
function initWow() {
  const wowInstance = new WOW({
    offset: 100,
    mobile: true,
    live: true,
  });
  wowInstance.init();

}
function mobileMenu() {
  if (document.querySelector('html').classList.contains('mobile')) {
    const button = document.querySelector('.js-menu-toggle');
    if (!button) return;
    const siteMenu = document.querySelector('.site-menu');
    const links = siteMenu.querySelectorAll('a');
    button.addEventListener('click', function () {
      siteMenu.classList.toggle('opened');
      button.classList.toggle('active');
    });
    links.forEach(link => {
      link.addEventListener('click', function (e) {
        const target = e.currentTarget;
        if (target.closest('.has-submenu')) {
          if (target.getAttribute('href') === '#') {
            e.preventDefault();
          }
          const li = target.closest('.has-submenu');
          if (li.querySelector('.submenu')) {
            $(li.querySelector('.submenu')).slideToggle(300)
          }
        }
        else {
          setTimeout(function () {
            siteMenu.classList.toggle('opened');
            button.classList.toggle('active');
          }, 200);
        }
      })
    });
  }

}

function initTyped() {
  const texts = document.querySelectorAll('.typed-strings span');
  if (texts.length > 0) {
    var typed = new Typed('.typed', {
      strings: Array.from(texts).map(text => text.innerHTML),
      typeSpeed: 100,
      backDelay: 1000,
      loop: true,
      contentType: 'html', // or text
      // defaults to false for infinite loop
      loopCount: false,
    });

  }
}


function initSlider() {
  const slider = document.querySelector('.testimonial-slider');
  if (slider) {
    const swiper = new Swiper(".testimonial-slider", {
      slidesPerView: 1,
      spaceBetween: 42,
      speed: 1000,
      pagination: { el: ".swiper-testimonial-pagination" },
      autoplay: {
        delay: 5000,
      },
      breakpoints: {
        480: {
          slidesPerView: 1,
          spaceBetween: 42,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 42,
        }
      },
      navigation: {
        nextEl: ".testimonial-slider-nav .nav-next",
        prevEl: ".testimonial-slider-nav .nav-prev",
      }
    })
  }

}

function debounce(func, timeout = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => func.apply(this, args), timeout);
  };
}

function initPageNav() {
  const onePageNavInstance = Object.create(onePageLink);
  onePageNavInstance.render();
}

var onePageLink = {
  config: {
    sections: [],
    currentClassName: 'active',
    linkSelector: '.one-page-link',
    scrollOffset: 80
  },

  render: function () {
    const links = document.querySelectorAll(this.config.linkSelector);
    const self = this;
    links.forEach(link => {
      if (self.isValidSelector(link.getAttribute('href'))) {
        self.config.sections.push(document.querySelector(link.getAttribute('href')));
        link.addEventListener('click', function (e) {
          e.preventDefault();
          const destinationId = e.currentTarget.getAttribute('href');
          if (destinationId) {
            const destination = document.querySelector(destinationId);
            if (destination) {
              window.scrollTo({
                top: destination.offsetTop - (self.config.scrollOffset - 16),
                left: 0,
                behavior: "smooth",
              });
            }
          }
        });
      }
    });
    this.getCurrentSection();

    window.addEventListener('scroll', debounce(this.handleWindowOnScrolled.bind(this), 300));
  },

  isValidSelector: function (selector) {
    try {
      document.querySelector(selector)
    }
    catch {
      return false
    }
    return true
  },

  handleWindowOnScrolled: function () {
    this.getCurrentSection();
  },

  getCurrentSection: function () {
    const winH = window.innerHeight;
    this.config.sections.forEach(section => {
      if (section) {
        const sectionY = section.getBoundingClientRect().y;
        const sectionH = section.getBoundingClientRect().height;
        if (sectionY < winH && Math.abs(sectionY) < sectionH) {
          if (sectionY < this.config.scrollOffset + 1) {
            this.setActiveMenuLink(section.getAttribute('id'));
          }
        }
      }
    });
  },

  setActiveMenuLink: function (sectionId) {
    const currentActiveLink = document.querySelector(`${this.config.linkSelector}.${this.config.currentClassName}`);
    if (currentActiveLink) {
      currentActiveLink.classList.remove('active');
      const nextCurrentLink = document.querySelector(`a[href="#${sectionId}"]`);
      nextCurrentLink.classList.add('active');
    }
  }
}

function initBackToTop() {
  const backToTopInstance = Object.create(BackToTop);
  backToTopInstance.config = {
    button: document.querySelector('.back-to-top')
  }
  backToTopInstance.init();

}

var BackToTop = {
  config: {
    button: undefined,
    path: undefined,
  },
  init: function () {
    if (!this.config.button) return;
    const progressWrap = this.config.button.querySelector('.progress-wrap');
    this.config.path = progressWrap.querySelector('path');

    this.config.button.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    })

    this.updateProgress();
    window.addEventListener('scroll', debounce(this.updateProgress.bind(this), 100));
  },

  updateProgress: function () {
    const body = document.body;
    const html = document.documentElement;
    const documentH = Math.max(body.scrollHeight, body.offsetHeight,
      html.clientHeight, html.scrollHeight, html.offsetHeight) - window.innerHeight;
    const windowScrollY = window.scrollY;

    const buttonWrap = this.config.button.closest('.back-to-top-wrapper');
    if ((windowScrollY / documentH) > 0.2) {
      buttonWrap.classList.add('active');
      setTimeout(() => {
        this.config.button.classList.add('active');
      }, 100)

      const pathLength = this.config.path.getTotalLength();
      this.config.path.style.strokeDasharray = pathLength + ' ' + pathLength;
      const progress = pathLength - (windowScrollY * (pathLength / documentH));
      this.config.path.style.strokeDashoffset = progress;
    } else {
      this.config.button.classList.remove('active');
      setTimeout(() => {
        buttonWrap.classList.remove('active');
      }, 300)
    }

  }

}

function contactForm() {
  const contactForm = document.querySelector('#contactForm');
  if (!contactForm) return;
  const formAction = contactForm.getAttribute('action');
  const formMessage = document.querySelector('.form-action-message');
  const successMessage = formMessage.querySelector('.success-message');
  const errorMessage = formMessage.querySelector('.error-message');

  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (formAction === '#') {
      showSuccessMessage();
      return;
    }
    // Construct a FormData instance
    const formData = new FormData();
    try {
      const response = await fetch(formAction, {
        method: "POST",
        body: formData,
      });
      if (response.status === 200) {
        contactForm.classList.add('wow-out', 'animated');
        setTimeout(() => {
          contactForm.classList.add('fadeOutUp');
          setTimeout(() => {
            showSuccessMessage();
            contactForm.classList.add('invisible');
          }, 1000)
        }, 200)
      } else {
        showErrorMessage();
      }
    } catch (e) {
      console.error(e);
      showErrorMessage();
    }
  })

  function showSuccessMessage() {
    successMessage.classList.remove('d-none');
    successMessage.classList.add('wow', 'fadeInDown');
    setTimeout(() => {
      successMessage.classList.add('animated');
    }, 200);
  }

  function showErrorMessage() {
    errorMessage.classList.remove('d-none');
    errorMessage.classList.add('wow', 'fadeInUp');
    setTimeout(() => {
      errorMessage.classList.add('animated');
    }, 200);
  }
}

function pageCursor() {
  const cursors = document.querySelectorAll('.mouse-cursor');
  const cursorTargetSelectors = ['a', '.cursor-pointer', 'button', '.project-box'];
  const cursorTargets = document.querySelectorAll(cursorTargetSelectors.join(','));
  if (cursors.length === 2) {
    const cursorInner = document.querySelector('.cursor-inner');
    const cursorOuter = document.querySelector('.cursor-outer');

    window.addEventListener('mousemove', function (event) {
      cursorInner.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
      cursorOuter.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
    });

    cursorTargets.forEach(target => {
      target.addEventListener('mouseenter', function () {
        cursorInner.classList.add('cursor-hover');
        cursorOuter.classList.add('cursor-hover');
      });

      target.addEventListener('mouseleave', function () {
        cursorInner.classList.remove('cursor-hover');
        cursorOuter.classList.remove('cursor-hover');
      });
    });
    cursorInner.style.visibility = 'visible';
    cursorOuter.style.visibility = 'visible';
  }
}

function preloader() {
  const preloader = document.querySelector('.preloader');

  setTimeout(() => {
    preloader.classList.add('preloaded');

    initWow();
    setTimeout(() => {
      preloader.classList.add('d-none');
      preloader.remove();
    }, 2000);
  }, 1000);
}

function stickyHeader() {
  if (document.querySelector('.site-header')) {
    if (window.scrollY > 0) {
      document.querySelector('.site-header').classList.add('body-scrolled');
    } else {
      document.querySelector('.site-header').classList.remove('body-scrolled');
    }
  }
}

