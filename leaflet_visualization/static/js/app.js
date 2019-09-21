function buildCharts(day,hour) {

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

//`/map_responses/${day}/${hour}`; 
  //var url = `/map_calls/${day}/${hour}`;

  if (document.getElementById("Choice1").checked) { 
    var url = `/map_calls/${day}/${hour}`;
    }
    else {
      var url = `/map_responses/${day}/${hour}`; 
    }

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

  
  d3.selectAll("input[name='options']").on("change", function(){
    dayofWeek = this.id
    });
  
  

  // d3.selectAll("#ex16a").on("change", function(){
  //   hourofDay = this.value
  //    });


// For non-getter methods, you can chain together commands


      // Use the first sample from the list to build the initial plots
    buildCharts(dayofWeek,hourofDay);
    addMap(dayofWeek,hourofDay,"Y");

  //  buildMetadata(firstSample);
};

function dayChanged(day) {

  var x = document.getElementsByName("options");
  var y = document.getElementsByClassName("btn")
  // console.log(x);
  // console.log(x.length);


  var i;
  for (i = 0; i < x.length; i++) {

   // x[i].classList.add ("btn btn-secondary active");
   if (x[i].checked == true) {
   y[i].className= "btn btn-secondary active";
  }
  else {
  y[i].className= "btn btn-secondary";
  }

  }
 
  dayofWeek = day;
}

function optionChanged() {
  // Fetch new data each time a new sample is selected
  hourofDay = document.getElementById('slider1').value;
  // alert("onChanged day: "+dayofWeek+" hour: "+hourofDay)
    buildCharts(dayofWeek,hourofDay);
  addMap(dayofWeek,hourofDay,"N");
}


function addMap(day,hour,initial) {
 
  // document.getElementById("map").outerHTML = "";
  // alert("onMap day: "+dayofWeek+" hour: "+hourofDay)
 
 if (initial == "Y")  {
    myMap = new L.map("map", {
    center: [37.76, -122.44],
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
// var marker = L.marker([37.7749, -122.4194], {
//   draggable: true,
//   title: "My First Marker"
// }).addTo(myMap);


//////////////////////////////////////////////////

// var areaToValue = {};

// var hour = document.getElementById("slider1").value 
if (document.getElementById("Choice1").checked) { 
var url = `/map_calls/${day}/${hour}`;
}
else {
  var url = `/map_responses/${day}/${hour}`; 
}

  d3.json(url).then(function(data) {

    var xValues = data.station_area;
    var yValues = data.calls;

    // TODO (populate the dictionary)
    minColor = 0;
    maxColor = 0;
    
    for (i = 0; i < data.station_area.length; ++i) {
    //  console.log("area "+data.station_area[i])
      if (data.calls[i] < minColor) {minColor = data.calls[i]}
      if (data.calls[i] > maxColor) {maxColor = data.calls[i]}
      areaToValue[data.station_area[i]] = data.calls[i];
    }

    L.geoJson(areaData2, {style: style}).addTo(myMap);

    
        ////////////////////////////////////////////////////

  //   if (initial != "Y")  {
  //     alert("delete1");
  //     alert ("type1 "+ typeof(document.getElementById("info legend")))
  //     alert ("type2 "+ typeof(div_legend))
  //     document.getElementById("info legend").innerHTML = "";
  //   }
  // //  delete myMap.legend; 
  //   if (typeof (legend) != 'undefined') {
  //     alert("delete2")
  //     document.getElementById("info legend").innerHTML = "";
  //     myMap.removeControl(legend);
  
  //   }
     
  //   if (legend instanceof L.Control) { myMap.removeControl(legend)};  
   
    var legend = L.control({position: 'bottomright'});

legend.onAdd = function (myMap) {
  var grades = [];
  for (i = 0; i < 10; ++i) {
    grades[i] = Math.round((minColor + (i / 11.0) * (maxColor-minColor))*100) / 100; 
   }
 
  //  console.log(div_legend);
   if (!div_legend) {
 
    div_legend = L.DomUtil.create('div', '');
   }
   
  
 
	//labels = [];

	// loop through our density intervals and generate a label with a colored square for each interval
  div_legend.innerHTML = "";
  for (var i = 0; i < grades.length; i++) {
    div_legend.innerHTML +=
    '<i style="background-color: red;"></i> ' +
			//'<i style="background-color:' + "'"+ getColor(grades[i] + 1) +  "'" + ';"></i> ' +
			grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
	}
 
  return div_legend;
  if (initial != "Y")  {
  myMap.removeControl(legend);
  }
};

legend.addTo(myMap);
    
//////////////////////////////// 

    
    
    //////////////////////////////////////////////////////
    
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


// L.geoJson(areaData2).addTo(myMap);

  // var url = `/day_of_week_total_area/${day}`;

  // jsonObject = JSON.parse(url);
  // console.log(jsonObject);
     
 // L.geoJson(areaData2, {style: style}).addTo(myMap);
// update geoJson based on results of query

};


 function getColor(d) {
   q = areaToValue[d];
 //  console.log("area "+d+" "+ q)
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
