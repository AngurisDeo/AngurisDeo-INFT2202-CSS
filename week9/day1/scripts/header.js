"use strict";

/**
 * Dynamically loads the header from the header.html into the current page
 * @returns {Promise} Resolves when the header is successfully loaded
 */
export function LoadHeader(){
    console.log("[INFO] LoadHeader() called...");

    return fetch("./views/components/header.html")
        .then(response => response.text())
        .then(data => {
            document.querySelector('header').innerHTML = data;
            updateActiveNavLink();
        })
        .catch (error => console.log("[ERROR] Unable to load header ", error));
}

/**
 * Update the navigation bar to highlight the current active page
 */
export function updateActiveNavLink(){
    console.log("[INFO] UpdateActiveNavLink() called...");

    //current page loaded in browser
    const currentPath = location.hash.slice(1) || "/";
    const navLinks = document.querySelectorAll("nav a");

    navLinks.forEach(link => {

        // remove hash symbol
        const linkPath  = link.getAttribute("href").replace("#", "");
        if (currentPath === linkPath) {
            link.classList.add("active");
        }else{
            link.classList.remove("active");
        }
    });


}
