const urlParams = new URLSearchParams(window.location.search);
const selectedStrategy = urlParams.get("strategy");

//determines which parts of the site will show based on the strategy chosen
if(selectedStrategy === 'average') {
  document.querySelector('.calculate-most-appeared-button').style.display = 'none';
  document.querySelector('.calculate-weighted-average-button').style.display = 'none';
  document.querySelector('.calculate-average-button').style.display = 'block';
} else if (selectedStrategy === 'majority') {
  document.querySelector('.calculate-most-appeared-button').style.display = 'block';
  document.querySelector('.calculate-weighted-average-button').style.display = 'none';
  document.querySelector('.calculate-average-button').style.display = 'none';
} else if (selectedStrategy === 'weighted') {
  document.querySelector('.calculate-most-appeared-button').style.display = 'none';
  document.querySelector('.calculate-weighted-average-button').style.display = 'block';
  document.querySelector('.calculate-average-button').style.display = 'none';
}

var buildingList = [];
var classList = [];
var weightList = []; //array of importance values 1 to 5
var excludedLots = [];

  //lot sizes gathered from parkopedia, needed to show results for different calculation algorithms
  const lotAttributesList = {
    "Lot 6" : ["Card & Event", "N/A", "lot6pic1.jfif", "1135 South Halsted Street"],
    "Lot 1A" : ["Card Only", "N/A", "lot1Apic1.jfif", "1109 West Harrison Street"],
    "Lot 1B" : ["Card Only", "N/A", "lot1Bpic1.jfif", "1139 West Harrison Street"],
    "Lot 5" : ["Visitor, Card, & Meter", "515 + 27 (Meter)", "lot5pic1.jfif", "1135 South Morgan Street"],
    "Maxwell Street Parking Structure" : ["Visitor & Card", "760", "mspspic1.jpg", "701 West Maxwell Street"],
    "Lot 14" : ["Card Only", "140", "lot14pic1.jfif", "729 Rochford Street"],
    "Harrison Street Parking Structure" : ["Visitor & Card", "500", "hspspic1.jpg", "1100 West Harrison Street"],
    "Lot 11" : ["Card & Event", "138", "lot11pic1.jfif", "1055 West Congress Parkway"],
    "Halsted Taylor Parking Structure" : ["Visitor & Card", "1200", "htpspic1.jpg", "760 West Taylor Street"],
    "Lot 3" : ["Card Only", "N/A", "lot3pic1.jfif", "924 South Morgan Street"],
    "Lot 20" : ["Card Only", "N/A", "lot20pic1.jfif", "1101 West Taylor Street"],
    "Lot 8" : ["Card Only", "N/A", "lot8pic1.jfif", "401 South Peoria Street"],
    "Lot 9" : ["Card Only", "N/A", "lot9pic1.jfif", "501 South Morgan Street"]
  };

renderList();

function displayRangeValues() {
  for(let i = 0; i < classList.length; i++) {
    const slider = document.getElementById(`rangeDisplay${i}`);
    const output = document.getElementById(`weight${i}`);

    if(!slider || !output) continue;

      if(slider.value === '3') {output.innerHTML = `${slider.value} (high importance)`;}
      if(slider.value === '2') {output.innerHTML = `${slider.value} (default importance)`;}
      if(slider.value === '1') {output.innerHTML = `${slider.value} (low importance)`;}

    //if slider is moved, values will change
    slider.addEventListener('input', function()  {
      if(slider.value === '3') {output.innerHTML = `${slider.value} (high importance)`;}
      if(slider.value === '2') {output.innerHTML = `${slider.value} (default importance)`;}
      if(slider.value === '1') {output.innerHTML = `${slider.value} (low importance)`;}
      //output.innerHTML = slider.value;
      weightList[i] = Number(slider.value); //dynamically change the value in weightList through event listener
      //console.log(weightList);
    });
  }
}


function renderList() {
  let listHTML = '';
  //console.log(weightList);

  for(let i = 0; i < buildingList.length; i++) {
    const building = buildingList[i];
    const className = classList[i];
    var html = `
    <div class="class-list-item-${i}">
      <p>${className}</p>
      <p>${building}</p>
      <button onclick="deleteClass(${i})">
        <img src="/images/trashcantrans.png">
      </button>
    </div>`;

    if(selectedStrategy === 'weighted') {
      html = `
      <div class="class-list-item-${i}">
        <p>${className}</p>
        <p>${building}</p>
        <button onclick="deleteClass(${i})">
          <img src="/images/trashcantrans.png">
        </button>
        <input type="range" min="1" max="3" value="2" id="rangeDisplay${i}">
        <p>Weight: <span id="weight${i}"></span></p>
      </div>`;
      }

    listHTML += html;
  }

  //console.log(listHTML);
  document.querySelector('.js-class-list')
    .innerHTML = listHTML;

    if(selectedStrategy === 'weighted') {displayRangeValues();}
}


function addClass() {
  var buildingIndex = document.getElementById("classSelection").selectedIndex;
  const buildingOptions = document.getElementById("classSelection").options;
  const building = buildingOptions[buildingIndex].value;

  if(building == 'N/A') {
    console.log("Please choose a valid building!") //fix this later
    renderList();
    return;
  } else if (buildingList.length >= 20) {
    console.log("Too many buildings. Please delete one or do something else.") //fix this later
    renderList();
    return;
  }

  const nameInput = document.querySelector('.className');
  var name = nameInput.value;

  //this portion of code will make sure the correct unnamed class number will be 
  // associated w/ the # of unnamed classes the user put
  if(name == '') { 
    var unnamedClassCount = 0;
    for(let i = 0; i < classList.length; i++) {
      if(classList[i].includes('Unnamed Class')) {
        unnamedClassCount++;
      }
    }
    name = 'Unnamed Class ' + (unnamedClassCount+1);
  };

  buildingList.push(building);
  classList.push(name);
  weightList.push(2); //default weight value that can be changed through event listener
  console.log(buildingList);
  console.log(classList);

  nameInput.value = ''; //reset value
  document.getElementById("classSelection").selectedIndex = 0; //reset selection value

  renderList();
}


function deleteClass(position) {
  const list = document.querySelector('.js-class-list');

  if(list.querySelector(`.class-list-item-${position}`)) {
    list.querySelector(`.class-list-item-${position}`)?.remove();
    const building = buildingList[position];
    const className = classList[position];
    buildingList.splice(position, 1);
    classList.splice(position, 1);
    weightList.splice(position, 1);

    console.log(`The class in ${building} named ${className} at position ${position} was removed!`);

    var unnamedClassCount = 1;
    for(let i = 0; i < classList.length; i++) {
      if(classList[i].includes('Unnamed Class')) {
        classList[i] = 'Unnamed Class ' + unnamedClassCount;
        unnamedClassCount++;
      }
    }
    console.log(classList);
  }
  renderList();
}


function writeSingleData(origin, destination, minutes) {
  const reference = 'walking_times/' + origin + '/' + destination
  firebase.database().ref(reference).set(minutes)
    .then(() => {
      console.log(`Writing ${minutes} mins from ${origin} to ${destination}`);
      console.log("Single data written successfully!");
    })
    .catch((error) => {
      console.error("Error writing single data:", error);
    });
}


function readAllBuildingsForLot(lotName) {
  firebase.database().ref("walking_times/" + lotName).once("value")
    .then((snapshot) => {
      const buildings = snapshot.val();
      if (!buildings) {
        console.log("No data found for", lotName);
        return;
      }

      console.log("Walking times from", lotName + ":");
      for (let building in buildings) {
        console.log(`  ${building}: ${buildings[building]} minutes`);
      }
    })
    .catch((error) => {
      console.error("Error reading data:", error);
    });
}

// Try reading for LotA
//readAllBuildingsForLot("LotA");

function writeMultipleWalkingTimes(lotName, dataObject) {
  firebase.database().ref("walking_times/" + lotName).set(dataObject)
    .then(() => {
      console.log(`All walking times for ${lotName} written successfully!`);
    })
    .catch((error) => {
      console.error("Error writing data:", error);
    });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


// Example manual entry:
const lotAData = {
  "BURNHAM_HALL": 7,
  "SEO": 6,
  "Lincoln Hall": 8,
  "CDRLC": 5,
  "BSB": 9
};

function resetRender() {
  const fullList = document.querySelector('.js-lot-banner-list');
  if(fullList) {
    fullList
      .innerHTML = '';
  }
}

function renderTimeList(timeList) {
  resetRender();
  let position = 1;
  let listHTML = '';


  for(let i = 0; i < 3; i++) { //by default, top 3 vals are shown
    const [lotName1, avgTime] = timeList[i];
    const found = Object.entries(lotAttributesList).find(([lot, [accessType, lotSize, lotPicture, address]]) => {
      return lot.includes(lotName1);
    });

    if (found) {
      const [lotName2, [accessType, lotSize, lotPicture, address]] = found;

      //console.log("Lot:", lotName1);
      //console.log("Access Type:", accessType);
      //console.log("Lot Size:", lotSize);

      const html = `
        <div class="lot-banner">
          <div class="lot-banner-top">
            <img src="/images/${lotPicture}" class="lot-picture">
            <hr>
            <div style="padding: 0px 13px; width: 435px">
              <p style="font-weight: 700; font-size: 28px; margin-top: 12px;">${lotName1}</p>
              <div class="location-container">
                <img src="/images/locationpin.png">
                <p style="color: rgb(66, 66, 66)">${address}, Chicago, IL 60607</p> <!--i wanna put a little location icon next to this-->
              </div>
              <p style="padding-top: 10px">this is a long description about the lot and what happens. maybe some interesting information like hey i park at this lot! or at least i did freshman year. im kinda biased so might continue parking here.</p>
            </div>
            <hr>
            <div class="lot-banner-right">
              <p class="stats-header">Position in Time Ranking</p>
              <p>#${position}</p>

              <p class="stats-header">Lot Access Type</p>
              <p>${accessType}</p>
              
              <p class="stats-header">Estimated Amt of Spots Total</p>
              <p>${lotSize}</p>

              <p class="stats-header">Average Walking Time</p>
              <p>${avgTime} mins</p>
            </div>
          </div>
          <hr>
          <div class="lot-banner-bottom">
            <img src="/images/yellow-star.png">
            <p style="font-size: 15px; padding: 10px 3px">Favorite This Lot</p>
            <div class="lot-banner-bottom-right">
              <button class="lot-banner-button">this will do smth eventually...</button>
            </div>
          </div>


        </div>
      `
      listHTML += html;
    }

    //this will update the position variable only if the current time is less than the next one in timeList
    //if they're equal, that means both this and the next lot will have the same positon in the list!
    if(i !== timeList.length-1) {
      const [lotName3, nextAvgTime] = timeList[i+1];
      if(avgTime < nextAvgTime || position == 0) {
        position++;
      }
    }
  }

  //add all the banners to the lot banner list in html!
  document.querySelector('.js-lot-banner-list')
    .innerHTML = listHTML;
}

async function calculateAvgTimes(weighted) {
  if(buildingList.length === 0) {
    console.log("The list is empty!");
    return;
  }

  const snapshot = await firebase.database().ref('walking_times/').once('value');
  const lotsData = snapshot.val();
  const lotNames = Object.keys(lotsData);
  const avgTimes = {};



  for(const lotName of lotNames) {
    if(excludedLots.includes(lotName)) {continue;} //make sure to skip any excluded lots from user preferences

    if(weighted) {
      let weightedSum = 0;
      let totalWeight = 0;
      for(let i = 0; i < buildingList.length; i++) {
        const minuteSnapshot = await firebase.database().ref('walking_times/' + lotName + '/' + buildingList[i]).once('value');
        totalWeight += weightList[i];
        weightedSum += minuteSnapshot.val() * weightList[i];
      }
      const weightedAvg = weightedSum / totalWeight;
      let rounded = Math.round(weightedAvg * 10) / 10; //to show one decimal place only
      avgTimes[lotName] = rounded;
    } else {
        let avg = 0;
        for(const building of buildingList) {
          const minuteSnapshot = await firebase.database().ref('walking_times/' + lotName + '/' + building).once('value');
          avg += minuteSnapshot.val();
        }
        avg /= buildingList.length;
        let rounded = Math.round(avg * 10) / 10; //to show one decimal place only
        avgTimes[lotName] = rounded;
    }


  }

  // Convert avgTimes object to array of [lotName, avgTime] pairs
  const sortedLots = Object.entries(avgTimes)
    .sort((a, b) => a[1] - b[1]); // ascending order by avg time

  
  renderTimeList(sortedLots); //renders the list based on the pairs
  //delete list at the end and render it
}

function renderMostAppearedList(appearancesList, closestBuildings) {
  resetRender();
  let position = 1;
  let listHTML = '';


  for(let i = 0; i < appearancesList.length; i++) {
    //if(i >= 3) {continue}; //by default, top 3 vals are shown
    const [lotName1, appearances] = appearancesList[i];
    const found = Object.entries(lotAttributesList).find(([lot, [accessType, lotSize, lotPicture, address]]) => {
      return lot.includes(lotName1);
    });

    if (found) {
      const [lotName2, [accessType, lotSize, lotPicture, address]] = found;
      let buildings = [];
      if(lotName2 in closestBuildings) {
        buildings = closestBuildings[lotName2];
      }


      //console.log("Lot:", lotName1);
      //console.log("Access Type:", accessType);
      //console.log("Lot Size:", lotSize);

      const html = `
        <div class="lot-banner">
          <div class="lot-banner-top">
            <img src="/images/${lotPicture}" class="lot-picture">
            <hr>
            <div style="padding: 0px 13px; width: 435px">
              <p style="font-weight: 700; font-size: 28px; margin-top: 12px;">${lotName1}</p>
              <div class="location-container">
                <img src="/images/locationpin.png">
                <p style="color: rgb(66, 66, 66)">${address}, Chicago, IL 60607</p> <!--i wanna put a little location icon next to this-->
              </div>
              <p style="padding-top: 10px">this is a long description about the lot and what happens. maybe some interesting information like hey i park at this lot! or at least i did freshman year. im kinda biased so might continue parking here.</p>
              <p style="margin-top: 10px; font-weight: 500"> Your class buildings near this lot: ${buildings}</p>
            </div>
            <hr>
            <div class="lot-banner-right">
              <p class="stats-header">Position in Time Ranking</p>
              <p>#${position}</p>

              <p class="stats-header">Lot Access Type</p>
              <p>${accessType}</p>
              
              <p class="stats-header">Estimated Amt of Spots Total</p>
              <p>${lotSize}</p>

              <p class="stats-header">Amt of Classes Near This Lot</p>
              <p>${appearances}</p>
            </div>
          </div>
          <hr>
          <div class="lot-banner-bottom">
            <img src="/images/yellow-star.png">
            <p style="font-size: 15px; padding: 10px 3px">Favorite This Lot</p>
            <div class="lot-banner-bottom-right">
              <button class="lot-banner-button">this will do smth eventually...</button>
            </div>
          </div>


        </div>
      `
      listHTML += html;
    }

    //this will update the position variable only if the current time is less than the next one in timeList
    //if they're equal, that means both this and the next lot will have the same positon in the list!
    if(i !== appearancesList.length-1) {
      const [lotName3, nextAppearances] = appearancesList[i+1];
      if(appearances > nextAppearances || position == 0) {
        position++;
      }
    }
  }

  //add all the banners to the lot banner list in html!
  document.querySelector('.js-lot-banner-list')
    .innerHTML = listHTML;
}


async function calculateMostAppearedLots() {
  if(buildingList.length == 0) {
    console.log("The list is empty!");
    return;
  }

  const snapshot = await firebase.database().ref('walking_times/').once('value');
  const lotsData = snapshot.val();
  const lotNames = Object.keys(lotsData);

   //stores the amount of times a lot appeared in the upcoming find min search algorithm
   //only stores lots that were found at least once
   //closestBuildings stores the buildings the user chose that are specifically closest to one of the lots
  const timesAppeared = {};
  const closestBuildings = {};

  for(const building of buildingList) {
    let minValue = 1000000000; //the smallest time taken to get to a certain building
    let enteredLot = ""; //the lot to be entered into our timesAppeared map, aka the closest lot to the building
    for(const lotName of lotNames) {
      if(excludedLots.includes(lotName)) {continue;} //make sure to skip any excluded lots from user preferences
      const minuteSnapshot = await firebase.database().ref('walking_times/' + lotName + '/' + building).once('value');
      if(minuteSnapshot.val() < minValue) {
        minValue = minuteSnapshot.val();
        enteredLot = lotName;
      }
    }

     //adds an additional entry of this lot with the amount of times it appeared in the map.
    if(enteredLot in timesAppeared) {
      timesAppeared[enteredLot] += 1;
      if(closestBuildings[enteredLot].includes(building)) {
        continue;
      }
      else {
        closestBuildings[enteredLot].push(building);
      }
    } else {
      timesAppeared[enteredLot] = 1;
      closestBuildings[enteredLot] = [building];
    }

  }

  //console.log(timesAppeared);

  //now let's convert timesAppeared to an array to be sorted
  const sortedLots = Object.entries(timesAppeared)
    .sort((a, b) => b[1] - a[1]); //descending order by most appearances

  renderMostAppearedList(sortedLots, closestBuildings); //lastly we will show the results to the user
}

function confirmExclusions() {
  excludedLots = [];
  console.log('Function was called!');
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes
    .forEach(checkbox => {
      if(checkbox.checked) {
        excludedLots.push(checkbox.value);
      }
    });

  console.log(excludedLots);
}


