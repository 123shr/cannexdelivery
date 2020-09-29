var triggerPoint = document.getElementById("object-trigger-point");
var objectAnimated = document.getElementById("object-animated");
var trigger = triggerPoint.offsetTop;



window.onscroll = function () { animate() };
function animate() {
    if (window.pageYOffset > trigger + 350) {
        objectAnimated.classList.add("triggered");
    } else if (window.pageYOffset < trigger + 400) {
        objectAnimated.classList.remove("triggered");
    }
}