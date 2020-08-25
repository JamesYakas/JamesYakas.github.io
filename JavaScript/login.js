(function () {
    const APP_ID = 'CA14D4D2-1B0F-4527-FF1E-9C38D5AEFC00';
    const API_KEY = '64606BDA-9451-4847-BCA2-AE0422269CFE';

    Backendless.serverURL = 'https://api.backendless.com';
    Backendless.initApp(APP_ID, API_KEY);
})();



login.addEventListener('click', e => {

    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    console.log(email);
    console.log(password);

    function userLoggedIn(user) {
        console.log("user has logged in");
        console.log(user);

        // Store user state to local storage
        // var status = "logged_in";
        //localStorage.setItem("userStatus", "logged_in");

        localStorage.setItem('userData', JSON.stringify({
            status: true,
            email: email,
            id: user.ownerId
        }));

        // Re-direct to the main page
        window.location.href = "main.html";

    }

    function gotError(err) // see more on error handling
    {
        console.log("error message - " + err.message);
        console.log("error code - " + err.statusCode);
    }

    Backendless.UserService.login(email, password, true)
        .then(userLoggedIn)
        .catch(gotError);


});