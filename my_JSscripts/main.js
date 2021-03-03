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
                    marker.bindPopup("<dl><dt> WELL INFORMATION- NAVAJO NATION WELL" + "<dt>FID:" + d.properties.FID + ";<dd>" + "<dt> OBJECTID:" + d.properties.OBJECTID + ";<dd>" + "<dt> well_no:" + d.properties.well_no + ";<dd>" + "<dt> well_id:" + d.properties.well_id + ";<dd>" + "<dt> well_name:" + d.properties.well_name + ";<dd>" + "<dt> owner:" + d.properties.owner + ";<dd>" + "<dt> depth:" + d.properties.depth + ";<dd>" + "<dt> aquifer_co:" + d.properties.aquifer_co + ";<dd>" + "<dt> swl:" + d.properties.swl + ";<dd>" + "<dt> pwsid:" + d.properties.pwsid + ";<dd>" + "<dt> usgs_id:" + d.properties.usgs_id + ";<dd>" + "<dt> data_sourc:" + d.properties.data_sourc + ";<dd>" + "<dt> comments:" + d.properties.comments + ";<dd>" + "<dt> aka2:" + d.properties.aka2 + ";<dd>" + "<dt> aka3:" + d.properties.aka3 + ";<dd>" + "<dt> chapid:" + d.properties.chapid + ";<dd>" + "<dt> grazing_di:" + d.properties.grazing_di + ";<dd>" + "<dt> welltype:" + d.properties.welltype + ";<dd>" + "<dt> well_use:" + d.properties.well_use + ";<dd>" + "<dt> well_statu:" + d.properties.well_statu + ";<dd>" + "<dt> sdwa_type:" + d.properties.sdwa_type + ";<dd>" + "<dt> nn_agency:" + d.properties.nn_agency + ";<dd>" + "<dt> USE:" + d.properties.USE + ";<dd>" + "<dt> FID_ :" + d.properties.FID_ + ";<dd>" + "<dt> well_id_1:" + d.properties.well_id_1 + ";<dd>" + "<dt> Alkalinity:" + d.properties.Alkalinity + ";<dd>" + "<dt> Alkalini_1:" + d.properties.Alkalini_1 + ";<dd>" + "<dt> As_:" + d.properties.As_ + ";<dd>" + "<dt> Ba:" + d.properties.Ba + ";<dd>" + "<dt> Be:" + d.properties.Be + ";<dd>" + "<dt> Br_:" + d.properties.Br_ + ";<dd>" + "<dt> Ca:" + d.properties.Ca + ";<dd>" + "<dt> Cd:" + d.properties.Cd + ";<dd>" + "<dt> Cl_:" + d.properties.Cl_ + ";<dd>" + "<dt> Conductivity:" + d.properties.Conductivi + ";<dd>" + "<dt> Cr:" + d.properties.Cr + ";<dd>" + "<dt> DO:" + d.properties.DO + ";<dd>" + "<dt> Electrical:" + d.properties.Electrical + ";<dd>" + "<dt> Gross_alph:" + d.properties.Gross_alph + ";<dd>" + "<dt> GrossAplha:" + d.properties.GrossAplha + ";<dd>" + "<dt> GrossBeta:" + d.properties.GrossBeta + ";<dd>" + "<dt> GrossBeta_:" + d.properties.GrossBeta_ + ";<dd>" + "<dt> Hardness:" + d.properties.Hardness + ";<dd>" + "<dt> Hardness_T:" + d.properties.Hardness_T + ";<dd>" + "<dt> Hg:" + d.properties.Hg + ";<dd>" + "<dt> Hydroxide:" + d.properties.Hydroxide + ";<dd>" + "<dt> K:" + d.properties.K + ";<dd>" + "<dt> Mg:" + d.properties.Mg + ";<dd>" + "<dt> Mn:" + d.properties.Mn + ";<dd>" + "<dt> Na:" + d.properties.Na + ";<dd>" + "<dt> Na_Fractio:" + d.properties.Na_Fractio + ";<dd>" + "<dt> Na_K:" + d.properties.Na_K + ";<dd>" + "<dt> Nitrate:" + d.properties.Nitrate + ";<dd>" + "<dt> Nitrate_Ni:" + d.properties.Nitrate_Ni + ";<dd>" + "<dt> NO2_:" + d.properties.NO2_ + ";<dd>" + "<dt> NO3_:" + d.properties.NO3_ + ";<dd>" + "<dt> ORP:" + d.properties.ORP + ";<dd>" + "<dt> Pb:" + d.properties.Pb + ";<dd>" + "<dt> Ra_226:" + d.properties.Ra_226 + ";<dd>" + "<dt> Ra_228:" + d.properties.Ra_228 + ";<dd>" + "<dt> Ra_Total:" + d.properties.Ra_Total + ";<dd>" + "<dt> Sb:" + d.properties.Sb + ";<dd>" + "<dt> Se:" + d.properties.Se + ";<dd>" + "<dt> Temperature:" + d.properties.Temperatur + ";<dd>" + "<dt> Tl:" + d.properties.Tl + ";<dd>" + "<dt> Turbidity:" + d.properties.Turbidity + ";<dd>" + "<dt> U:" + d.properties.U + ".<dt><dl>");
                    wellMarkers.addLayer(marker);
                });
                map.addLayer(wellMarkers);
                map.fitBounds(wellMarkers.getBounds());
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