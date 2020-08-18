// Backendless database setup
(function () {
    const APP_ID = 'CA14D4D2-1B0F-4527-FF1E-9C38D5AEFC00';
    const API_KEY = '64606BDA-9451-4847-BCA2-AE0422269CFE';

    Backendless.serverURL = 'https://api.backendless.com';
    Backendless.initApp(APP_ID, API_KEY);
})();

// document.getElementById("sign_up").addEventListener("click", function(){
//     console.log("Hello");
//   });


sign_up.addEventListener('click', e => {

    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var password2 = document.getElementById("password_2").value;

    console.log(email + " " + password + " " + password2);

    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    var valid = true; // Whether there are any errors
    var errMsg = ""; // The error message

    // Blank email
    if (email == "") {

        errMsg += "Email is required<br>";
        valid = false;
    }

    // Invalid email format
    if (email != "" && re.test(String(email).toLowerCase()) == false) {

        errMsg += "Invalid email<br>";
        valid = false;
    }

    // Note - only 1 password error message is displayed at a time 

    // Blank password
    if (password == "") {

        errMsg += "Password is required<br>";
        valid = false;
    }

    // Password less than 8 characters
    if (password != "" && password != password2) {

        errMsg += "Passwords don't match<br>";
        valid = false;
    }

    // Password contains spaces
    if (password != "" && password == password2 && (/\s/.test(password)) == true) {

        errMsg += "Password cannot contain spaces<br>";
        valid = false;
    }

    // Password not contain an uppercase character
    if (password != "" && password == password2 && (/\s/.test(password)) == false && (!password.match(/.*[A-Z].*/))) {

        errMsg += "Password requires at least 1 uppercase character<br>";
        valid = false;
    }

    // Password not contain an at least 1 number
    if (password != "" && password == password2 && (/\s/.test(password)) == false && (password.match(/.*[A-Z].*/)) && (!password.match(/.*\d.*/))) {
        errMsg += "Password requires at least 1 number<br>";
        valid = false;

    }

    // Password less than 8 characters
    if (password != "" && password == password2 && (/\s/.test(password)) == false && (password.match(/.*[A-Z].*/)) && (password.match(/.*\d.*/)) && password.length < 8) {

        errMsg += "Password must be at least 8 characters<br>";
        valid = false;
    }


    if (valid == true) {

        // Create user

        // When user registration complete
        function userRegistered(user) {
            console.log("user has been registered");
            document.getElementById("error_message").innerHTML = "user has been registered";
        }

        // When there is an error in the registration 
        function gotError(err) // see more on error handling
        {
            console.log("error message - " + err.message);
            console.log("error code - " + err.statusCode);

            document.getElementById("error_message").innerHTML = err.message + err.statusCode;
        }

        // Create a new user
        var user = new Backendless.User();
        user.email = email;
        user.password = password;

        // Submit the user to the database
        Backendless.UserService.register(user).then(userRegistered).catch(gotError);

    } else {
        document.getElementById("error_message").innerHTML = errMsg;
    }


});

sign_up_facebook.addEventListener('click', e => {

    console.log("fdgfd");

    // var facebookFieldsMapping = {"first_name":"first_name", "last_name":"last_name", "email":"email"};

    // Backendless.UserService.loginWithFacebookSdk(facebookFieldsMapping,
    //     true,
    //     options)
    //     .then(function (result) {
    //     })
    //     .catch(function (error) {
    //     });

    // FB.login(function(response) {
    //     if (response.authResponse) {
    //      console.log('Welcome!  Fetching your information.... ');
    //      FB.api('/me', function(response) {
    //        console.log('Good to see you, ' + response.name + '.');
    //      });
    //     } else {
    //      console.log('User cancelled login or did not fully authorize.');
    //     }
    // });

    // FB.login(function (response) {
    //     // handle the response 
    // });

    // FB.getLoginStatus(function(response) {
    //     statusChangeCallback(response);
    // });

    //var facebookFieldsMapping = {"name":response.first_name, "email":response.email, "accessToken":response.impersonate_token};

    FB.login(function (response) {
        if (response.authResponse) {
            console.log('Welcome!  Fetching your information.... ');
            FB.api('/me', function (response) {
                console.log('Good to see you, ' + response.name + '.');

                console.log(response);
                console.log(response.name);
                console.log(response.first_name);
                console.log(response.email);
                console.log(response.impersonate_token);


                // //"email":response.email, 
                // var facebookFieldsMapping = {"name":response.name, "accessToken":response.id};
                // console.log(facebookFieldsMapping);

                // Backendless.UserService.loginWithFacebookSdk(response.id,
                //     true)
                //     .then(function (result) {
                //         console.log(result)
                //     })
                //     .catch(function (error) {
                //         console.log(error)
                //     });
                
            });
        } else {
            console.log('User cancelled login or did not fully authorize.');
        }
    });



    //"first_name":"first_name", "email":"email"
    // var facebookFieldsMapping = {"name":"name", "email":"email", "access-token":"accessToken"};

    // Backendless.UserService.loginWithFacebookSdk(facebookFieldsMapping,
    //     true)
    //     .then(function (result) {
    //         console.log(result)
    //     })
    //     .catch(function (error) {
    //         console.log(error)
    //     });



});


log_out_facebook.addEventListener('click', e => { 

    FB.logout(function(response) {
        // Person is now logged out
        console.log(response);
     });

});