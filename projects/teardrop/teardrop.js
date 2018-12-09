
let sliderChanged = function(newIndex) {
    console.log("Slideshow index changed", newIndex);
    switchToRealImage(newIndex)
    switchToRealImage(newIndex + 1)

    document.querySelector('input.slideshowSlider').value = newIndex;
}

let imageElems = [].slice.call(document.querySelectorAll(".slideshow img"));

let switchToRealImage = function(index) {
    if (!imageElems[index]) {
        return;
    }
    
    if (!imageElems[index].src) {
        console.log("Loading src for index " + index)
        imageElems[index].src = imageElems[index].dataset.src;
    }
}

let slider = simpleslider.getSlider({
    onChange: sliderChanged,
    init: 100,
    show: 0,
    end: -100,
    unit: '%',
});
switchToRealImage(0);
switchToRealImage(1);
console.log("Created simple slider", slider);

document.querySelector('input.slideshowSlider').oninput = (e) => {
    if (e.target.value !== slider.currentIndex()) {
        slider.change(e.target.value);
        console.log('User changed slideshow toggle');
    }
}