"use strict";

import {Router} from "./router.js";
import {LoadHeader} from "./header.js";
import {LoadFooter} from "./footer.js";
import {AuthGuard} from "./authguard.js";
import {Contact} from "./contact.js";

const pageTitle: Record<string, string> = {
    "/" : "Home Page",
    "/home" : "Home Page",
    "/about" : "About Page",
    "/products" : "Our Products",
    "/services" : "Our Services",
    "/contact" : "Contact",
    "/contact-list" : "Contact List",
    "/edit" : "Edit Contact",
    "/login" : "Login Page",
    "/register" : "Register",
    "/404" : "Page Not Found"
}

const routes = {

  "/" : "views/pages/home.html",
  "/home" : "views/pages/home.html",
  "/about" : "views/pages/about.html",
  "/products" : "views/pages/products.html",
  "/services" : "views/pages/services.html",
  "/contact" : "views/pages/contact.html",
  "/contact-list" : "views/pages/contact-list.html",
  "/edit" : "views/pages/edit.html",
  "/login" : "views/pages/login.html",
  "/register" : "views/pages/register.html",
  "/404" : "views/pages/404.html"
};

const router = new Router(routes);

//IIFE - Immediately Invoked Functional Expression
(function () {

    function DisplayRegisterPage(){
        console.log("[INFO] DisplayRegisterPage() called...");
    }


    function DisplayLoginPage(){
        console.log("[INFO] DisplayLoginPage() called...");

        if (sessionStorage.getItem("user")){
            router.navigate("/contact-list");
            return;
        }

        const messageArea = document.getElementById("messageArea") as HTMLElement;
        const loginButton = document.getElementById("loginButton") as HTMLButtonElement;
        const cancelButton = document.getElementById("cancelButton") as HTMLButtonElement;
        const loginForm = document.getElementById("loginForm") as HTMLFormElement;

        if(!loginButton){
            console.error("[ERROR] loginButton not found in the DOM...");
            return;
        }

        loginButton.addEventListener("click", async (event ) => {
            event.preventDefault();
            console.log("[DEBUG] Login button clicked");

            const username = (document.getElementById("username") as HTMLInputElement).value.trim();
            const password = (document.getElementById("password") as HTMLInputElement).value.trim();

            try {

                const response = await fetch("data/users.json");

                if(!response.ok) {
                    throw new Error(`HTTP error Status: ${response.statusText}`);
                }

                const jsonData = await response.json();
                const users = jsonData.users;


                if(!Array.isArray(users)){
                    throw new Error("[ERROR] JSON data does not contain a valid data users array");
                }

                let success = false;
                let authenticatedUser = null;

                for(const user of users){
                    if(user.Username === username && user.Password === password){
                        success = true;
                        authenticatedUser = user;
                        break;
                    }
                }

                if(success){
                    sessionStorage.setItem("user", JSON.stringify( {
                        DisplayName: authenticatedUser.DisplayName,
                        EmailAddress: authenticatedUser.EmailAddress,
                        Username: authenticatedUser.Username
                    }));

                    messageArea.style.display = "none";
                    messageArea.classList.remove("alert", "alert-danger");

                    LoadHeader().then(() => {
                        router.navigate("/contact-list");
                    });

                }else{
                    messageArea.style.display = "block";
                    messageArea.classList.add("alert", "alert-danger");
                    messageArea.textContent = "Invalid username or password. Please try again";

                    (document.getElementById("username") as HTMLInputElement).focus();
                    (document.getElementById("username") as HTMLInputElement).select();
                }

            }catch(error) {
                console.error("[ERROR] Failure to login", error);
            }

        });

        if(cancelButton && loginForm) {
            cancelButton.addEventListener("click", (event ) => {
                loginForm.reset();
                router.navigate("/home");
            });
        }

    }




    function handleCancelClick(){
        router.navigate("/contact-list");
    }

    function handleEditClick(event:Event, contact:any, page:string):void {
        // prevent default form submission
        event.preventDefault();

        if (!validateForm()){
            alert("Form contains errors. Please correct them before submitting");
            return;
        }


        //retrieve values from form input
        const fullName = (document.getElementById("fullName") as HTMLInputElement).value;
        const contactNumber = (document.getElementById("contactNumber") as HTMLInputElement).value;
        const emailAddress = (document.getElementById("emailAddress") as HTMLInputElement).value;

        //update contact
        contact.fullName = fullName;
        contact.contactNumber = contactNumber;
        contact.emailAddress = emailAddress;

        //Save the updated contact data with new values
        localStorage.setItem(page, contact.serialize());

        //redirect
        router.navigate("/contact-list");
    }


    function handleAddClick(event:Event): void {
        // prevent default form submission
        event.preventDefault();

        if (!validateForm()){
            alert("Form contains errors. Please correct them before submitting");
            return;
        }


        //retrieve values from form input
        const fullName = (document.getElementById("fullName") as HTMLInputElement).value;
        const contactNumber = (document.getElementById("contactNumber") as HTMLInputElement).value;
        const emailAddress = (document.getElementById("emailAddress") as HTMLInputElement).value;

        AddContact(fullName, contactNumber, emailAddress);

        //redirect
        router.navigate("/contact-list");

    }

    function attachValidationListeners(){
        console.log("[INFO] attaching validation listeners...");

        Object.keys(VALIDATION_RULES).forEach((fieldID) => {

            const field = document.getElementById(fieldID);

            if(!field){
                console.warn(`[WARN] field '${fieldID}' not found. Skipping listener attachment`);
                return;
            }

            addEventListenersOnce(fieldID, "input", () => validateInput(fieldID))

        });
    }

    function addEventListenersOnce(elementId:string, event:string, handler:EventListener){

        const element = document.getElementById(elementId);

        if (element){
            // remove any existing event listener before attempting to modify
            element.removeEventListener(event, handler);

            element.addEventListener(event, handler);
        }else{
            console.warn(`[WARN] element with Id '${elementId}' not found`);
        }
    }

    function validateForm():boolean{
        return(
            validateInput("fullName") &&
                validateInput("contactNumber") &&
                validateInput("emailAddress")
        );
    }

    function validateInput(fieldID:string):boolean{
        const field = document.getElementById(fieldID) as HTMLInputElement;
        const errorElement = document.getElementById(`${fieldID}-error`) as HTMLElement;
        const rule = VALIDATION_RULES[fieldID];

        if (!field || !errorElement || !rule) {
            console.warn(`[WARN] Validation rule not found for: ${fieldID}`);
            return false;
        }

        if (field.value.trim() === "") {
            errorElement.textContent = "The field is required";
            errorElement.style.display = "block";
            errorElement.style.marginLeft = "5px"
            return false;
        }

        if(!rule.regex.test(field.value)){
            errorElement.textContent = rule.errorMessage;
            errorElement.style.display = "block";
            errorElement.style.marginLeft = "5px"
            return false;
        }

        errorElement.textContent = "";
        errorElement.style.display = "none";
        return true;
    }

    const VALIDATION_RULES: { [key:string]: {regex:RegExp;  errorMessage:string}}  = {
        fullName: {
            regex: /^[A-Za-z\s]+$/,      // allows for only letters and spaces
            errorMessage: "Full name must only contain letters and spaces."
        },
        contactNumber: {
            regex: /^\d{3}-\d{3}-\d{4}$/,
            errorMessage: "Contact Number must be in format ###-###-####"
        },
        emailAddress: {
            regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            errorMessage: "Email address must be a valid email address"
        }


    }

    function AddContact(fullName:string, contactNumber:string, emailAddress:string){
        console.log("[DEBUG] AddContact() triggered.")

        if(!validateForm()){
            alert("Form contains errors. Please correct them before submitting");
            return;
        }

        let contact = new Contact(fullName, contactNumber, emailAddress);
        const serializedContact = contact.serialize();
        if(serializedContact)
        {
            let key = `contact_${Date.now()}`;
            localStorage.setItem(key, serializedContact);
            console.log(`[INFO] contact added ${key} `);
        }else{
            console.error("[ERROR] contact serialization failed");
        }

        router.navigate("/contact-list");
    }

    //HERE
    function DisplayEditPage() {
        console.log("DisplayEditPage called...");

        const page = location.hash.split("#")[2];
        console.log("HERE: " + page);
        const editButton = document.getElementById("editButton");


        switch (page) {
            case "add": {
                //Update the browser and titles
                document.title = "Add Contact";
                document.querySelector("main > h1").textContent = "Add Contact";

                if (editButton) {
                    editButton.innerHTML = `<i class="fa-solid fa-user-plus"></i>Add Contact`;
                    editButton.classList.remove("btn-primary");
                    editButton.classList.add("btn-success");

                    //attach the event listeners
                    addEventListenersOnce("editButton", "click", handleAddClick);
                    addEventListenersOnce("cancelButton", "click", handleCancelClick);

                    break;
                }
            }
            default: {
                // Edit a existing contact
                const contact = new core.Contact();
                const contactData = localStorage.getItem(page);

                //Reconstructed the contact form localStorage
                if (contactData) {
                    contact.deserialize(contactData);
                }

                //repopulate form fields with existing contact details
                document.getElementById("fullName").value = contact.fullName;
                document.getElementById("contactNumber").value = contact.contactNumber;
                document.getElementById("emailAddress").value = contact.emailAddress;

                if (editButton) {
                    editButton.innerHTML = `<i class="fa-solid fa-user-plus"></i>Edit Contact`;
                    editButton.classList.remove("btn-success");
                    editButton.classList.add("btn-primary");

                    //attach the event listeners
                    addEventListenersOnce("editButton", "click",
                        (event) => handleEditClick(event, contact, page));
                    addEventListenersOnce("cancelButton", "click", handleCancelClick);
                }
                break;
            }
        }
    }

    async function DisplayWeather(){
        const apiKey = "c6a945e0f9d8bb8019299c3a5c1eac78";
        const city = "Oshawa";
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        try {

            const response = await fetch(url);

            if(!response.ok){
                throw new Error("Failed to fetch weather data");
            }


            const data = await response.json();
            console.log("Weather API response: ", data);

            const weatherDataElement = document.getElementById("weather-data");

            weatherDataElement.innerHTML = `<strong>City: </strong> ${data.name}<br>
                                            <strong>Temperature: </strong> ${data.main.temp} °C<br>
                                            <strong>Weather: </strong> ${data.weather[0].description}<br>`

        } catch (error) {

            console.error("Error fetching weather data", error);
            document.getElementById("weather-data").textContent = "Unable to fetch weather data at this time";
        }

    }

    function DisplayContactListPage(){
        console.log("Called DisplayContactListPage() ...");

        if(localStorage.length > 0){

            let contactList = document.getElementById("contactList");
            let data = "";

            let keys = Object.keys(localStorage);

            let index = 1;
            for(const key of keys){

                if(key.startsWith("contact_")){

                    let contactData = localStorage.getItem(key);

                    try{
                        //console.log(contactData);
                        let contact = new core.Contact();
                        contact.deserialize(contactData);
                        data += `<tr>
                                    <th scope="row" class="text-center">${index}</th>
                                    <td>${contact.fullName}</td>
                                    <td>${contact.contactNumber}</td>
                                    <td>${contact.emailAddress}</td>
                                    <td class="text-center">
                                        <button value="${key}" class="btn btn-warning btn-sm edit">
                                        <i class="fa-solid fa-pen-to-square"></i> Edit</button>
                                    </td>
                                    <td class="text-center">
                                        <button value="${key}" class="btn btn-danger btn-sm delete">
                                        <i class="fa-solid fa-trash"></i> Delete</button>
                                    </td>
                                 </tr>`;
                        index++;

                    }catch(error){
                        console.error("Error de-serializing contact data", error);
                    }
                }else{
                    console.warn(`Skipping on-contact key: ${key}`);
                }
            }
            contactList.innerHTML = data;
        }
        const addButton = document.getElementById("addButton");
        addButton.addEventListener("click", (e) => {
            router.navigate("/edit#add")
        });


        const deleteButtons = document.querySelectorAll("button.delete");
        deleteButtons.forEach(button => {
            button.addEventListener("click", function () {

                const contactKey = this.value;
                console.log(`[DEBUG] Deleting Contact Id: ${contactKey}`);

                if(!contactKey.startsWith("contact_")){
                    console.error("[ERROR] Invalid contact key format")
                    return;
                }

                if(confirm("Delete contact, please confirm.")){
                    localStorage.removeItem(contactKey);
                    DisplayContactListPage();
                }

            });
        });

        const editButtons = document.querySelectorAll("button.edit");
        editButtons.forEach(button => {
            button.addEventListener("click", function () {
                router.navigate(`/edit#${this.value}`);
            });
        });


    }

    function DisplayHomePage(){
        console.log("Called DisplayHomePage() ... ");

        const main = document.querySelector("main");
        main.innerHTML = "";

        main.insertAdjacentHTML(
            "beforeend",
                `   
                <h1> Welcome to our site</h1> 
                <button id="AboutUsBtn" class="mb-5">About Us</button>
                
                <div id="weather" class="mt-5">
                    <h3>Weather Information</h3>
                    <p id="weather-data">Fetching weather data</p>
                </div>
                
                <p id="MainParagraph" class="mt-5">This is my main paragraph</p>

                <article class="container">
                    <p id="ArticleParagraph" class="mt-3">This is my article paragraph</p>
                </article>
                `
        );


        const aboutUsBtn = document.getElementById("AboutUsBtn");
        aboutUsBtn.addEventListener("click", () => {
            router.navigate("/about");
        });

        DisplayWeather();

    }

    function DisplayAboutPage(){
        console.log("Called DisplayAboutPage() ... ");
    }

    function DisplayProductsPage(){
        console.log("Called DisplayProductsPage() ... ");
    }

    function DisplayServicesPage(){
        console.log("Called DisplayServicesPage() ... ");
    }

    function DisplayContactPage(){
        console.log("Called DisplayContactPage() ... ");

        let sendButton = document.getElementById("sendButton");
        let subscribeCheckbox = document.getElementById("subscribeCheckbox");

        sendButton.addEventListener("click", function(event){
            event.preventDefault();

            if(!validateForm()) {
                alert("Please fix errors before submitting.")
                return;
            }

            if(subscribeCheckbox.checked)
            {
               AddContact(
                   document.getElementById("fullName").value,
                   document.getElementById("contactNumber").value,
                   document.getElementById("emailAddress").value
               )
            }
            alert("Form successfully submitted");
        });

        const contactListButton = document.getElementById("showContactList");
        contactListButton.addEventListener("click", function (event) {
            event.preventDefault();
            router.navigate("/contact-list");
        });

    }

    document.addEventListener("routeLoaded", (event) => {
       const newPath = event.detail;
       console.log(`[INFO] New Route Loaded: ${newPath}`);
       LoadHeader().then(() => {
           handlePageLogic(newPath);
       });
    });

    function handlePageLogic(path){

        document.title = pageTitle[path] || "Untitled Page";

        const protectedRoutes = ["/contact-list", "/edit"]
        if (protectedRoutes.includes(path)){
            AuthGuard();
        }

        switch(path){
            case "/":
            case "/home":
                DisplayHomePage();
                break;
            case "/about":
                DisplayAboutPage();
                break;
            case "/products":
                DisplayProductsPage();
                break;
            case "/services":
                DisplayServicesPage();
                break;
            case "/contact":
                DisplayContactPage();
                attachValidationListeners();
                break;
            case "/contact-list":
                DisplayContactListPage();
                break;
            case "/edit":
                DisplayEditPage();
                attachValidationListeners();
                break;
            case "/login":
                DisplayLoginPage();
                break;
            case "/register":
                DisplayRegisterPage();
                break;
            default:
                console.error(`[WARNING] No page logic matching for path: ${path}`);
        }
    }

    async function Start()
    {
        console.log("Start App...");

        //LoadHeader first, then LoadFooter
         await LoadHeader();
         await LoadFooter();
         AuthGuard();

         const currentPath = location.hash.slice(1) || "/";
         router.loadRoute(currentPath);
         handlePageLogic(currentPath);
    }

    window.addEventListener("DOMContentLoaded", () => {
        console.log("DOM is fully loaded and parsed");
        Start();
    });

})()