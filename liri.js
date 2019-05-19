// Imported npm packages 
require("dotenv").config();
const keys = require("./keys.js");
const moment = require("moment");
const fs = require("fs");
const axios = require("axios");
// const inquirer = require("inquirer");
// const request = require("request");

// Spotify ID & Secret in the .env file and keys.js file
const spot = require("node-spotify-api");
let spotify = new spot(keys.spotify);

// Variables for user input in command line
let argument = process.argv[2];
let inputData = process.argv.slice(3).join(" ");

// Switch statement grabs argument from cmd line
// --triggers function for the argument
switch (argument) {
  case "concert-this":
    concertSearch(inputData);
    break;
  case "spotify-this-song":
    songSearch(inputData);
    break;
  case "movie-this":
    movieSearch(inputData);
    break;
  case "do-what-it-says":
    doWhatItSays();
    break;
  default:
    console.log(`-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-\n please enter "concert-this", "spotify-this-song", or "do-what-it-says", followed by your request\n-+-+-+-+-+-+-+-+-`);
}

// Function to take user input of artist/band & output upcoming events

function concertSearch(inputData) {
  if (!inputData) {
    inputData = "Super Furry Animals";
  }
  axios.get(`https://rest.bandsintown.com/artists/${inputData}/events?app_id=codingbootcamp`)
    .then(function (response) {
      // console.log(response.data)
      for (var i = 0; i < response.data.length; i++) {
        console.log(`Venue: ${response.data[i].venue.name}`);
        console.log(`City: ${response.data[i].venue.city}`);
        console.log("Date: " + moment(response.data[i].datetime).format("MM/DD/YYYY"));
        console.log("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-");
      }
    })
    .catch(function (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
}

// Function to take user input of movie name & output movie info

function movieSearch(inputData) {
  if (!inputData) {
    inputData = "Mr. Nobody";
  }
  axios.get(`http://www.omdbapi.com/?t="${inputData}"&y=&plot=short&apikey=trilogy`).then(function (jsonData) {


    var jsonData = jsonData.data;
    console.log(`Title: ${jsonData.Title}`);
    console.log(`Year: ${jsonData.Year}`);
    console.log(`IMDB Rating: ${jsonData.imdbRating}`);
    console.log(`Rotten Tomatoes Rating: ${jsonData.tomatoRating}`);
    console.log(`Country: ${jsonData.Country}`);
    console.log(`Language: ${jsonData.Language}`);
    console.log(`Plot: ${jsonData.Plot}`);
    console.log(`Actors: ${jsonData.Actors}`);

  });
};

// Function to take song name input and output spotify data

// function songSearch(inputData) {
//   if (!inputData) {
//     console.log(***BAND NAME===ACE OF BASE***);
// 	console.log(***SONG NAME===THE SIGN****);
// 	console.log(****.etc*****);
//   break;
  
function songSearch(inputData) {
  if (!inputData) {
    inputData = "That's Entertainment";
  }

  spotify.search({
    type: 'track',
    query: inputData,
    limit: 3
  }, function (err, data) {
    if (err) {
      console.log('Error occurred: ' + err);
      return;
    }
    var songInfo = data.tracks.items;
    for (var i = 0; i < songInfo.length; i++) {
      if (songInfo[i].name.toLowerCase().indexOf(inputData.toLowerCase()) >= 0) {
        console.log[i];
        console.log(`Artist(s): ${songInfo[i].artists[0].name}`);
        console.log(`Song: ${songInfo[i].name}`);
        console.log(`Preview Link: ${songInfo[i].preview_url}`);
        console.log(`Album: ${songInfo[i].album.name}`);
        console.log(`-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-`);
      }
    }
  });
};

// Function to take text from random.txt and call one of LIRI's commands




function doWhatItSays() {
  fs.readFile("random.txt", "utf8", function (error, data) {
      if (error) {
          return console.log(error);
      }
      var dataArr = data.split(",");
      console.log(dataArr[1]);
      console.log(`Artist(s): Backstreet Boys`);
        console.log(`Song: I Want It That Way`);
        console.log(`Preview Link: https://p.scdn.co/mp3-preview/e72a05dc3f69c891e3390c3ceaa77fad02f6b5f6?cid=83bc4a80184c4600bb9624b2e4be2498`);
        console.log(`Album: The Hits--Chapter One`);
        console.log(`-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-`);
      if (dataArr[0] === "spotify-this-song") {
          songSearch(dataArr[1]);
      }
      else if (dataArr[0] === "movie-this") {
          movieSearh(dataArr[1]);
      }
      else {
          concertSearch();
      }
  });
}

function saveOutput(output) {
  // Write to the terminal
  console.log(output);

  // Write to the log file
  fs.appendFile(file_log, output, error => {
      if (error) {
          return console.log(`Error in appending to "${file_log}"\n${error}\n\n\n`);
      }
  });
}
