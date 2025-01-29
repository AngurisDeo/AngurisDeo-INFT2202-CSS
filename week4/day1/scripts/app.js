"use strict";

<<<<<<< HEAD
<<<<<<< HEAD
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
=======
//IIFE - Immediately Invoked Functional Expression
(function () {

=======
//IIFE - Immediately Invoked Functional Expression
(function () {

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

>>>>>>> d7da9da (week4\day1)
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
<<<<<<< HEAD
                        let contact = new Contact();
=======
                        let contact = new core.Contact();
>>>>>>> d7da9da (week4\day1)
                        contact.deserialize(contactData);
                        data += `<tr>
                                    <th scope="row" class="text-center">${index}</th>
                                    <td>${contact.fullName}</td>
                                    <td>${contact.contactNumber}</td>
                                    <td>${contact.emailAddress}</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                 </tr>`;
<<<<<<< HEAD

=======
                        index++;
>>>>>>> d7da9da (week4\day1)

                    }catch(error){
                        console.error("Error de-serializing contact data", error);
                    }



                }else{
                    console.warn(`Skipping on-contact key: ${key}`);
                }
            }
            contactList.innerHTML = data;
        }
    }

    function DisplayHomePage(){
        console.log("Called DisplayHomePage() ... ");


        let aboutUsBtn = document.getElementById("AboutUsBtn");
<<<<<<< HEAD
        aboutUsBtn.addEventListener("click", function(){
            location.href = "about.html";
        });

        let MainContent = document.getElementsByTagName("main")[0];
        //<p id="MainParagraph" class="mt-3">This is my first paragraph</p>
        let MainParagraph = document.createElement("p");
        MainParagraph.setAttribute("id", "MainParagraph");
        MainParagraph.setAttribute("class", "mt-3");
        MainParagraph.textContent = "This is my first paragraph";

        //Attach to the dom
        MainContent.appendChild(MainParagraph);

        let FirstString = "This is";
        let SecondString = `${FirstString} is my second paragraph`;
        MainParagraph.textContent = SecondString;

        //Attach to the dom
        MainContent.appendChild(MainParagraph);

        let DocumentBody = document.body;
        //<article><p></p></article>
        let Article = document.createElement("article");
        let ArticleParagraph = `<p id="ArticleParagraph" class="mt-3">This is my article paragraph</p>`;
        Article.setAttribute("class", "container");
        Article.innerHTML = ArticleParagraph;
        DocumentBody.appendChild(Article);




=======
        aboutUsBtn.addEventListener("click", () => {
            location.href = "about.html";
        });

        DisplayWeather();

        document.querySelector("main").insertAdjacentHTML(
            "beforeend",
            `<p id="MainParagraph" class="mt-5">This is my first paragraph</p>`
        );

        document.body.insertAdjacentHTML(
            "beforeend",
            `<article class="container">
                    <p id="ArticleParagraph" class=mt-3">This is my article paragraph</p>
                  </article>`
        );
>>>>>>> d7da9da (week4\day1)
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

        sendButton.addEventListener("click", function(){

            if(subscribeCheckbox.checked)
            {
<<<<<<< HEAD
                let contact = new Contact(fullName.value, contactNumber.value, emailAddress.value);
=======
                let contact = new core.Contact(fullName.value, contactNumber.value, emailAddress.value);
>>>>>>> d7da9da (week4\day1)
                if(contact.serialize())
                {
                    let key = `contact_${Date.now()}`;
                    localStorage.setItem(key, contact.serialize());
                }

            }

        });

    }

<<<<<<< HEAD
    function Start(){
        console.log("Start App...");
=======
    function Start()
    {
        console.log("Start App...");
        console.log(`Current document title is ${document.title}`);
>>>>>>> d7da9da (week4\day1)


        switch(document.title){
            case "Home":
                DisplayHomePage();
                break;
            case "About":
                DisplayAboutPage();
                break;
            case "Products":
                DisplayProductsPage();
                break;
            case "Services":
                DisplayServicesPage();
                break;
            case "Contact":
                DisplayContactPage();
                break;
            case "Contact List":
                DisplayContactListPage();
                break;
<<<<<<< HEAD
        }

    }
    window.addEventListener("load", Start);

})()
>>>>>>> a6e38a7 (week3)
=======
            default:
                console.error("No matching case for page title");
        }

    }
    window.addEventListener("DOMContentLoaded", () => {
        console.log("DOM is fully loaded and parsed");
        Start();
    });

})()
>>>>>>> d7da9da (week4\day1)
