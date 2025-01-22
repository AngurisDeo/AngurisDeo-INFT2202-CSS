"use strict";

(function() {
    function  DisplayHomepage(){
        console.log("Display Homepage");
        let AboutBt = document.getElementById("AboutBtn");
        AboutBt.addEventListener("click", function() {
            location.href = "about.html";
        });

    }
    function  Displaycontact(){
    }
    function  Displayservices(){
    }
    function  Displayabout(){
    }
    function Start(){
        console.log("App started!");


        switch (document.title.toLowerCase()) {
            case "home":
                DisplayHomepage();
                break;
            case "contact":
                Displaycontact();
                break;
            case "services":
                Displayservices();
                break;
            case "about":
                Displayabout();
                break;
        }


    }
    window.addEventListener("load", Start);
})();
