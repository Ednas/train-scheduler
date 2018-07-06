// Initialize Firebase
var config = {
    apiKey: "AIzaSyCyFwNZjys0krmoC3U01ZYvYKzQ17_3BS8",
    authDomain: "train-time-2c1cc.firebaseapp.com",
    databaseURL: "https://train-time-2c1cc.firebaseio.com",
    projectId: "train-time-2c1cc",
    storageBucket: "",
    messagingSenderId: "591191230804"
};
firebase.initializeApp(config);

var trainData = firebase.database().ref();


// Button for adding trains
$("#addTrainBtn").on("click", function() {
    event.preventDefault();
    // Grabs user input
    var trainName = $("#trainNameInput").val().trim();
    var destination = $("#destinationInput").val().trim();
    var firstTrain = moment($("#firstTrainInput").val().trim(), "HH:mm").subtract(10, "years").format("X");
    var frequency = $("#frequencyInput").val().trim();

    // Creates local "temporary" object for holding train data
    var newTrain = {
        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency
    }

    // Uploads train data to the database
    trainData.push(newTrain);

    // Alert
    alert(newTrain.name + " has been successfully added");

    // Clears all of the text-boxes
    $("#trainNameInput").val("");
    $("#destinationInput").val("");
    $("#firstTrainInput").val("");
    $("#frequencyInput").val("");

    return false;
});


// Create Firebase event for adding trains to the database and a row in the html when a user adds an entry
trainData.on("child_added", function(childSnapshot) {

    let data = childSnapshot.val();
    let trainNames = data.name;
    let trainDestin = data.destination;
    let trainFrequency = data.frequency;
    let theFirstTrain = data.firstTrain;

    // Calculate the minutes until arrival using hardcore math
    // To calculate the minutes till arrival, take the current time in unix subtract the FirstTrain time and find the modulus between the difference and the frequency  
    let tRemainder = moment().diff(moment.unix(theFirstTrain), "minutes") % trainFrequency;
    let tMinutes = trainFrequency - tRemainder;

    // To calculate the arrival time, add the tMinutes to the currrent time
    let tArrival = moment().add(tMinutes, "m").format("hh:mm A");

    // [Work on later] Sort function
    // data.ref.orderByChild("firstTrain")
    // console.log(nextTrain);
    // Add each train's data into the table 
    $("#trainTable > tbody").append("<tr><td>" + trainNames + "</td><td>" + trainDestin + "</td><td id='min'>" + trainFrequency + "</td><td id='min'>" + tArrival + "</td><td id='min'>" + tMinutes + "</td></tr>");

});

$("#currentTime").append(moment().format("hh:mm A"));

//Sort function

// var sortable = [];
// for (var firstTrain in maxSpeed) {
//     sortable.push([vehicle, maxSpeed[vehicle]]);
// }

// sortable.sort(function(a, b) {
//     return a[1] - b[1];
// });
// var points = [40, 100, 1, 5, 25, 10];
// points.sort(function(a, b){return a - b});