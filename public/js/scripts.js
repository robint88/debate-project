const navSlide = function(){
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');




// Toggle nav
burger.addEventListener('click', function(){
    nav.classList.toggle("nav-active");
    // Animate links
    navLinks.forEach((link, index)=>{
        if(link.style.animation){
            link.style.animation = ``;
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index/7 + 1}s`
        }
    });
    burger.classList.toggle('burgertoggle')
    });
}

navSlide();

// CAROUSEL FUNCTIONS

const carouselSlide = document.querySelector('.carousel-slide');
const carouselImages = document.querySelectorAll('.carousel-slide a');
// Buttons
const prevButton = document.querySelector('#p-btn');
const nextButton = document.querySelector('#n-btn');
// Counter
let counter = 1;
const size = carouselImages[0].clientWidth;

// carouselSlide.style.transform = 'translateX(' + (-size * counter) + 'px)';

// button listeners
nextButton.addEventListener('click', function(){
    if(counter >= carouselImages.length-1) return;
    carouselSlide.style.transition = "transform 0.4s ease-in-out";
    counter++;
    carouselSlide.style.transform = 'translateX(' + (-size * counter) + 'px)';
});
prevButton.addEventListener('click', function(){
    if(counter <=0) return;
    carouselSlide.style.transition = "transform 0.4s ease-in-out";
    counter--;
    carouselSlide.style.transform = 'translateX(' + (-size * counter) + 'px)';
});

// carouselSlide.addEventListener('transitionend', function(){
//     if(carouselImages[counter].id === 'last-clone'){
//         carouselSlide.style.transition = 'none';
//         counter = carouselImages.length - 2;
//         carouselSlide.style.transform = 'translateX(' + (-size * counter) + 'px)';
//     }
//     if(carouselImages[counter].id === 'first-clone'){
//         carouselSlide.style.transition = 'none';
//         counter = carouselImages.length - counter;
//         carouselSlide.style.transform = 'translateX(' + (-size * counter) + 'px)';
//     }
// });
