//Script for when a user inputs their suburb on the landing page

//Test - establish db connection
(function (){
    const APP_ID = '073669A8-CCB7-2AED-FFEC-841A4CE5F400';
    const API_KEY = 'FAFDE171-5308-49CF-9980-AA89E4F28F0C';

    Backendless.serverURL = 'https://api.backendless.com';
    Backendless.initApp(APP_ID, API_KEY);
})();

// Function to display the suburb entered by the user
function lpSearchSuburb(){
    //Get user's suburb
    var suburb = document.getElementById('lpInputSearchSuburb').value

    //Store the suburb in localStorage
    localStorage.setItem("usersSuburb", suburb);

    //Simulate a mouse click:
    window.location.href = "resultspage.html";
}