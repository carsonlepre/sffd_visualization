// Create a map object for San Francisco
var myMap = L.map("map", {
  center: [37.7749, -122.4194],
  zoom: 13
});



// Add the tile layer (I'm still not sure what this does, I just copied it from the homework.)
//Also, I hard coded the API key, just to make things slightly simpler. 
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: "pk.eyJ1IjoiY2Fyc29ubGVwcmUiLCJhIjoiY2swN2Z6N2NzMDc3ajNib2JmZDA1N3VlOCJ9.rehbVxixsGnyYv4TFOKH4A"
}).addTo(myMap);


//Initialize a variable containing a list of dictionaries whose data can be parsed with a for loop.
var calls = [{
  incident_id: "1901629984",
  location: [37.77966604, -122.4137112],
  unit_id: "84",
  final_priority: "3",
  response_time: "3.48"
},
{
  incident_id: "1901627084",
  location: [37.71323913, -122.4729724],
  unit_id: "84",
  final_priority: "3",
  response_time: "8.46"
},
{
  incident_id: "1901625084",
  location: [37.73974948, -122.4646284],
  unit_id: "84",
  final_priority: "3",
  response_time: "5.09"
},
{
  incident_id: "1901622384",
  location: [37.73762369, -122.3931884],
  unit_id: "84",
  final_priority: "2",
  response_time: "6.84"
}
];


// Loop through the cities array and create one marker for each call.
for (var i = 0; i < calls.length; i++) {
  var call = calls[i];
  L.marker(call.location)
    .bindPopup("<h1>Response Time: " + call.response_time + "</h1> <hr> <h3>Priority " + call.final_priority + "</h3>")
    .addTo(myMap);
}
