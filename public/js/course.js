function trans(element, rate) {
    var parent = element;
    while (!parent.classList.contains('container')) {
        parent = parent.parentElement;
    }
    var difference = window.pageYOffset - parent.offsetTop;
    if (difference > -500) {
        var velocity = difference * rate;
        element.style.transform = 'translate3d(0px, ' + velocity + 'px,0px)';
    }

};
window.addEventListener('scroll', function (e) {
    var scrolled = window.pageYOffset;

    try {
        var elements = document.querySelectorAll('.scroll-vertical-up-1');
        for (var i = 0; i < elements.length; i++) {
            trans(elements[i], -0.1);
        }

    } catch (error) {

    }
    try {
        var elements = document.querySelectorAll('.scroll-vertical-up-2');
        for (var i = 0; i < elements.length; i++) {
            trans(elements[i], -0.2);
        }

    } catch (error) {

    }
    try {
        var elements = document.querySelectorAll('.scroll-vertical-up-3');
        for (var i = 0; i < elements.length; i++) {
            trans(elements[i], -0.3);
        }

    } catch (error) {

    }
    try {
        var elements = document.querySelectorAll('.scroll-vertical-up-4');
        for (var i = 0; i < elements.length; i++) {
            trans(elements[i], -0.4);
        }

    } catch (error) {

    }
    try {
        var elements = document.querySelectorAll('.scroll-vertical-up-5');
        for (var i = 0; i < elements.length; i++) {
            trans(elements[i], -0.5);
        }

    } catch (error) {

    }

});
