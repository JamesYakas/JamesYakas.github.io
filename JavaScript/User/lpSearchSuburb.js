//Script for when a user inputs their suburb on the landing page

// Function to display the suburb entered by the user
function lpSearchSuburb(){
    //Get user's suburb
    var suburb = document.getElementById('lpInputSearchSuburb').value

    //Store the suburb in localStorage
    localStorage.setItem("usersSuburb", suburb);

    //Simulate a mouse click:
    window.location.href = "resultspage.html";
}