// Make the variable to have access to DOM of the html.
const usernameInput = document.querySelector('.info-name__input');
const submitButton = document.querySelector('.info_wrapper__button');
const males = document.querySelector('.predict__content');
const maleValue = document.querySelector('.predict__value');
const clearButton = document.querySelector('.saved-answer__button');
const saveButton = document.querySelector('.save_wrapper__button');
const whichMale = document.querySelector('.male');
const error = document.querySelector('.error');
const saved = document.querySelector('.saving-answer');

//regex expression: (a-Z and space) to limit input. 
var reg_name = /^[a-zA-Z\s]*$/;


// for handle status code error.
function handleError(response) {
    showErrorMessage(response.message);
}

// displays each given message as an error message.   
function showErrorMessage(message) {
    console.log(message);
    error.classList.add('active');
    error.innerHTML = message;
    setTimeout(() => { // removes the error message from screen after 4 seconds.
        error.classList.remove('active');
    }, 5000)
}

// fill result data in view. sex predictions.
function fillResult(userData) {
    console.log(userData);
    setMale(userData);
}

// set the male or female in view.
function setMale(userData){
    males.innerHTML = userData.gender;
    maleValue.innerHTML = userData.probability;
}

//Validation to the user_name input field.
function validations(usernameInput){
    valid = true;
    if(!reg_name.test(usernameInput)){
        console.log("Correct your First Name: only letters and spaces.");
        showErrorMessage("Correct your First Name: only letters and spaces.");
        valid = false;
        usernameInput.value = '';
        }
    return valid;
}

// get name from API and return the json value of the predictions.
async function getUserData(usernameInput) {
    console.log("request");
    if(validations(usernameInput)){
        try {
            let response = await fetch(`https://api.genderize.io/?name=${usernameInput}`)
            let json = await response.json();
            if (response.status == 200) {
                return json;
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
    if( userData == null){
        userData = await getUserData(username);
        if(userData == null){
            showErrorMessage("Network error :||");
        }
        if (userData.gender == null) {
            showErrorMessage("Excuse us, we can`t predict this name genders :((");
        }
        else{
            fillResult(userData);
        }
    }
    else{
        fillResult(userData);
        showSaved(userData);
    }
}

// show the info in html.
function showSaved(userData){
    console.log("showing...");
    console.log(userData);
    saved.innerHTML = userData.name + "`s Sex is : " + userData.gender + " with " +userData.probability +" probability.";
}

// clear the local storage for the repetitive name.
async function clearOneLocalStorage() {
    console.log(`the last perdict of ${usernameInput.value} is deleted`);
    localStorage.removeItem(usernameInput.value);
    saved.value = '';
    location.reload();
}



// clear the local storage and use location.reload() to reaload page after delete storage
async function clearLocalStorage() {
    console.log("The Local Storage is Cleared :))");
    window.localStorage.clear();
    location.reload();
}

// make the save from the predict or known sex.
async function forceSave(e) {
    console.log("clicked on save");
    let username = usernameInput.value;
    if (username == "") {
        console.log("username was empty");
        return;
    }
    else{
        e.preventDefault();
        let userData;
        userData = await JSON.parse(window.localStorage.getItem(username));
        if(userData == null){
            userData = await getUserData(username);
            if(userData == null){
                showErrorMessage("Network error :||");
            }
            if (userData.gender == null) {
                showErrorMessage("Excuse us, we can`t predict this name genders :((");
            }
            if(document.getElementById('male').checked) {
                console.log("sex is male choese");
                localStorage.setItem(username , `{"name":"${username}","gender":"male","probability":0.999,"count":271127}`);
                return
            }if(document.getElementById('female').checked) {
                console.log("sex is female choese");
                localStorage.setItem(username , `{"name":"${username}","gender":"female","probability":0.999,"count":271127}`);
                return            
            }
            fillResult(userData);
            showSaved(userData);
        }
    }
}

submitButton.addEventListener('click', sendRequest);
saveButton.addEventListener('click', forceSave);
clearButton.addEventListener('click', clearOneLocalStorage);