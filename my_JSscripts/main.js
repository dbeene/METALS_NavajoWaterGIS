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

    // Add chapters layer to map -- need to render underneath circleMarkers
    // var myStyle = {
    //     "color": "#dbc38f",
    //     "fillColor": "white",
    //     "weight": 0.5,
    //     "fillOpacity": 0.25
    // }

    // $.getJSON("data/nnChapters.geojson", function (data) {
    //     // L.geoJson(data).addTo(map);
    //     var geojson = L.geoJson(data, {
    //         style: myStyle,
    //         onEachFeature: function (feature, layer) {
    //             var chPopup = "Chapter:<br>" + feature.properties.Chapter
    //             layer.bindPopup(chPopup);
    //         }
    //     });
    //     geojson.addTo(map)
    // });

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
                    // var id = d.properties.well_id;

                    // Color based on well use
                    function getColor(wUse) {
                        switch (wUse) {
                            case "Independent":
                                return "#8c510a";
                            case "Agriculture":
                                return "#bf812d";
                            case "Domestic":
                                return "#dfc27d";
                            case "Livestock":
                                return "#f6e8c3";
                            case "Other":
                                return "#01665e";
                            case "Municipal":
                                return "#c7eae5";
                            case "Domestic Irrigation":
                                return "#80cdc1";
                            case "Recreation":
                                return "#35978f";
                            default:
                                return "#01665e";
                        }
                    }

                    var markerOptions = {
                        radius: 3.5,
                        fillColor: getColor(d.properties.USE),
                        color: "black",
                        weight: 0,
                        opacity: 1,
                        fillOpacity: 0.7
                    };

                    // Add circle markers
                    var marker = L.circleMarker([filLoc.lat, filLoc.long], markerOptions);

                    marker.bindPopup(
                        "<dl><dt> <h4><b>WELL INFORMATION- NAVAJO NATION WELL</b></h4><br>"
                        + "<dt><i>FID</i>: " + d.properties.FID + ";<dd>"
                        + "<dt><i>Well No.</i>: " + d.properties.well_no + ";<dd>"
                        + "<dt><i>Well ID</i>: " + d.properties.well_id + ";<dd>"
                        + "<dt><i>Well Name</i>: " + d.properties.well_name + ";<dd>"
                        + "<dt><i>Owner</i>: " + d.properties.owner + ";<dd>"
                        + "<dt><i>Depth</i>: " + d.properties.depth + ";<dd>"
                        + "<dt><i>Public Water Sys. ID</i>: " + d.properties.pwsid + ";<dd>"
                        + "<dt><i>USGS ID</i>: " + d.properties.usgs_id + ";<dd>"
                        + "<dt><i>Data Source</i>: " + d.properties.data_sourc + ";<dd>"
                        + "<dt><i>Comment(s)</i>: " + d.properties.comments + ";<dd>"
                        + "<dt><i>Alternate Name 1</i>: " + d.properties.aka2 + ";<dd>"
                        + "<dt><i>Alternate Name 2</i>: " + d.properties.aka3 + ";<dd>"
                        + "<dt><i>Status</i>: " + d.properties.well_statu + ";<dd>"
                        + "<dt><i>Agency</i>: " + d.properties.nn_agency + ";<dd>"
                        + "<dt><i>Well Use</i>: " + d.properties.USE + ";<dd>"
                        + "<dt><i>Alkalinity</i>: " + d.properties.Alkalinity + ";<dd>"
                        + "<dt><i>Total Alkalinity</i>: " + d.properties.Alkalinity_Total + ";<dd>"
                        + "<dt><i>As</i>: " + d.properties.As_ + ";<dd>"
                        + "<dt><i>Ba</i>: " + d.properties.Ba + ";<dd>"
                        + "<dt><i>Be</i>: " + d.properties.Be + ";<dd>"
                        + "<dt><i>Br</i>: " + d.properties.Br_ + ";<dd>"
                        + "<dt><i>Ca</i>: " + d.properties.Ca + ";<dd>"
                        + "<dt><i>Cd</i>: " + d.properties.Cd + ";<dd>"
                        + "<dt><i>Cl :" + d.properties.Cl_ + ";<dd>"
                        + "<dt><i>Conductivity</i>: " + d.properties.Conductivity + ";<dd>"
                        + "<dt><i>Cr</i>: " + d.properties.Cr + ";<dd>"
                        + "<dt><i>DO</i>: " + d.properties.DO + ";<dd>"
                        + "<dt><i>Electrical Conductivity</i>: " + d.properties.ElectricalConductivity + ";<dd>"
                        + "<dt><i>Gross Alpha 2 Sigma Comb. Uncertainty</i>: " + d.properties.Gross_alpha__2_sigma_combined_uncertainty + ";<dd>"
                        + "<dt><i>Gross Alpha</i>: " + d.properties.GrossAlpha + ";<dd>"
                        + "<dt><i>Gross Alpha: U Nat</i>: " + d.properties.GrossAlpha_U_Nat + ";<dd>"
                        + "<dt><i>Gross Beta 1</i>: " + d.properties.GrossBeta + ";<dd>"
                        + "<dt><i>Gross Beta: Cs 137</i>: " + d.properties.GrossBeta_Cs137 + ";<dd>"
                        + "<dt><i>Gross Beta: Sr Y90</i>: " + d.properties.GrossBeta_Sr_Y90 + ";<dd>"
                        + "<dt><i>Hardness</i>: " + d.properties.Hardness + ";<dd>"
                        + "<dt><i>Total Hardness</i>: " + d.properties.Hardness_Total + ";<dd>"
                        + "<dt><i>Hg</i>: " + d.properties.Hg + ";<dd>"
                        + "<dt><i>Hydroxide</i>: " + d.properties.Hydroxide + ";<dd>"
                        + "<dt><i>K</i>: " + d.properties.K + ";<dd>"
                        + "<dt><i>Mg</i>: " + d.properties.Mg + ";<dd>"
                        + "<dt><i>Mn</i>: " + d.properties.Mn + ";<dd>"
                        + "<dt><i>Na</i>: " + d.properties.Na + ";<dd>"
                        + "<dt><i>Na Adsorption Ratio</i>: " + d.properties.Na_AdsorptionRatio + ";<dd>"
                        + "<dt><i>Na Fraction Cations</i>: " + d.properties.Na_FractionCations + ";<dd>"
                        + "<dt><i>Na_K</i>: " + d.properties.Na_K + ";<dd>"
                        + "<dt><i>Nitrate</i>: " + d.properties.Nitrate + ";<dd>"
                        + "<dt><i>Nitrate_Nitrite</i>: " + d.properties.Nitrate_Nitrite + ";<dd>"
                        + "<dt><i>NO2</i>: " + d.properties.NO2_ + ";<dd>"
                        + "<dt><i>NO3</i>: " + d.properties.NO3_ + ";<dd>"
                        + "<dt><i>ORP</i>: " + d.properties.ORP + ";<dd>"
                        + "<dt><i>Pb</i>: " + d.properties.Pb + ";<dd>"
                        + "<dt><i>Ra 226</i>: " + d.properties.Ra_226 + ";<dd>"
                        + "<dt><i>Ra 228</i>: " + d.properties.Ra_228 + ";<dd>"
                        + "<dt><i>Ra Total</i>: " + d.properties.Ra_Total + ";<dd>"
                        + "<dt><i>Sb</i>: " + d.properties.Sb + ";<dd>"
                        + "<dt><i>Se</i>: " + d.properties.Se + ";<dd>"
                        + "<dt><i>Temperature</i>: " + d.properties.Temperature + ";<dd>"
                        + "<dt><i>Tl</i>: " + d.properties.Tl + ";<dd>"
                        + "<dt><i>Turbidity</i>: " + d.properties.Turbidity + ";<dd>"
                        + "<dt><i>U</i>: " + d.properties.U + "<dt><dl>");
                    wellMarkers.addLayer(marker);
                });

                // Add markers to map:
                map.addLayer(wellMarkers);
                map.fitBounds(wellMarkers.getBounds());

            });
        dc.renderAll();
    });

    // Scatterplot matrix
    // Event handler for d3 version

    function graphicviz() {
        require.config({
            paths: {
                d3: "JS_CSS_downladed_libraries/d3.v4.min"
            }
        });

        require(["d3"], function (d3) {
            // Sample taken from https://www.d3-graph-gallery.com/graph/correlogram_scatter.html
            // Chart dimensions
            var marginWhole = { top: 10, right: 10, bottom: 10, left: 40 },
                sizeWhole = 585 - marginWhole.left - marginWhole.right

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
                    .range(["#f6e8c3", "#01665e", "#dfc27d", "#c7eae5", "#bf812d", "#01665e", "#8c510a", "#35978f", "#80cdc1"])

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
                            .range([size - 2 * mar, 10]);

                        // Add a 'g' at the right position
                        var tmp = svg
                            .append('g')
                            .attr("transform", "translate(" + (position(var1) + mar) + "," + (position(var2) + mar) + ")");

                        // Add X and Y axis in tmp
                        tmp.append("g")
                            .attr("transform", "translate(" + 0 + "," + (size - mar * 2) + ")")
                            .call(d3.axisBottom(x).ticks(3))
                            .selectAll("text")
                            .style("text-anchor", "end")
                            .attr("dx", "-.8em")
                            .attr("dy", ".15em")
                            .attr("transform", "rotate(-30)");

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
                            .attr("r", 2.5)
                            .attr("fill", function (d) {
                                return color(d.wellUse)
                            })
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
                            .attr("x", size / 3.75)
                            .attr("y", size / 1.7)
                            .text(var1)
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
    //     fillColor_Var = "#8c510a";
    //   }
    //   else if (feature.properties.USE == "Agriculture") {
    //     fillColor_Var = "#bf812d";
    //   }
    //   else if (feature.properties.USE == "Domestic") {
    //     fillColor_Var = "#dfc27d";
    //   }
    //   else if (feature.properties.USE == "Livestock") {
    //     fillColor_Var = "#f6e8c3";
    //   }
    //   else if (feature.properties.USE == "Other") {
    //     fillColor_Var = "#01665e";
    //   }
    //   else if (feature.properties.USE == "Municipal") {
    //     fillColor_Var = "#c7eae5";
    //   }
    //   else if (feature.properties.USE == "Domestic Irrigaiton") {
    //     fillColor_Var = "#80cdc1";
    //   }
    //   else if (feature.properties.USE == "Recreation") {
    //     fillColor_Var = "#35978f";
    //   }
    //   // if USE == Unknown
    //   else {
    //     fillColor_Var = "01665e";
    //   }
    //   var geojsonMarkerOptions = {
    //     radius: 7,
    //     //fillColor: "#F46B06",
    //     fillColor: fillColor_Var,
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