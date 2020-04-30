(function (){
    const APP_ID = '073669A8-CCB7-2AED-FFEC-841A4CE5F400';
    const API_KEY = 'FAFDE171-5308-49CF-9980-AA89E4F28F0C';

    Backendless.serverURL = 'https://api.backendless.com';
    Backendless.initApp(APP_ID, API_KEY);
})();

//Function for when the page loads
$(document).ready(function () {

    // //Hard coded - Register user
    // function userRegistered( user )
    // {
    // console.log( "user has been registered" );
    // }

    // function gotError( err ) // see more on error handling
    // {
    // console.log( "error message - " + err.message );
    // console.log( "error code - " + err.statusCode );
    // }

    // var user = new Backendless.User();
    // user.email = "james21444@hotmail.com";
    // user.password = "magicalfruit735";

    // Backendless.UserService.register( user ).then( userRegistered ).catch( gotError );
    //document.getElementById('btnLogout').style.display = "block";
  

    //Retrieve status from local storage
    const status = localStorage.getItem("userStatus");
    //console.log(status);
    if(status == "logged_out"){
      //document.getElementById('btnLogout').style.display = "block";
      logoutUser();
    }

    // // get objectId of the logged-in user:
    // var userObjectId = Backendless.LocalCache.get("current-user-id")

    // // get user-token of the logged-in user:
    // var userToken = Backendless.LocalCache.get("user-token")

    // // get current user object:
    // var userObject = Backendless.UserService.getCurrentUser()

    // console.log("Object Id: " + userObjectId);
    // console.log("User Token: " + userToken);
    // console.log(userObject);

    // function success( result )
    // { 
    //   //console.log( "Is login valid?: " + result );
    // } 
    
    // function error( err ) 
    // { 
    //   //console.log( err.message );
    //   //console.log( err.statusCode );
    // } 
    
    // Backendless.UserService.isValidLogin()
    //  .then( success )
    //  .catch( error );
    $('select').formSelect();


});

//Function to validate the login
function loginUser(){

    //Dismiss current toasts
    M.Toast.dismissAll();

    //Credentials
    var login = document.getElementById('email').value
    var password = document.getElementById('password').value

    function userLoggedIn( user )
    {
      //console.log( user );
      //console.log( "user has logged in" );
      //Store user state
      var status = "logged_in";
      localStorage.setItem("userStatus", status);
      return Backendless.UserService.getCurrentUser()
      .then( function( currentUser ) {
          //Store the user
          //console.log(currentUser);
          var user = currentUser.email;
          localStorage.setItem("currentUser", user);
          //console.log(user);
          //Re-direct to admin page
          // sessionStorage.setItem("AuthenticationState", "Authenticated");
          // //Push the user over to the next page.
          // window.open('adminmainpage2.html','_self');
          window.location.href = "admin/establishments.html";
       })
      .catch( function ( error ) {
       });
    }
    
    function gotError( err ) // see more on error handling
    {
      if(err.message == "Invalid login or password"){
        toastNotification(err.message, 'toast-error', 'error-symbol.png', 'red lighten-1','Infinity','#ce5548');
      }
      else if(err.message == "Unable to login. User account is locked out due to too many failed logins."){
        toastNotification(err.message, 'toast-error', 'error-symbol.png', 'red lighten-1','Infinity','#ce5548');
      }
      //console.log( "error message - " + err.message );
      //console.log( "error code - " + err.statusCode );
    }
    
    Backendless.UserService.login( login, password, true )
     .then( userLoggedIn )
     .catch( gotError );
}

//Function to logout
// function logout(){
//     console.log("Logout");

function userLoggedOut()
{
    //console.log( "user has been logged out" );
    //Re-direct to login page
    //window.location.href = "admin.html";

}

function gotError( err ) // see more on error handling
{
    //console.log( "error message - " + err.message );
    //console.log( "error code - " + err.statusCode );
}

function logoutUser()
{
    Backendless.UserService.logout()
    .then( userLoggedOut )
    .then ( () => {
      //Store user state
      status = "logged_out";
      localStorage.setItem("userStatus", status);
    })
    .catch( gotError ) ;
}

//Function to Reset password
function forgotPassword(){

  //Credentials
  var login = document.getElementById('email').value


  function passwordRecoverySent()
  {
    //console.log( "an email with a link to restore password has been sent to the user" );
    //console.log(login);
  }
  
  function gotError( err ) // see more on error handling
  {
    //console.log( "error message - " + err.message );
    //console.log( "error code - " + err.statusCode );
  }
  
  Backendless.UserService.restorePassword( login )
   .then( passwordRecoverySent )
   .catch( gotError );
}



//Function to display a toast notification
function toastNotification(message, imgClass, img, colour, time, sideColour){
  M.toast({html: '<div class="toast-side">' + '</div>' + '<div class="toast-notification-con">' + '<img class=' + "\"" + imgClass + "\"" + ' src="images/'  + img + "\"" + '>' + '<div class="toast-message">' + "" + message + "" + '</div>'  + '<img class="toast-close" src="images/toast-close.png" height="16" width="16">' + '</div>', displayLength:time, classes: "" + colour + ""})
  $('.toast-side').css({"background-color":sideColour});

  //toast-close
  $(document).on('click', '.toast-close', function() {
      $('#toast-container .toast').fadeOut(500, function(){
          $('#toast-container .toast').remove();
      });
  });
}
