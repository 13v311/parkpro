const sidebarButtons = document.querySelectorAll('.sidebar-button');
const sections = document.querySelectorAll('.information-display-container');

//by default, the display settings icon will be selected and show its content first
sections.forEach(section => {
  if(section.id !== 'settings') {
    section.style.display = 'none';
  } else {
    section.style.display = 'block';
  }
})

//all of the buttons are given click event listeners that will show different content dependent on which one is active
sidebarButtons.forEach(button  =>  {
  button.addEventListener('click', () => {
    //remove active from all other sidebar buttons
    sidebarButtons.forEach(btn => btn.classList.remove('active'));

    //add active to the one that was clicked
    button.classList.add('active');

    const targetId = button.getAttribute('data-target');
    sections.forEach(section => {
      section.style.display = (section.id === targetId) ? 'block' : 'none';
    })
  });
});

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log("User is signed in:", user.email);
    // Hide login form, show profile dropdown, etc.
  } else {
    console.log("No user signed in");
    // Show login form
  }
});