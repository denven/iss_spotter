// index.js
const { nextISSTimesForMyLocation } = require('./iss');

const printPassTimes = function (array) {
  array.map(item => {
    console.log(`Next pass at ${Date(item.risetime)} for ${item.duration} seconds!`);
  });
};

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  printPassTimes(passTimes);
});
