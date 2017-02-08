jQuery(document).ready(function($){
    //set animation timing
    var animationDelay = 2500,
    //loading bar effect
        barAnimationDelay = 3800,
        barWaiting = barAnimationDelay - 3000, //3000 is the duration of the transition on the loading bar - set in the scss/css file
    //letters effect
        lettersDelay = 50,
    //type effect
        typeLettersDelay = 150,
        selectionDuration = 500,
        typeAnimationDelay = selectionDuration + 800,
    //clip effect
        revealDuration = 600,
        revealAnimationDelay = 1500;

    initHeadline();


    function initHeadline() {
        //insert <i> element for each letter of a changing word
        singleLetters($('.cd-headline.letters').find('b'));
        //initialise headline animation
        animateHeadline($('.cd-headline'));
    }

    function singleLetters($words) {
        $words.each(function(){
            var word = $(this),
                letters = word.text().split(''),
                selected = word.hasClass('is-visible');
            for (i in letters) {
                if(word.parents('.rotate-2').length > 0) letters[i] = '<em>' + letters[i] + '</em>';
                letters[i] = (selected) ? '<i class="in">' + letters[i] + '</i>': '<i>' + letters[i] + '</i>';
            }
            var newLetters = letters.join('');
            word.html(newLetters).css('opacity', 1);
        });
    }

    function animateHeadline($headlines) {
        var duration = animationDelay;
        $headlines.each(function(){
            var headline = $(this);

            if(headline.hasClass('loading-bar')) {
                duration = barAnimationDelay;
                setTimeout(function(){ headline.find('.cd-words-wrapper').addClass('is-loading') }, barWaiting);
            } else if (headline.hasClass('clip')){
                var spanWrapper = headline.find('.cd-words-wrapper'),
                    newWidth = spanWrapper.width() + 10
                spanWrapper.css('width', newWidth);
            } else if (!headline.hasClass('type') ) {
                //assign to .cd-words-wrapper the width of its longest word
                var words = headline.find('.cd-words-wrapper b'),
                    width = 0;
                words.each(function(){
                    var wordWidth = $(this).width();
                    if (wordWidth > width) width = wordWidth;
                });
                headline.find('.cd-words-wrapper').css('width', width);
            };

            //trigger animation
            setTimeout(function(){ hideWord( headline.find('.is-visible').eq(0) ) }, duration);
        });
    }

    function hideWord($word) {
        var nextWord = takeNext($word);

        if($word.parents('.cd-headline').hasClass('type')) {
            var parentSpan = $word.parent('.cd-words-wrapper');
            parentSpan.addClass('selected').removeClass('waiting');
            setTimeout(function(){
                parentSpan.removeClass('selected');
                $word.removeClass('is-visible').addClass('is-hidden').children('i').removeClass('in').addClass('out');
            }, selectionDuration);
            setTimeout(function(){ showWord(nextWord, typeLettersDelay) }, typeAnimationDelay);

        } else if($word.parents('.cd-headline').hasClass('letters')) {
            var bool = ($word.children('i').length >= nextWord.children('i').length) ? true : false;
            hideLetter($word.find('i').eq(0), $word, bool, lettersDelay);
            showLetter(nextWord.find('i').eq(0), nextWord, bool, lettersDelay);

        }  else if($word.parents('.cd-headline').hasClass('clip')) {
            $word.parents('.cd-words-wrapper').animate({ width : '2px' }, revealDuration, function(){
                switchWord($word, nextWord);
                showWord(nextWord);
            });

        } else if ($word.parents('.cd-headline').hasClass('loading-bar')){
            $word.parents('.cd-words-wrapper').removeClass('is-loading');
            switchWord($word, nextWord);
            setTimeout(function(){ hideWord(nextWord) }, barAnimationDelay);
            setTimeout(function(){ $word.parents('.cd-words-wrapper').addClass('is-loading') }, barWaiting);

        } else {
            switchWord($word, nextWord);
            setTimeout(function(){ hideWord(nextWord) }, animationDelay);
        }
    }

    function showWord($word, $duration) {
        if($word.parents('.cd-headline').hasClass('type')) {
            showLetter($word.find('i').eq(0), $word, false, $duration);
            $word.addClass('is-visible').removeClass('is-hidden');

        }  else if($word.parents('.cd-headline').hasClass('clip')) {
            $word.parents('.cd-words-wrapper').animate({ 'width' : $word.width() + 10 }, revealDuration, function(){
                setTimeout(function(){ hideWord($word) }, revealAnimationDelay);
            });
        }
    }

    function hideLetter($letter, $word, $bool, $duration) {
        $letter.removeClass('in').addClass('out');

        if(!$letter.is(':last-child')) {
            setTimeout(function(){ hideLetter($letter.next(), $word, $bool, $duration); }, $duration);
        } else if($bool) {
            setTimeout(function(){ hideWord(takeNext($word)) }, animationDelay);
        }

        if($letter.is(':last-child') && $('html').hasClass('no-csstransitions')) {
            var nextWord = takeNext($word);
            switchWord($word, nextWord);
        }
    }

    function showLetter($letter, $word, $bool, $duration) {
        $letter.addClass('in').removeClass('out');

        if(!$letter.is(':last-child')) {
            setTimeout(function(){ showLetter($letter.next(), $word, $bool, $duration); }, $duration);
        } else {
            if($word.parents('.cd-headline').hasClass('type')) { setTimeout(function(){ $word.parents('.cd-words-wrapper').addClass('waiting'); }, 200);}
            if(!$bool) { setTimeout(function(){ hideWord($word) }, animationDelay) }
        }
    }

    function takeNext($word) {
        return (!$word.is(':last-child')) ? $word.next() : $word.parent().children().eq(0);
    }

    function takePrev($word) {
        return (!$word.is(':first-child')) ? $word.prev() : $word.parent().children().last();
    }

    function switchWord($oldWord, $newWord) {
        $oldWord.removeClass('is-visible').addClass('is-hidden');
        $newWord.removeClass('is-hidden').addClass('is-visible');
    }
});





















(function() {
    //wrap our existing svg and store elements to be animated
    var animatingSvg = Snap('#cd-animated-svg'),
        loadingSvg = animatingSvg.select('#cd-loading'),
        playBtn = animatingSvg.select('#cd-play-btn'),
        pauseBtn = animatingSvg.select('#cd-pause-btn'),
        loadingCircle = animatingSvg.select('#cd-loading-circle-filled'),
        buildingBase1 = animatingSvg.select('#cd-home-1-base'),
        buildingDoor1 = animatingSvg.select('#cd-home-1-door'),
        buildingRoof1 = animatingSvg.select('#cd-home-1-roof'),
        buildingWindow1 = animatingSvg.select('#cd-home-1-window'),
        buildingChimney = animatingSvg.select('#cd-home-1-chimney'),
        buildingBase2 = animatingSvg.select('#cd-home-2-base'),
        buildingDoor2 = animatingSvg.select('#cd-home-2-door'),
        buildingRoof2 = animatingSvg.select('#cd-home-2-roof'),
        buildingWindow2 = animatingSvg.select('#cd-home-2-window'),
        buildingBase3 = animatingSvg.select('#cd-home-3-base'),
        buildingRoof3 = animatingSvg.select('#cd-home-3-roof'),
        buildingWindow3 = animatingSvg.select('#cd-home-3-window'),
        floor = animatingSvg.select('#cd-floor'),
        clouds1 = animatingSvg.select('#cd-cloud-1'),
        clouds2 = animatingSvg.select('#cd-cloud-2');

    //circumf will be used to animate the loadingCircle
    var circumf = Math.PI*(loadingCircle.attr('r')*2);
    //this variable will be used to store the loadingCircle animation object
    var globalAnimation;

    initLoading();
    //detect the click on the play btn and start the animation
    playBtn.click(function(){
        loadingSvg.addClass('play-is-clicked');
        //scale down play btn
        playBtn.animate({'transform': 's0 0'}, 200, mina.easeinout);
        //scale up pause btn
        pauseBtn.animate({'transform': 's1 1'}, 200, mina.easeinout);

        var strokeOffset = loadingCircle.attr('stroke-dashoffset').replace('px', '');
        //animate strokeOffeset desn't work with circle element - we need to use Snap.animate() rather than loadingCircle.animate()
        globalAnimation = Snap.animate(strokeOffset, '0', function( value ){
                loadingCircle.attr({ 'stroke-dashoffset': value })
            }, (strokeOffset/circumf)*1500, mina.easein, function(){
                loadingSvg.addClass('fade-out');
                setTimeout(function(){
                    animateFloor();
                }, 300);
            }
        );
    });

    //detect the click on the pause btn and stop the animation
    pauseBtn.click(function(){
        //pause the animation on the loadingCircle
        globalAnimation.stop();
        loadingSvg.removeClass('play-is-clicked');
        //scale up play btn
        playBtn.animate({'transform': 's1 1'}, 200, mina.easeinout);
        //scale down pause btn
        pauseBtn.animate({'transform': 's0 0'}, 200, mina.easeinout);
    });

    function initLoading() {
        loadingCircle.attr({
            'stroke-dasharray': circumf+' '+circumf,
            'stroke-dashoffset': circumf,
        });
    }

    function animateFloor() {
        floor.animate({'x2': floor.attr('data-x')}, 400, mina.easeinout, animateBuildings);
    }

    function animateBuildings() {
        buildingBase1.animate({'height': buildingBase1.attr('data-height')}, 800, mina.elastic);
        setTimeout(function(){
            buildingBase2.animate({'height': buildingBase2.attr('data-height')}, 800, mina.elastic);
        }, 100);
        setTimeout(function(){
            buildingBase3.animate({'height': buildingBase3.attr('data-height')}, 800, mina.elastic, function(){
                animateRoofs();
                animateDoors();
            });
        }, 200);
    }

    function animateRoofs() {
        buildingRoof1.animate({'width': buildingRoof1.attr('data-width')}, 300, mina.easeinout);
        setTimeout(function(){
            buildingRoof2.animate({'width': buildingRoof2.attr('data-width')}, 300, mina.easeinout);
        }, 100);
    }

    function animateDoors() {
        buildingDoor1.animate({'height': buildingDoor1.attr('data-height')}, 300, mina.easeinout);
        setTimeout(function(){
            buildingDoor2.animate({'height': buildingDoor2.attr('data-height')}, 300, mina.easeinout, function(){
                animateWindows();
            });
        }, 100);
    }

    function animateWindows() {
        buildingWindow1.animate({transform: 's1 1'}, 400, mina.easeinout);
        setTimeout(function(){
            buildingWindow2.animate({transform: 's1 1'}, 400, mina.easeinout);
        }, 100);
        setTimeout(function(){
            buildingWindow3.animate({transform: 's1 1'}, 400, mina.easeinout, function(){
                animateChimneies();
            });
        }, 200);
    }

    function animateChimneies() {
        buildingChimney.attr('visibility', 'visible').animate({'transform': 't0 0'}, 800, mina.elastic);
        setTimeout(function(){
            buildingRoof3.attr('visibility', 'visible').animate({'transform': 't0 0'}, 1000, mina.elastic, function(){
                showClouds();
            });
        }, 100);
    }

    function showClouds() {
        clouds1.animate({transform: 't210 0'}, 12000);
        clouds2.animate({transform: 't-210 0'}, 12000, function() {
            hideClouds();
        });
    }

    function hideClouds() {
        clouds1.animate({transform: 't-80 0'}, 12000);
        clouds2.animate({transform: 't70 0'}, 12000, function() {
            //this way the animation will be infinite
            showClouds();
        });
    }
})();
