/**
 * When DOM content is loaded
 */
document.addEventListener('DOMContentLoaded', function () {

    var userData = JSON.parse(localStorage.getItem('userData'));

    console.log(userData);
    // //If logged in, hide the sign up button
    // if (userData.status == true) {

    //     document.getElementById("signup_btn").style.display = "none";
    // }

    // Display the user's email
    //document.getElementById("users_email").innerHTML = "Signed in as: " + userData.email;

    //Load the javascript components
    //pageOnLoad();
});