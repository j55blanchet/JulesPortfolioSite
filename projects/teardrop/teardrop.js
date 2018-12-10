
let imageElems = [].slice.call(document.querySelectorAll("#teardrop-slideshow img"));

let loadImageIfNeeded = function(index) {
    if (!imageElems[index]) {
        return;
    }
    
    if (!imageElems[index].src) {
        console.log("Loading src for index " + index)
        imageElems[index].src = imageElems[index].dataset.src;
    }
}


let slides = [].slice.call(document.querySelectorAll('#teardrop-slideshow .slide'));
let currentSlide = 0;

let nextSlide = function() {
    setSlide((currentSlide+1)%slides.length);
}

let slideInterval = setInterval(nextSlide, 2000);

let setSlide = function(index) {
    slides[currentSlide].className = 'slide';
    currentSlide = index;
    slides[currentSlide].className = 'slide showing';
    loadImageIfNeeded(currentSlide);
    loadImageIfNeeded(currentSlide + 1 % slides.length);
    document.querySelector('input.slideshowSlider').value = currentSlide;
}

document.querySelector('input.slideshowSlider').oninput = (e) => {

    if (e.target.value !== currentSlide) {
        setSlide(e.target.value);
    }
}