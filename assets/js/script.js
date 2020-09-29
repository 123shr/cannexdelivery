/* global initMap:true, Cookies, gMapStyles:true */

initMap = false;

(function (fn) {
    if (typeof jQuery === 'undefined') {
        throw 'Requires jQuery to be loaded first';
    }
    fn(jQuery, Cookies);
}(function ($, Cookies) {
    "use strict";

    var $body = $('body'),
        resizeTimeout,
        resizeDelay = function(){
            if (resizeTimeout){
                clearTimeout(resizeTimeout);
            }
            resizeTimeout = setTimeout(function(){
                $(window).trigger('resize').trigger('scroll');
                resizeTimeout = null;
            }, 50);
        };


    // Age verification buttons
    var ageCoookie = 'ageVerification';
    $('[data-role="age-yes"]').on('click', function(e){
        e.preventDefault();
        Cookies.set(ageCoookie, 'yes');
        $('.age-popup').removeClass('show');
    });
    $('[data-role="age-no"]').on('click', function(){
        e.preventDefault();
        Cookies.set(ageCoookie, 'no');
        var redirect = $(this).data('redirectUrl');
        if (redirect){
            window.location.href = redirect;
        }
        return;
    });

    // Page load
    // hide loader and after remove it
    function hideLoader(){
        $(window).off('load.loader');
        $('.page-loader').fadeOut(500, function(){
            $(this).remove();
        });
        if (Cookies.get(ageCoookie) === 'yes'){
            $('.age-popup').addClass('disabled');
        } else {
            $('.age-popup').addClass('show');
        }
    }
    $(window).on('load.loader', function () {
        hideLoader();
    });
    // if page is not loaded in ~10 seconds - display content as it is
    setTimeout(hideLoader, 10000);

    // Calculate progressbar width
    $('[data-bar]').each(function(i, el){
        var $el = $(el),
            value = parseFloat(parseFloat($el.attr('aria-valuenow') / $el.attr('aria-valuemax'))) * 100;
        if (value < 0){
            value = 0;
        } else if (value > 100){
            value = 100;
        }
        $el.css('width', value + '%');
    });

    // Toggle main navigation
    $('.navbar-toggler').on('click', function(e){
        e.preventDefault();
        $(this).toggleClass('active')
            .closest('header').toggleClass('active');
    });

    // Toggle sub navigation
    $('[data-role="nav-toggler"], .nav-arrow').on('click', function(e){
        e.preventDefault();
        $(this).parent().toggleClass('active');
    });

    // Toggle extra navigation
    $('[data-role="nav-self-toggle"]').on('click', function(e){
        e.preventDefault();
        $(this).toggleClass('active');
    });

    // Scroll Top
    var checkScroll = function(){
        if ( $(window).scrollTop() > 0 ) {
            $('.scroll-top').removeClass('disabled');
            if( (window.innerHeight + window.scrollY) >= document.body.offsetHeight ){
                $('.scroll-top').addClass('end');
            }else{
                $('.scroll-top').removeClass('end');
            }
        }else{
            $('.scroll-top').addClass('disabled');
        }
    };
    checkScroll();
    $(window).on('scroll resize orientationchange focus', checkScroll);
    $('.scroll-top').on('click', function(e){
        e.preventDefault();
        $('html, body').animate({
            scrollTop: 0
        }, 1000);
    });

    // Checkbox
    $('.form-check .form-check-icon').on('click', function(i, el){
        var $field = $(this).closest('.form-check').find('input.form-check-input'),
            value = $field.attr('type') === 'radio' ? true : !$field.prop('checked');
        $field.prop('checked', value);
    });


    // Accordions
    $('[data-role="accordion-item"]').each(function(i, el){
        var $el = $(el);
        $el.find('[data-role="accordion-toggle"]').on('click', function(e){
            e.preventDefault();
            var $list = $el.closest('[data-role="accordion-list"]'),
                $active = $list.find('[data-role="accordion-item"]').not($el);
            $active.removeClass('active');
            $el.addClass('active');
            $list.trigger('resize');
            setTimeout(function(){
                resizeDelay();
            }, 2000);
        });
    });
    $('[data-role="accordion-list"]').each(function(i, el){
        var $el = $(el),
            resizeFn = function(){
                var active = $el.find('.active[data-role="accordion-item"] [data-role="accordion-content"]');
                if (active.length){
                    active = active[0];
                    $el.css('minHeight', Math.max(active.clientHeight, active.offsetHeight, active.scrollHeight));
                } else {
                    $el.css('minHeight', '');
                }
            };
        $el.on('resize', resizeFn);
        $(window).on('resize', resizeFn);
        $el.find('[src]').on('load', resizeFn);
        resizeFn();
    });

    // Put positions, i.e. for pointers on contact us dots map
    $('[data-left]').each(function(i, el){
        $(el).css('left', $(el).data('left'));
    });
    $('[data-top]').each(function(i, el){
        $(el).css('top', $(el).data('top'));
    });
    
    // Svg loader
    $('[data-svg]').each(function(i, el){
        var $el = $(el);
        $el.load($el.data('svg'), null, resizeDelay);
    });

    // Background image
    $('[data-background]').each(function (i, el){
        var $el = $(el);
        $el.css('backgroundImage', "url(" + $el.data('background') + ")" );
    });

    // Slick banner
    $('[data-slider="top-main"]').each(function(i, el){
        var $el = $(el);
        $el.find('.slick-slides').slick({
            infinite: true,
            dots : false,
            arrows : false,
            asNavFor : '[data-slider="top-thumb"] .slick-slides'
        });
    });

    $('[data-slider="top-side-dots"]').each(function(i, el){
        var $el = $(el);
        $el.find('.slick-slides').slick({
            infinite: true,
            dots : true,
            arrows : false
        });
    });

    // Slick banner thumb
    $('[data-slider="top-thumb"]').each(function(i, el){
        var $el = $(el);
        $el.find('.slick-slides').slick({
            slidesToShow : 3,
            centerPadding : 0,
            centerMode: true,
            infinite: true,
            dots : false,
            arrows : true,
            focusOnSelect : true,
            swipeToSlide : true,
            nextArrow : $el.find('.slick-arrow-next'),
            prevArrow : $el.find('.slick-arrow-prev'),
            asNavFor : '[data-slider="top-main"] .slick-slides',
            responsive : [
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow : 3
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow : 2
                    }
                },
                {
                    breakpoint: 576,
                    settings: {
                        slidesToShow : 1
                    }
                }
            ]
        });
    });

    // Slick images carousel
    $('[data-slider="images-carousel"]').each(function(i, el){
        var $el = $(el);
        $el.find('.slick-slides').slick({
            slidesToShow : 4,
            infinite: true,
            dots : false,
            arrows : true,
            swipeToSlide : true,
            nextArrow : $el.find('.slick-arrow-next'),
            prevArrow : $el.find('.slick-arrow-prev'),
            responsive : [
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow : 3
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow : 2
                    }
                },
                {
                    breakpoint: 576,
                    settings: {
                        slidesToShow : 1
                    }
                }
            ]
        });
    });

    // Slick quick products
    $('[data-slider="quick-products"]').each(function(i, el){
        var $el = $(el);
        $el.find('.slick-slides').slick({
            slidesToShow : 3,
            infinite: true,
            dots : false,
            arrows : true,
            focusOnSelect : true,
            swipeToSlide : true,
            nextArrow : $el.find('.slick-arrow-next'),
            prevArrow : $el.find('.slick-arrow-prev'),
            responsive : [
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow : 2
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow : 1
                    }
                }
            ]
        });
    });

    // Slick testimonials
    $('[data-slider="testimonials"]').each(function(i, el){
        var $el = $(el);
        $el.find('.slick-slides').slick({
            slidesToShow : 3,
            infinite: true,
            dots : false,
            arrows : true,
            focusOnSelect : true,
            swipeToSlide : true,
            nextArrow : $el.find('.slick-arrow-next'),
            prevArrow : $el.find('.slick-arrow-prev'),
            responsive : [
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow : 2
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow : 1
                    }
                }
            ]
        });
    });

    $('[data-role="fill-line"]').each(function(i, el){
        var $line = $(el),
            $segments = $line.find('> [data-role="fill-line-segment"]'),
            $auto = $([]),
            leftPerc = 100,
            minLeft = 100,
            width = $line.width(),
            segmentWidth
        ;
        $segments.each(function(i, segment){
            var $segment = $(segment),
                data = $segment.data(),
                minWidth = data.hasOwnProperty('minWidth') ? data.minWidth : 0
            ;
            if (data.hasOwnProperty('width')){
                segmentWidth = data.width;
                var maxWidth = data.hasOwnProperty('maxWidth') ? data.maxWidth : 100;
                if (width < data.minWidth){
                    width = data.minWidth;
                }
                if (width > data.maxWidth){
                    width = data.maxWidth;
                }
                leftPerc -= width;
                $segment.width(width + '%');
            } else {
                $auto = $auto.add($segment);
                minLeft -= minWidth;
            }
        });
        $auto.each(function(i, segment){
            var $segment = $(segment),
                data = $segment.data(),
                maxWidth = data.hasOwnProperty('maxWidth') ? data.maxWidth : 100,
                minWidth = data.hasOwnProperty('minWidth') ? data.minWidth : 0,
                preffered = data.hasOwnProperty('prefferedWidth') ? data.prefferedWidth : data.minWidth + (data.maxWidth - data.minWidth) / 2,
                perc
            ;
            maxWidth = Math.min(maxWidth, preffered, minLeft, leftPerc);
            if (maxWidth <= minWidth){
                segmentWidth = minWidth;
            } else {
                segmentWidth = Math.random() * (maxWidth - minWidth) + minWidth;
            }
            leftPerc -= segmentWidth;
            $segment.width(segmentWidth + '%');
        });

        if (leftPerc > 0){
            $segments.last().width((segmentWidth + leftPerc) + '%');
        }
    });

    // Spin field value
    $('.input-spin').each(function(i, el){
        var $el = $(el),
            $field = $el.find('.form-control'),
            $decEl = $el.find('.input-decrement'),
            $incEl = $el.find('.input-increment'),
            fn = function (val){
                var fieldVal = parseInt($field.val()),
                    min = parseInt($field.attr('min')),
                    max = parseInt($field.attr('max'))
                ;
                if (val) {
                    fieldVal = isNaN(fieldVal) ? 0 : fieldVal + val;
                    $field.val(fieldVal);
                }
                if( !isNaN(min) && fieldVal <= min ){
                    $decEl.addClass('disabled');
                    $field.val(min);
                } else {
                    $decEl.removeClass('disabled');
                }
                if( !isNaN(max) && fieldVal >= max ){
                    $incEl.addClass('disabled');
                    $field.val(max);
                } else {
                    $incEl.removeClass('disabled');
                }
            }
        ;
        fn();
        $field.on('blur', function() {
            fn();
        });
        $decEl.on('click', function (){
            fn(-1);
        });
        $incEl.on('click', function (){
            fn(1);
        });
    });

    // Shuffle
    $('.shuffle-js').each(function(i, el){
        var $el = $(el),
            $shuffle = $(el).find('.shuffle-items'),
            shuffleInstance = new Shuffle($shuffle[0], {
                itemSelector: '.shuffle-item'
            }),
            $filters = $el.find("[data-filter]")
        ;
        $filters.on('click', function(e){
            e.preventDefault();
            $el.find('.shuffle-empty').css('display', 'none');
            var filter,
                $filter = $(this)
            ;
            try{
                filter = JSON.parse($filter.data('filter'));
            }catch(exc){
                filter = $filter.data('filter');
            }
            $filters.removeClass('active');
            $filter.addClass('active');
            shuffleInstance.filter(filter);
        });
        shuffleInstance.on(Shuffle.EventType.LAYOUT, function () {
            $(window).trigger('resize');
            $el.find('.shuffle-empty').css('display', shuffleInstance.visibleItems ? 'none' : 'block' );
        });
    });

    // File field
    $('.form-control-file').each(function(i, el){
        var $el = $(el);
        // show file name in text input
        $el.on('change.fileField', function(){
                var $wrap = $(this).closest('.input-group-file'),
                    $control = $wrap.find('.form-control')
                ;
                $control.val(this.value ? this.value : $control.attr('data-value-current') || '');
            })
            .triggerHandler('change.fileField')
        ;

        var $form = $el.closest('form');
        if( $form.length ){
            $form
                .data('fileFields', ($form.data('fileFields') || $([])).add($el) )
                .off('.fileFields')
                .on('reset.fileFields', function(){
                    var $el = $(this);
                    setTimeout(function(){
                        $el.data('fileFields').each(function(i, field){
                            $(field).triggerHandler('change.fileField');
                        });
                    });
                })
            ;
        }

        // add on click events to show file selection window
        $el.closest('.input-group-file').find('.form-control, .form-control-file-btn').on('click', function(e){
            e.preventDefault();
            $el.trigger('click');
        });
    });

    /*
        Preview field
        IE 10 and above, and modern browsers
        Show preview image, if it's image file upload
    */
    if (typeof(FileReader) !== 'undefined') {
        $('.file-preview').each(function(i, el){
            var $root = $(el),
                reader = false,
                $input = $(el).closest('.form-group-preview').find('.form-control-file');

            if( $root.find('.file-preview-image img') ){
                $root.addClass('has-file');
            }

            // add on click events to show file selection window
            $root.on('click', function(e){
                e.preventDefault();
                $input.trigger('click');
            });

            reader = new FileReader();
            
            reader.onloadstart = function(){
                $root.removeClass('has-file'); //Hide old image
            };
            reader.onload = function (e) {
                //Show new image
                $root.find('.file-preview-image')
                    .empty()
                    .html('<img src="' + e.target.result + '" alt="" />');
                $root.addClass('has-file');
            };
            
            // Set change event, unset any previous
            $input.on('change.imageField', function(){
                var files = this.files ? this.files : this.currentTarget.files;
                if( files.length ){
                    reader.readAsDataURL( files[0] );
                }else{
                    $root
                        .removeClass('has-file')
                        .find('.file-preview-image').empty()
                    ;
                }
                
            });

            var $form = $root.closest('form');
            if( $form.length ){
                $form
                    .data('imageFields', ($form.data('imageFields') || $([])).add($input) )
                    .off('.imageFields')
                    .on('reset.imageFields', function(){
                        var $formEl = $(this);
                        setTimeout(function(){
                            $formEl.data('imageFields').each(function(i, field){
                                $(field).find('input[type="file"]').triggerHandler('change.imageField');
                            });
                        });
                    })
                ;
            }
        });
    }

    // Accordion
    $('[data-theme-accordion] .entity-expand-head').on('click', function(e) {
        e.preventDefault();
        var $block = $(this).closest('[data-theme-accordion]');
        var name = $block.data('themeAccordion');
        $('.active[data-theme-accordion="' + name + '"]').not($block).removeClass('active');
        $block.toggleClass('active');
    });

    gMapStyles = typeof gMapStyles === 'undefined' ? {} : gMapStyles;

    /* Google Maps */
    initMap = function (){
        var gmapType = {};
        // Create a new StyledMapType object, passing it an array of styles,
        // and the name to be displayed on the map type control.
        $.each(gMapStyles, function(name, settings) {
            gmapType[name] = new google.maps.StyledMapType(settings.styles, settings.options);
        });

        // Create a map object, and include the MapTypeId to add
        // to the map type control.
        $('.gmap').each(function(i, el){
            var $el = $(el),
                data = $el.data(),
                mark = {lat: data.lat, lng: data.lng},
                centredAt = 768,
                center = {lat: data.centerLat || mark.lat, lng: data.centerLng || mark.lng},
                map = new google.maps.Map(el, {
                    center: $(window).width() >= centredAt ? center : mark, // map center position
                    zoom: data.zoom || 15,
                    scrollwheel: false,
                    zoomControl: true,
                    zoomControlOptions: {
                      position: google.maps.ControlPosition.LEFT_CENTER
                    },
                    streetViewControl: true,
                    streetViewControlOptions: {
                      position: google.maps.ControlPosition.LEFT_BOTTOM
                    },
                    mapTypeControlOptions: {
                        mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain', 'styled_map']
                    }
                }),
                styleName = data.mapStyle && gmapType[data.mapStyle] ? data.mapStyle : 'default',
                styledMapType = gmapType[styleName] ? gmapType[styleName] : false;

            new google.maps.Marker({
              position: mark,
              map: map,
              icon: data.marker || "./assets/images/parts/map-marker.png"
            });

            // Associate the styled map with the MapTypeId and set it to display.
            if (styledMapType) {
                map.mapTypes.set(styleName, styledMapType);
                map.setMapTypeId(styleName);
            }
            // Center map on resize
            $(window).on('resize', function(){
                google.maps.event.trigger(map, 'resize');
                map.setCenter($(window).width() >= centredAt ? center : mark);
            });
        });
    };
}));