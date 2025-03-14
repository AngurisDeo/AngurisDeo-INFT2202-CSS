"use strict";


(function (){
    if(!sessionStorage.getItem("user")){
        console.warn("[AUTHGUARD] Unauthorized access detected. Redirecting to login page.");
        location.hash = "/login";
    }
})();