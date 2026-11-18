// Dropdown Handler

// DOM elements
const navlinks = document.getElementById("navlinks");
const darkener = document.getElementById("darkener");
const navbar = document.getElementById("navbar");


function toggleHiddenElements() {
    navlinks?.classList.toggle("hidden");
    darkener?.classList.toggle("hidden");
    console.log('d');
}

function setHiddenElements() {
navlinks?.classList.add("hidden");
    darkener?.classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
    //set default classes
    setHiddenElements();

    navbar?.addEventListener('click', toggleHiddenElements)
})


