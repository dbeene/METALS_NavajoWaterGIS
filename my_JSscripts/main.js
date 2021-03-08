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
            d.As_ = Math.round(+d.properties.As_ / 50) * 50;
            d.Ba = Math.round(+d.properties.Ba / 1) * 1;
            d.Ca = Math.round(+d.properties.Ca / 100) * 100;
            d.Cl_ = Math.round(+d.properties.Cl_ / 1) * 1;
            d.Cr = Math.round(+d.properties.Cr / 1) * 1;
            d.GrossAlpha_U_Nat = Math.round(+d.properties.GrossAlpha_U_Nat / 1) * 1;
            d.Nitrate = Math.round(+d.properties.Nitrate / 1) * 1;
            d.Pb = Math.round(+d.properties.Pb / 1) * 1;
            d.Ra_Total = Math.round(+d.properties.Ra_Total / 1) * 1;
            d.Se = Math.round(+d.properties.Se / 1) * 1;
            d.U = Math.round(+d.properties.U / 100) * 100;

        });
        // set crossfilter
        var ndx = crossfilter(wellData);

        //Dimensions
        var As_Dim = ndx.dimension(function (d) { return d.properties.As_; });
        var BaDim = ndx.dimension(function (d) { return d.properties.Ba; });
        var CaDim = ndx.dimension(function (d) { return d.properties.Ca; });
        var Cl_Dim = ndx.dimension(function (d) { return d.properties.Cl_; });
        var CrDim = ndx.dimension(function (d) { return d.properties.Cr; });
        var GrossAlpha_U_NatDim = ndx.dimension(function (d) { return d.properties.GrossAlpha_U_Nat; });
        var NitrateDim = ndx.dimension(function (d) { return d.properties.Nitrate; });
        var PbDim = ndx.dimension(function (d) { return d.properties.Pb; });
        var Ra_TotalDim = ndx.dimension(function (d) { return d.properties.Ra_Total; });
        var SeDim = ndx.dimension(function (d) { return d.properties.Se; });
        var UDim = ndx.dimension(function (d) { return d.properties.U; });

        var allDim = ndx.dimension(function (d) { return d; });

        // create groups (y-axis values)
        var all = ndx.groupAll();

        //
        var countPerAs_ = As_Dim.group().reduceCount();
        var countPerBa = BaDim.group().reduceCount();
        var countPerCa = CaDim.group().reduceCount();
        var countPerCl_ = Cl_Dim.group().reduceCount();
        var countPerCr = CrDim.group().reduceCount();
        var countPerGrossAlpha_U_Nat = GrossAlpha_U_NatDim.group().reduceCount();
        var countPerNitrate = NitrateDim.group().reduceCount();
        var countPerPb = PbDim.group().reduceCount();
        var countPerRa_Total = Ra_TotalDim.group().reduceCount();
        var countPerSe = SeDim.group().reduceCount();
        var countPerU = UDim.group().reduceCount();

        //specify charts

        var as_CountChart = dc.barChart('#histogram1');
        var caCountChart = dc.barChart('#histogram2');
        var ra_TotalCountChart = dc.barChart('#histogram3');
        var uCountChart = dc.barChart('#histogram4');


        //data table declare
        var dataTable = dc.dataTable('#data-table');

        caCountChart
            .width(250)
            .height(250)
            .dimension(CaDim)
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
            .dimension(UDim)
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


        as_CountChart
            .width(250)
            .height(250)
            .dimension(As_Dim)
            .group(countPerAs_)
            .x(d3.scale.linear().domain([0, 282]))
            .y(d3.scale.linear().domain([0, 30]))
            .elasticY(false)
            .centerBar(true)
            .barPadding(3)
            .xAxisLabel('Arsenic')
            .yAxisLabel('Count')
            .margins({ top: 10, right: 20, bottom: 50, left: 50 });
        as_CountChart.xAxis().tickValues([0, 50, 100, 150, 200, 250]);
        as_CountChart.yAxis().tickValues([0, 10, 20, 30]);

        ra_TotalCountChart
            .width(250)
            .height(250)
            .dimension(Ra_TotalDim)
            .group(countPerRa_Total)
            .x(d3.scale.linear().domain([0, 1]))
            .elasticY(false)
            .centerBar(true)
            .barPadding(3)
            .xAxisLabel('Radium_Total')
            .yAxisLabel('Count')
            .margins({ top: 10, right: 20, bottom: 50, left: 50 });
        ra_TotalCountChart.xAxis().tickValues([0.2, 0.4, 0.6, 0.8, 1]);

        dataTable
            .dimension(allDim)
            .group(function (d) { return 'dc.js insists on putting a row here so I remove it using JS'; })
            .size(1000)
            .columns([
                function (d) { return d.properties.well_id; },
                function (d) { return d.properties.As_; },
                function (d) { return d.properties.Ca; },
                function (d) { return d.properties.Ra_Total },
                function (d) { return d.properties.U; }
            ])
            .on('renderlet', function (table) {
                // each time table is rendered remove nasty extra row dc.js insists on adding
                table.select('tr.dc-table-group').remove();

                wellMarkers.clearLayers();
                _.each(allDim.top(Infinity), function (d) {
                    var filLoc = d.properties;
                    var id = d.properties.well_id;
                    var marker = L.marker([filLoc.lat, filLoc.long]);
                    marker.bindPopup(
                        "<dl><dt> <h4><b>WELL INFORMATION- NAVAJO NATION WELL</b></h4><br>"
                        + "<dt><b>FID</b>: " + d.properties.FID + ";<dd>"
                        + "<dt> Well No.: " + d.properties.well_no + ";<dd>"
                        + "<dt> Well ID: " + d.properties.well_id + ";<dd>"
                        + "<dt> Well Name: " + d.properties.well_name + ";<dd>"
                        + "<dt> Owner: " + d.properties.owner + ";<dd>"
                        + "<dt> Depth: " + d.properties.depth + ";<dd>"
                        + "<dt> Public Water Sys. ID: " + d.properties.pwsid + ";<dd>"
                        + "<dt> USGS ID: " + d.properties.usgs_id + ";<dd>"
                        + "<dt> Data Source: " + d.properties.data_sourc + ";<dd>"
                        + "<dt> Comment(s): " + d.properties.comments + ";<dd>"
                        + "<dt> Alternate Name 1: " + d.properties.aka2 + ";<dd>"
                        + "<dt> Alternate Name 2: " + d.properties.aka3 + ";<dd>"
                        + "<dt> Status: " + d.properties.well_statu + ";<dd>"
                        + "<dt> Agency: " + d.properties.nn_agency + ";<dd>"
                        + "<dt> Well Use: " + d.properties.USE + ";<dd>"
                        + "<dt> Alkalinity: " + d.properties.Alkalinity + ";<dd>"
                        + "<dt> Total Alkalinity: " + d.properties.Alkalinity_Total + ";<dd>"
                        + "<dt> As: " + d.properties.As_ + ";<dd>"
                        + "<dt> Ba: " + d.properties.Ba + ";<dd>"
                        + "<dt> Be: " + d.properties.Be + ";<dd>"
                        + "<dt> Br: " + d.properties.Br_ + ";<dd>"
                        + "<dt> Ca: " + d.properties.Ca + ";<dd>"
                        + "<dt> Cd: " + d.properties.Cd + ";<dd>"
                        + "<dt> Cl :" + d.properties.Cl_ + ";<dd>"
                        + "<dt> Conductivity: " + d.properties.Conductivity + ";<dd>"
                        + "<dt> Cr: " + d.properties.Cr + ";<dd>"
                        + "<dt> DO: " + d.properties.DO + ";<dd>"
                        + "<dt> Electrical Conductivity: " + d.properties.ElectricalConductivity + ";<dd>"
                        + "<dt> Gross Alpha 2 Sigma Comb. Uncertainty: " + d.properties.Gross_alpha__2_sigma_combined_uncertainty + ";<dd>"
                        + "<dt> Gross Alpha: " + d.properties.GrossAlpha + ";<dd>"
                        + "<dt> Gross Alpha: U Nat: " + d.properties.GrossAlpha_U_Nat + ";<dd>"
                        + "<dt> Gross Beta 1: " + d.properties.GrossBeta + ";<dd>"
                        + "<dt> Gross Beta: Cs 137: " + d.properties.GrossBeta_Cs137 + ";<dd>"
                        + "<dt> Gross Beta: Sr Y90: " + d.properties.GrossBeta_Sr_Y90 + ";<dd>"
                        + "<dt> Hardness: " + d.properties.Hardness + ";<dd>"
                        + "<dt> Total Hardness: " + d.properties.Hardness_Total + ";<dd>"
                        + "<dt> Hg: " + d.properties.Hg + ";<dd>"
                        + "<dt> Hydroxide: " + d.properties.Hydroxide + ";<dd>"
                        + "<dt> K: " + d.properties.K + ";<dd>"
                        + "<dt> Mg: " + d.properties.Mg + ";<dd>"
                        + "<dt> Mn: " + d.properties.Mn + ";<dd>"
                        + "<dt> Na: " + d.properties.Na + ";<dd>"
                        + "<dt> Na Adsorption Ratio: " + d.properties.Na_AdsorptionRatio + ";<dd>"
                        + "<dt> Na Fraction Cations: " + d.properties.Na_FractionCations + ";<dd>"
                        + "<dt> Na_K: " + d.properties.Na_K + ";<dd>"
                        + "<dt> Nitrate: " + d.properties.Nitrate + ";<dd>"
                        + "<dt> Nitrate_Nitrite: " + d.properties.Nitrate_Nitrite + ";<dd>"
                        + "<dt> NO2: " + d.properties.NO2_ + ";<dd>"
                        + "<dt> NO3: " + d.properties.NO3_ + ";<dd>"
                        + "<dt> ORP: " + d.properties.ORP + ";<dd>"
                        + "<dt> Pb: " + d.properties.Pb + ";<dd>"
                        + "<dt> Ra 226: " + d.properties.Ra_226 + ";<dd>"
                        + "<dt> Ra 228: " + d.properties.Ra_228 + ";<dd>"
                        + "<dt> Ra Total: " + d.properties.Ra_Total + ";<dd>"
                        + "<dt> Sb: " + d.properties.Sb + ";<dd>"
                        + "<dt> Se: " + d.properties.Se + ";<dd>"
                        + "<dt> Temperature: " + d.properties.Temperature + ";<dd>"
                        + "<dt> Tl: " + d.properties.Tl + ";<dd>"
                        + "<dt> Turbidity: " + d.properties.Turbidity + ";<dd>"
                        + "<dt> U: " + d.properties.U + "<dt><dl>");
                    wellMarkers.addLayer(marker);
                });
                // Option 1: Cluster points on render - not working
                // var clusters = L.markerClusterGroup();
                // clusters.addLayer(wellMarkers);
                // map.addLayer(clusters);
                // map.fitBounds(clusters.getBounds());

                //working code, no clusters:
                map.addLayer(wellMarkers);
                map.fitBounds(wellMarkers.getBounds());

                // Option 2: Cluster points and update filter using layersupport - not working
                // mcgLayerSupportGroup = L.markerClusterGroup.layerSupport(),
                // myLayerGroup = L.layerGroup(arrayOfMarkers);
                // mcgLayerSupportGroup.addTo(map);
                // mcgLayerSupportGroup.checkIn(myLayergroup);

                // myLayergroup.addTo(map);
            });
        dc.renderAll();
    });

    // Scatterplot matrix
    // Event handler for d3 version

    function graphicviz(scatterplot) {
        require.config({
            paths: {
                d3: "JS_CSS_downladed_libraries/d3.v4.min"
            }
        });

        require(["d3"], function (d3) {
            // Sample taken from https://www.d3-graph-gallery.com/graph/correlogram_scatter.html
            // Chart dimensions
            var marginWhole = { top: 10, right: 10, bottom: 10, left: 10 },
                sizeWhole = 500 - marginWhole.left - marginWhole.right

            // Create SVG area
            var svg = d3.select("#scatterplot")
                .append("svg")
                .attr("width", sizeWhole + marginWhole.left + marginWhole.right)
                .attr("height", sizeWhole + marginWhole.top + marginWhole.bottom)
                .append("g")
                .attr("transform", "translate(" + marginWhole.left + "," + marginWhole.top + ")");


            d3.csv("data/data_correlogram.csv", function (data) {

                // call in numeric variables - will need to change to crossfilter
                var allVar = ["As", "Ca", "Ra_Total", "U"]
                var numVar = allVar.length

                // Calculate chart size
                mar = 20
                size = sizeWhole / numVar

                // Scales
                // Create a scale: gives the position of each pair each variable
                var position = d3.scalePoint()
                    .domain(allVar)
                    .range([0, sizeWhole - size])

                // Color scale by well use
                var color = d3.scaleOrdinal()
                    .domain(["Livestock", "Unknown", "Domestic", "Municipal", "Agriculture", "Other", "Independent", "Recreation", "Domestic Irrigation"])
                    .range(["#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#c7eae5", "#80cdc1", "#35978f", "#01665e", "#003c30"])

                // Add charts
                for (i in allVar) {
                    for (j in allVar) {

                        // Get current variable name
                        var var1 = allVar[i]
                        var var2 = allVar[j]

                        // Skip diagonals 
                        if (var1 === var2) { continue; }

                        // Add X Scale of each graph
                        xextent = d3.extent(data, function (d) { return +d[var1] })
                        var x = d3.scaleLinear()
                            .domain(xextent).nice()
                            .range([0, size - 2 * mar]);

                        // Add Y Scale of each graph
                        yextent = d3.extent(data, function (d) { return +d[var2] })
                        var y = d3.scaleLinear()
                            .domain(yextent).nice()
                            .range([size - 2 * mar, 0]);

                        // Add a 'g' at the right position
                        var tmp = svg
                            .append('g')
                            .attr("transform", "translate(" + (position(var1) + mar) + "," + (position(var2) + mar) + ")");

                        // Add X and Y axis in tmp
                        tmp.append("g")
                            .attr("transform", "translate(" + 0 + "," + (size - mar * 2) + ")")
                            .call(d3.axisBottom(x).ticks(3));
                        tmp.append("g")
                            .call(d3.axisLeft(y).ticks(3));

                        // Add circle
                        tmp
                            .selectAll("myCircles")
                            .data(data)
                            .enter()
                            .append("circle")
                            .attr("cx", function (d) { return x(+d[var1]) })
                            .attr("cy", function (d) { return y(+d[var2]) })
                            .attr("r", 3)
                            .attr("fill", function (d) { return color(d.wellUse) })
                    }
                }



                // Add variable names on diagonal

                for (i in allVar) {
                    for (j in allVar) {
                        if (i != j) { continue; }
                        // Add text
                        var var1 = allVar[i]
                        var var2 = allVar[j]
                        svg
                            .append('g')
                            .attr("transform", "translate(" + position(var1) + "," + position(var2) + ")")
                            .append('text')
                            .attr("x", size / 2)
                            .attr("y", size / 2)
                            .text(var1)
                            .attr("text-anchor", "middle")

                    }
                }


            })

        });
    }

    //Call The Function
    graphicviz(scatterplot);




    //change well markers to circle

    // function pointToCircle(feature, latlng) {
    //   if (feature.properties.USE == "Independent") {
    //     fillCOlor_Var = "#01665e";
    //   }
    //   else if (feature.properties.USE == "Agriculture") {
    //     fillCOlor_Var = "#c7eae5";
    //   }
    //   else if (feature.properties.USE == "Domestic") {
    //     fillCOlor_Var = "#dfc27d";
    //   }
    //   else if (feature.properties.USE == "Livestock") {
    //     fillCOlor_Var = "#8c510a";
    //   }
    //   else if (feature.properties.USE == "Other") {
    //     fillCOlor_Var = "#80cdc1";
    //   }
    //   else if (feature.properties.USE == "Municipal") {
    //     fillCOlor_Var = "#f6e8c3";
    //   }
    //   else if (feature.properties.USE == "Domestic Irrigaiton") {
    //     fillCOlor_Var = "#003c30";
    //   }
    //   else if (feature.properties.USE == "Recreation") {
    //     fillCOlor_Var = "#01665e";
    //   }
    //   // if USE == Unknown
    //   else {
    //     fillCOlor_Var = "bf812d";
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

    // Scatterplot matrix //
    // source: https://observablehq.com/@d3/brushable-scatterplot-matrix



}
function selectAnalyte() {

    var selected1 = document.getElementById("selectbox1");
    var input1 = selected1.options[selected1.selectedIndex].value;

    var selected2 = document.getElementById("selectbox2");
    var input2 = selected2.options[selected2.selectedIndex].value;

    var selected3 = document.getElementById("selectbox3");
    var input3 = selected3.options[selected3.selectedIndex].value;

    var selected4 = document.getElementById("selectbox4");
    var input4 = selected4.options[selected4.selectedIndex].value;

    d3.json('data/nnWells.json', function (error, data) {
        var wellData = data.features;
        _.each(wellData, function (d) {
            d.count = +d.count;
            d.As_ = Math.round(+d.properties.As_ / 50) * 50;
            d.Ba = Math.round(+d.properties.Ba / 1) * 1;
            d.Ca = Math.round(+d.properties.Ca / 100) * 100;
            d.Cl_ = Math.round(+d.properties.Cl_ / 1) * 1;
            d.Cr = Math.round(+d.properties.Cr / 1) * 1;
            d.GrossAlpha_U_Nat = Math.round(+d.properties.GrossAlpha_U_Nat / 1) * 1;
            d.Nitrate = Math.round(+d.properties.Nitrate / 1) * 1;
            d.Pb = Math.round(+d.properties.Pb / 1) * 1;
            d.Ra_Total = Math.round(+d.properties.Ra_Total / 1) * 1;
            d.Se = Math.round(+d.properties.Se / 1) * 1;
            d.U = Math.round(+d.properties.U / 100) * 100;
            d.None = 0;
        });

        //Crossfilter
        var ndx = crossfilter(wellData);

        var As_Dim = ndx.dimension(function (d) { return d.properties.As_; });
        var BaDim = ndx.dimension(function (d) { return d.properties.Ba; });
        var CaDim = ndx.dimension(function (d) { return d.properties.Ca; });
        var Cl_Dim = ndx.dimension(function (d) { return d.properties.Cl_; });
        var CrDim = ndx.dimension(function (d) { return d.properties.Cr; });
        var GrossAlpha_U_NatDim = ndx.dimension(function (d) { return d.properties.GrossAlpha_U_Nat; });
        var NitrateDim = ndx.dimension(function (d) { return d.properties.Nitrate; });
        var PbDim = ndx.dimension(function (d) { return d.properties.Pb; });
        var Ra_TotalDim = ndx.dimension(function (d) { return d.properties.Ra_Total; });
        var SeDim = ndx.dimension(function (d) { return d.properties.Se; });
        var UDim = ndx.dimension(function (d) { return d.properties.U; });
        var NoneDim = ndx.dimension(function (d) { return d.None; });

        var allDim = ndx.dimension(function (d) { return d; });

        //countPerAnalyte
        var countPerAs_ = As_Dim.group().reduceCount();
        var countPerBa = BaDim.group().reduceCount();
        var countPerCa = CaDim.group().reduceCount();
        var countPerCl_ = Cl_Dim.group().reduceCount();
        var countPerCr = CrDim.group().reduceCount();
        var countPerGrossAlpha_U_Nat = GrossAlpha_U_NatDim.group().reduceCount();
        var countPerNitrate = NitrateDim.group().reduceCount();
        var countPerPb = PbDim.group().reduceCount();
        var countPerRa_Total = Ra_TotalDim.group().reduceCount();
        var countPerSe = SeDim.group().reduceCount();
        var countPerU = UDim.group().reduceCount();
        var countPerNone = NoneDim.group().reduceCount();

        //Charts
        var histogram1 = dc.barChart('#histogram1');
        var histogram2 = dc.barChart('#histogram2');
        var histogram3 = dc.barChart('#histogram3');
        var histogram4 = dc.barChart('#histogram4');

        if (input1 == "As_") {

            histogram1
                .width(250)
                .height(250)
                .dimension(As_Dim)
                .group(countPerAs_)
                .x(d3.scale.linear().domain([0, 282]))
                .y(d3.scale.linear().domain([0, 30]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
                .xAxisLabel('Arsenic')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram1.xAxis().tickValues([0, 50, 100, 150, 200, 250]);
            histogram1.yAxis().tickValues([0, 10, 20, 30]);
        }
        else if (input1 == "Ba") {

            histogram1
                .width(250)
                .height(250)
                .dimension(BaDim)
                .group(countPerBa)
                .x(d3.scale.linear().domain([0, 1500]))
                .y(d3.scale.linear().domain([0, 30]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
                .xAxisLabel('Barium')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram1.xAxis().tickValues([0, 300, 600, 900, 1200, 1500]);
            histogram1.yAxis().tickValues([0, 10, 20, 30]);
        }
        else if (input1 == "Ca") {

            histogram1
                .width(250)
                .height(250)
                .dimension(CaDim)
                .group(countPerCa)
                .x(d3.scale.linear().domain([0, 970]))
                .y(d3.scale.linear().domain([0, 13]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(20)
                .xAxisLabel('Calcium')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram1.xAxis().tickValues([0, 200, 400, 600, 800, 1000]);
            histogram1.yAxis().tickValues([0, 3, 6, 9, 12]);
        }
        else if (input1 == "Cl_") {

            histogram1
                .width(250)
                .height(250)
                .dimension(Cl_Dim)
                .group(countPerCl_)
                .x(d3.scale.linear().domain([0, 41800]))
                .y(d3.scale.linear().domain([0, 3]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
                .xAxisLabel('Clorine')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram1.xAxis().tickValues([0, 10000, 20000, 30000, 40000]);
            histogram1.yAxis().tickValues([0, 1, 2, 3]);
        }
        else if (input1 == "Cr") {

            histogram1
                .width(250)
                .height(250)
                .dimension(CrDim)
                .group(countPerCr)
                .x(d3.scale.linear().domain([0, 30]))
                .y(d3.scale.linear().domain([0, 20]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
                .xAxisLabel('Chromium')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram1.xAxis().tickValues([0, 10, 20, 30]);
            histogram1.yAxis().tickValues([0, 5, 10, 15, 20]);
        }
        else if (input1 == "GrossAlpha_U_Nat") {

            histogram1
                .width(250)
                .height(250)
                .dimension(GrossAlpha_U_NatDim)
                .group(countPerGrossAlpha_U_Nat)
                .x(d3.scale.linear().domain([0, 780]))
                .y(d3.scale.linear().domain([0, 2]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
                .xAxisLabel('GrossAlpha_U_Nat')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram1.xAxis().tickValues([0, 200, 400, 600, 800]);
            histogram1.yAxis().tickValues([0, 1, 2]);
        }
        else if (input1 == "Nitrate") {

            histogram1
                .width(250)
                .height(250)
                .dimension(NitrateDim)
                .group(countPerNitrate)
                .x(d3.scale.linear().domain([0, 240]))
                .y(d3.scale.linear().domain([0, 3]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
                .xAxisLabel('Nitrate')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram1.xAxis().tickValues([0, 50, 100, 150, 200, 250]);
            histogram1.yAxis().tickValues([0, 1, 2, 3]);
        }
        else if (input1 == "Pb") {

            histogram1
                .width(250)
                .height(250)
                .dimension(PbDim)
                .group(countPerPb)
                .x(d3.scale.linear().domain([0, 320]))
                .y(d3.scale.linear().domain([0, 15]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
                .xAxisLabel('Lead')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram1.xAxis().tickValues([0, 100, 200, 300]);
            histogram1.yAxis().tickValues([0, 5, 10, 15]);
        }
        else if (input1 == "Ra_Total") {

            histogram1
                .width(250)
                .height(250)
                .dimension(Ra_TotalDim)
                .group(countPerRa_Total)
                .x(d3.scale.linear().domain([0, 1]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
                .xAxisLabel('Ra_Total')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram1.xAxis().tickValues([0.2, 0.4, 0.6, 0.8, 1]);


        }
        else if (input1 == "Se") {

            histogram1
                .width(250)
                .height(250)
                .dimension(SeDim)
                .group(countPerSe)
                .x(d3.scale.linear().domain([0, 282]))
                .y(d3.scale.linear().domain([0, 20]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
                .xAxisLabel('Selenium')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram1.xAxis().tickValues([0, 50, 100, 150, 200, 250]);
            histogram1.yAxis().tickValues([0, 5, 10, 15, 20]);
        }
        else if (input1 == "U") {

            histogram1
                .width(250)
                .height(250)
                .dimension(UDim)
                .group(countPerU)
                .x(d3.scale.linear().domain([0, 282]))
                .y(d3.scale.linear().domain([0, 20]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
                .xAxisLabel('Uranium')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram1.xAxis().tickValues([0, 50, 100, 150, 200, 250]);
            histogram1.yAxis().tickValues([0, 5, 10, 15, 20]);
        }

        else if (input1 == "None") {

            histogram1
                .width(250)
                .height(250)
                .dimension(NoneDim)
                .group(countPerNone)
                //.range([0,20])
                .x(d3.scale.linear().domain([0, 0]))
                // .y(d3.scale.linear().domain([0, 30]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
                .xAxisLabel('None')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram1.xAxis().tickValues([0, 0, 0, 0, 0, 0]);
            histogram1.yAxis().tickValues([0, 0, 0, 0]);
        }

        if (input2 == "As_") {
            histogram2
                .width(250)
                .height(250)
                .dimension(As_Dim)
                .group(countPerAs_)
                .x(d3.scale.linear().domain([0, 282]))
                .y(d3.scale.linear().domain([0, 30]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
                .xAxisLabel('Arsenic')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram2.xAxis().tickValues([0, 50, 100, 150, 200, 250]);
            histogram2.yAxis().tickValues([0, 10, 20, 30]);
        }
        else if (input2 == "Ba") {

            histogram2
                .width(250)
                .height(250)
                .dimension(BaDim)
                .group(countPerBa)
                .x(d3.scale.linear().domain([0, 1500]))
                .y(d3.scale.linear().domain([0, 30]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
                .xAxisLabel('Barium')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram2.xAxis().tickValues([0, 300, 600, 900, 1200, 1500]);
            histogram2.yAxis().tickValues([0, 10, 20, 30]);
        }
        else if (input2 == "Ca") {

            histogram2
                .width(250)
                .height(250)
                .dimension(CaDim)
                .group(countPerCa)
                .x(d3.scale.linear().domain([0, 970]))
                .y(d3.scale.linear().domain([0, 13]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(20)
                .xAxisLabel('Calcium')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram2.xAxis().tickValues([0, 200, 400, 600, 800, 1000]);
            histogram2.yAxis().tickValues([0, 3, 6, 9, 12]);
        }
        else if (input2 == "Cl_") {

            histogram2
                .width(250)
                .height(250)
                .dimension(Cl_Dim)
                .group(countPerCl_)
                .x(d3.scale.linear().domain([0, 41800]))
                .y(d3.scale.linear().domain([0, 3]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
                .xAxisLabel('Clorine')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram2.xAxis().tickValues([0, 10000, 20000, 30000, 40000]);
            histogram2.yAxis().tickValues([0, 1, 2, 3]);
        }
        else if (input2 == "Cr") {

            histogram2
                .width(250)
                .height(250)
                .dimension(CrDim)
                .group(countPerCr)
                .x(d3.scale.linear().domain([0, 30]))
                .y(d3.scale.linear().domain([0, 20]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
                .xAxisLabel('Chromium')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram2.xAxis().tickValues([0, 10, 20, 30]);
            histogram2.yAxis().tickValues([0, 5, 10, 15, 20]);
        }
        else if (input2 == "GrossAlpha_U_Nat") {

            histogram2
                .width(250)
                .height(250)
                .dimension(GrossAlpha_U_NatDim)
                .group(countPerGrossAlpha_U_Nat)
                .x(d3.scale.linear().domain([0, 780]))
                .y(d3.scale.linear().domain([0, 2]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
                .xAxisLabel('GrossAlpha_U_Nat')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram2.xAxis().tickValues([0, 200, 400, 600, 800]);
            histogram2.yAxis().tickValues([0, 1, 2]);
        }
        else if (input2 == "Nitrate") {

            histogram2
                .width(250)
                .height(250)
                .dimension(NitrateDim)
                .group(countPerNitrate)
                .x(d3.scale.linear().domain([0, 240]))
                .y(d3.scale.linear().domain([0, 3]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
                .xAxisLabel('Nitrate')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram2.xAxis().tickValues([0, 50, 100, 150, 200, 250]);
            histogram2.yAxis().tickValues([0, 1, 2, 3]);
        }
        else if (input2 == "Pb") {

            histogram2
                .width(250)
                .height(250)
                .dimension(PbDim)
                .group(countPerPb)
                .x(d3.scale.linear().domain([0, 320]))
                .y(d3.scale.linear().domain([0, 15]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
                .xAxisLabel('Lead')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram2.xAxis().tickValues([0, 100, 200, 300]);
            histogram2.yAxis().tickValues([0, 5, 10, 15]);
        }
        else if (input2 == "Ra_Total") {

            histogram2
                .width(250)
                .height(250)
                .dimension(Ra_TotalDim)
                .group(countPerRa_Total)
                .x(d3.scale.linear().domain([0, 1]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
                .xAxisLabel('Ra_Total')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram2.xAxis().tickValues([0.2, 0.4, 0.6, 0.8, 1]);
        }
        else if (input2 == "Se") {

            histogram2
                .width(250)
                .height(250)
                .dimension(SeDim)
                .group(countPerSe)
                .x(d3.scale.linear().domain([0, 282]))
                .y(d3.scale.linear().domain([0, 20]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
                .xAxisLabel('Selenium')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram2.xAxis().tickValues([0, 50, 100, 150, 200, 250]);
            histogram2.yAxis().tickValues([0, 5, 10, 15, 20]);
        }
        else if (input2 == "U") {

            histogram2
                .width(250)
                .height(250)
                .dimension(UDim)
                .group(countPerU)
                .x(d3.scale.linear().domain([0, 282]))
                .y(d3.scale.linear().domain([0, 20]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
                .xAxisLabel('Uranium')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram2.xAxis().tickValues([0, 50, 100, 150, 200, 250]);
            histogram2.yAxis().tickValues([0, 5, 10, 15, 20]);
        }

        else if (input2 == "None") {

            histogram2
                .width(250)
                .height(250)
                .dimension(NoneDim)
                .group(countPerNone)
                .x(d3.scale.linear().domain([0, 0]))
                // .y(d3.scale.linear().domain([0, 30]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
                .xAxisLabel('None')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram2.xAxis().tickValues([0, 0, 0, 0, 0, 0]);
            histogram2.yAxis().tickValues([0, 0, 0, 0]);
        }

        if (input3 == "As_") {

            histogram3
                .width(250)
                .height(250)
                .dimension(As_Dim)
                .group(countPerAs_)
                .x(d3.scale.linear().domain([0, 282]))
                .y(d3.scale.linear().domain([0, 30]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
                .xAxisLabel('Arsenic')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram3.xAxis().tickValues([0, 50, 100, 150, 200, 250]);
            histogram3.yAxis().tickValues([0, 10, 20, 30]);
        }
        else if (input3 == "Ba") {

            histogram3
                .width(250)
                .height(250)
                .dimension(BaDim)
                .group(countPerBa)
                .x(d3.scale.linear().domain([0, 1500]))
                .y(d3.scale.linear().domain([0, 30]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
                .xAxisLabel('Barium')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram3.xAxis().tickValues([0, 300, 600, 900, 1200, 1500]);
            histogram3.yAxis().tickValues([0, 10, 20, 30]);
        }
        else if (input3 == "Ca") {

            histogram3
                .width(250)
                .height(250)
                .dimension(CaDim)
                .group(countPerCa)
                .x(d3.scale.linear().domain([0, 970]))
                .y(d3.scale.linear().domain([0, 13]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(20)
                .xAxisLabel('Calcium')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram3.xAxis().tickValues([0, 200, 400, 600, 800, 1000]);
            histogram3.yAxis().tickValues([0, 3, 6, 9, 12]);
        }
        else if (input3 == "Cl_") {

            histogram3
                .width(250)
                .height(250)
                .dimension(Cl_Dim)
                .group(countPerCl_)
                .x(d3.scale.linear().domain([0, 41800]))
                .y(d3.scale.linear().domain([0, 3]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
                .xAxisLabel('Clorine')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram3.xAxis().tickValues([0, 10000, 20000, 30000, 40000]);
            histogram3.yAxis().tickValues([0, 1, 2, 3]);
        }
        else if (input3 == "Cr") {

            histogram3
                .width(250)
                .height(250)
                .dimension(CrDim)
                .group(countPerCr)
                .x(d3.scale.linear().domain([0, 30]))
                .y(d3.scale.linear().domain([0, 20]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
                .xAxisLabel('Chromium')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram3.xAxis().tickValues([0, 10, 20, 30]);
            histogram3.yAxis().tickValues([0, 5, 10, 15, 20]);
        }
        else if (input3 == "GrossAlpha_U_Nat") {

            histogram3
                .width(250)
                .height(250)
                .dimension(GrossAlpha_U_NatDim)
                .group(countPerGrossAlpha_U_Nat)
                .x(d3.scale.linear().domain([0, 780]))
                .y(d3.scale.linear().domain([0, 2]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
                .xAxisLabel('GrossAlpha_U_Nat')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram3.xAxis().tickValues([0, 200, 400, 600, 800]);
            histogram3.yAxis().tickValues([0, 1, 2]);
        }
        else if (input3 == "Nitrate") {

            histogram3
                .width(250)
                .height(250)
                .dimension(NitrateDim)
                .group(countPerNitrate)
                .x(d3.scale.linear().domain([0, 240]))
                .y(d3.scale.linear().domain([0, 3]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
                .xAxisLabel('Nitrate')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram3.xAxis().tickValues([0, 50, 100, 150, 200, 250]);
            histogram3.yAxis().tickValues([0, 1, 2, 3]);
        }
        else if (input3 == "Pb") {

            histogram3
                .width(250)
                .height(250)
                .dimension(PbDim)
                .group(countPerPb)
                .x(d3.scale.linear().domain([0, 320]))
                .y(d3.scale.linear().domain([0, 15]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
                .xAxisLabel('Lead')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram3.xAxis().tickValues([0, 100, 200, 300]);
            histogram3.yAxis().tickValues([0, 5, 10, 15]);
        }
        else if (input3 == "Ra_Total") {

            histogram3
                .width(250)
                .height(250)
                .dimension(Ra_TotalDim)
                .group(countPerRa_Total)
                .x(d3.scale.linear().domain([0, 1]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
                .xAxisLabel('Ra_Total')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram3.xAxis().tickValues([0.2, 0.4, 0.6, 0.8, 1]);
        }
        else if (input3 == "Se") {

            histogram3
                .width(250)
                .height(250)
                .dimension(SeDim)
                .group(countPerSe)
                .x(d3.scale.linear().domain([0, 282]))
                .y(d3.scale.linear().domain([0, 20]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
                .xAxisLabel('Selenium')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram3.xAxis().tickValues([0, 50, 100, 150, 200, 250]);
            histogram3.yAxis().tickValues([0, 5, 10, 15, 20]);
        }
        else if (input3 == "U") {

            histogram3
                .width(250)
                .height(250)
                .dimension(UDim)
                .group(countPerU)
                .x(d3.scale.linear().domain([0, 282]))
                .y(d3.scale.linear().domain([0, 20]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
                .xAxisLabel('Uranium')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram3.xAxis().tickValues([0, 50, 100, 150, 200, 250]);
            histogram3.yAxis().tickValues([0, 5, 10, 15, 20]);
        }

        else if (input3 == "None") {

            histogram3
                .width(250)
                .height(250)
                .dimension(NoneDim)
                .group(countPerNone)
                .x(d3.scale.linear().domain([0, 0]))
                // .y(d3.scale.linear().domain([0, 30]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
                .xAxisLabel('None')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram3.xAxis().tickValues([0, 0, 0, 0, 0, 0]);
            histogram3.yAxis().tickValues([0, 0, 0, 0]);
        }

        if (input4 == "As_") {

            histogram4
                .width(250)
                .height(250)
                .dimension(As_Dim)
                .group(countPerAs_)
                .x(d3.scale.linear().domain([0, 282]))
                .y(d3.scale.linear().domain([0, 30]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
                .xAxisLabel('Arsenic')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram4.xAxis().tickValues([0, 50, 100, 150, 200, 250]);
            histogram4.yAxis().tickValues([0, 10, 20, 30]);
        }
        else if (input4 == "Ba") {

            histogram4
                .width(250)
                .height(250)
                .dimension(BaDim)
                .group(countPerBa)
                .x(d3.scale.linear().domain([0, 1500]))
                .y(d3.scale.linear().domain([0, 30]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
                .xAxisLabel('Barium')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram4.xAxis().tickValues([0, 300, 600, 900, 1200, 1500]);
            histogram4.yAxis().tickValues([0, 10, 20, 30]);
        }
        else if (input4 == "Ca") {

            histogram4
                .width(250)
                .height(250)
                .dimension(CaDim)
                .group(countPerCa)
                .x(d3.scale.linear().domain([0, 970]))
                .y(d3.scale.linear().domain([0, 13]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(20)
                .xAxisLabel('Calcium')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram4.xAxis().tickValues([0, 200, 400, 600, 800, 1000]);
            histogram4.yAxis().tickValues([0, 3, 6, 9, 12]);

        }
        else if (input4 == "Cl_") {

            histogram4
                .width(250)
                .height(250)
                .dimension(Cl_Dim)
                .group(countPerCl_)
                .x(d3.scale.linear().domain([0, 41800]))
                .y(d3.scale.linear().domain([0, 3]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
                .xAxisLabel('Clorine')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram4.xAxis().tickValues([0, 10000, 20000, 30000, 40000]);
            histogram4.yAxis().tickValues([0, 1, 2, 3]);
        }
        else if (input4 == "Cr") {

            histogram4
                .width(250)
                .height(250)
                .dimension(CrDim)
                .group(countPerCr)
                .x(d3.scale.linear().domain([0, 30]))
                .y(d3.scale.linear().domain([0, 20]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
                .xAxisLabel('Chromium')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram4.xAxis().tickValues([0, 10, 20, 30]);
            histogram4.yAxis().tickValues([0, 5, 10, 15, 20]);
        }
        else if (input4 == "GrossAlpha_U_Nat") {

            histogram4
                .width(250)
                .height(250)
                .dimension(GrossAlpha_U_NatDim)
                .group(countPerGrossAlpha_U_Nat)
                .x(d3.scale.linear().domain([0, 780]))
                .y(d3.scale.linear().domain([0, 2]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
                .xAxisLabel('GrossAlpha_U_Nat')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram4.xAxis().tickValues([0, 200, 400, 600, 800]);
            histogram4.yAxis().tickValues([0, 1, 2]);
        }
        else if (input4 == "Nitrate") {

            histogram4
                .width(250)
                .height(250)
                .dimension(NitrateDim)
                .group(countPerNitrate)
                .x(d3.scale.linear().domain([0, 240]))
                .y(d3.scale.linear().domain([0, 3]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
                .xAxisLabel('Nitrate')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram4.xAxis().tickValues([0, 50, 100, 150, 200, 250]);
            histogram4.yAxis().tickValues([0, 1, 2, 3]);
        }
        else if (input4 == "Pb") {

            histogram4
                .width(250)
                .height(250)
                .dimension(PbDim)
                .group(countPerPb)
                .x(d3.scale.linear().domain([0, 320]))
                .y(d3.scale.linear().domain([0, 15]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
                .xAxisLabel('Lead')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram4.xAxis().tickValues([0, 100, 200, 300]);
            histogram4.yAxis().tickValues([0, 5, 10, 15]);
        }
        else if (input4 == "Ra_Total") {

            histogram4
                .width(250)
                .height(250)
                .dimension(Ra_TotalDim)
                .group(countPerRa_Total)
                .x(d3.scale.linear().domain([0, 1]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
                .xAxisLabel('Ra_Total')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram4.xAxis().tickValues([0.2, 0.4, 0.6, 0.8, 1]);
        }
        else if (input4 == "Se") {

            histogram4
                .width(250)
                .height(250)
                .dimension(SeDim)
                .group(countPerSe)
                .x(d3.scale.linear().domain([0, 282]))
                .y(d3.scale.linear().domain([0, 20]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
                .xAxisLabel('Selenium')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram4.xAxis().tickValues([0, 50, 100, 150, 200, 250]);
            histogram4.yAxis().tickValues([0, 5, 10, 15, 20]);
        }
        else if (input4 == "U") {

            histogram4
                .width(250)
                .height(250)
                .dimension(UDim)
                .group(countPerU)
                .x(d3.scale.linear().domain([0, 282]))
                .y(d3.scale.linear().domain([0, 20]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
                .xAxisLabel('Uranium')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram4.xAxis().tickValues([0, 50, 100, 150, 200, 250]);
            histogram4.yAxis().tickValues([0, 5, 10, 15, 20]);
        }

        else if (input4 == "None") {

            histogram4
                .width(250)
                .height(250)
                .dimension(NoneDim)
                .group(countPerNone)
                .x(d3.scale.linear().domain([0, 0]))
                // .y(d3.scale.linear().domain([0, 30]))
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
                .xAxisLabel('None')
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            histogram4.xAxis().tickValues([0, 0, 0, 0, 0, 0]);
            histogram4.yAxis().tickValues([0, 0, 0, 0]);
        }

        dc.renderAll();
        //xdocument.getElementById("histogram1").innerHTML=histogram1;
    });
}
