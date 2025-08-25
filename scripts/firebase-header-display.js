firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log("User is signed in:", user.email);
    // Hide login form, show profile dropdown, etc.
  } else {
    console.log("No user signed in");
    // Show login form
  }
});

firebase.auth().onAuthStateChanged((user) => {
  const greetingDiv = document.getElementById("userGreeting");
  const authLink = document.querySelector('.auth-link');
  const profLink = document.querySelector('.profile-link');

  if(user && greetingDiv) {
    const displayName = user.displayName || user.email;
    greetingDiv.textContent = `Hello, ${displayName}!`;
    profLink.style.display = 'block';
    authLink.style.display = 'none';
  } else {
    console.log('user not logged in or greetingDiv doesnt exist.');
    profLink.style.display = 'none';
    authLink.style.display = 'block';
    //additional things that have to be added for beta testing, ensures ppl unaccepted cannot just use the site
    window.location.href = "/frontend-html/waitlist.html";
    alert("If you are not logged in (and accepted as a beta tester) you cannot access any parts of this site besides this page and the login.");

    
  }
});

async function menuClick() {
  const menuButton = document.querySelector('.menu-click');
  menuButton.addEventListener('click', () => {
    //console.log('clicked menu');
    const sidebar = document.querySelector('.nav-sidebar');
    

    //console.log(sidebar.classList);
    menuButton.classList.toggle("active");
    console.log(menuButton.classList);
    sidebar.classList.toggle("active");
  });
}

menuClick();