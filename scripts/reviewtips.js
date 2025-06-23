firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    // Not logged in — send to homepage
    window.location.href = "homepage.html";
  } else if (user.email !== "lkens@uic.edu") {
    // Logged in but not admin — block access
    alert("You do not have access to this page.");
    window.location.href = "homepage.html";
  } else {
    // Admin is in — load moderation content
    console.log("Admin access granted.");
    loadPendingTips(); // Your custom function
  }
});

async function loadPendingTips() {
  const snapshot = await firebase.database().ref('tips/').once('value');
  const allTipsData = snapshot.val();
  //const allTips = Object.keys(allTipsData);
  console.log(allTipsData);

  for(var currTip of allTipsData) {
    if(currTip.status === 'pending') {
      const authorInput = document.getElementById('tip-author');
      const affiliationInput = document.getElementById('tip-affiliation');
      const tipInput = document.getElementById('tip-message');

      const container = document.querySelector('.all-tips-container');
      const html = `
        <div class="tip-container">
          <p id="tip-email">${currTip.email}</p>
          <p id="tip-author">${currTip.name}</p>
          <p id="tip-affiliation">${currTip.affiliation}</p>
          <p id="tip-message">${currTip.tip}</p>
          <button onclick="approve()">Approve</button>
          <button onclick="deny()">Deny</button>
        </div>
      `;

      container.innerHTML += html;
    }
  }

  
}

function approve(id) {

}

function deny(id) {

}