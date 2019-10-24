// This is connecting your app to Firebase
var config = {
	apiKey: "AIzaSyCzn78NKDPBKEMeEpFnpPFRDZnBF1MGcuA",
	authDomain: "trainschedule-b8ac1.firebaseapp.com",
	databaseURL: "https://trainschedule-b8ac1.firebaseio.com",
	projectId: "trainschedule-b8ac1",
	storageBucket: "trainschedule-b8ac1.appspot.com",
	messagingSenderId: "539883479478"
};
// Actually initializing the app to allow input into firebase
firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();

//Declaring the CURRENT TIME using moment.js
var currentTime = moment().format();

//Logging the current time
console.log("Current Time: " + currentTime);

// This is my on.click function to run prevent default
$("#click-button").on("click", function () {
	// Prevent the page from refreshing
	event.preventDefault();

	// Grab any input the end user puts in
	var trainNameForm = $("#trainNameForm").val().trim();
	var destinationForm = $("#destinationForm").val().trim();
	var trainTimeForm = moment($("#trainTimeForm").val().trim(), "HH:mm").format("HH:mm");

	//	  var frequencyForm = moment($("#frequencyForm").val().trim().format("mm"));
	var frequencyForm = $("#frequencyForm").val().trim();

	// Create a new variable to save ALL above INPUT data into a single variable
	var newTrain = {
		train: trainNameForm,
		destination: destinationForm,
		first: trainTimeForm,
		frequency: frequencyForm
	};
	//Setting the new values in the database
	database.ref().push(newTrain);


	//Console.logging to make sure the new data has been stored to the database
	console.log(newTrain.train);
	console.log(newTrain.destination);
	console.log(newTrain.first);
	console.log(newTrain.frequency);

	//Clearing the inputs
	$("#trainNameForm").val("");
	$("#destinationForm").val("");
	$("#trainTimeForm").val("");
	$("#frequencyForm").val("");
});

//Creates firebase input to to save 
database.ref().on("child_added", function (childSnapshot, prevChildKey) {


	console.log(childSnapshot.val());

	// Store everything into a variable.
	var trainName = childSnapshot.val().train;
	var trainDestination = childSnapshot.val().destination;
	var trainTime = childSnapshot.val().first;
	var trainFrequency = childSnapshot.val().frequency;
	currentTime = moment().format();

	//Variable to figure out the converted train time
	var trainTimeConverted = moment(trainTime, "HH:mm");
	if (trainTimeConverted.diff(moment(), "minutes") >= 0) {
		console.log("first train in the future");
		minutesAway = moment(trainTime, "HH:mm").diff(moment(), "minutes");
		var nextArrival = moment(currentTime).add(minutesAway, "minutes").format("hh:mm A");
	} else {


		//Declaring a time difference variable
		var timeDifference = moment().diff(moment(trainTimeConverted), "minutes");
		console.log(timeDifference);

		var frequencyMinutes = childSnapshot.val().frequency;
		console.log("Frequency Minutes: " + frequencyMinutes);


		var timeRemainder = Math.abs(timeDifference % frequencyMinutes);


		var minutesAway = frequencyMinutes - timeRemainder;
		console.log("Minutes Away: " + minutesAway);

		var nextArrival = moment(currentTime).add(minutesAway, "minutes").format("hh:mm A");
		console.log("Next Arrival: " + nextArrival);

	}
	//Adding into the table
	$("#trainScheduleTable > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + trainFrequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");
});