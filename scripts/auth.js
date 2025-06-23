function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function signup() {
  const email = document.getElementById('signup-email-input').value;
  const password = document.getElementById('signup-password-input').value;

  
  if (!email.endsWith('@uic.edu')) {
    document.getElementById('authMessage').textContent = 'Only @uic.edu emails allowed for safety purposes.';
    return;
  }
 
  if(!(password.length >= 8)) {
    document.getElementById('authMessage').textContent = 'Password needs to be at least 8 characters long!';
    return;
  }

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      document.getElementById('authMessage').textContent = 'Signed up successfully! You can now safely return to the homepage.';
    })
    .catch((error) => {
      document.getElementById('authMessage').textContent = error.message;
    });
}

function login() {
  const email = document.getElementById('login-email-input').value;
  const password = document.getElementById('login-password-input').value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      document.getElementById('authMessage').textContent = 'Logged in successfully! You can now safely return to the homepage.';
      delay(3000);
      document.getElementById('authMessage').textContent = '';
    })
    .catch((error) => {
      document.getElementById('authMessage').textContent = error.message;
    });  
}

function logout() {
  firebase.auth().signOut()
    .then(() => {
      document.getElementById('authMessage').textContent = 'Successfully logged out! You can now safely return to the homepage.'
    })
}

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log("User is signed in:", user.email);
    // Hide login form, show profile dropdown, etc.
  } else {
    console.log("No user signed in");
    // Show login form
  }
});

function forgotPassword() {
  const email = document.getElementById('login-email-input').value;

  firebase.auth().sendPasswordResetEmail(email)
    .then(() => {
      document.getElementById('authMessage').textContent = 'Password reset email sent!';
    })
    .catch((error) => {
      document.getElementById('authMessage').textContent = error.message;
    });
}