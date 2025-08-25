const accepted = [
  "lkens@uic.edu"
];

function checkUser() {
  const user = document.getElementById('email-input').value;
  if(user === "lkens@uic.edu") {
    let PIN = prompt("What is the pin for lkens@uic.edu?");
    if(PIN === "0415") {
      window.location.href = "../frontend-html/auth.html";
    } else {
      alert('This is not the correct PIN. Please do not pretend to be an admin.');
    }
  } else if (accepted.includes(user)) {
    window.location.href = "../frontend-html/homepage.html";
  } else {
    alert("You were not granted access, but ParkPro may be open fully in the future. For inquiries, please email lkens@uic.edu, or visit the CSRC on Wednesday 8/27 from 2:30-4:30pm.");
  }
}