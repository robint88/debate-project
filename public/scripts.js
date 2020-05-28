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