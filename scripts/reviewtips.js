firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    // Not logged in — send to homepage
    window.location.href = "homepage.html";
  } else if (user.email !== "lkens@uic.edu") {
    // Logged in but not admin — block access
    window.location.href = "homepage.html";
    alert("You do not have access to this page.");
  } else {
    // Admin is in — load moderation content
    console.log("Admin access granted.");
    loadPendingTips(); // Your custom function
  }
});

async function loadPendingTips() {
  const snapshot = await firebase.database().ref('tips').once('value');
  const allTipsData = snapshot.val();
  const allTips = Object.keys(allTipsData);
  console.log(allTips);

  for(var tipId of allTips) {
    let tip = allTipsData[tipId];
    if(tip.status === 'pending') {

      const authorInput = document.getElementById('tip-author');
      const affiliationInput = document.getElementById('tip-affiliation');
      const tipInput = document.getElementById('tip-message');

      const container = document.querySelector('.all-tips-container');
      const timestamp = tip.timestamp.substring(0, 10);

      //these will be used to fill the email template
      let templateParamsA = {
        email: tip.email,
        name: tip.name,
        status: 'Approved',
        tip: tip.tip,
        subject: tip.subject,
        date: timestamp
      };

      let templateParamsD = {
        email: tip.email,
        name: tip.name,
        status: 'Denied',
        tip: tip.tip,
        subject: tip.subject,
        date: timestamp
      };

      const html = `
        <div class="tip-container tip-container-${tipId}">
          <p>Date: ${timestamp}</p>
          <p>Email: ${tip.email}</p>
          <p>Name: ${tip.name}</p>
          <p>Affiliation: ${tip.affiliation}</p>
          <p>Subject: ${tip.subject}</p>
          <p>Message: ${tip.tip}</p>
          <div class="button-container">
            <button 
              class="approve-button" 
              data-tipid="${tipId}" 
              data-template='${JSON.stringify(templateParamsA)}'>
              Approve
            </button>
            <button 
              class="deny-button" 
              data-tipid="${tipId}" 
              data-template='${JSON.stringify(templateParamsD)}'>
              Deny
            </button>
          </div>
        </div>
      `;

      container.innerHTML += html;
    }

    document.querySelectorAll('.approve-button').forEach(button => {
      button.addEventListener('click', () => {
        const tipId = button.dataset.tipid;
        const template = JSON.parse(button.dataset.template);
        approve(tipId, template);
      });
    });

    document.querySelectorAll('.deny-button').forEach(button => {
      button.addEventListener('click', () => {
        const tipId = button.dataset.tipid;
        const template = JSON.parse(button.dataset.template);
        deny(tipId, template);
      });
    });

  }

}



function approve(id, templateParams) {
  firebase.database().ref(`tips/${id}`).update({ status: 'approved'});

  //send email function
  emailjs.send('service_f19zrqt', 'template_c0c0me10n', templateParams).then(
  (response) => {
    console.log('SUCCESS!', response.status, response.text);
    alert('Email was sent a successfullay.');
  },
  (error) => {
    console.log('FAILED...', error);
    alert('Email was NOT sent a successfullay.');
  },
);

  //lastly reload the tips shown to me on the frontend
  const container = document.querySelector('.all-tips-container')
    .innerHTML = '';
  loadPendingTips();
}

async function deny(id, templateParams) {
  firebase.database().ref(`tips/${id}`).update({ status: 'denied'});


  //send email function
  emailjs.send('service_f19zrqt', 'template_c0c0me10n', templateParams).then(
  (response) => {
    console.log('SUCCESS!', response.status, response.text);
    alert('Email was sent a successfullay.');
  },
  (error) => {
    console.log('FAILED...', error);
    alert('Email was NOT sent a successfullay.');
  },
);

  //lastly reload the tips shown to me on the frontend
  const container = document.querySelector('.all-tips-container')
    .innerHTML = '';
  loadPendingTips();
}