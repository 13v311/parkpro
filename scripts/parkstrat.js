function redirect(option) {
  if(option === 1) {
    window.location.href = "/frontend-html/lotfinder.html?strategy=average";
  } else if (option === 2) {
    window.location.href = "/frontend-html/lotfinder.html?strategy=majority";
  } else if (option === 3) {
    window.location.href = "/frontend-html/lotfinder.html?strategy=weighted";
  }
}