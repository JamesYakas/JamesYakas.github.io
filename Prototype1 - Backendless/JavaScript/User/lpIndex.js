//Script for the landingpage/index

const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const staticLinks = document.querySelectorAll('.static');

//Hide and show links depending on user/login status
const setupUI = (user) => {
    if(user){
        //toggle UI elements
        loggedInLinks.forEach(item => item.style.display = 'block');
        loggedOutLinks.forEach(item => item.style.display = 'none');
        staticLinks.forEach(item => item.style.display = 'block');
    }else{
        //toggle UI elements
        loggedInLinks.forEach(item => item.style.display = 'none');
        loggedOutLinks.forEach(item => item.style.display = 'block');
        staticLinks.forEach(item => item.style.display = 'block');
    }
}
// setup materialize components
document.addEventListener('DOMContentLoaded', function() {

    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
  
    var items = document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);
  
  });