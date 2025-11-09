(function ($) {
	"use strict";

/*=============================================
	=    		 Preloader			      =
=============================================*/
function preloader() {
	$('#preloader').delay(0).fadeOut();
};

$(window).on('load', function () {
	preloader();
	wowAnimation();
    aosAnimation();
});

/*=============================================
	=   $('select').niceSelect();		      =
=============================================*/
    // $('select').niceSelect();
    if ($(".nice-select").length) {
        $(".nice-select").niceSelect();
    }

/*===========================================
=            Mobile Menu Script             =
===========================================*/

// Add dropdown toggle button for menu items with children
if ($('.tgmenu__wrap li.menu-item-has-children ul').length) {
	$('.tgmenu__wrap .navigation li.menu-item-has-children').append('<div class="dropdown-btn"><span class="arrow-right"><i class="fas fa-arrow-right"></i></span></div>');
}

// Check if mobile menu exists
if ($('.tgmobile__menu').length) {

// Copy desktop menu content into mobile menu container
var mobileMenuContent = $('.tgmenu__wrap .tgmenu__main-menu').html();
$('.tgmobile__menu .tgmobile__menu-box .tgmobile__menu-outer').append(mobileMenuContent)

// Ensure GSAP is loaded before this runs
$('.tgmobile__menu').on('click', '.menu-item-has-children > a', function (e) {
  e.preventDefault();
  e.stopPropagation();

  const $parentLi = $(this).parent('li');
  const $subMenu = $parentLi.children('.sub-menu');

  if ($parentLi.hasClass('open')) {
    // Close current
    gsap.to($subMenu, {
      height: 0,
      opacity: 0,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        $parentLi.removeClass('open');
        $subMenu.css({ display: 'none' });
      }
    });
  } else {
    // Close other open submenus
    $parentLi
      .siblings('.menu-item-has-children.open')
      .each(function () {
        const $otherSub = $(this).children('.sub-menu');
        gsap.to($otherSub, {
          height: 0,
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: () => {
            $(this).removeClass('open');
            $otherSub.css({ display: 'none' });
          }
        });
      });

    // Open current
    $subMenu.css({ display: 'block', height: 'auto' });
    const fullHeight = $subMenu.outerHeight();

    $subMenu.css({ height: 0, opacity: 0 });
    $parentLi.addClass('open');

    gsap.to($subMenu, {
      height: fullHeight,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out"
    });
  }
});


	// Declare GSAP timeline globally inside the scope
	let menuTimeline;

	// Show mobile menu and play animation
    $('.mobile-nav-toggler').on('click', function () {
        $('body').addClass('mobile-menu-visible');
    
        // If timeline exists and is reversed, just play forward
        if (menuTimeline && menuTimeline.reversed()) {
            menuTimeline.play();
            return;
        }
    
        // If timeline already exists, kill and rebuild to reset all states
        if (menuTimeline) {
            menuTimeline.kill();
            menuTimeline = null;
        }
    
        // Rebuild timeline
        menuTimeline = gsap.timeline({ paused: true });
    
        menuTimeline
            .from(".tgmobile__menu .nav-logo", {
                y: -30,
                opacity: 0,
                duration: 0.4
            }, "+=0.3")
            .fromTo(".tgmobile__menu .close-btn", {
                opacity: 0,
                scale: 0,
                rotate: -360
            }, {
                opacity: 1,
                scale: 1,
                rotate: 0,
                duration: 0.7,
                ease: "back.out(1.7)"
            }, "-=0.5")
            .from(".tgmobile__menu .navigation > li", {
                y: 20,
                opacity: 0,
                duration: 0.3,
                stagger: 0.05
            }, "-=0.1")
            .from(".tgmobile__menu .tgmobile__menu-bottom .contact-info ul", {
                x: 20,
                opacity: 0,
                duration: 0.35
            }, "-=0.3")
            .from(".tgmobile__menu .social-links", {
                y: 30,
                opacity: 0,
                duration: 0.3
            }, "-=0.1");
    
        menuTimeline.play();
    });
    

	// Hide mobile menu and reverse animation
	$('.tgmobile__menu-backdrop, .tgmobile__menu .close-btn').on('click', function () {
		if (menuTimeline) {
			// Reverse the timeline animation
			menuTimeline.reverse();

			// Remove the menu visibility class after reverse animation completes
			menuTimeline.eventCallback("onReverseComplete", () => {
				$('body').removeClass('mobile-menu-visible');
			});
		} else {
			$('body').removeClass('mobile-menu-visible');
		}
	});
}


/*=============================================
=    Sidebar List      =
=============================================*/
// $(".sidebarmenu_open").on("click", function () {
// 	$(".sidebarmenu-wrapper, .body-overlay").addClass("active");
// 	return false;
// });
// $(".sidebarmenu_close, .body-overlay").on("click", function () {
// 	$(".sidebarmenu-wrapper, .body-overlay").removeClass("active");
// });


// // Menu search Active
// $(".searchBoxToggler").on("click", function () {
// 	$(".popup-search-box, .body-overlay").addClass("active");
// 	return false;
// });
// $(".searchClose, .body-overlay").on("click", function () {
// 	$(".popup-search-box, .body-overlay").removeClass("active");
// });

function toggleClassHandler(triggerSelector, targetSelector, action) {
    $(triggerSelector).on("click", function () {
        $(targetSelector).toggleClass("active", action);
        return false;
    });
}

// Sidebar Menu Open & Close
toggleClassHandler(".sidebarmenu_open", ".sidebarmenu-wrapper, .quick-view-modal, .body-overlay", true);
toggleClassHandler(".sidebarmenu_close, .body-overlay", ".sidebarmenu-wrapper, .quick-view-modal, .body-overlay", false);

// Search Box Open & Close
toggleClassHandler(".searchBoxToggler", ".popup-search-box, .body-overlay", true);
toggleClassHandler(".searchClose, .body-overlay", ".popup-search-box, .body-overlay", false);


/*=============================================
	=           Counter             =
=============================================*/
$.fn.countdown = function () {
    $(this).each(function () {
        var $counter = $(this);
        var offerDateStr = $counter.data("offer-date");
        var countDownDate = new Date(offerDateStr).getTime(); // Proper date parsing

        var exprireCls = "expired";

        function updateCounter() {
            var now = new Date().getTime();
            var distance = countDownDate - now;

            if (distance < 0) {
                clearInterval(timer);
                $counter.addClass(exprireCls);
                $counter.find(".message").css("display", "block");
                return;
            }

            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Always 2 digits
            $counter.find(".day").html(days.toString().padStart(2, "0"));
            $counter.find(".hour").html(hours.toString().padStart(2, "0"));
            $counter.find(".minute").html(minutes.toString().padStart(2, "0"));
            $counter.find(".seconds").html(seconds.toString().padStart(2, "0"));
        }

        // Initial call
        updateCounter();

        // Update every second
        var timer = setInterval(updateCounter, 1000);
    });
};

if ($(".counter-list").length) {
    $(".counter-list").countdown();
}

/*=============================================
	=           Data Background             =
=============================================*/
$("[data-background]").each(function () {
	$(this).css("background-image", "url(" + $(this).attr("data-background") + ")")
})
$("[data-bg-color]").each(function () {
    $(this).css("background-color", $(this).attr("data-bg-color"));
});

$("[data-text-color]").each(function () {
    $(this).css("color", $(this).attr("data-text-color"));
});

/*=============================================
	=           Data Mask Src             =
=============================================*/
if ($('[data-mask-src]').length > 0) {
    $('[data-mask-src]').each(function () {
      var mask = $(this).attr('data-mask-src');
      $(this).css({
        'mask-image': 'url(' + mask + ')',
        '-webkit-mask-image': 'url(' + mask + ')'
      });
      $(this).addClass('bg-mask');
      $(this).removeAttr('data-mask-src');
    });
};



// ========================================================= Portfolio showcase
$(document).ready(function () {
    $(".porfolio2-single-item").hover(function () {
        // Sibling der theke 'active' class remove korbe
        $(this).siblings(".porfolio2-single-item").removeClass("active");
        
        // Nijer moddhe 'active' class add korbe
        $(this).addClass("active");
    });
});


/************lettering js***********/
function injector(t, splitter, klass, after) {
    var a = t.text().split(splitter),
        inject = "";
    if (a.length) {
        $(a).each(function (i, item) {
            inject +=
                '<span class="' +
                klass +
                (i + 1) +
                '">' +
                item +
                "</span>" +
                after;
        });
        t.empty().append(inject);
    }
}

var methods = {
    init: function () {
        return this.each(function () {
            injector($(this), "", "char", "");
        });
    },

    words: function () {
        return this.each(function () {
            injector($(this), " ", "word", " ");
        });
    },

    lines: function () {
        return this.each(function () {
            var r = "eefec303079ad17405c889e092e105b0";
            // Because it's hard to split a <br/> tag consistently across browsers,
            // (*ahem* IE *ahem*), we replaces all <br/> instances with an md5 hash
            // (of the word "split").  If you're trying to use this plugin on that
            // md5 hash string, it will fail because you're being ridiculous.
            injector(
                $(this).children("br").replaceWith(r).end(),
                r,
                "line",
                ""
            );
        });
    },
};

$.fn.lettering = function (method) {
    // Method calling logic
    if (method && methods[method]) {
        return methods[method].apply(this, [].slice.call(arguments, 1));
    } else if (method === "letters" || !method) {
        return methods.init.apply(this, [].slice.call(arguments, 0)); // always pass an array
    }
    $.error("Method " + method + " does not exist on jQuery.lettering");
    return this;
};

$(".logo-animation").lettering();


/*===========================================
	=     Menu sticky & Scroll to top      =
=============================================*/
$(window).on('scroll', function () {
	var scroll = $(window).scrollTop();
	if (scroll < 245) {
		$("#sticky-header").removeClass("sticky-menu");
		$('.scroll-to-target').removeClass('open');
        $("#header-fixed-height").removeClass("active-height");

	} else {
		$("#sticky-header").addClass("sticky-menu");
		$('.scroll-to-target').addClass('open');
        $("#header-fixed-height").addClass("active-height");
	}
});


/*=============================================
	=    		 Scroll Up  	         =
=============================================*/
if ($('.scroll-to-target').length) {
  $(".scroll-to-target").on('click', function () {
    var target = $(this).attr('data-target');
    // animate
    $('html, body').animate({
      scrollTop: $(target).offset().top
    }, 1000);

  });
}


/*=============================================
    =          Swiper active              =
=============================================*/
$('.tg-swiper__slider').each(function () {
    var thmSwiperSlider = $(this);
    var settings = $(this).data('swiper-options');

    // Store references to the navigation and pagination elements
    var prevArrow = thmSwiperSlider.find('.slider-prev');
    var nextArrow = thmSwiperSlider.find('.slider-next');
    var paginationEl = thmSwiperSlider.find('.slider-pagination');
    var customPaginationEl = thmSwiperSlider.find('.slider-pagination2'); // Custom number pagination container

    var autoplayCondition = settings['autoplay'];

    var sliderDefault = { 
        slidesPerView: 1,
        spaceBetween: settings['spaceBetween'] ? settings['spaceBetween'] : 24,
        loop: settings['loop'] === false ? false : true,
        speed: settings['speed'] ? settings['speed'] : 1000,
        autoplay: autoplayCondition ? autoplayCondition : { delay: 6000, disableOnInteraction: false },
        navigation: {
            nextEl: nextArrow.get(0),
            prevEl: prevArrow.get(0),  
        },
        pagination: {
            el: paginationEl.get(0),
            clickable: true,
            renderBullet: function (index, className) {
                return '<span class="' + className + '" aria-label="Go to Slide ' + (index + 1) + '"></span>';
            },
        },
        on: {
            init: function () {
                updateFractionPagination(this); // Update fraction pagination on init
                updateCustomNumberPagination(this, customPaginationEl); // Update custom number pagination on init
            },
            slideChange: function () {
                updateFractionPagination(this); // Update fraction pagination on slide change
                updateCustomNumberPagination(this, customPaginationEl); // Update custom number pagination on slide change
            }
        },
    };

    var options = JSON.parse(thmSwiperSlider.attr('data-swiper-options'));
    options = $.extend({}, sliderDefault, options);
    var swiper = new Swiper(thmSwiperSlider.get(0), options); // Assign the swiper variable

    if ($('.slider-area').length > 0) {
        $('.slider-area').closest(".container").parent().addClass("arrow-wrap");
    }
});

// Function to update fraction pagination
function updateFractionPagination(swiper) {
    var current = swiper.realIndex + 1; // realIndex gives the current slide
    var total = swiper.slides.length - swiper.loopedSlides * 2; // Adjust for looped slides
    var paginationElement = swiper.pagination.el;

    // Update fraction pagination with current/total
    $(paginationElement).find('.fraction-pagination').html(current + ' / ' + total);
}

// Function to update custom number pagination with leading zeros
function updateCustomNumberPagination(swiper, customPaginationEl) {
    var current = swiper.realIndex + 1; // Get the current slide index
    var total = swiper.slides.length - swiper.loopedSlides * 0; // Adjust for looped slides

    // Create custom pagination HTML with leading zeros
    var customPaginationHTML = '';
    for (var i = 1; i <= total; i++) {
        var isActive = i === current ? 'active' : ''; // Highlight the current slide
        var formattedNumber = i.toString().padStart(2, '0'); // Add leading zero
        customPaginationHTML += `<span class="custom-page ${isActive}" data-slide="${i}">${formattedNumber}</span>`;
    }

    // Update the custom pagination element
    customPaginationEl.html(customPaginationHTML);

    // Add click event to custom pagination numbers
    customPaginationEl.find('.custom-page').on('click', function () {
        var targetSlide = $(this).data('slide') - 1; // Convert to zero-based index
        swiper.slideToLoop(targetSlide); // Slide to the target index (adjust for loop)
    });
}

// Function to add animation classes
function animationProperties() {
    $('[data-ani]').each(function () {
        var animationName = $(this).data('ani');
        $(this).addClass(animationName);
    });

    $('[data-ani-delay]').each(function () {
        var delayTime = $(this).data('ani-delay');
        $(this).css('animation-delay', delayTime);
    });
}
animationProperties();

// Add click event handlers for external slider arrows based on data attributes
$('[data-slider-prev], [data-slider-next]').on('click', function () {
    var sliderSelector = $(this).data('slider-prev') || $(this).data('slider-next');
    var targetSlider = $(sliderSelector);

    if (targetSlider.length) {
        var swiper = targetSlider[0].swiper;

        if (swiper) {
            if ($(this).data('slider-prev')) {
                swiper.slidePrev(); 
            } else {
                swiper.slideNext(); 
            }
        }
    }
});

/*=============================================
	=    		Magnific Popup		      =
=============================================*/
$('.popup-image').magnificPopup({
	type: 'image',
	gallery: {
		enabled: true
	}
});

/* magnificPopup video view */
$('.popup-video').magnificPopup({
	type: 'iframe'
});


/*=============================================
	=    		 Wow Active  	         =
=============================================*/
function wowAnimation() {
	var wow = new WOW({
		boxClass: 'wow',
		animateClass: 'animated',
		offset: 0,
		mobile: false,
		live: true
	});
	wow.init();
}

/*=============================================
	=           Aos Active       =
=============================================*/
function aosAnimation() {
	AOS.init({
		duration: 1000,
		mirror: true,
		once: true,
		disable: 'mobile',
	});
}

/*=============================================
	=           Counter Number       =
=============================================*/
$(".counter-number").counterUp({
	delay: 10,
	time: 1000,
});

/*=============================================
	=           Progress Counter       =
=============================================*/
$('.progress-bar').waypoint(function() {
	$('.progress-bar').css({
	animation: "animate-positive 1.8s",
	opacity: "1"
	});
}, { offset: '100%' });


/*=============================================
	=           Masonary Active       =
=============================================*/
$(".masonary-active").imagesLoaded(function () {
    var $filter = ".masonary-active",
        $filterItem = ".filter-item",
        $filterMenu = ".filter-menu-active";

    if ($($filter).length > 0) {
        var $grid = $($filter).isotope({
            itemSelector: $filterItem,
            filter: "*",
            masonry: {
                // use outer width of grid-sizer for columnWidth
                columnWidth: 1,
            },
        });

        // filter items on button click
        $($filterMenu).on("click", "button", function () {
            var filterValue = $(this).attr("data-filter");
            $grid.isotope({
                filter: filterValue,
            });
        });

        // Menu Active Class
        $($filterMenu).on("click", "button", function (event) {
            event.preventDefault();
            $(this).addClass("active");
            $(this).siblings(".active").removeClass("active");
        });
    }
});

/*=============================================
	=           Add active class       =
=============================================*/
$('.industries-dropdown').on('click', function () {
  // sob theke active class remove kore dibe
  $('.industries-dropdown').removeClass('active');

  // jei div e click kora hoise shekhane active class add korbe
  $(this).addClass('active');
});


/*=============================================
	=           Date Time Picker       =
=============================================*/
// Only Date Picker
$('.date-pick').datetimepicker({
    timepicker: false,
    datepicker: true,
    format: 'd-m-y',
    step: 10
});

    // Only Time Picker
$('.time-pick').datetimepicker({
    datepicker:false,
    format:'H:i',
    step:30
});

    // Date Time
$('.date-time-pick').datetimepicker({
        
});


// Demo Section Cursor Animation ================================

$(document).ready(function () {
    let $secCursorParent = $('.demo-wrapper');
    let $secCursor = $('.demo-link a');

    $secCursorParent.on('mousemove', function (e) {
        let rect = this.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        gsap.to($secCursor, {
            left: x,
            top: y,
            duration: 0.2,
            ease: "power2.out",
            transform: "translate(-50%, -50%)"
        });
    });

    $secCursorParent.on('mouseleave', function () {
        gsap.to($secCursor, {
            left: "50%",
            top: "50%",
            duration: 0.5,
            ease: "power3.out",
            transform: "translate(-50%, -50%)"
        });
    });
});


/*=============================================
	=           Price Slider       =
=============================================*/
$(".price_slider").slider({
    range: true,
    min: 75,
    max: 3500,
    values: [75, 3500],
    slide: function (event, ui) {
        $(".from").text("$" + ui.values[0]);
        $(".to").text("$" + ui.values[1]);
    },
});
$(".from").text("$" + $(".price_slider").slider("values", 0));
$(".to").text("$" + $(".price_slider").slider("values", 1));

/**----- Gallery Active class -----*/
$(".single-inventory-item").on("mouseenter", function () {
    $(".single-inventory-item").removeClass("active"); 
    $(this).addClass("active");
});
    

/*=============================================
	=           Smooth Scroll       =
=============================================*/
// gsap.registerPlugin(ScrollTrigger);

// const lenisScroll = new Lenis({
//   lerp: 0.07
// });

// lenisScroll.on('scroll', ScrollTrigger.update);

// gsap.ticker.add((time)=>{
//   lenisScroll.raf(time * 1000)
// })

/*=============================================
	=           Image paralax       =
=============================================*/
gsap.registerPlugin(ScrollTrigger);  

gsap.utils.toArray(".parallax-container").forEach(function(container) {
    let image = container.querySelector("img");
  
    let tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          scrub: true,
          pin: false,
        },
      }); 
      tl.from(image, {
        yPercent: -15,
        ease: "none",
      }).to(image, {
        yPercent: 15,
        ease: "none",
      }); 
  });

/*=============================================
	=           Gsap text Animation       =
=============================================*/
if ($('.text-anim').length) {
    let staggerAmount = 0.05,
        translateXValue = 20,
        delayValue = 0.5,
        easeType = "power2.out",
        animatedTextElements = document.querySelectorAll('.text-anim');

    animatedTextElements.forEach((element) => {
        let animationSplitText = new SplitText(element, {
            type: "chars, words"
        });
        gsap.from(animationSplitText.chars, {
            duration: 1,
            delay: delayValue,
            x: translateXValue,
            autoAlpha: 0,
            stagger: staggerAmount,
            ease: easeType,
            scrollTrigger: {
                trigger: element,
                start: "top 85%"
            },
        });
    });
}

if ($('.text-anim2').length) {				
    let	 staggerAmount 		= 0.03,
         translateXValue	= 20,
         delayValue 		= 0.05,
         easeType 			= "power2.out",
         animatedTextElements = document.querySelectorAll('.text-anim2');
    
    animatedTextElements.forEach((element) => {
        let animationSplitText = new SplitText(element, { type: "chars, words" });
            gsap.from(animationSplitText.chars, {
                duration: 1,
                delay: delayValue,
                x: translateXValue,
                autoAlpha: 0,
                stagger: staggerAmount,
                ease: easeType,
                scrollTrigger: { trigger: element, start: "top 85%"},
            });
    });		
}

/*=============================================
	=    		pricing Active  	       =
=============================================*/
  $(document).ready(function () {
    let count = parseInt($('#quantity').text());

    $('#increase').click(function () {
      count++;
      $('#quantity').text(count);
    });

    $('#decrease').click(function () {
      if (count > 1) {
        count--;
        $('#quantity').text(count);
      }
    });
  });


/*=============================================
	=    		pricing Active  	       =
=============================================*/
$(".pricing-tab-switcher, .tab-btn").on("click", function () {
	$(".pricing-tab-switcher, .tab-btn").toggleClass("active"),
	$(".pricing-tab").toggleClass("seleceted"),
	$(".pricing-price, .pricing-price-two").toggleClass("change-subs-duration");
});
/*=============================================
	=    		Btn push span 	       =
=============================================*/


// Array of class selectors where effect apply hobe
const targetClasses = ['.btn'];

// Loop through each selector
targetClasses.forEach(function (selector) {
    $(selector).each(function () {
        // jodi .btn-five or .no-span na thake, tokhon span add hobe
        if (
        !$(this).hasClass('btn-five') &&
        !$(this).hasClass('no-span') &&
        $(this).find('span').length === 0
        ) {
        for (let i = 0; i < 4; i++) {
            $(this).append('<span></span>');
        }
        }
    });
});

})(jQuery);