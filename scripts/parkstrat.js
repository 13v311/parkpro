function redirect(option) {
  if (option === 1) {
    window.location.href = "../frontend-html/lotfinder.html?strategy=weighted";
  } else if (option === 2) {
    window.location.href = "../frontend-html/lotfinder.html?strategy=majority";
  }
}