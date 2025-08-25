const urlParams = new URLSearchParams(window.location.search);
const selectedStrategy = urlParams.get("strategy");

//determines which parts of the site will show based on the strategy chosen
 if (selectedStrategy === 'majority') {
  document.querySelector('.calculate-most-appeared-button').style.display = 'block';
  document.querySelector('.calculate-weighted-average-button').style.display = 'none';
  document.querySelector('.calculate-average-button').style.display = 'none';
  document.querySelector('.weighted-instructions').style.display = 'none';
  document.querySelector('.majority-instructions').style.display = 'block';
} else if (selectedStrategy === 'weighted') {
  document.querySelector('.calculate-most-appeared-button').style.display = 'none';
  document.querySelector('.calculate-weighted-average-button').style.display = 'block';
  document.querySelector('.calculate-average-button').style.display = 'none';
  document.querySelector('.weighted-instructions').style.display = 'block';
  document.querySelector('.majority-instructions').style.display = 'none';
}

var buildingList = [];
var classList = [];
var weightList = []; //array of importance values based on number of classes inputted
var excludedLots = [];

  //lot sizes gathered from parkopedia, needed to show results for different calculation algorithms
  const lotDetailList = {
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

  //additional attributes such as accessible, electric, etc, using true/false vals
  //this order: open/covered, accessible, ev charging, ...
  //TODO: put these values in here or its not gonna load the lots
  //most are placeholders, pplz confirm all of these
  const lotAttributesList = {
    "Lot 6" : [false, true],
    "Lot 1A" : [false],
    "Lot 1B" : [false],
    "Lot 5" : [false],
    "Maxwell Street Parking Structure" : [true,false,true],
    "Lot 14" : [false],
    "Harrison Street Parking Structure" : [true,false,true],
    "Lot 11" : [false],
    "Halsted Taylor Parking Structure" : [true, true, true],
    "Lot 3" : [false],
    "Lot 20" : [false],
    "Lot 8" : [false],
    "Lot 9" : [false]
  };

renderList(); //automatically render the list

//below you will find code to read an ics file which is provided by xe registration if users download it
document.getElementById("icsFileInput").addEventListener("change", function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const text = e.target.result;
    parseICS(text); // pass the contents to our parser
  };
  reader.readAsText(file);
});

//yes, chatgpt helped me do this because i have no idea how to parse ics files lol
function parseICS(icsData) {
  const events = [];
  const lines = icsData.split(/\r?\n/);
  let currentEvent = null;

  lines.forEach(line => {
    if(line.startsWith("BEGIN:VEVENT")) {
      currentEvent = {};
    } else if(line.startsWith("END:VEVENT")) {
      if(currentEvent) {events.push(currentEvent);}
      currentEvent = null;
    } else if (currentEvent) {
      if (line.startsWith("SUMMARY:")) {
        currentEvent.className = line.replace("SUMMARY:", "").trim();
      } else if(line.startsWith("LOCATION:")) {
        const locationLine = line.replace("LOCATION:", "").trim();
        const match = locationLine.match(/Chicago Building:\s*(.*?)\s*Room:/);
        if (match) {
          currentEvent.building = match[1].trim();
        }
      }
    }
  });

  //push both class and building to respective outside lists
  events.forEach(cbSet => {
    //for building list there are, sadly, a lot of exclusions we have to make cuz of the names
    var buildingName = cbSet.building;
    if(buildingName === 'Comp Des Research & Learn Ctr') {buildingList.push("CDRLC");}
    else if(buildingName === 'Behavioral Sciences Building') {buildingList.push("BSB");}
    else if(buildingName === 'Lecture Center Building A') {buildingList.push("Lecture Center A");}
    else if(buildingName === 'Lecture Center Building B') {buildingList.push("Lecture Center B");}
    else if(buildingName === 'Lecture Center Building C') {buildingList.push("Lecture Center C");}
    else if(buildingName === 'Lecture Center Building D') {buildingList.push("Lecture Center D");}
    else if(buildingName === 'Lecture Center Building E') {buildingList.push("Lecture Center E");}
    else if(buildingName === 'Lecture Center Building F') {buildingList.push("Lecture Center F");}
    else if(buildingName === 'Thomas Beckham Hall') {buildingList.push('TBH');}
    else if(buildingName === 'Academic & Residential Complex') {buildingList.push('ARC');}
    else if(buildingName === 'Science & Engineering South') {buildingList.push('SES');}
    else if(buildingName === 'Science & Engineering Lab East') {buildingList.push('Science & Engineering Labs East');}
    else if(buildingName === 'Science & Engineering Lab West') {buildingList.push('Science & Engineering Labs West');}
    else {
      buildingList.push(cbSet.building);
    }

    classList.push(cbSet.className);
    //addClass(cbSet.className, cbSet.building);
  });
  renderList();
}
//all done with file stuff

//this function will create a map for users based on the results they were given for their lots
function initializeMap(lotNames) {
  //first, we're going to plot every class building on the map that the user inputted

  //center serves as the center of the map
  const centerUIC = {lat: 41.87190224920448, lng: -87.6492414536955};

  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: centerUIC,
  });

  //let's take a look at buildingList to get these buildings; google maps lets us use a geocoder to create
  //latitude and longitude values for these class buildings
  const geocoder = new google.maps.Geocoder();

  for(let i = 0; i < buildingList.length; i++) {
    console.log(`originally, this building name is ${buildingList[i]}`);
    let buildingName = buildingList[i];
    let className = classList[i];
    //ill make a few exceptions because it in fact does not work universally as hoped for below
    //we will change them to their respective address
    if(buildingName === 'CDRLC') {buildingName = '842w W. Taylor St'};
    if(buildingName === 'Science & Engineering Labs East') {buildingName = '950 S Halsted St'};
    if(buildingName === 'Science & Engineering Labs West') {buildingName = '804 W Taylor St'};

    //we will use the building name along with , UIC for the address (hopefully this works unviersally)
    geocoder.geocode( {address: `${buildingName}, Chicago, IL 60607`}, (results, status) => {
      if(status === 'OK') {
        const location = results[0].geometry.location;
        new google.maps.Marker({
          position: location,
          map: map,
          label: {
            text: `${className}`,
            color: 'dodgerblue',
            fontSize: '14px',
            fontWeight: 'bold'
          },
          title: `${buildingName}`,
          icon: {
            url: "/images/classroom-icon.png",
            labelOrigin: new google.maps.Point(30, 55)
          },
        });
      } else {
        console.error(`There was an error using the geocoder for: ${buildingName}` + status);
      }
    });

    //next let's look at the parking results, which are separated by key and value
    let j = 1;
    Object.keys(lotNames).forEach((lot) => {
      console.log(lotNames);
      const rank = j;
      const address = lotNames[lot];
      //the color of the label will be determined by the rank of the lot in the algorithm
      let color = '';
      //if(j === 1) {color = 'gold';}
      //else if(j === 2) {color = 'silver';}
      //else {color = 'bronze';}

      //use a geocoder to get lat/lon of lot with a specific address!
      geocoder.geocode( {address: `${address}, Chicago, IL 60607`}, (results, status) => {
        if(status === 'OK') {
          const location = results[0].geometry.location;
          new google.maps.Marker({
            position: location,
            map: map,
            label: {
              text: `${lot} (ranked #${rank})`,
              color: 'black',
              fontSize: '15px',
              fontWeight: 'bold'
            },
            title: `${lot}`,
            icon: {
              url: "/images/parking-p-icon.png",
              labelOrigin: new google.maps.Point(30, 55)
            },
          });
        } else {
          console.error(`There was an error using the geocoder for: ${lot}` + status);
        }
      });

      j++;
    });
  }
}

function clearResults() {
  document.querySelector('.js-lot-banner-list')
    .innerHTML = '';
}

function displayRangeValues() {
  for(let i = 0; i < classList.length; i++) {
    const slider = document.getElementById(`rangeDisplay${i}`);
    const output = document.getElementById(`weight${i}`);

    if(!slider || !output) continue;


    //if slider is moved, values will change
    slider.addEventListener('input', function()  {
      output.innerHTML = `${slider.value}`;

      //output.innerHTML = slider.value;
      weightList[i] = Number(slider.value); //dynamically change the value in weightList through event listener
      console.log(weightList);
    });
  }
}


function renderList() {
  let listHTML = '';
  console.log(weightList);

  for(let i = 0; i < buildingList.length; i++) {
    const building = buildingList[i];
    const className = classList[i];
    var classesAmt = buildingList.length;
    var html = `
    <div class="class-list-item-${i}">
      <p>${className}</p>
      <p>${building}</p>
      <button onclick="deleteClass(${i})">
        <img src="images/trashcantrans.png">
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
        <input type="range" min="1" max="${Number(classesAmt)}" value="1" id="rangeDisplay${i}">
        <p>Ranking: <span id="weight${i}"></span></p>
      </div>`;
      }

    listHTML += html;
  }

  //console.log(listHTML);
  document.querySelector('.js-class-list')
    .innerHTML = '';

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
  let lots = {};


  for(let i = 0; i < 3; i++) { //by default, top 3 vals are shown
    const [lotName1, avgTime] = timeList[i];
    const found = Object.entries(lotDetailList).find(([lot, [accessType, lotSize, lotPicture, address]]) => {
      return lot.includes(lotName1);
    });

    if (found) {
      const [lotName2, [accessType, lotSize, lotPicture, address]] = found;
      lots[lotName2] = address;
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
              <p style="padding-top: 10px"></p>
              <div class="lot-attribute-list">
                <div class="accessible-attribute-container-${i}" style="display: flex; align-items: center;">
                  <img src="/images/accessibility-icon.png" style="height: 25px;">
                  <p>This lot is accessibility friendly and contains accessible spots. Visit https://parking.uic.edu/accessible-parking/ for more info.</p>
                </div>
                <div class="evcharge-attribute-container-${i}" style="display: flex; align-items: center;">
                  <img src="/images/evcharge-icon.png" style="height: 25px;">
                  <p>This lot contains spots for electric vehicle charging. Visit https://parking.uic.edu/electric-vehicles/ for more info.</p>
                </div>
                <div class="covered-attribute-container-${i}" style="display: flex; align-items: center;">
                  <img src="/images/covered-lot-icon.png" style="height: 25px">
                  <p>This lot is covered (offers protection from outside weather elements).</p>
                </div>
                <div class="open-attribute-container-${i}" style="display: flex; align-items: center;">
                  <img src="/images/open-lot-icon.png" style="height: 25px;">
                  <p>This lot is not covered (does not offer protection from outside weather elements).</p>
                </div>
              </div>
            </div>
            <hr>
            <div class="lot-banner-right">
              <p class="stats-header">Position in Time Ranking</p>
              <p>#${position}</p>

              <p class="stats-header">Lot Access Type</p>
              <p>${accessType}</p>
              
              <p class="stats-header">Estimated Amt of Spots Total</p>
              <p>${lotSize}</p>

              <!-- i am putting the avg walking time in a comment at least for now bc it doesnt represent accurately
              <p class="stats-header">Average Walking Time</p>
              <p>${avgTime} mins</p>
              -->
            </div>
          </div>
          <hr>
          <div class="lot-banner-bottom">
            <img src="/images/yellow-star.png">
            <p style="font-size: 15px; padding: 10px 3px">Favorite This Lot</p>
            <div class="lot-banner-bottom-right">
              <a class="lot-banner-button" href="https://parkingservices.uic.edu/studentparking/newapplication">Link to Parking Application</a>
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

    for(let i = 0; i < timeList.length; i++) {
      if(i >= 3) {continue;} //only top 3 results are shown
      const [lotName1, avgTime] = timeList[i];
      const found2 = Object.entries(lotAttributesList).find(([lot, [isCovered, isAccessible, hasCharging]]) => {
        return lot.includes(lotName1);
      });

      if(!found2) {
        console.log("Could not match lotAttributeList values with found2 values. Elements may be missing.");
        break;
      }

      const [lotName3, [isCovered = false, isAccessible = false, hasCharging = false]] = found2;


      
      
      if(isCovered) {
        document.querySelector(`.covered-attribute-container-${i}`).style.display = 'flex';
        document.querySelector(`.open-attribute-container-${i}`).style.display = 'none';
      } else {
        document.querySelector(`.covered-attribute-container-${i}`).style.display = 'none';
        document.querySelector(`.open-attribute-container-${i}`).style.display = 'flex';
      }
      if(isAccessible) {
        document.querySelector(`.accessible-attribute-container-${i}`).style.display = 'flex';
      } else {
        document.querySelector(`.accessible-attribute-container-${i}`).style.display = 'none';
      }
      if(hasCharging) {
        document.querySelector(`.evcharge-attribute-container-${i}`).style.display = 'flex';
      } else {
        document.querySelector(`.evcharge-attribute-container-${i}`).style.display = 'none';
      }
      
    }

  //lastly initialize the map that shows lots and classes
  initializeMap(lots);
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
  let lots = {}; //this will be sent to the map function


  for(let i = 0; i < appearancesList.length; i++) {
    if(i >= 3) {continue}; //by default, top 3 vals are shown
    //needs to find the lot in the lotdetaillist and the lotattributeslist
    const [lotName1, appearances] = appearancesList[i];

    const found1 = Object.entries(lotDetailList).find(([lot, [accessType, lotSize, lotPicture, address]]) => {
      return lot.includes(lotName1);
    });



    if (found1) {
      const [lotName2, [accessType, lotSize, lotPicture, address]] = found1;

      lots[lotName2] = address;
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
              <p style="padding-top: 10px"></p>
              <p style="margin-top: 5px; font-weight: 500; font-size: 13px;"> Your class buildings near this lot: ${buildings}</p>
              <p style="margin-top: 7px; font-weight: 500; font-size: 13px;">Specifics about this Lot:</p>
              <div class="lot-attribute-list">
                <div class="accessible-attribute-container-${i}" style="display: flex; align-items: center;">
                  <img src="/images/accessibility-icon.png" style="height: 25px;">
                  <p>This lot is accessibility friendly and contains accessible spots. Visit https://parking.uic.edu/accessible-parking/ for more info.</p>
                </div>
                <div class="evcharge-attribute-container-${i}" style="display: flex; align-items: center;">
                  <img src="/images/evcharge-icon.png" style="height: 25px;">
                  <p>This lot contains spots for electric vehicle charging. Visit https://parking.uic.edu/electric-vehicles/ for more info.</p>
                </div>
                <div class="covered-attribute-container-${i}" style="display: flex; align-items: center;">
                  <img src="/images/covered-lot-icon.png" style="height: 25px">
                  <p>This lot is covered (offers protection from outside weather elements).</p>
                </div>
                <div class="open-attribute-container-${i}" style="display: flex; align-items: center;">
                  <img src="/images/open-lot-icon.png" style="height: 25px;">
                  <p>This lot is not covered (does not offer protection from outside weather elements).</p>
                </div>
              </div>
            </div>
            <hr>
            <div class="lot-banner-right">
              <p class="stats-header">Position in Ranking</p>
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
              <a class="lot-banner-button" href="https://parkingservices.uic.edu/studentparking/newapplication">Link to Parking Application</a>
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

    for(let i = 0; i < appearancesList.length; i++) {
      if(i >= 3) {continue;} //only top 3 results are shown
      const [lotName1, appearances] = appearancesList[i];
      const found2 = Object.entries(lotAttributesList).find(([lot, [isCovered, isAccessible, hasCharging]]) => {
        return lot.includes(lotName1);
      });

      if(!found2) {
        console.log("Could not match lotAttributeList values with found2 values. Elements may be missing.");
        break;
      }

      const [lotName3, [isCovered = false, isAccessible = false, hasCharging = false]] = found2;


      
      
      if(isCovered) {
        document.querySelector(`.covered-attribute-container-${i}`).style.display = 'flex';
        document.querySelector(`.open-attribute-container-${i}`).style.display = 'none';
      } else {
        document.querySelector(`.covered-attribute-container-${i}`).style.display = 'none';
        document.querySelector(`.open-attribute-container-${i}`).style.display = 'flex';
      }
      if(isAccessible) {
        document.querySelector(`.accessible-attribute-container-${i}`).style.display = 'flex';
      } else {
        document.querySelector(`.accessible-attribute-container-${i}`).style.display = 'none';
      }
      if(hasCharging) {
        document.querySelector(`.evcharge-attribute-container-${i}`).style.display = 'flex';
      } else {
        document.querySelector(`.evcharge-attribute-container-${i}`).style.display = 'none';
      }
      
    }
    //lastly initialize the map for the users
    initializeMap(lots);
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

    const listText = document.querySelector('.excluded-lot-list');

  if(excludedLots.length === 0) {
    listText.innerHTML = 'Excluded Lot(s): None Selected';
  } else {
    listText.innerHTML = `Excluded Lot(s): ${excludedLots}`;
  }
  console.log(excludedLots);
}


