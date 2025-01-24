"use strict";

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
                        let contact = new Contact();
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
                let contact = new Contact(fullName.value, contactNumber.value, emailAddress.value);
                if(contact.serialize())
                {
                    let key = `contact_${Date.now()}`;
                    localStorage.setItem(key, contact.serialize());
                }

            }

        });

    }

    function Start(){
        console.log("Start App...");


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
        }

    }
    window.addEventListener("load", Start);

})()
>>>>>>> a6e38a7 (week3)
