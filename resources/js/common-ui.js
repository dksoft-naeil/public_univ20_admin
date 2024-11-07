// 스크롤바 있는지 체크
$.fn.hasScrollBar = function () {
  return (this.prop('scrollHeight') == 0 && this.prop('clientHeight') == 0) || this.prop('scrollHeight') > this.prop('clientHeight');
};

(function (exports) {
  var $selectric; // 셀렉트릭
  var sliderArr = []; // 슬라이드 배열

  $(document).ready(function () {
    // ------------------------ 공통 함수 실행 -----------------------------//
    // 셀렉트박스
    selectric();
    // 헤더 스크롤감지
    scrollHeader();
    // 아코디언 핸들러
    accordionHandler();
    // input active 핸들러
    inputActiveHandler();
    // 달력
    datePicker();
    // 최상단버튼
    floatBtnTop();
    // 스크롤 애니메이션
    scrollAnimation();
    // 탭 컨텐츠
    tabContentController();
    // 평점 선택
    ratingSelectHandler();
    // 셀렉트박스 float
    selectboxFloat();
    // 폼 관련 스크립트
    formScript();
    // 글자수 표시 및 제한
    textLengthCheck();
    // 헤더 높이 감지 컨텐츠간격
    // contentSpaceFn();
    // 숫자 카운팅
    // numberCounter('.number-count');

    // ------------------------ ui 함수 실행 -----------------------------//
    // 슬라이드
    sliderMaker();
    // 사이드바 메뉴
    sidebarController();
    // 스위치
    switchHandler();
    // 코멘트 안내 텍스트
    commentInfoText();
  });

  // ------------------------ ui 함수 -----------------------------//

  function commentInfoText() {
    if (!$('.comment-input-box').length) return;

    // focus
    $('.comment-input-box-active .form-textarea').on('focus', function (e) {
      if (!$(this).closest('.textarea-box').hasClass('show')) {
        $(this).closest('.textarea-box').addClass('show');
      }
    });

    // keyup
    $('.comment-input-box-active .form-textarea').on('keyup', function () {
      $(this).closest('.textarea-box').addClass('writing');

      if ($(this).val().length == 0) {
        $(this).closest('.textarea-box').removeClass('writing');
      }
    });

    // 다른 부분 클릭 시 제거
    $('body').click(function (e) {
      if ($(e.target).parents('.comment-input-box-active').length < 1 && $(e.target).attr('class') !== 'comment-input-box-active') {
        $('.textarea-box').removeClass('show');
      }
    });
  }

  function switchHandler() {
    setSwitchItem();
    $('body').on('click', '.switch-label', function () {
      var $this = $(this);
      var $checkbox = $this.prev('.switch-input');

      if (!$checkbox.prop('disabled')) {
        $checkbox.click();
        setSwitchItem();
      }
    });
  }
  function setSwitchItem() {
    $('.switch-label').each(function () {
      var $this = $(this);
      var $checkbox = $this.prev('.switch-input');

      if ($checkbox.prop('checked')) {
        $this.closest('.switch-item').addClass('active');
      } else {
        $this.closest('.switch-item').removeClass('active');
      }
    });
  }

  function sidebarController() {
    var $sideBar = $('.sidebar');
    var $menu = $sideBar.find('.nav-menu-item');
    var $btnSideBarToggle = $('.btn-sidebar-toggle');
    var $mobileNavItem = $('.mobile-nav-item');
    $menu.on('click', function () {
      var $this = $(this);
      if ($(window).width() < 1200) {
        menuToggleFn($this);
      } else {
        if ($('body').hasClass('sidebar-folder')) {
          $('body').removeClass('sidebar-folder');
        } else {
          menuToggleFn($this);
        }
      }
    });
    function menuToggleFn(el) {
      if (el.next('.sub-menu').length) {
        el.next('.sub-menu').stop().slideToggle(250).closest('.nav-menu').toggleClass('active').siblings('.nav-menu').removeClass('active').find('.sub-menu').slideUp(250).closest('.nav-menu-wrapper').siblings('.nav-menu-wrapper').find('.nav-menu').removeClass('active').find('.sub-menu').slideUp(250);
      }
    }

    $btnSideBarToggle.on('click', function () {
      $(this).toggleClass('active');
      $('body').toggleClass('sidebar-folder');

      if ($(this).hasClass('active')) {
       window.sessionStorage.setItem('sidebar', 'active');
      } else {
       window.sessionStorage.removeItem('sidebar');
      }
    });

    // 화면 최초 로딩시 폴딩상태 체크
    if (window.localStorage.getItem('sidebar')) {
      $btnSideBarToggle.addClass('active');
      $('body').addClass('sidebar-folder');
    }

    var resizeFlag = true;
    mobileCheckSize();
    $(window).on('resize', function () {
      mobileCheckSize();
    });

    function mobileCheckSize() {
      if ($(window).width() < 1400 && resizeFlag) {
        $btnSideBarToggle.addClass('active');
        $('body').addClass('sidebar-folder');
        resizeFlag = false;
      } else if ($(window).width() > 1320 && !resizeFlag) {
        resizeFlag = true;
      }
    }

    $mobileNavItem.on('click', function () {
      var $this = $(this);
      var _idx = $this.index();
      $mobileNavItem.removeClass('active');
      $this.addClass('active');
      $('.nav-menu-wrapper').hide().eq(_idx).show();
    });
  }
  function sliderMaker() {
    var exampleSlider = sliderInit('.slider-example', {
      loop: false,
      // slidesPerView: 2
      // centeredSlides: true,
      // spaceBetween: 30,
      // freeMode: true,
      // autoplay: {
      //   delay: 1000,
      //   disableOnInteraction: false,
      //   pauseOnMouseEnter: false,
      // },
      // autoHeight: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        // 모바일에서 -> pc
        360: {
          slidesPerView: 2,
        },
        600: {
          slidesPerView: 'auto',
        },
      },
    });
  }
  // ------------------------ ui 함수 -----------------------------//

  // ------------------------ 공통 함수(공통함수의 수정이 필요한 경우 공유 후 작업) ---------------------------//

  function formScript() {
    // input 비밀번호 타입변경
    if ($('.btn-type-change').length) {
      $('.btn-type-change').on('click', function () {
        var $typeChange = $(this).closest('.type-change');
        if (!$(this).hasClass('type-text')) {
          $(this).addClass('type-text');
          $typeChange.find('.form-input').attr('type', 'text');
        } else {
          $(this).removeClass('type-text');
          $typeChange.find('.form-input').attr('type', 'password');
        }
      });
    }
  }

  function aTagHandler() {
    $('body').on('mouseover', 'a', function (e) {
      var $link = $(this),
        href = $link.attr('href') || $link.data('href');

      if (!$link.hasClass('no-cursor')) {
        $(this).css({cursor: 'pointer'});
      }
      if (href) {
        // 아이디로 이동하는경우가 아닌경우
        if (href.indexOf('#') !== 0) {
          $link.off('click.chrome');
          $link
            .on('click.chrome', function () {
              if (href !== 'javascript:void(0);') {
                if ($link.attr('target') === '_blank') {
                  window.open(href, '_blank');
                } else {
                  window.location.href = href;
                }
              } else {
                return false;
              }
            })
            .attr('data-href', href)
            .removeAttr('href');
        }
      } else {
        $link.removeAttr('href');
      }
    });
  }

  function inputReadOnlyHandler() {
    // input 최초 readonly 상태만들고 포커스시 readonly 해제 - edge autocomplete 기능 해제를 위함
    $('.form-input').each(function () {
      // 초기에 readonly값이나 disalbed값이 없는경우만
      if (!$(this).prop('readonly') && !$(this).prop('disabled') && !$(this).hasClass('readonly-input')) {
        $(this).off('focus');
        $(this).prop('readonly', true);
        $(this).on('focus', function () {
          $(this).prop('readonly', false);
        });
      }
    });
  }

  // 타겟 외 클릭시 닫기 함수
  function bodyToggleFn(target, element, callback) {
    $('body').on('click', function (e) {
      if ($(e.target).closest(target).length < 1 && $(e.target).closest(element).length < 1) {
        callback();
      }
    });
  }

  // 셀렉트박스 float
  function selectboxFloat() {
    if (!$('.float-select').length) return;
    $(document).on('change', '.float-select', function () {
      if ($(this).val() !== '') {
        $(this).closest('.select-box-container').addClass('active');
      } else {
        $(this).closest('.select-box-container').removeClass('active');
      }
    });
  }

  var popupScrollInit = 0;
  // 팝업 컨트롤러
  var layerPopup = {
    popupArr: [],
    zIndex: 999,
    // 특정 팝업 열기
    openPopup: function (popupId, dimFlag) {
      var $popupEl = $('#' + popupId);
      var _ = this;
      var $closeBtn = $popupEl.find('.popup-close');
      var $popupContainer = $popupEl.find('.popup-container');
      // 팝업 배열에 담기
      _.popupArr.push($popupEl);

      // 팝업 오픈
      $popupEl.addClass('open').css({
        zIndex: _.zIndex + _.popupArr.length,
      });

      // 팝업 위에 팝업띄울때 dim처리
      if (_.popupArr.length > 1) {
        $popupEl.css('background-color', 'rgba(0,0,0,0.5)');
      }

      // body 스크롤 막기
      // html에 스크롤이 있는경우만
      if ($('html').hasScrollBar()) {
        $('body').css('overflow-y', 'scroll');
      }

      if (_.popupArr.length == 1) {
        popupScrollInit = $(window).scrollTop();
        $('#container').css({
          position: 'fixed',
          top: -$(window).scrollTop(),
          left: 0,
          width: '100%',
        });
      } else {
        $('#container').css({
          position: 'fixed',
          top: -popupScrollInit,
          left: 0,
          width: '100%',
        });
      }

      if (!$('.layer-popup-dim').length) {
        // dim없을경우 생성
        $('body').append('<div class="layer-popup-dim"></div>');
      }

      $('.layer-popup-dim').addClass('show');

      // 팝업닫기 눌렀을때
      $closeBtn.off('click');
      $closeBtn.on('click', function (e) {
        e.preventDefault();
        _.closePopup();
      });

      if (!dimFlag) {
        // dim 클릭시 팝업 전부 닫기
        $popupEl.off('click');
        $popupEl.on('click', function (e) {
          if (!$(e.target).closest($popupContainer).length) {
            _.closePopup();
          }
        });
      }
    },
    // 특정 팝업 닫기
    closePopup: function (popupId) {
      var _ = this;
      var $popupEl = popupId ? $('#' + popupId) : _.popupArr[_.popupArr.length - 1];
      $popupEl.removeClass('open');
      _.popupArr = _.popupArr.filter(function (item) {
        return item.attr('id') !== $popupEl.attr('id');
      });
      if (_.popupArr.length === 0) {
        $('.layer-popup-dim').removeClass('show');
        _.popupCloseInit();
      }
    },
    // 모든 팝업 닫기
    closeAllPopup: function () {
      var _ = this;
      for (var i = 0; i < _.popupArr.length; i++) {
        _.popupArr[i].removeClass('open');
      }
      _.popupArr = [];
      _.popupCloseInit();
      $('.layer-popup-dim').removeClass('show');
    },
    // 팝업 닫을때 초기화
    popupCloseInit: function () {
      var scrollPosition = Math.abs($('#container').css('top').split('px')[0]);
      scrollPosition = !scrollPosition ? $(window).scrollTop() : scrollPosition;
      $('#container').removeAttr('style');
      $(window).scrollTop(scrollPosition);
      $('body').removeAttr('style');
    },
  };

  // 모바일 햄버거 메뉴 컨트롤러
  var mobileMenuController = {
    // 메뉴 하나로 열기&닫기 사용시
    toggle: function (btn, menuName, bodyFlag) {
      $(btn).toggleClass('active');
      $(menuName).toggleClass('open');
      // 기본적으로 body스크롤 금지, true줄경우 body스크롤 허용
      if (!bodyFlag) {
        $('body').toggleClass('scroll-disable');
      }
    },
    // 메뉴 열기
    open: function (btn, menuName, bodyFlag) {
      $(btn).addClass('active');
      $(menuName).addClass('open');
      if (!bodyFlag) {
        $('body').addClass('scroll-disable');
      }
    },
    // 메뉴 닫기
    close: function (btn, menuName, bodyFlag) {
      $(btn).removeClass('active');
      $(menuName).removeClass('open');
      if (!bodyFlag) {
        $('body').removeClass('scroll-disable');
      }
    },
  };

  // 스크롤 이동 함수
  function scrollMoveTo(id, between, speed) {
    var _speed = speed ? speed : 300;
    if (id) {
      var _id = id.replace('#', '');
      if (!$('#' + _id).length) return;
      var offset = $('#' + _id).offset().top;
      var _between = between ? between : 0;
      $('html, body').animate({scrollTop: offset - _between}, _speed);
    } else {
      $('html, body').animate({scrollTop: 0}, _speed);
    }
  }

  function scrollHeader() {
    headerScrollFn();
    $(window).on('scroll', function () {
      headerScrollFn();
    });

    function headerScrollFn() {
      var _sct = $(window).scrollTop();
      if (_sct > 0) {
        $('#header').addClass('scroll');
      } else {
        $('#header').removeClass('scroll');
      }
    }
  }

  // 슬라이드 생성
  function sliderInit(element, option) {
    if (!$(element).length) return;

    var slider = new Swiper(element, option);
    if (Array.isArray(slider)) {
      for (var i = 0; i < slider.length; i++) {
        sliderArr.push(slider[i]);
      }
    } else {
      sliderArr.push(slider);
    }
    return slider;
  }

  // 슬라이드 update(새로고침)
  function sliderUpdate() {
    if (sliderArr.length) {
      $.each(sliderArr, function (i) {
        sliderArr[i].update();
      });
    }
  }

  function selectric() {
    $selectric = $('.selectric');
    if (!$selectric.length) return;
    $selectric.selectric({
      nativeOnMobile: false,
      onInit: function (event, selectric) {
        var $this = $(this);
        initSelectric($this, selectric);
      },
      onRefresh: function (event, selectric) {
        var $this = $(this);
        initSelectric($this, selectric);
      },
      onChange: function (el, selectric) {
        // 셀렉트릭 작동시 select박스 change 트리거
        $(this).trigger('change');
        // float 라벨 있을경우
        if ($(this)[0].value) {
          $(this).closest('.selectric-container').removeClass('error init-before').addClass('active');
        } else {
          $(this).closest('.selectric-container').removeClass('active');
          initSelectric($(this), selectric);
        }
      },
      onOpen: function (el) {
        $(el).closest('.selectric-container').addClass('open');
      },
      onClose: function (el) {
        $(el).closest('.selectric-container').removeClass('open');
      },
    });

    // 초기 셋팅 함수
    function initSelectric(target, selectric) {
      // 에러 아이콘 생성
      if (!selectric.elements.outerWrapper.find('.icon-error').length) {
        selectric.elements.wrapper.append('<span class="icon-error"></span>');
      }

      // 필수항목일경우
      if (target.hasClass('required') && !target[0].value) {
        selectric.elements.label.append('<span class="required">*</span>');
      }

      // disabled일 경우
      if (target.prop('disabled')) {
        target.closest('.selectric-container').addClass('disabled');
      } else {
        target.closest('.selectric-container').removeClass('disabled');
      }

      // float 라벨 있을경우
      if (target.hasClass('float')) {
        if (target[0].value) {
          target.closest('.selectric-container').addClass('active').removeClass('init-before');
        } else {
          target.closest('.selectric-container').addClass('init-before');
        }
      }
      // erorr일 경우
      if (target.hasClass('error')) {
        target.closest('.selectric-container').addClass('error');
      } else {
        target.closest('.selectric-container').removeClass('error');
      }
    }
  }

  // 셀렉트릭 새로고침
  function refreshSelectric() {
    $selectric.selectric('refresh');
  }

  function accordionHandler() {
    var accordionContainer = $('.accordion-container');
    if (!accordionContainer.length) return;
    $('body').on('click', '.accordion-header', function () {
      var $this = $(this);
      var _speed = $this.closest('.accordion-container').attr('data-speed');
      _speed = _speed ? parseInt(_speed) : 200;
      accordionFn($this, _speed);
    });
  }

  function accordionFn(el, speed) {
    speed = speed ? speed : 200;
    // 컨테이너에 solo 클래스가 있으면 각각 토글됨
    if (el.closest('.accordion-container').hasClass('solo')) {
      el.closest('.accordion-list').toggleClass('active').find('.accordion-body').stop().slideToggle(speed);
    } else {
      el.closest('.accordion-list').toggleClass('active').find('.accordion-body').stop().slideToggle(speed).closest('.accordion-list').siblings('.accordion-list').removeClass('active').find('.accordion-body').slideUp(speed);
    }
  }

  function tabContentController() {
    var $tabs = $('.ui-tab-item');
    if (!$tabs.length) return;
    $tabs.on('click', function (e) {
      e.preventDefault();
      var $tab = $(this);
      var _id = $tab.find('a').attr('href');

      $tab.addClass('active').siblings('.ui-tab-item').removeClass('active');
      $(_id).show().siblings('.ui-tab-content').hide();
    });
  }

  function inputActiveHandler() {
    var $inputs = $('.input-active');
    if (!$inputs.length) return;

    $inputs.each(function () {
      var $this = $(this);
      var $inputcover = $this.closest('.input-cover');
      if ($this.is('[readonly]') && !$this.hasClass('datepicker-input')) {
        $inputcover.removeClass('active');
        $inputcover.addClass('disable-active');
      } else {
        $inputcover.removeClass('disable-active');
        if ($this.val().length) {
          $inputcover.addClass('active');
        }
      }
    });

    $(document).on('focus change', '.input-active', function (e) {
      var $this = $(this);
      var $inputcover = $this.closest('.input-cover');
      if (!$this.is('[readonly]')) {
        $inputcover.addClass('focus');
        $inputcover.addClass('active');
        $inputcover.removeClass('disable-active');
      }
      if ($this.hasClass('datepicker-input')) {
        $inputcover.addClass('active');
      }
    });

    $(document).on('focusout change', '.input-active', function (e) {
      var $this = $(this);
      var $inputcover = $this.closest('.input-cover');
      var setTimeHandle = setTimeout(function () {
        if (!$this.hasClass('open-datepicker')) {
          $inputcover.removeClass('focus');
          clearTimeout(setTimeHandle);
        }
      }, 100);

      if (!$this.val().length) {
        if (!$this.hasClass('open-datepicker')) {
          $inputcover.removeClass('active');
        }
      }
    });
  }

  function datePicker(el) {
    // https://ui.toast.com/tui-date-picker
    var datePickerArr = [];
    const DatePicker = tui.DatePicker;
    DatePicker.localeTexts['customKey'] = {
      titles: {
        // days
        DD: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
        // daysShort
        D: ['일', '월', '화', '수', '목', '금', '토'],
        // months
        MMMM: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        // monthsShort
        MMM: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
      },
      titleFormat: 'yyyy년 MMM',
      todayFormat: 'yyyy년 MMMM dd, D',
    };

    if (!el) {
      // 모든 datepicker작동시키기
      setDatePicker('.datepicker-input');
    } else {
      // 데이터 직접셋팅의 경우
      return setDateElPicker(el);
    }

    function setDatePicker(item) {
      $(item).each(function () {
        setDate(this);
      });
    }

    function setDateElPicker(item) {
      return setDate(item, true);
    }
    var focusFlag = true;
    function setDate(el, flag) {
      var datePicker;
      var $datePickerContainer = $(el).closest('.datepicker-item');
      var $datePickerWrapper = $datePickerContainer.find('.tui-datepicker-wrapper');
      var $datePickerInput = $datePickerContainer.find('.datepicker-input');
      var timeFlag = $datePickerContainer.hasClass('time') ? true : false;
      var type = 'date';
      var timeFormat = 'yyyy-MM-dd';

      if ($datePickerContainer.hasClass('init-datepicker')) return;
      if ($datePickerContainer.hasClass('time')) {
        // 시간 달력일경우
        timeFormat = 'yyyy-MM-dd HH:mm';
        // 월 달력일경우
      } else if ($datePickerContainer.hasClass('month')) {
        timeFormat = 'yyyy-MM';
        // 년도 달력일경우
      } else if ($datePickerContainer.hasClass('year')) {
        timeFormat = 'yyyy';
      }

      // 월 달력일경우
      if ($datePickerContainer.hasClass('month')) {
        type = 'month';
        // 년도 달력일경우
      } else if ($datePickerContainer.hasClass('year')) {
        type = 'year';
      }

      datePicker = new DatePicker($datePickerWrapper[0], {
        date: '',
        type: type,
        input: {
          element: $datePickerInput[0],
          format: timeFormat,
        },
        timePicker: timeFlag,
        language: 'customKey',
      });
      datePicker.on('open', function (e) {
        $datePickerInput.addClass('open-datepicker');
      });
      datePicker.on('close', function (e) {
        $datePickerInput.removeClass('open-datepicker');
      });

      // 포커스로 달력 열고 닫기
      $datePickerInput.on('focusin', function () {
        datePicker.open();
        focusFlag = true;
        datePicker.setDate(new Date($datePickerInput.val()));
      });
      $datePickerInput.on('focusout', function (e) {
        if (focusFlag) {
          datePicker.close();
        }
      });

      // 달력 클릭시 blur 막기
      $datePickerContainer.find('.tui-datepicker').on('click mousedown', function (event) {
        if ($(event.target).hasClass('tui-timepicker-select')) {
          focusFlag = false;
          return true;
        }
        return false;
      });

      if (flag) {
        $datePickerContainer.addClass('init-datepicker');
        return datePicker;
      }
    }
  }

  function floatBtnTop() {
    $('.float-btn-top').on('click', function () {
      scrollMoveTo();
    });
  }

  function scrollAnimation() {
    if (!$('.scroll-animate').length) return;
    var $element = $('.scroll-animate');
    if (!$element.length) return;
    $element.each(function (i) {
      var $this = $(this);
      var delay = $this.attr('data-delay');
      if (delay) {
        $this.css('animation-delay', delay + 's');
      }
      var setTimeHandler = setTimeout(function () {
        animationFn($this);
        clearTimeout(setTimeHandler);
      }, 400);

      $(window).on('scroll', function () {
        animationFn($this);
      });
    });

    function animationFn(element) {
      var _offset = element.offset().top;
      var _sct = $(window).scrollTop();
      var _windowHeight = $(window).height();
      var setValue = 1.2;

      if (_sct + _windowHeight / setValue >= _offset) {
        var animationName = element.attr('data-animation') || 'fade-in-bottom';

        element.addClass(animationName);
      }
    }
  }

  function textLengthCheck() {
    var $lengthCheckCover = $('.length-check-cover');
    if (!$lengthCheckCover.length) return;
    var $textElement = $lengthCheckCover.find('.length-check-item');
    $textElement.each(function () {
      setTextCount($(this));
    });
    $('body').on('keyup', '.length-check-item', function () {
      setTextCount($(this));
    });

    function setTextCount(el) {
      var _maxLength = el.attr('data-maxLength');
      var _textLength = el.val().length;
      if (_textLength > _maxLength) {
        _textLength = _maxLength;
      }
      el.val(el.val().substr(0, _maxLength));
      el.closest('.length-check-cover')
        .find('.count')
        .text(Number(_textLength).toLocaleString() + '/' + Number(_maxLength).toLocaleString());
    }
  }

  function contentSpaceFn() {
    var $content = $('#content');
    var setTimeHandler = null;
    if (!$('#header').length) return;
    if ($content.hasClass('space')) {
      setTimeHandler = setTimeout(function () {
        var _headerHeight = $('#header').outerHeight();
        $content.css('paddingTop', _headerHeight);
        clearTimeout(setTimeHandler);
      }, 150);
    }
  }

  function ratingSelectHandler() {
    var container = $('.rating-select-container');
    var inputs = container.find('input[type="radio"]');
    var labels = container.find('label');
    inputs.on('change', function () {
      if ($(this).prop('checked')) {
        labels.each(function () {
          $(this).removeClass('checked');
        });
        $(this).next('label').addClass('checked').prevAll('label').addClass('checked');
      }
    });
  }

  // 숫자 카운팅
  let isCountFlag = false;
  function numberCounter(target) {
    var items = $(target);
    if (!items.length) return;
    if (isCountFlag) return;

    isCountFlag = true;
    gsap.to(items, {
      textContent: items.data('number'),
      duration: 1,
      ease: 'power1.in',
      snap: {textContent: 1},
      stagger: {
        each: 1,
        onUpdate: function () {
          items[0].innerHTML = numberWithCommas(Math.ceil(items[0].textContent));
        },
      },
      onComplete: function () {
        isCountFlag = false;
      },
    });
  }

  // 콤마 생성
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // 숫자만 입력
  function onlyNumber(value) {
    return value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
  }

  // 숫자 + 마침표만 입력
  function onlyNumberPeriod(value) {
    return value.replace(/[^-\.0-9]/g, '');
  }

  // 폰번호 하이픈 생성
  const autoHyphen = (target) => {
    target.value = target.value.replace(/[^0-9]/g, '').replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
  };

  // 달력 년-월-일
  const autoDateHyphen = (target) => {
    target.value = target.value.replace(/[^0-9]/g, '').replace(/^(\d{4})(\d{2})(\d{2})$/, `$1-$2-$3`);
  };

  // 달력 년-월
  const autoDateMonthHyphen = (target) => {
    target.value = target.value.replace(/[^0-9]/g, '').replace(/^(\d{4})(\d{2})$/, `$1-$2`);
  };

  // ------------------------ 공통 함수 ---------------------------//

  // js 함수 외부사용을 위함

  // 팝업함수
  exports.layerPopup = layerPopup;
  // 모바일메뉴
  exports.mobileMenuController = mobileMenuController;
  // 숫자 카운팅
  exports.numberCounter = numberCounter;
  // input 활성화
  exports.inputActiveHandler = inputActiveHandler;
  // 콤마 생성
  exports.numberWithCommas = numberWithCommas;
  // 숫자만 입력
  exports.onlyNumber = onlyNumber;
  // 폰번호 하이픈 생성
  exports.autoHyphen = autoHyphen;
  // 달력 년-월-일
  exports.autoDateHyphen = autoDateHyphen;
  // 달력 년-월
  exports.autoDateMonthHyphen = autoDateMonthHyphen;

  // --- 비동기 실행후 재실행 함수 모음 -- //
  // 슬라이드 업데이트
  exports.sliderUpdate = sliderUpdate;
  // 셀렉트릭 새로고침
  exports.refreshSelectric = refreshSelectric;
  // 셀렉트릭 생성
  exports.selectric = selectric;
  // datepicker
  exports.datePicker = datePicker;
  // --- 비동기 실행후 재실행 함수 모음 -- //
  // exports.toolbarHandler = toolbarHandler;
})(this);
