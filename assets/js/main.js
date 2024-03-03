$(function () {
  'use strict';

  var Slideout = window.Slideout;
  var Swiper = window.Swiper;
  var jarallax = window.jarallax;
  var blueimp = window.blueimp.Gallery;

  // Animation function
  $.fn.extend({
    animateCss: function (animationName) {
      var animationEnd =
        'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
      $(this)
        .addClass('animated ' + animationName)
        .one(animationEnd, function () {
          $(this).removeClass('animated ' + animationName);
        });
    },
  });

  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  window.objectFitImages();

  // http://git.blivesta.com/animsition/
  // A SIMPLE AND EASY JQUERY PLUGIN FOR CSS ANIMATED PAGE TRANSITIONS.
  $('.animsition').animsition({
    inClass: 'fade-in',
    outClass: 'fade-out',
    inDuration: 1500,
    outDuration: 800,
    linkElement:
      'a:not([target="_blank"]):not([href^="#"]):not([href^="tel"]):not([href^="mailto"]):not(#blueimp-gallery a):not(.js-gallery-link)',
    loading: true,
    loadingParentElement: 'body',
    timeout: true,
    timeoutCountdown: 100,
    onLoadEvent: false,
    overlay: false,
    transition: function (url) {
      window.location.href = url;
    },
  });

  /**
   * Parralax Initial
   */
  jarallax(document.querySelectorAll('.intro-bg'), {
    speed: 0.8,
    type: 'scroll',
    imgSize: 'cover',
    automaticResize: true,
  });

  jarallax(document.querySelectorAll('.jarallax.prlx'), {
    speed: 0.6,
    type: 'scroll',
    imgSize: 'auto',
    imgRepeat: 'repeat',
  });

  /**
   * fix for bootstrap tooltips
   */
  $('[data-toggle="tooltip"]')
    .tooltip()
    .on('click', function (e) {
      e.preventDefault();
    });

  function headerAffix() {
    var navbarFixed = $('.navbar-fixed');
    var didScroll;
    var lastScrollTop = 0;
    var delta = 0;
    var navbarHeight = navbarFixed.outerHeight();

    $(window).on('scroll', function () {
      didScroll = true;
    });

    function hasScrolled() {
      var st = $(document).scrollTop();

      // Make sure they scroll more than delta
      if (Math.abs(lastScrollTop - st) <= delta) return;

      // If they scrolled down and are past the navbar, add class .nav-up.
      // This is necessary so you never see what is "behind" the navbar.
      if (st > lastScrollTop && st > navbarHeight) {
        navbarFixed.css('top', -$('.navbar__topline').outerHeight());
      } else if (st + $(window).height() < $(document).height()) {
        navbarFixed.css('top', 0);
      }

      lastScrollTop = st;
    }

    setInterval(function () {
      if (didScroll) {
        hasScrolled();
        didScroll = false;
      }
    }, 100);
  }

  function offsetMenu() {
    $('.navbar-nav ul').each(function () {
      var $this = $(this);
      var $win = $(window);
      var $l = $this.offset().left;

      var isVisible = $l + $this.width() > $win.width();

      if (isVisible) {
        $this.addClass('pull-right');
      }
    });
  }

  /**
   * Sticky sidebars and elements
   */
  function stickySide() {
    var $sidebar = $('.blog-sidebar');
    var $blogPostMeta = $('.js-blog-meta');

    var $top =
      $('.navbar-affix').length > 0
        ? $('.navbar-affix.affix').height() + 20
        : 20;

    $sidebar.parent().css('position', 'static');

    $sidebar.stick_in_parent({
      parent: $('.container'),
      offset_top: $top,
    });

    $blogPostMeta.stick_in_parent({
      offset_top: $top - 10,
    });
  }

  function initialVideo() {
    $('.btn-play').on({
      mouseenter: function () {
        $(this)
          .closest('.video-contain')
          .find('.video-contain__preview')
          .addClass('hover');
      },
      mouseleave: function () {
        $(this)
          .closest('.video-contain')
          .find('.video-contain__preview')
          .removeClass('hover');
      },
      click: function () {
        var $contain = $(this).closest('.video-contain');
        var $video = $contain.find('iframe');
        var $id = $video.data('id');

        $contain.addClass('actived');

        $video.attr('src', $id);
      },
    });
  }

  if (isMobile === false) {
    $('html').addClass('no-touch');
    headerAffix();
    offsetMenu();
    stickySide();
    initialVideo();
  }

  $(window).on('resize', function () {
    if (isMobile === false) {
      headerAffix();
      offsetMenu();
    }
  });

  /**
   * Room banner animation
   */
  $('.room-banner').on({
    mouseenter: function () {
      $(this).addClass('active');
      $('.room-banner__more p', $(this)).animateCss('slideInDown');
      $('.link-more', $(this)).animateCss('slideInLeft');
    },
    mouseleave: function () {
      $(this).removeClass('active');
    },
  });

  /**
   * Mobile panel navigation
   */
  var MobileNav = (function () {
    var $menu = $('#panelMenu');
    var $menuTitle = $menu.find('.js-menu-title');
    var slideMenuOpen = $('#trigger');
    var slideMenuClose = $('#overPage, .panel-menu-header');

    return {
      init: function () {
        var MenuPanel = new Slideout({
          panel: document.getElementById('content'),
          menu: document.getElementById('panelMenu'),
          padding: 256,
          tolerance: 70,
          touch: false,
        });

        slideMenuOpen.on('click', function (e) {
          e.preventDefault();
          MenuPanel.toggle();
        });

        slideMenuClose.on('click', function () {
          if ($('html').hasClass('slideout-open')) {
            MenuPanel.close();
          }
        });

        MenuPanel.on('beforeopen', function () {
          $('.navbar, .over-page, .page-footer').addClass('open');
        });

        MenuPanel.on('beforeclose', function () {
          $('.navbar, .over-page, .page-footer').removeClass('open');
        });

        MenuPanel.on('close', function () {
          $menu.find('li').removeClass('next active');
          $menuTitle.find('.text').text($menuTitle.data('title'));
        });

        // Call methods
        this.next();
        this.prev();
      },

      next: function () {
        $menu.on('click', 'ul > li > a', function (e) {
          var $this = $(this);

          if ($this.next('.panel-list__next').length > 0) {
            e.preventDefault();

            $menu.find('.open').closest('ul').addClass('prev');

            $this.parent().parent().addClass('open');
            $this.parent().addClass('next active').siblings().addClass('next');

            $menuTitle.addClass('active').find('.text').text($this.text());
          }
        });
      },

      prev: function () {
        $menu.on('click', '.js-menu-title', function (e) {
          var $current = $menu.find('ul.open:not(.prev)');
          var $prev = $current.closest('.prev');

          e.preventDefault();

          $current.removeClass('open').children().removeClass('next active');

          $prev.removeClass('prev');

          $menuTitle.find('.text').text($prev.find('> li.active > a').text());

          if ($prev.length < 1) {
            $menuTitle
              .removeClass('active')
              .find('.text')
              .text($menuTitle.data('title'));
          }
        });
      },
    };
  })();

  MobileNav.init();

  $('.pricing-panel, .hm-features-2__item').equalHeights();

  $('.js-counter').counterUp({
    delay: 10,
    time: 1000,
  });

  /**
   * Bootstrap mod for forms datepicker & clockpicker
   */
  $('.input-daterange').datepicker({
    orientation: 'bottom',
    keyboardNavigation: true,
    format: 'mm/dd/yyyy',
    autoclose: true,
  });

  $('.js-input-time').clockpicker({
    autoclose: true,
  });

  $('.label-control').on('click', function () {
    $(this).next().focus();
  });

  /**
   * Reservation Select
   */
  $('.js-select-reserved').barrating({
    hoverState: false,
  });

  $('.js-reserved-check').on('click', function () {
    $(this).closest('.row').find('.br-widget').toggleClass('disable');
  });

  /**
   * http://idangero.us/swiper/api/#events
   * https://owlcarousel2.github.io/OwlCarousel2/docs/started-welcome.html
   */
  var $homeSlider = $('.js-home-slider');
  var $ourClientsCarousel = $('.js-client-carousel');
  var $historyCarousel = $('.js-history-carousel');
  var $spaCarousel = $('.js-spa-menu-carousel');
  var $spaNav = $('.js-spa-menu-nav');
  var $carouselOwl = $('.owl-carousel');
  var $swiperCarousel = $('.js-carousel');
  var $serviceCategory = $('.js-service-category');
  var $roomCarousel = $('.js-room-carousel');

  if ($carouselOwl) {
    $carouselOwl.each(function () {
      var $this = $(this);

      $ourClientsCarousel.owlCarousel({
        loop: true,
        nav: false,
        slideSpeed: 300,
        paginationSpeed: 400,
        autoHeight: false,
        dots: true,
        mouseDrag: true,
        touchDrag: true,
        dotsContainer: $ourClientsCarousel.next().find('.js-pagination'),
        responsive: {
          0: {
            items: 1,
          },
          576: {
            items: 2,
          },
          992: {
            items: 3,
          },
        },
      });

      // bind custom controls
      $historyCarousel.owlCarousel({
        items: 1,
        loop: true,
        nav: false,
        dots: true,
        dotsContainer: $this.next().find('.js-pagination'),
      });

      $this
        .parent()
        .find('.next')
        .on('click', function () {
          $this.trigger('next.owl.carousel');
        });

      $this
        .parent()
        .find('.prev')
        .on('click', function () {
          $this.trigger('prev.owl.carousel');
        });
    });
  }

  if ($homeSlider.length > 0) {
    var homeSliderInit = new Swiper($homeSlider, {
      loop: true,
      speed: 1500,
      autoplay: {
        delay: 5000,
        stopOnLastSlide: true,
      },
      parallax: true,
      effect: 'coverflow',
      coverflowEffect: {
        rotate: 30,
        stretch: 0,
        depth: 100,
        slideShadows: true,
        modifier: 1,
      },
      navigation: {
        prevEl: '.swiper-button-prev',
        nextEl: '.swiper-button-next',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });

    homeSliderInit.on('slideChange', function () {});
  }

  if ($spaCarousel.length > 0) {
    var spaMenuCarousel = new Swiper($spaCarousel, {
      speed: 500,
      effect: 'fade',
      fadeEffect: {
        crossFade: true,
      },
      allowTouchMove: false,
      autoHeight: false,
    });

    var spaMenuNav = new Swiper($spaNav, {
      speed: 500,
      spaceBetween: 50,
      centeredSlides: true,
      slidesPerView: 'auto',
      mousewheel: {
        invert: false,
      },
      slideToClickedSlide: true,
      navigation: {
        prevEl: '.js-spa-menu-prev',
        nextEl: '.js-spa-menu-next',
      },
    });

    spaMenuCarousel.controller.control = spaMenuNav;
    spaMenuNav.controller.control = spaMenuCarousel;
  }

  if ($swiperCarousel.length > 0) {
    $swiperCarousel.each(function () {
      var $this = $(this);

      var swiperCarouselInit = new Swiper($this, {
        slidesPerView: 1,
        loop: true,
        autoplay: 3500,
        speed: 1200,
        pagination: {
          el: $this.find('.js-pagination'),
          clickable: true,
        },
      });
      $this.find('.js-prev').on('click', function (e) {
        e.preventDefault();
        swiperCarouselInit.slidePrev();
      });
      $this.find('.js-next').on('click', function (e) {
        e.preventDefault();
        swiperCarouselInit.slideNext();
      });
    });
  }

  if ($roomCarousel.length) {
    var roomCarouselInit = new Swiper($roomCarousel, {
      spaceBetween: 8,
    });

    var roomCarouselThumbs = new Swiper('.js-room-thumbs', {
      spaceBetween: 0,
      direction: 'vertical',
      slidesPerView: 'auto',
      centeredSlides: true,
      touchRatio: 0.8,
      mousewheel: {
        invert: false,
      },
      slideToClickedSlide: true,
      on: {
        init: function () {
          roomGalleryResize(this);
        },
        resize: function () {
          roomGalleryResize(this);
        },
      },
    });
    roomCarouselInit.controller.control = roomCarouselThumbs;
    roomCarouselThumbs.controller.control = roomCarouselInit;
  }

  if ($serviceCategory.length > 0) {
    var serviceCategoriesInit = new Swiper($serviceCategory, {
      loop: true,
      slidesPerView: 2,
      autoplay: 3500,
      speed: 1200,
      navigation: {
        prevEl: '.js-prev',
        nextEl: '.js-next',
      },
      breakpoints: {
        768: {
          slidesPerView: 1,
        },
      },
    });

    serviceCategoriesInit.on('slideChange', function () {});
  }

  var $gallerylink = $('.js-gallery-link');

  $gallerylink.on('click', function (e) {
    var options = {
      index: $gallerylink.index(this),
      event: e,
      fullscreen: true,
      hidePageScrollbars: false,
      disableScroll: true,
    };

    e.preventDefault();

    blueimp($gallerylink, options);
  });

  /**
   * Cascading grid Masonry for galleries
   */
  var $masonryGrid = $('.js-grid-masonry');
  var $masonryItems = $masonryGrid.find('.grid-item');

  $masonryItems.hide();

  $(window).imagesLoaded(function () {
    $masonryItems.fadeIn();

    $masonryGrid.masonry({
      columnWidth: '.grid-sizer',
      itemSelector: '.gallery__item',
      percentPosition: true,
    });

    var $masonryFilter = $masonryGrid.isotope({
      itemSelector: '.gallery__item',
      resizable: false,
      percentPosition: true,
      masonry: {
        columnWidth: '.grid-sizer',
      },
    });

    $('.filter-button-group').on('click', 'button', function (e) {
      var filterValue = $(this).attr('data-filter');

      e.preventDefault();

      $masonryFilter.isotope({ filter: filterValue });
    });
  });

  function roomGalleryResize(el) {
    var $width = $(window).width();

    if ($width < 750) el.params.direction = 'horizontal';
    if ($width > 750) el.params.direction = 'vertical';

    el.update();
  }
});
