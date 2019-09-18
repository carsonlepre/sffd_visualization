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

  var dayofWeek;
  // var hourofDay;
 
  d3.selectAll("input[name='options']").on("change", function(){
    dayofWeek = this.id
    });
  
  

  // d3.selectAll("#ex16a").on("change", function(){
  //   hourofDay = this.value
  //    });


// For non-getter methods, you can chain together commands


      // Use the first sample from the list to build the initial plots
    const firstDay = 1;
    buildCharts(firstDay);
    addMap(firstDay,"Y");

  //  buildMetadata(firstSample);
};

function optionChanged(dayofWeek) {
  // Fetch new data each time a new sample is selected

  buildCharts(dayofWeek);
  addMap(dayofWeek,"N");
}


function addMap(day,initial) {
 
  // document.getElementById("map").outerHTML = "";
   
 
 if (initial == "Y")  {
    myMap = new L.map("map", {
    center: [37.7749, -122.4194],
    zoom: 13
  });
}

myMap.eachLayer(function (layer) {
  myMap.removeLayer(layer);
});

  // Adding a tile layer (the background map image) to our map
  // We use the addTo method to add objects to our map
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 20,
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

// var areaToValue = {};

var url = `/day_of_week_area/${day}`;
  d3.json(url).then(function(data) {

    var xValues = data.station_area;
    var yValues = data.calls;

    // TODO (populate the dictionary)
    // var minColor = 0;
    // var maxColor = 0;
    for (i = 0; i < data.station_area.length; ++i) {
      if (data.calls[i] < minColor) {minColor = data.calls[i]}
      if (data.calls[i] > maxColor) {maxColor = data.calls[i]}
      areaToValue[data.station_area[i]] = data.calls[i];
    }
 
    L.geoJson(areaData2, {style: style}).addTo(myMap);

    // var graphDiv = document.getElementById('daily_chart') 
    // var plotData = [
    //   {
    //     x: xValues,
    //     y: yValues,
    //     type: 'bar'
    //   }
    // ];
    // Plotly.newPlot(graphDiv, plotData);

});


//////////////////////////////////////////////////


 L.geoJson(areaData2).addTo(myMap);

  // var url = `/day_of_week_total_area/${day}`;

  // jsonObject = JSON.parse(url);
  // console.log(jsonObject);
     
 // L.geoJson(areaData2, {style: style}).addTo(myMap);
// update geoJson based on results of query

};


 function getColor(d) {
   q = areaToValue[d];
   var r = (q-minColor)/(maxColor-minColor) 
 return       r > .9 ? '#800000' :
              r > .8 ? '#8E1C18' :
              r > .7 ? '#9C3831' :
              r > .6 ? '#AA554A' :
              r > .5 ? '#B87163' :
              r > .4 ? '#C68D7C' :
              r > .3 ? '#D4AA95' :
              r > .2 ? '#E2C6AE' :
              r > .1 ? '#F0E2C7' :
                       '#FFFFE0' ;
                      

  //  return     q > 700 ? '#800026' :
  //             q > 600 ? '#BD0026' :
  //             q > 500  ? '#E31A1C' :
  //             q > 400  ? '#FC4E2A' :
  //             q > 300 ? '#FD8D3C' :
  //             q > 200 ? '#FEB24C' :
  //             q > 100   ? '#FED976' :
  //                     '#FFEDA0';
   }
  

function style(feature) {
	return {
		fillColor: getColor(feature.properties.FID),
		weight: 2,
		opacity: 1,
		color: 'white',
		fillOpacity: 0.6
	};
}

// Initialize the dashboard
init();
