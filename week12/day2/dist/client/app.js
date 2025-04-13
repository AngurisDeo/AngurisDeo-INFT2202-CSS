"use strict";
import { Router } from "./router.js";
import { LoadHeader } from "./header.js";
import { LoadFooter } from "./footer.js";
import { AuthGuard } from "./authguard.js";
import { Contact } from "./contact.js";
import { validateForm, AddContact, DisplayWeather, attachValidationListeners, addEventListenersOnce, handleCancelClick, handleEditClick, removeFromStorage, getFromStorage } from "./utils.js";
const pageTitle = {
    "/": "Home Page",
    "/home": "Home Page",
    "/about": "About Page",
    "/products": "Our Products",
    "/services": "Our Services",
    "/contact": "Contact",
    "/contact-list": "Contact List",
    "/edit": "Edit Contact",
    "/login": "Login Page",
    "/register": "Register",
    "/404": "Page Not Found"
};
const routes = {
    "/": "views/pages/home.html",
    "/home": "views/pages/home.html",
    "/about": "views/pages/about.html",
    "/products": "views/pages/products.html",
    "/services": "views/pages/services.html",
    "/contact": "views/pages/contact.html",
    "/contact-list": "views/pages/contact-list.html",
    "/edit": "views/pages/edit.html",
    "/login": "views/pages/login.html",
    "/register": "views/pages/register.html",
    "/404": "views/pages/404.html"
};
const router = new Router(routes);
(function () {
    function DisplayRegisterPage() {
        console.log("[INFO] DisplayRegisterPage() called...");
    }
    function DisplayLoginPage() {
        console.log("[INFO] DisplayLoginPage() called...");
        if (sessionStorage.getItem("user")) {
            router.navigate("/contact-list");
            return;
        }
        const messageArea = document.getElementById("messageArea");
        const loginButton = document.getElementById("loginButton");
        const cancelButton = document.getElementById("cancelButton");
        const loginForm = document.getElementById("loginForm");
        if (!loginButton) {
            console.error("[ERROR] loginButton not found in the DOM...");
            return;
        }
        loginButton.addEventListener("click", async (event) => {
            event.preventDefault();
            console.log("[DEBUG] Login button clicked");
            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();
            try {
                const response = await fetch("http://localhost:3000/users");
                if (!response.ok) {
                    throw new Error(`HTTP error Status: ${response.statusText}`);
                }
                const jsonData = await response.json();
                const users = jsonData.users;
                let authenticatedUser = users.find((user) => user.Username === username && user.Password === password);
                if (authenticatedUser) {
                    sessionStorage.setItem("user", JSON.stringify({
                        DisplayName: authenticatedUser.DisplayName,
                        EmailAddress: authenticatedUser.EmailAddress,
                        Username: authenticatedUser.Username
                    }));
                    messageArea.style.display = "none";
                    messageArea.classList.remove("alert", "alert-danger");
                    LoadHeader().then(() => {
                        router.navigate("/contact-list");
                    });
                }
                else {
                    messageArea.style.display = "block";
                    messageArea.classList.add("alert", "alert-danger");
                    messageArea.textContent = "Invalid username or password. Please try again";
                    document.getElementById("username").focus();
                    document.getElementById("username").select();
                }
            }
            catch (error) {
                console.error("[ERROR] Failure to login", error);
            }
        });
        if (cancelButton && loginForm) {
            cancelButton.addEventListener("click", (event) => {
                loginForm.reset();
                router.navigate("/home");
            });
        }
    }
    function handleAddClick(event) {
        event.preventDefault();
        if (!validateForm()) {
            alert("Form contains errors. Please correct them before submitting");
            return;
        }
        const fullName = document.getElementById("fullName").value;
        const contactNumber = document.getElementById("contactNumber").value;
        const emailAddress = document.getElementById("emailAddress").value;
        AddContact(fullName, contactNumber, emailAddress, router);
        router.navigate("/contact-list");
    }
    function DisplayEditPage() {
        console.log("DisplayEditPage called...");
        const hashParts = location.hash.split("#");
        const page = hashParts.length > 2 ? hashParts[2] : "";
        const editButton = document.getElementById("editButton");
        const pageTitle = document.querySelector("main > h1");
        if (!pageTitle) {
            console.error("[ERROR] Main title element not found");
            return;
        }
        if (page == "add") {
            document.title = "Add Contact";
            pageTitle.textContent = "Add Contact";
            if (editButton) {
                editButton.innerHTML = `<i class="fa-solid fa-user-plus"></i>Add Contact`;
                editButton.classList.remove("btn-primary");
                editButton.classList.add("btn-success");
            }
            addEventListenersOnce("editButton", "click", handleAddClick);
            addEventListenersOnce("cancelButton", "click", (event) => handleCancelClick(router));
        }
        else {
            const contactData = localStorage.getItem(page);
            if (!contactData) {
                console.warn("[WARNING] No contact data found for ID");
                return;
            }
            const contact = new Contact();
            contact.deserialize(contactData);
            document.getElementById("fullName").value = contact.fullName;
            document.getElementById("contactNumber").value = contact.contactNumber;
            document.getElementById("emailAddress").value = contact.emailAddress;
            if (editButton) {
                editButton.innerHTML = `<i class="fa-solid fa-user-plus"></i>Edit Contact`;
                editButton.classList.remove("btn-success");
                editButton.classList.add("btn-primary");
            }
            addEventListenersOnce("editButton", "click", (event) => handleEditClick(event, contact, page, router));
            addEventListenersOnce("cancelButton", "click", (event) => handleCancelClick(router));
        }
    }
    function DisplayContactListPage() {
        console.log("Called DisplayContactListPage() ...");
        let contactList = document.getElementById("contactList");
        if (!contactList) {
            console.warn("[WARNING] Element with ID 'contact-list' not found");
            return;
        }
        let data = "";
        let keys = Object.keys(localStorage);
        let index = 1;
        keys.forEach((key) => {
            if (key.startsWith("contact_")) {
                let contact = getFromStorage(key);
                if (!contact) {
                    console.warn(`[WARNING] No contact found for key: ${key}`);
                    return;
                }
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
            }
            else {
                console.warn(`Skipping non-contact key: ${key}`);
            }
        });
        contactList.innerHTML = data;
        const addButton = document.getElementById("addButton");
        if (addButton) {
            addButton.addEventListener("click", (e) => {
                router.navigate("/edit#add");
            });
        }
        const deleteButtons = document.querySelectorAll("button.delete");
        deleteButtons.forEach((button) => {
            button.addEventListener("click", function (event) {
                const targetButton = event.target;
                const contactKey = targetButton.value;
                if (confirm("Delete contact, please confirm.")) {
                    removeFromStorage(contactKey);
                    DisplayContactListPage();
                }
            });
        });
        const editButtons = document.querySelectorAll("button.edit");
        editButtons.forEach((button) => {
            button.addEventListener("click", function (event) {
                const targetButton = event.target;
                router.navigate(`/edit#${targetButton.value}`);
            });
        });
    }
    function DisplayHomePage() {
        console.log("Called DisplayHomePage() ... ");
        const aboutUsBtn = document.getElementById("AboutUsBtn");
        if (aboutUsBtn) {
            aboutUsBtn.addEventListener("click", () => {
                router.navigate("/about");
            });
        }
        DisplayWeather();
    }
    function DisplayAboutPage() {
        console.log("Called DisplayAboutPage() ... ");
    }
    function DisplayProductsPage() {
        console.log("Called DisplayProductsPage() ... ");
    }
    function DisplayServicesPage() {
        console.log("Called DisplayServicesPage() ... ");
    }
    function DisplayContactPage() {
        console.log("Called DisplayContactPage() ... ");
        let sendButton = document.getElementById("sendButton");
        let subscribeCheckbox = document.getElementById("subscribeCheckbox");
        const contactListButton = document.getElementById("showContactList");
        if (!sendButton) {
            console.warn("[WARNING} Element with ID 'sendButton' not found");
            return;
        }
        sendButton.addEventListener("click", function (event) {
            event.preventDefault();
            if (!validateForm()) {
                alert("Please fix errors before submitting.");
                return;
            }
            if (subscribeCheckbox && subscribeCheckbox.checked) {
                const fullName = document.getElementById("fullName").value;
                const contactNumber = document.getElementById("contactNumber").value;
                const emailAddress = document.getElementById("emailAddress").value;
                AddContact(fullName, contactNumber, emailAddress, router);
            }
            alert("Form successfully submitted");
        });
        if (contactListButton) {
            contactListButton.addEventListener("click", function (event) {
                event.preventDefault();
                router.navigate("/contact-list");
            });
        }
    }
    document.addEventListener("routeLoaded", (event) => {
        if (!(event instanceof CustomEvent) || typeof event.detail != "string") {
            console.warn("[WARNING] Recieved an invaild 'routeLoaded' event");
            return;
        }
        const newPath = event.detail;
        console.log(`[INFO] New Route Loaded: ${newPath}`);
        LoadHeader().then(() => {
            handlePageLogic(newPath);
        });
    });
    function handlePageLogic(path) {
        document.title = pageTitle[path] || "Untitled Page";
        const protectedRoutes = ["/contact-list", "/edit"];
        if (protectedRoutes.includes(path)) {
            AuthGuard();
        }
        switch (path) {
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
    async function Start() {
        console.log("Start App...");
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
})();
//# sourceMappingURL=app.js.map