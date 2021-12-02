const usernameInput = document.querySelector('.info-name__input');
const submitButton = document.querySelector('.info_wrapper__button');
const males = document.querySelector('.predict__content');
const maleValue = document.querySelector('.predict__value');
const clearButton = document.querySelector('.saved-answer__button');
const saveButton = document.querySelector('.save_wrapper__button');
const whichMale = document.querySelector('.male');

//regex expression:
var reg_name_lastname = /^[a-zA-Z\s]*$/;


// displays each given message as an error message 
function showErrorMessage(message) {
    console.log(message);
    error.classList.add('active');
    error.innerHTML = message;
    setTimeout(() => { // removes the error message from screen after 4 seconds.
        error.classList.remove('active');
    }, 4000)
}

// fill result data in view .
function fillResult(userData) {
    console.log(userData);
    setMale(userData);
}

// set the male or female
function setMale(userData){
    males.innerHTML = userData.gender;
    maleValue.innerHTML = userData.probability;
}

//Validation to the user_name input field
function validations(usernameInput){
    valid = true;
    if(!reg_name_lastname.test(usernameInput)){
        console.log("Correct your First Name: only letters and spaces.");
        valid = false;
        document.querySelector('.info-name__input').value = '';
        }
    return valid;
}
// get name from API and return the json value.
async function getUserData(usernameInput) {
    console.log("request");
    if(validations(usernameInput)){
        try {
            let response = await fetch(`https://api.genderize.io/?name=${usernameInput}`)
            let json = await response.json();
            if (response.status == 200) {
                return json
            }
            handleError(json);
            return Promise.reject(`Request failed with error ${response.status}`);
        } catch (e) {
            showErrorMessage(e);
            console.log(e);
        }
    }
}

// the process of sending data and fill it in view.
async function sendRequest(e) {
    console.log("clicked on submit");
    let username = usernameInput.value;
    if (username == "") {
        console.log("username was empty");
        return;
    }
    e.preventDefault();
    let userData;
    showSaved(username);
    clearOneLocalStorage(username);
    userData = await JSON.parse(window.localStorage.getItem(username));
    if (userData == null) {
        userData = await getUserData(username);
        if (userData == null)
            return;
        window.localStorage.setItem(username, JSON.stringify(userData));
    }
    fillResult(userData);
}

// show the saved 
function showSaved(usernameInput){
    console.log("showing...");
    if(localStorage.length > 0 ){
        if(localStorage.getItem(usernameInput) != null){ 
            var mainContainer = document.querySelector('.saved-answer__header');;
            var div = document.createElement("div");
            content = localStorage.getItem(usernameInput);
            // console.log(localStorage.getItem(usernameInput)['name']);
            // div.innerHTML = content.name + "`s Male is : " + content['"gender"'] + " with " +content['probability'] +" probability.";
            div.innerHTML = content;
            div.style.cssText ="font-size:10px;";
            mainContainer.appendChild(div);
        }
    }
}

// clear the local storage for the repetitive name
async function clearOneLocalStorage(usernameInput) {
    console.log(usernameInput);
    localStorage.removeItem(usernameInput);
}



// clear the local storage and use location.reload() to reaload page after delete storage
async function clearLocalStorage() {
    window.localStorage.clear();
    location.reload();
}

// clear the local storage and use location.reload() to reaload page after delete storage
async function forceSave() {
    let username = usernameInput.value;
    if (username == "") {
        console.log("username was empty");
        return;
    }
    else{
        clearOneLocalStorage(username);
        if(document.getElementById('male').checked) {
            localStorage.setItem(username, 'male and probability is 0.999');
        }else if(document.getElementById('female').checked) {
            localStorage.setItem(username, 'female and probability is 0.999');            
        }
    }
}

submitButton.addEventListener('click', sendRequest);
clearButton.addEventListener('click', clearLocalStorage);
saveButton.addEventListener('click', forceSave);