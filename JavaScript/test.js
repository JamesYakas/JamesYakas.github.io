(function (){
    const APP_ID = '073669A8-CCB7-2AED-FFEC-841A4CE5F400';
    const API_KEY = 'FAFDE171-5308-49CF-9980-AA89E4F28F0C';

    Backendless.serverURL = 'https://api.backendless.com';
    Backendless.initApp(APP_ID, API_KEY);
})();

$(document).ready(function (){

    //Store user state
    var status = "logged_in";
    localStorage.setItem("userStatus", status);

    console.log(status);

    //Retrieve status from local storage
    const checkStatus = localStorage.getItem("userStatus");

    if(checkStatus == "logged_in"){
        document.getElementById('btnLogout').style.display = "none";
    }

    //Initialize the materialize select element
    $('select').formSelect();
});