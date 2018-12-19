(() => {
    
    let imageElems = [].slice.call(document.querySelectorAll("#teardrop-slideshow img"));

    let loadImageIfNeeded = function(index) {
        if (!imageElems[index]) {
            return;
        }
        
        if (!imageElems[index].src) {
            // console.log("Loading src for index " + index)
            imageElems[index].src = imageElems[index].dataset.src;
        }
    }


    let slides = [].slice.call(document.querySelectorAll('#teardrop-slideshow .slide'));
    let currentSlide = 0;

    let nextSlide = () => {
        setSlide((currentSlide + 1) % slides.length);
    }

    let slideTimeMs = 2000;
    let slideInterval = setInterval(nextSlide, slideTimeMs);

    let scheduleSlideAdvance = () => {
        slideInterval = setInterval(nextSlide, slideTimeMs);
    };

    let setSlide = function(index) {
        slides[currentSlide].className = 'slide';
        currentSlide = +index;
        slides[currentSlide].className = 'slide showing';
        loadImageIfNeeded(currentSlide);
        loadImageIfNeeded((currentSlide + 1) % slides.length);
        document.querySelector('input.slideshowSlider').value = currentSlide;

        console.log("setSlide: Switched to slide " + index);

        clearInterval(slideInterval);
        if (!isPaused) {
            scheduleSlideAdvance();
        }
    }

    let isPaused = false;
    let pause = function() {
        clearInterval(slideInterval);
        isPaused = true;
    }
    let resume = function() {
        scheduleSlideAdvance();
        isPaused = false;
    }

    let pauseButton = document.querySelector('.playpause');
    pauseButton.onclick = (e) => {
        
        console.log("PlayPause clicked", e);
        if (isPaused) {
            pauseButton.innerHTML = `<div class="icon is-medium"><i class="fas fa-fw fa-lg fa-pause"></i></div>`;
            resume();
            return;
        } else {
            pauseButton.innerHTML = `<div class="icon is-medium"><i class="fas fa-fw fa-lg fa-play"></i></div>`;
            pause();
            return;
        }
    }

    document.querySelector('#teardrop-slideshow .left').onclick = (e) => {
        console.log("Move left clicked");
        let nSlide = currentSlide - 1;
        if (nSlide < 0) { nSlide = slides.length - 1;}
        setSlide(nSlide);
    }

    document.querySelector('#teardrop-slideshow .right').onclick = (e) => {
        console.log("Move right clicked")
        nextSlide();
    }

    document.querySelector('input.slideshowSlider').oninput = (e) => {

        if (e.target.value !== currentSlide) {
            console.log("Slider: switching to: " + e.target.value);
            setSlide(e.target.value);
        }
    }

    window['onOverlayClosed'] = function() {
        pause();
    }

})();