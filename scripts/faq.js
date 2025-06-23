
const qAndA = {
  1: "ParkPro is a web app made by a UIC student to help other students find the best parking spots based on their class schedule. It also features parking tips/advice submitted by others!",
  2: "Average walking times were found using the Google Maps API, then stored in Firebase. We recommend the top 3 (or more depending on user preferences) lots with the shortest average time—and if you choose, you can even tell us which classes are more important, and we’ll prioritize those in our recommendations!",
  3: "Nope! You can use ParkPro without signing in. However, if you see yourself using ParkPro consistently, no harm in making one! Account features will allow you to save your schedule and certain user preferences between visits.",
  4: "Right now, ParkPro focuses on East Campus class buildings only—like SELW, BSB, and Lincoln Hall. West Campus support may be added in the future based on student demand!",
  5: "If you leave the class name blank, ParkPro will automatically assign a name like “Unnamed Class 1,” “Unnamed Class 2,” etc., just to help keep things organized for you.",
  6: "There’s a Tips page where you can submit your own advice for others to read! You can share a tip about a specific lot, add your class standing, and even include your name if you’d like—but it’s totally optional.",
  7: "Not right away! To keep things helpful and appropriate, tips are reviewed manually before being posted to the site. We appreciate your patience—it helps keep ParkPro high-quality for everyone!",
  8: "Right now, we only collect the buildings and class names you input to help calculate parking suggestions. If you decide to create an account, your email and password, as well as any user preferences you may set are safely handled with student privacy in mind!"
};

function revealAnswer(questionNum) {
  const segment = document.querySelector(`.faq-segment${questionNum}`);
  const arrow = segment.querySelector('.dropdown-button');

  if(segment.querySelector('.faq-segmenta')) {
    segment.querySelector('.faq-segmenta')?.remove(); //remove the answer div from this faq segment
    arrow?.classList.remove('rotated');
    return;
  } else {
    const answer = qAndA[questionNum];
    const html = `
            <div class="faq-segmenta">
            <div class="answer-sidebar"></div>
            <p>A.</p>
            <button class="answer-button">
              <p>${answer}</p>
            </button>
          </div>
    `;

    segment
      .insertAdjacentHTML('beforeend', html);
  }
  arrow?.classList.add('rotated');
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

firebase.auth().onAuthStateChanged((user) => {
  const greetingDiv = document.getElementById("userGreeting").value;

  if(user) {
    const displayName = user.displayName || user.email;
    greetingDiv.textContent = "Hello, ${displayName}!"
  } else {
    greetingDiv.textContent = '';
  }
});