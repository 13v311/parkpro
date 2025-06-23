import admin from 'firebase-admin';
import fetch from 'node-fetch';
import serviceAccount from './parkprouic-firebase-adminsdk-fbsvc-aacc860f33.json' assert {type: "json"};
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount), 
  databaseURL:"https://parkprouic-default-rtdb.firebaseio.com/"
});

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const db = admin.database();

/*db.ref("test_from_node/hello").set("world")
  .then(() => {
    console.log("✅ Data written to Firebase!");
  })
  .catch((error) => {
    console.error("❌ Error writing to Firebase:", error);
  });*/

function writeSingleData(origin, destination, minutes) {
  const reference = 'walking_times/' + origin + '/' + destination
  db.ref(reference).set(minutes)
    .then(() => {
      console.log(`Writing ${minutes} mins from ${origin} to ${destination}`);
      console.log("Single data written successfully!");
    })
    .catch((error) => {
      console.error("Error writing single data:", error);
    });
}

  async function getWalkingTime(origin, destination) {
    const apiKey = "AIzaSyBPqV00eRg6Ch2uRO2OdJWrzelhMSbCJJU"; // 👈 paste your key here

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&mode=walking&key=${apiKey}`;

    console.log("Sending request to:", url);

    
    const response = await fetch(url);
    const data = await response.json();

    console.log("Raw response:", data);


    const element = data?.rows?.[0]?.elements?.[0];

    if (!element || element.status !== "OK") {
      console.warn(`⚠️ Could not get walking time from ${origin} to ${destination}. Status: ${element?.status}`);
      return;
    }

    const walkingTimeInSeconds = element.duration.value;
    const walkingTimeText = element.duration.text;
    const distanceText = element.distance.text;

    console.log("🚶 Time:", walkingTimeText);     // e.g. "17 mins"
    console.log("📏 Distance:", distanceText);   // e.g. "0.8 mi"

    writeSingleData(origin, destination, Math.round((walkingTimeInSeconds / 60)));

  }

  //Lot 1A, Lot1B, Lot3, Lot5, Lot6, Lot8, Lot9, Lot11, Lot14, Lot20
  const lots = ["1109 West Harrison Street", "1139 West Harrison Street", "924 South Morgan St, Chicago, IL 60607", "1135 South Morgan Street",
   "1135 South Halsted Street, Chicago, IL 60607", "401 South Peoria Street, Chicago, IL 60607", "501 South Morgan Street", "1055 West Congress Parkway", 
   "729 Rochford Street, Chicago, IL 60607", "1101 West Taylor Street", "Harrison Street Parking Structure", 
   "Halsted Parking Structure", "Maxwell Street Parking Structure", "Halsted Taylor Parking Structure"];    

   //const lots = ["Halsted Taylor Parking Structure"];

   //(the lecture centers have addresses instead, as well as the cdrlc since it's new, and taft hall, sele, lincoln hall)
  /*const buildings = ["Science & Engineering South", "804 West Taylor St", "950 South Halsted St", 
  "Engineering Research Facility", "850 West Taylor St", "Academic & Residential Complex", "UIC Lincoln Hall",
  "UIC Grant Hall", "UIC Burnham Hall", "825 South Halsted St", "Thomas Beckham Hall", "Behavioral Sciences Building", "805 South Morgan St",
  "803 South Morgan St, Chicago, IL", "802 South Halsted St, Chicago, IL", "804 South Halsted St", "806 South Halsted St", "807 South Morgan St"];
*/

/*const buildings = ["900 West Taylor St, Chicago, IL 60607", 
  "826 South Halsted St, Chicago, IL 60607", "830 South Halsted St, Chicago, IL 60607", 
"701 South Morgan St, Chicago, IL 60607", "802 South Halsted St"];
*/

const buildings = ["705 South Morgan Street, Chicago, IL 60607", "935 West Harrison Street, Chicago, IL 60607",
"929 West Harrison Street, Chicago, IL 60607"];

  //call function with all of these lots, one lot at a time
  /*async function runAllRequests() {
    console.log("🚀 Starting walking time collection...");
    for (let lot of lots) {
      for (let building of buildings) {
        await getWalkingTime(lot, building);
        await delay(1500);
      }
    }
  }

  runAllRequests()
    .then(() => console.log("🎉 All walking times completed!"))
    .catch(err => console.error("💥 Error during runAllRequests:", err));
*/
const renamedLotsMap = {
  "1109 West Harrison Street" : "Lot 1A",
  "1139 West Harrison Street" : "Lot 1B",
  "1135 South Morgan Street" : "Lot 5",
  "501 South Morgan Street" : "Lot 9",
  "1101 West Taylor Street" : "Lot 20",
  "1055 West Congress Parkway" : "Lot 11",
  "1135 South Halsted Street, Chicago, IL 60607" : "Lot 6",
  "401 South Peoria Street, Chicago, IL 60607" : "Lot 8",
  "729 Rochford Street, Chicago, IL 60607" : "Lot 14",
  "924 South Morgan St, Chicago, IL 60607" : "Lot 3",
  "Halsted Taylor Parking Structure" : "Halsted Taylor Parking Structure",
  "Harrison Street Parking Structure" : "Harrison Street Parking Structure",
  "Maxwell Street Parking Structure" : "Maxwell Street Parking Structure"
};

const renamedBuildingsMap = {
  //taft hall should be 826 south halsted, 
  "802 South Halsted St" : "Lecture Center C",
  "805 South Morgan St" : "Lecture Center A",
  "803 South Morgan St, Chicago, IL" : "Lecture Center B",
  "807 South Morgan St" : "Lecture Center F",
  "806 South Halsted St" : "Lecture Center E",
  "804 South Halsted St" : "Lecture Center D",
  "826 South Halsted St, Chicago, IL 60607" : "Taft Hall",
  "850 West Taylor St" : "CDRLC",
  "900 West Taylor St, Chicago, IL 60607" : "Science & Engineering Labs West",
  "950 South Halsted St" : "Science & Engineering Labs East",
  "701 South Morgan St, Chicago, IL 60607" : "Stevenson Hall",
  "830 South Halsted St, Chicago, IL 60607" : "Addams Hall",
  "UIC Burnham Hall" : "Burnham Hall",
  "UIC Grant Hall" : "Grant Hall", 
  "UIC Lincoln Hall" : "Lincoln Hall",
  "Academic & Residential Complex" : "ARC",
  "Behavioral Sciences Building" : "BSB",
  "Engineering Research Facility" : "ERF",
  "Thomas Beckham Hall" : "TBH",
  "Science & Engineering South" : "SES",
  "705 South Morgan Street, Chicago, IL 60607" : "Douglass Hall",
  "935 West Harrison Street, Chicago, IL 60607" : "Henry Hall",
  "929 West Harrison Street, Chicago, IL 60607" : "Jefferson Hall"
};

async function renameLotsAndBuildings() {
  for (const [oldLot, newLot] of Object.entries(renamedLotsMap)) {
    for (const [oldBuilding, newBuilding] of Object.entries(renamedBuildingsMap)) {
      const ref = db.ref('walking_times/' + oldLot + '/' + oldBuilding);

      const snapshot = await ref.once("value");
      const minutes = snapshot.val();

      if(minutes !== null) {
        writeSingleData(newLot, newBuilding, minutes);
        await ref.remove();
      }

    }
  }
}

renameLotsAndBuildings();

