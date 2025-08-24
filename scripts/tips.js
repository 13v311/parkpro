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

  const subjectIndex = document.getElementById("tipSubject").selectedIndex;
  const subjectOptions = document.getElementById("tipSubject").options;
  const subject = subjectOptions[subjectIndex].value;

  const tipData = {
    name,
    email,
    affiliation,
    tip,
    timestamp,
    subject,
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

  if(subject === 'N/A') {
    alert('You need to pick a subject.');
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


async function revealSubject(subject, segmentNumber) {
  const snapshot = await firebase.database().ref('tips').once('value');
  const allTipsData = snapshot.val();
  const allTips = Object.keys(allTipsData);
  const container = document.querySelector(`.tip-segment${segmentNumber}`);
  var exists = false;
  while(container.querySelector('.tip-container')) {
    container.querySelector('.tip-container')?.remove();
    container.querySelector('.dropdown-button')?.classList.remove('rotated');
    exists = true;
  }
  if(exists) {return;}

  container.querySelector('.dropdown-button')?.classList.add('rotated');
  const segment = container.querySelector('.tip-segmentb');

  for(var tipId of allTips) {
    let tip = allTipsData[tipId];
    if(tip.status === 'approved' && tip.subject === subject) {


      const timestamp = tip.timestamp.substring(0, 10);




      const html = `<div class="tip-container">
      <div class="tip-name-and-affiliation-container">
        <p style="width: 50%; font-weight: 500">${tip.name}</p>
        <p></p>
        <p style="width: 50%; text-align: right;">${tip.affiliation}</p>
      </div>
      <div class="tip-paragraph-container">
        <p>"${tip.tip}"</p>
      </div>
      <div class="tip-date-container">
        <p style="width: 100%; text-align: right;"><i>${timestamp}</i></p>
      </div>
    </div>
      `;

      segment.innerHTML += html;
    }
  }
}