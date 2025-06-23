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

  if(user && greetingDiv) {
    const displayName = user.displayName || user.email;
    greetingDiv.textContent = `Hello, ${displayName}!`
  } else {
    console.log('user not logged in or greetingDiv doesnt exist.')
  }
});