const usernameInput = document.querySelector('.info-name__input');
const submitButton = document.querySelector('.info_wrapper__button');
const males = document.querySelector('.predict__content');
const maleValue = document.querySelector('.predict__value');

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
    userData = await JSON.parse(window.localStorage.getItem(username));
    if (userData == null) {
        userData = await getUserData(username);
        if (userData == null)
            return;
        window.localStorage.setItem(username, JSON.stringify(userData));
    }
    fillResult(userData);
}

submitButton.addEventListener('click', sendRequest);