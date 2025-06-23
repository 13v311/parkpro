firebase.auth().onAuthStateChanged((user) => {
  if(user) {
    document.getElementById("emailInput").value = user.email;
    if(user.displayName) {
      document.getElementById("nameInput").value = user.displayName;
    }
  }
});

function tipSubmit() {
  const user = firebase.auth().currentUser;

  const email = user?.email || document.getElementById("emailInput").value;
  const name = user?.displayName || document.getElementById("nameInput").value || 'Anonymous';
  const tip = document.getElementById("tipInput").value;
  const timestamp = new Date().toISOString();

  const affiliationIndex = document.getElementById("uicAffiliation").selectedIndex;
  const affiliationOptions = document.getElementById("uicAffiliation").options;
  const affiliation = affiliationOptions[affiliationIndex].value;

  const tipData = {
    name,
    email,
    affiliation,
    tip,
    timestamp,
    status: "pending"
  };

  //edge cases
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  if(tip === '') {
    alert('Write a parking tip! There\'s nothing here at the moment');
    return;
  }

  if(affiliation === 'N/A') {
    alert('You need to pick an affiliation.');
    return;
  }

  firebase.database().ref("tips")
    .orderByChild("email")
    .equalTo(email)
    .once("value", (snapshot) => {
      let pendingCount = 0;

      snapshot.forEach(child => {
        const tip = child.val();
        if (tip.status === "pending") {
          pendingCount++;
        }
      });

      if (pendingCount >= 5) {
        alert("You have reached the limit of 5 pending tips. Please wait for approval.");
      } else {
        submitTipToDB(tipData);
      }
    });


}

function submitTipToDB(tipData) {
  //now we will write all the data into realtime database! yay
  firebase.database().ref('tips').push(tipData)
    .then(() => {
      alert("Tip submitted successfully!");
      document.getElementById("tipInput").value = '';
    })
    .catch((error) => {
      alert("Error submitting tip:" + error.message);
    });
}

firebase.auth().onAuthStateChanged((user) => {
  const greetingDiv = document.getElementById("userGreeting").value;

  if(user) {
    const displayName = user.displayName || user.email;
    greetingDiv.textContent = "Hello, ${displayName}!"
  } else {
    greetingDiv.textContent = '';
  }
});