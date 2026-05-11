document.addEventListener("DOMContentLoaded", function () {
    var shrinkHeader = 40;
    var header = document.querySelector(".header-container");

    if (!header) {
        return;
    }

    function updateHeaderBorder() {
        if (window.pageYOffset >= shrinkHeader) {
            header.classList.add("border-bottom");
        } else {
            header.classList.remove("border-bottom");
        }
    }

    window.addEventListener("scroll", updateHeaderBorder);
    updateHeaderBorder();
});
