window.onload = function () {
  // Call leaflet map into map frame
//base map
var map = L.map('map').setView([36.292, -110.090], 8);
var wellMarkers = new L.FeatureGroup();
var HikeBike_HikeBike = L.tileLayer('https://tiles.wmflabs.org/hikebike/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
HikeBike_HikeBike.addTo(map);

"use strict"; //JS strict mode

// Modal window 
// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function () {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Add chapters layer to map
var myStyle = {
    "color": "#dbc38f",
    "stroke-width": 0.5,
    "fill-opacity": 1.0
}

$.getJSON("data/nnChapters.geojson", function (data) {
    // L.geoJson(data).addTo(map);
    var geojson = L.geoJson(data, {
        style: myStyle,
        onEachFeature: function (feature, layer) {
            var chPopup = "Chapter:<br>" + feature.properties.Chapter
            layer.bindPopup(chPopup);
        }
    });
    geojson.addTo(map)
});
// create charts
d3.json('data/nnWells.json', function (error, data) {
    var wellData = data.features;
    _.each(wellData, function (d) {
        d.count = +d.count;
        // round to the nearest 200
        d.ca = Math.round(+d.properties.Ca / 100) * 100;
        d.u = Math.round(+d.properties.U / 100) * 100;
        d.as = Math.round(+d.properties.As_ / 50) * 50;
        d.ra_tot = d.properties.Ra_Total;
        // round to the nearest 100
        d.ca = Math.floor(+d.properties.Ca / 100) * 100;

    });
    // set crossfilter
    var ndx = crossfilter(wellData);

    var caDim = ndx.dimension(function (d) { return d.properties.Ca; });
    var uDim = ndx.dimension(function (d) { return d.properties.U; });
    var asDim = ndx.dimension(function (d) { return d.properties.As_; });
    var ra_totDim = ndx.dimension(function (d) { return d.properties.Ra_Total; });

    var allDim = ndx.dimension(function (d) { return d; });
    // create groups (y-axis values)
    var all = ndx.groupAll();
    var countPerCa = caDim.group().reduceCount();
    var countPerU = uDim.group().reduceCount();
    var countPerAs = asDim.group().reduceCount();
    var countPerRa_tot = ra_totDim.group().reduceCount();

    //specify charts
    var caCountChart = dc.barChart('#histogram1');
    var uCountChart = dc.barChart('#histogram2');
    var asCountChart = dc.barChart('#histogram3');
    var ra_totCountChart = dc.barChart('#histogram4');

    var dataTable = dc.dataTable('#data-table');

    caCountChart
        .width(250)
        .height(250)
        .dimension(caDim)
        .group(countPerCa)
        .x(d3.scale.linear().domain([0, 976]))
        .y(d3.scale.linear().domain([0, 13]))
        .elasticY(false)
        .centerBar(true)
        .barPadding(3)
        .xAxisLabel('Calcium')
        .yAxisLabel('Count')
        .margins({ top: 10, right: 20, bottom: 50, left: 50 });
    caCountChart.xAxis().tickValues([0, 200, 400, 600, 800, 1000]);
    caCountChart.yAxis().tickValues([0, 3, 6, 9, 12]);

    uCountChart
        .width(250)
        .height(250)
        .dimension(uDim)
        .group(countPerU)
        .x(d3.scale.linear().domain([0, 700]))
        .y(d3.scale.linear().domain([0, 20]))
        .elasticY(false)
        .centerBar(true)
        .barPadding(3)
        .xAxisLabel('Uranium')
        .yAxisLabel('Count')
        .margins({ top: 10, right: 20, bottom: 50, left: 50 });
    uCountChart.xAxis().tickValues([0, 200, 400, 600]);
    uCountChart.yAxis().tickValues([0, 5, 10, 15, 20]);

    asCountChart
        .width(250)
        .height(250)
        .dimension(asDim)
        .group(countPerAs)
        .x(d3.scale.linear().domain([0, 282]))
        .y(d3.scale.linear().domain([0, 30]))
        .elasticY(false)
        .centerBar(true)
        .barPadding(3)
        .xAxisLabel('Arsenic')
        .yAxisLabel('Count')
        .margins({ top: 10, right: 20, bottom: 50, left: 50 });
    asCountChart.xAxis().tickValues([0, 50, 100, 150, 200, 250]);
    asCountChart.yAxis().tickValues([0, 10, 20, 30]);

    ra_totCountChart
        .width(250)
        .height(250)
        .dimension(ra_totDim)
        .group(countPerRa_tot)
        .x(d3.scale.linear().domain([0, 1]))
        .elasticY(false)
        .centerBar(true)
        .barPadding(3)
        .xAxisLabel('Radium_Total')
        .yAxisLabel('Count')
        .margins({ top: 10, right: 20, bottom: 50, left: 50 });
    ra_totCountChart.xAxis().tickValues([0.2, 0.4, 0.6, 0.8, 1]);

    dataTable
        .dimension(allDim)
        .group(function (d) { return 'dc.js insists on putting a row here so I remove it using JS'; })
        .size(1000)
        .columns([
            function (d) { return d.properties.well_id; },
            function (d) { return d.properties.Ca; },
            function (d) { return d.properties.U; },
            function (d) { return d.properties.As_; },
            function (d) { return d.properties.Ra_Total }
        ])
        .on('renderlet', function (table) {
            // each time table is rendered remove nasty extra row dc.js insists on adding
            table.select('tr.dc-table-group').remove();

            wellMarkers.clearLayers();
            _.each(allDim.top(Infinity), function (d) {
                var filLoc = d.properties;
                var id = d.properties.well_id;
                var marker = L.marker([filLoc.lat, filLoc.long]); 
                marker.bindPopup( "<dl><dt> WELL INFORMATION- NAVAJO NATION WELL" + "<dt>FID:" + d.properties.FID + ";<dd>" + "<dt> OBJECTID:" + d.properties.OBJECTID + ";<dd>" + "<dt> well_no:" + d.properties.well_no + ";<dd>" + "<dt> well_id:" + d.properties.well_id + ";<dd>" + "<dt> well_name:" + d.properties.well_name + ";<dd>" + "<dt> owner:" + d.properties.owner + ";<dd>" + "<dt> depth:" + d.properties.depth + ";<dd>" + "<dt> aquifer_co:" + d.properties.aquifer_co + ";<dd>" + "<dt> swl:" + d.properties.swl + ";<dd>" + "<dt> pwsid:" + d.properties.pwsid + ";<dd>" + "<dt> usgs_id:" + d.properties.usgs_id + ";<dd>" + "<dt> data_sourc:" + d.properties.data_sourc + ";<dd>" + "<dt> comments:" + d.properties.comments + ";<dd>" + "<dt> aka2:" + d.properties.aka2 + ";<dd>" + "<dt> aka3:" + d.properties.aka3 + ";<dd>" + "<dt> chapid:" + d.properties.chapid + ";<dd>" + "<dt> grazing_di:" + d.properties.grazing_di + ";<dd>" + "<dt> welltype:" + d.properties.welltype + ";<dd>" + "<dt> well_use:" + d.properties.well_use + ";<dd>" + "<dt> well_statu:" + d.properties.well_statu + ";<dd>" + "<dt> sdwa_type:" + d.properties.sdwa_type + ";<dd>" + "<dt> nn_agency:" + d.properties.nn_agency + ";<dd>" + "<dt> USE:" + d.properties.USE + ";<dd>" + "<dt> FID_ :" + d.properties.FID_ + ";<dd>" + "<dt> well_id_1:" + d.properties.well_id_1 + ";<dd>" + "<dt> Alkalinity:" + d.properties.Alkalinity + ";<dd>" + "<dt> Alkalini_1:" + d.properties.Alkalini_1 + ";<dd>" + "<dt> As_:" + d.properties.As_ + ";<dd>" + "<dt> Ba:" + d.properties.Ba + ";<dd>" + "<dt> Be:" + d.properties.Be + ";<dd>" + "<dt> Br_:" + d.properties.Br_ + ";<dd>" + "<dt> Ca:" + d.properties.Ca + ";<dd>" + "<dt> Cd:" + d.properties.Cd + ";<dd>" + "<dt> Cl_:" + d.properties.Cl_ + ";<dd>" + "<dt> Conductivity:" + d.properties.Conductivi + ";<dd>" + "<dt> Cr:" + d.properties.Cr + ";<dd>" + "<dt> DO:" + d.properties.DO + ";<dd>" + "<dt> Electrical:" + d.properties.Electrical + ";<dd>" + "<dt> Gross_alph:" + d.properties.Gross_alph + ";<dd>" + "<dt> GrossAplha:" + d.properties.GrossAplha + ";<dd>" + "<dt> GrossBeta:" + d.properties.GrossBeta + ";<dd>" + "<dt> GrossBeta_:" + d.properties.GrossBeta_ + ";<dd>" + "<dt> Hardness:" + d.properties.Hardness + ";<dd>" + "<dt> Hardness_T:" + d.properties.Hardness_T + ";<dd>" + "<dt> Hg:" + d.properties.Hg + ";<dd>" + "<dt> Hydroxide:" + d.properties.Hydroxide + ";<dd>" + "<dt> K:" + d.properties.K + ";<dd>" + "<dt> Mg:" + d.properties.Mg + ";<dd>" + "<dt> Mn:" + d.properties.Mn + ";<dd>" + "<dt> Na:" + d.properties.Na + ";<dd>" + "<dt> Na_Fractio:" + d.properties.Na_Fractio + ";<dd>" + "<dt> Na_K:" + d.properties.Na_K + ";<dd>" + "<dt> Nitrate:" + d.properties.Nitrate + ";<dd>" + "<dt> Nitrate_Ni:" + d.properties.Nitrate_Ni + ";<dd>" + "<dt> NO2_:" + d.properties.NO2_ + ";<dd>" + "<dt> NO3_:" + d.properties.NO3_ + ";<dd>" + "<dt> ORP:" + d.properties.ORP + ";<dd>" + "<dt> Pb:" + d.properties.Pb + ";<dd>" + "<dt> Ra_226:" + d.properties.Ra_226 + ";<dd>" + "<dt> Ra_228:" + d.properties.Ra_228 + ";<dd>" + "<dt> Ra_Total:" + d.properties.Ra_Total + ";<dd>" + "<dt> Sb:" + d.properties.Sb + ";<dd>" + "<dt> Se:" + d.properties.Se + ";<dd>" + "<dt> Temperature:" + d.properties.Temperatur + ";<dd>" + "<dt> Tl:" + d.properties.Tl + ";<dd>" + "<dt> Turbidity:" + d.properties.Turbidity + ";<dd>" + "<dt> U:" + d.properties.U + ".<dt><dl>");
                wellMarkers.addLayer(marker);
            });
            map.addLayer(wellMarkers);
            map.fitBounds(wellMarkers.getBounds());
        });
    dc.renderAll();

});



  //change well markers to circle

  // function pointToCircle(feature, latlng) {
  //   if (feature.properties.USE == "Independent") {
  //     fillCOlor_Var = "black";
  //   }
  //   else if (feature.properties.USE == "Agriculture") {
  //     fillCOlor_Var = "lime";
  //   }
  //   else if (feature.properties.USE == "Domestic") {
  //     fillCOlor_Var = "blue";
  //   }
  //   else if (feature.properties.USE == "Livestock") {
  //     fillCOlor_Var = "red";
  //   }
  //   else if (feature.properties.USE == "Other") {
  //     fillCOlor_Var = "grey";
  //   }
  //   else if (feature.properties.USE == "Municipal") {
  //     fillCOlor_Var = "purple";
  //   }
  //   else if (feature.properties.USE == "Domestic Irrigaiton") {
  //     fillCOlor_Var = "green";
  //   }
  //   // if USE == Unknown
  //   else {
  //     fillCOlor_Var = "yellow";
  //   }
  //   var geojsonMarkerOptions = {
  //     radius: 7,
  //     //fillColor: "#F46B06",
  //     fillColor: fillCOlor_Var,
  //     color: "black",
  //     weight: 1,
  //     opacity: 1,
  //     fillOpacity: 0.7
  //   };
  //   var circleMarker = L.circleMarker(latlng, geojsonMarkerOptions);
  //   return circleMarker;
  // }


  // // L.geoJSON(nvWells, {
  // //   onEachFeature: addPopups,
  // //   pointToLayer: pointToCircle
  // // }).addTo(map);

  // // function to cluster well points on zoom
  // var wellsLayerGroup = L.geoJSON(nvWells, {
  //   pointToLayer: pointToCircle
  // });

  // var clusters = L.markerClusterGroup();
  // clusters.addLayer(wellsLayerGroup);
  // map.addLayer(clusters);

}