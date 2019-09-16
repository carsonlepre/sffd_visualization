function buildCharts(day) {

  // Use `d3.json` to fetch the sample data for the plots
  var url = `/day_of_week_total/${day}`;

  d3.json(url).then(function(data) {

    var xValues = data.hour;
    var yValues = data.calls;

    var data = [
      {
        x: xValues,
        y: yValues,
        type: 'bar'
      }
    ];
     var graphDiv = document.getElementById('hourly_chart') 
    Plotly.newPlot(graphDiv, data);
 
  });
  
///////////////////////////////////////////////////
  var url = `/day_of_week_area/${day}`;
  d3.json(url).then(function(data) {

    var xValues = data.station_area;
    var yValues = data.calls;

    var data = [
      {
        x: xValues,
        y: yValues,
        type: 'bar'
      }
    ];
    var graphDiv = document.getElementById('daily_chart') 
    Plotly.newPlot(graphDiv, data);

});


};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  var sampleNames = [1,2,3,4,5,6,7];
  
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
 
    // Use the first sample from the list to build the initial plots
    const firstDay = 1;
    buildCharts(firstDay);
    addMap(firstDay);

  //  buildMetadata(firstSample);
};

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  addMap(newSample);
}

function initCap (str) {
  return (str.charAt(0).toUpperCase() + str.slice(1).toLowerCase());
};

function addMap(day) {

  var myMap = L.map("map", {
    center: [37.7749, -122.4194],
    zoom: 13
  });
  
  // Adding a tile layer (the background map image) to our map
  // We use the addTo method to add objects to our map
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  }).addTo(myMap);
  

//Create a new marker
// Pass in some initial options, and then add it to the map using the addTo method
var marker = L.marker([37.7749, -122.4194], {
  draggable: true,
  title: "My First Marker"
}).addTo(myMap);


//////////////////////////////////////////////////

 
 L.geoJson(areaData2).addTo(myMap);

  // var url = `/day_of_week_total_area/${day}`;

  // jsonObject = JSON.parse(url);
  // console.log(jsonObject);
     
 L.geoJson(areaData2, {style: style}).addTo(myMap);
// update geoJson based on results of query

};


function getColor(d) {
  // update color based on results of query
	return d > 40 ? '#800026' :
	       d > 35 ? '#BD0026' :
	       d > 30  ? '#E31A1C' :
	       d > 25  ? '#FC4E2A' :
	       d > 20  ? '#FD8D3C' :
	       d > 10  ? '#FEB24C' :
	       d > 5   ? '#FED976' :
                     '#FFEDA0';
}

function style(feature) {
	return {
		fillColor: getColor(feature.properties.FID),
		weight: 2,
		opacity: 1,
		color: 'white',
		fillOpacity: 0.7
	};
}

// Initialize the dashboard
init();
