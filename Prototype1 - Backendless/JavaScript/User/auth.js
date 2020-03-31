//Script for authentication

//listen for auth status changes
auth.onAuthStateChanged(user => {
    var status;
    //console.log(user);
    if(user){
        console.log('user logged in: ', user);
        setupUI(user);

        //Store user state
        status = "logged_in";
        localStorage.setItem("userStatus", status);
    }else {
        console.log('user logged out');
        setupUI();

        //Store user state
        status = "logged_out";
        localStorage.setItem("userStatus", status);
    }
});

//Check user status locally
$(document).ready(function () {
    //Retrieve suburb from local storage
    const status = localStorage.getItem("userStatus");
    if(status == "logged_in"){
        // setupUI(user);
        //toggle UI elements
        loggedInLinks.forEach(item => item.style.display = 'block');
        loggedOutLinks.forEach(item => item.style.display = 'none');
        staticLinks.forEach(item => item.style.display = 'block');
    }else{
        //setupUI();
        //toggle UI elements
        loggedInLinks.forEach(item => item.style.display = 'none');
        loggedOutLinks.forEach(item => item.style.display = 'block');
        staticLinks.forEach(item => item.style.display = 'block');
    }

});

//signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //Get user info
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

    //sign up the user
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        //console.log('user signed up');
        // close the signup modal & reset form
        const modal = document.querySelector('#modal-signup');
        M.Modal.getInstance(modal).close();
        signupForm.reset();
    });
});

//Logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut()//.then(() =>{
        //console.log('user signed out');
    //});
});

//Login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //Get user info
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    auth.signInWithEmailAndPassword(email, password).then(cred => {
        //console.log(cred.user);
        //close the login modal and reset the form
        const modal = document.querySelector('#modal-login');
        M.Modal.getInstance(modal).close();
        loginForm.reset();
    });
});