"use strict";

//IIFE - Immediately Invoked Functional Expression
(function () {

    async function DisplayWeather(){
        const apiKey ="9c39df935818422cbd3c634931559964";
        const city = "Bowmanville";
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        try{
            const response = await fetch(url);

            if(!response.ok){
                throw new Error("Failed to fetch weather data");
            }

            const data = await response.json();
            console.log("weather API response", data);

            const weatherDataElement = document.getElementById("weather-data");

            weatherDataElement.innerHTML = `<strong>City: </strong> ${data.name}<br>
                                        <strong>Temperature: </strong> ${data.main.temp}<br>
                                        <strong>Weather: </strong> ${data.weather[0].description}<br>`;

        }catch(error){
            console.log("Error fetching weather data", error);
            document.getElementById("weather-data").textContent = "unable to fetch weather data at this time";
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
                                    <td></td>
                                    <td></td>
                                    <td></td>
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
    }

    function DisplayHomePage(){
        console.log("Called DisplayHomePage() ... ");


        let aboutUsBtn = document.getElementById("AboutUsBtn");
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
                let contact = new core.Contact(fullName.value, contactNumber.value, emailAddress.value);
                if(contact.serialize())
                {
                    let key = `contact_${Date.now()}`;
                    localStorage.setItem(key, contact.serialize());
                }

            }

        });

    }

    function Start()
    {
        console.log("Start App...");
        console.log(`Current document title is ${document.title}`);


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
            default:
                console.error("No matching case for page title");
        }

    }
    window.addEventListener("DOMContentLoaded", () => {
        console.log("DOM is fully loaded and parsed");
        Start();
    });

})()