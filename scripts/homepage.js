//for the feedback submission
document.getElementById('submit').addEventListener("click", function(e) {
  e.preventDefault(); //stop page reload

  const subject = encodeURIComponent(document.getElementById("subject-input").value);
  const body = encodeURIComponent(document.getElementById("feedback").value);

  const recipient = "parkpro.contact@gmail.com";

  const mailToLink = `mailto:${recipient}?subject=${subject}&body=${body}`;

  //open the link
  window.location.href = mailToLink;
});