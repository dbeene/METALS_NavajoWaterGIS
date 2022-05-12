window.onload = function () {

    // Call leaflet map into map frame
    //base map
    //Global Variables - Map
    window.map = L.map('map').setView([36.292, -110.090], 8);
    //Global Variable - wellMarkers
    window.wellMarkers = new L.FeatureGroup();
    var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    OpenStreetMap_Mapnik.addTo(map);

    var esri_world = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    var USGS_USImageryTopo = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 20,
        attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
    });

    // NN Layers

    // City markers
    var cityMarkers = {
        radius: 5,
        fillColor: '#333333',
        color: '#000000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.6
    };

    // AUM markers
    var AUMMarkers = {
        radius: 4,
        fillColor: '#bd1b1b',
        color: '#520e0e',
        weight: 0.5,
        opacity: 0.8,
        fillOpacity: 0.6
    };

    // Cities
    $.getJSON("data/nnCities.geojson", function (data) {
        var nnCities = L.geoJson(data, {
            pointToLayer: function (feature, layer) {
                return L.circleMarker(layer, cityMarkers)
            },
            // style: myStyle,
            onEachFeature: function (feature, layer) {
                var cityTooltip = feature.properties.Name
                layer.bindTooltip(cityTooltip, {
                    permanent: true,
                    direction: "auto",
                    className: "city-labels"
                }).openTooltip();
            }

        });

        // AUMs
        $.getJSON("data/nnAUMs.geojson", function (data) {
            var nnAUMs = L.geoJson(data, {
                pointToLayer: function (feature, layer) {
                    return L.circleMarker(layer, AUMMarkers)
                },
                onEachFeature: function (feature, layer) {
                    var aumPopup = "<b>Name: </b>" + feature.properties.MINE
                        + "<br><b>Reclamation Status: </b>" + feature.properties.REC_STAT
                    layer.bindPopup(aumPopup);
                }
            });

            // Watersheds -- need to rework input data
            // Add NHD Watersheds layer to map
            // function wsStyle(feature) {
            //     return {
            //         fillColor: '#dbc38f',
            //         weight: 1,
            //         opacity: 0.5,
            //         color: '#9c9076',
            //         dashArray: 1.5,
            //         fillOpacity: 0.75
            //     };
            // }
            // $.getJSON("data/NHDWBDHU12.geojson", function (data) {
            //     var watersheds = L.geoJson(data, {
            //         style: wsStyle,
            //         onEachFeature: function (feature, layer) {
            //             var wsPopup = "<b>Subwatershed Name: </b>" + feature.properties.name
            //             layer.bindPopup(wsPopup);
            //         }
            //     });

                // Chapters
                // Add NN layer to map -- render underneath circleMarkers
                // Define colors by NN agency for overlay map
                function getColor(d) {
                    return d == "Chinle" ? '#ffffd4' :
                        d == "Eastern" ? '#fee391' :
                            d == "Fort Defiance" ? '#fec44f' :
                                d == "Shiprock" ? '#fe9929' :
                                    d == "Western" ? '#d95f0e' :
                                        '#993404';
                }

                // Define style using referenced colors
                function myStyle(feature) {
                    return {
                        fillColor: getColor(feature.properties.Agency),
                        weight: 1,
                        opacity: 1,
                        color: '#9c9076',
                        dashArray: '1.5',
                        fillOpacity: 0.4
                    };
                }

                // Call in NN layer
                $.getJSON("data/nnChapters.geojson", function (data) {
                    var nnChapters = L.geoJson(data, {
                        style: myStyle,
                        onEachFeature: function (feature, layer) {
                            var chPopup = "<b>Chapter: </b>" + feature.properties.Chapter
                                + "<br><b>Agency: </b>" + feature.properties.Agency
                                + "<br><b>Population: </b>" + feature.properties.Population
                            layer.bindPopup(chPopup);
                        }
                    });

                    nnChapters.addTo(map)
                    nnChapters.bringToBack();

                    // Leaflet layer control
                    var baseMaps = {
                        'Topo': OpenStreetMap_Mapnik,
                        'Sattelite': esri_world,
                        'Hybrid': USGS_USImageryTopo
                    }

                    var overlayMaps = {
                        // 'Watersheds': watersheds,
                        'Cities': nnCities,
                        'AUMs': nnAUMs
                        // 'Chapters': nnChapters
                    }


                    L.control.layers(baseMaps, overlayMaps).addTo(map);
                });

            });
        });

        "use strict"; //JS strict mode
        // Add control.scale to map
        L.control.scale().addTo(map);


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
        d3.json('data/AnalytesSel_new.json', function (error, data) {
            var wellData = data.features;
            _.each(wellData, function (d) {
                d.count = +d.count;
                // round to the nearest 200
                d.As = Math.round(+d.properties.As / 50) * 50;
                d.Ca = Math.round(+d.properties.Ca / 100) * 100;
                d.Ra_Total = Math.round(+d.properties.Ra_Total / 1) * 1;
                d.U = Math.round(+d.properties.U / 100) * 100;
                // Well use
                d.USE = d.properties.USE

            });

            // set crossfilter
            var ndx = crossfilter(wellData);

            //Dimensions
            var AsDim = ndx.dimension(function (d) { return d.properties.As; });
            var CaDim = ndx.dimension(function (d) { return d.properties.Ca; });
            var Ra_TotalDim = ndx.dimension(function (d) { return d.properties.Ra_Total; });
            var UDim = ndx.dimension(function (d) { return d.properties.U; });

            //20210825 attempt to build pie chart
            var useDim = ndx.dimension(dc.pluck('USE'));

            var allDim = ndx.dimension(function (d) { return d; });

            // create groups (y-axis values)
            var all = ndx.groupAll();

            //
            var countPerAs = AsDim.group().reduceCount();
            var countPerCa = CaDim.group().reduceCount();
            var countPerRa_Total = Ra_TotalDim.group().reduceCount();
            var countPerU = UDim.group().reduceCount();
            var countPerUse = useDim.group().reduceCount();

            //specify charts

            var as_CountChart = dc.barChart('#histogram1');
            var caCountChart = dc.barChart('#histogram2');
            var ra_TotalCountChart = dc.barChart('#histogram3');
            var uCountChart = dc.barChart('#histogram4');
            var dataCount = dc.dataCount('#data-count');

            //data table declare
            var dataTable = dc.dataTable('#data-table');

            // Register handler
            d3.selectAll('a#all').on('click', function () {
                dc.filterAll();
                dc.renderAll();
            })

            // Default histograms
            caCountChart
                .width(250)
                .height(250)
                .dimension(CaDim)
                .group(countPerCa)
                .x(d3.scale.linear().domain([0, 976]))
                .y(d3.scale.linear().domain([0, 13]))
                .xUnits(function () { return 976 })
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
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
                .xUnits(function () { return 700; })
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 })
                .on('pretransition', function (mcl) {
                    var x_vert = 30; // MCL for U is 30
                    var extra_data = [ // Array to define vertical line starting at (MCL, 0)
                        { x: mcl.x()(x_vert), y: 0 },
                        { x: mcl.x()(x_vert), y: uCountChart.effectiveHeight() }
                    ];
                    var line = d3.svg.line()
                        .x(function (d) { return d.x; })
                        .y(function (d) { return d.y; })
                        .interpolate('linear')
                    var chartBody = uCountChart.select('g.chart-body');
                    var path = chartBody.selectAll('path.extra').data([extra_data]);
                    path.enter()
                        .append('path')
                        .attr('class', 'oeExtra')
                        .attr('stroke', 'red')
                        .attr('id', 'oeLine')
                        .attr("stroke-width", 2)
                        .style("stroke-dasharray", ("4,3"))
                    path.attr('d', line)
                    path.exit().remove()
                        ;
                });
            ;
            uCountChart.xAxis().tickValues([30, 200, 400, 600])

            as_CountChart
                .width(250)
                .height(250)
                .dimension(AsDim)
                .group(countPerAs)
                .x(d3.scale.linear().domain([0, 282]))
                .y(d3.scale.linear().domain([0, 30]))
                .xUnits(function () { return 282; })
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 })
                // Add vertical line at MCL using example from https://github.com/dc-js/dc.js/blob/develop/web-src/examples/row-vertical-line.html
                .on('pretransition', function (mcl) {
                    var x_vert = 10; // MCL for As is 10
                    var extra_data = [ // Array to define vertical line starting at (MCL, 0)
                        { x: mcl.x()(x_vert), y: 0 },
                        { x: mcl.x()(x_vert), y: as_CountChart.effectiveHeight() }
                    ];
                    var line = d3.svg.line()
                        .x(function (d) { return d.x; })
                        .y(function (d) { return d.y; })
                        .interpolate('linear')
                    var chartBody = as_CountChart.select('g.chart-body'); //select g.chart-body will select the rect object within the svg
                    var path = chartBody.selectAll('path.extra').data([extra_data]);
                    path.enter()
                        .append('path')
                        .attr('class', 'oeExtra')
                        .attr('stroke', 'red')
                        .attr('id', 'oeLine')
                        .attr("stroke-width", 2)
                        .style("stroke-dasharray", ("4,3"))
                    path.attr('d', line)
                    path.exit().remove()
                        ;
                })
                ;
            ;
            as_CountChart.xAxis().tickValues([10, 125, 250, 375, 500]); //Lowest tick value set at MCL

            ra_TotalCountChart
                .width(250)
                .height(250)
                .dimension(Ra_TotalDim)
                .group(countPerRa_Total)
                .x(d3.scale.linear().domain([0, 111]))
                .y(d3.scale.linear().domain([0, 25]))
                .xUnits(function () { return 111; })
                .elasticY(false)
                .centerBar(true)
                .barPadding(3)
                .yAxisLabel('Count')
                .margins({ top: 10, right: 20, bottom: 50, left: 50 });
            ra_TotalCountChart.xAxis().tickValues([0, 25, 50, 75, 100]);

            var column2 = function (d) { return d.properties.As; };
            var column3 = function (d) { return d.properties.Ca; };
            var column4 = function (d) { return d.properties.U; };
            var column5 = function (d) { return d.properties.Ra_Total; };

            dataCount
                .dimension(ndx)
                .group(all);

            //default dataTable
            dataTable
                .dimension(allDim)
                .group(function (d) { return ''; }) //remove empty top row 
                .size(1000)
                .columns([
                    function (d) { return d.properties.well_no; },
                    function (d) { return d.properties.Chapter },
                    function (d) { return d.properties.nn_agency },
                    function (d) { return d.properties.lat; },
                    function (d) { return d.properties.long; },
                    column2,
                    column3,
                    column4,
                    column5
                ])
                .on('pretransition', function (table) {
                    // each time table is rendered remove nasty extra row dc.js insists on adding
                    table.select('tr.dc-table-group').remove();

                    wellMarkers.clearLayers();
                    _.each(allDim.top(Infinity), function (d) {
                        var filLoc = d.properties;

                        // Color based on well use
                        function getColor(wUse) {
                            switch (wUse) {
                                case "Domestic":
                                    return "#018571";
                                case "Livestock":
                                    return "#a6611a";
                                case "Other":
                                    return "#dfc27d";
                                case "Municipal":
                                    return "#80cdc1";
                                default:
                                    return "#666666";
                            }
                        }

                        var markerOptions = {
                            radius: 3.5,
                            fillColor: getColor(d.properties.USE),
                            color: "black",
                            weight: 0.4,
                            opacity: 1,
                            fillOpacity: 0.7
                        };

                        // Add circle markers
                        var marker = L.circleMarker([filLoc.lat, filLoc.long], markerOptions);

                        marker.bindPopup(
                            "<dl><dt> <h5><b><i>WELL INFORMATION- NAVAJO NATION WELL</i></b></h5><br>"
                            + "<dl>"
                            // General Well Info
                            + "<dt><span style='font-weight:bolder'><i><u>General Information</u></i></dt>"
                            + "<dt><span style='font-weight:bolder'>Chapter: </span> </dt> <dd>" + d.properties.Chapter + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Agency: </span> </dt> <dd>" + d.properties.nn_agency + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Latitude: </span> </dt> <dd>" + d.properties.lat + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Longitude: </span> </dt> <dd>" + d.properties.long + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Well No.: </span> </dt> <dd>" + d.properties.well_no + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Well Name: </span> </dt> <dd>" + d.properties.well_name + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Alternate Name 1: </span> </dt> <dd>" + d.properties.aka2 + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Alternate Name 2: </span> </dt> <dd>" + d.properties.aka3 + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Owner: </span> </dt> <dd>" + d.properties.owner + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Depth (ft.): </span> </dt> <dd>" + d.properties.depth + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Public Water Sys. ID: </span> </dt> <dd>" + d.properties.pwsid + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>USGS ID: </span> </dt> <dd>" + d.properties.usgs_id + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Data Source: </span> </dt> <dd>" + d.properties.data_sourc + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Comment(s): </span> </dt> <dd>" + d.properties.comments + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Status: </span> </dt> <dd>" + d.properties.well_statu + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Well Use: </span> </dt> <dd>" + d.properties.USE + ";<dd>"
                            // Primary Contaminants: Radionuclides
                            + "<br><dt><span style='font-weight:bolder'><i><u>Primary Contaminants: Radionuclides</u></i></dt>"
                            + "<dt><span style='font-weight:bolder'>Radium-226 (Ra-226) (pCi/L): </span> </dt> <dd>" + d.properties.Ra_226 + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Radium-228 (Ra-228) (pCi/L): </span> </dt> <dd>" + d.properties.Ra_228 + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Total Radium (Ra) (pCi/L): </span> </dt> <dd>" + d.properties.Ra_Total + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Uranium (U) (&mu;g/L): </span> </dt> <dd>" + d.properties.U + ";<dd>"
                            // Primary Contaminants: Inorganic Chemicals
                            + "<br><dt><span style='font-weight:bolder'><i><u>Primary Contaminants: Inorganic Chemicals</u></i></dt>"
                            + "<dt><span style='font-weight:bolder'>Arsenic (As) (&mu;g/L): </span> </dt> <dd>" + d.properties.As + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Barium (Ba) (&mu;g/L): </span> </dt> <dd>" + d.properties.Ba + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Beryllium (Be) (&mu;g/L): </span> </dt> <dd>" + d.properties.Be + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Cd (&mu;g/L): </span> </dt> <dd>" + d.properties.Cd + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Cr (&mu;g/L): </span> </dt> <dd>" + d.properties.Cr + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Chromium (Cr) (&mu;g/L): </span> </dt> <dd>" + d.properties.Cr + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Copper (Cu) (&mu;g/L): </span> </dt> <dd>" + d.properties.Cu + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Mercury (Hg) (&mu;g/L): </span> </dt> <dd>" + d.properties.Hg + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Nitrate (NO3-) (Mg/L): </span> </dt> <dd>" + d.properties.Nitrate + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Nitrite (NO2-) (Mg/L): </span> </dt> <dd>" + d.properties.Nitrite + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Lead (Pb) (&mu;g/L): </span> </dt> <dd>" + d.properties.Pb + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Antimony (Sb) (&mu;g/L): </span> </dt> <dd>" + d.properties.Sb + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Selenium (Se) (&mu;g/L): </span> </dt> <dd>" + d.properties.Se + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Thallium (Tl) (&mu;g/L): </span> </dt> <dd>" + d.properties.Tl + ";<dd>"
                            // Primary Contaminants: Microorganisms
                            + "<br><dt><span style='font-weight:bolder'><i><u>Primary Contaminants: Microorganisms</u></i></dt>"
                            + "<dt><span style='font-weight:bolder'>Turbidity (NTU): </span> </dt> <dd>" + d.properties.Turbidity + ";<dd>"
                            // Secondary Contaminants
                            + "<br><dt><span style='font-weight:bolder'><i><u>Secondary Contaminants</u></i></dt>"
                            + "<dt><span style='font-weight:bolder'>Aluminum (Al) (mg/L): </span> </dt> <dd>" + d.properties.Al + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Chloride (mg/L): </span> </dt> <dd>" + d.properties.Chloride + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Corrosivity (LSI): </span> </dt> <dd>" + d.properties.Corrosivity + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Iron (Fe) (&mu;g/L): </span> </dt> <dd>" + d.properties.Fe + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Fluoride (F-) (mg/L): </span> </dt> <dd>" + d.properties.Fluoride + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Manganese (Mn) (&mu;g/L): </span> </dt> <dd>" + d.properties.Mn + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>pH: </span> </dt> <dd>" + d.properties.pH + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Sulfate (SO<sub>4</sub><sup>2-</sup>) (mg/L): </span> </dt> <dd>" + d.properties.Sulfate + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Total Dissolved Solids (TDS) (mg/L): </span> </dt> <dd>" + d.properties.TotalDissolvedSolids + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Zinc (Zn) (&mu;g/L): </span> </dt> <dd>" + d.properties.Zn + ";<dd>"
                            // Other Water Chemistry
                            + "<br><dt><span style='font-weight:bolder'><i><u>Other Water Chemistry</u></i></dt>"
                            + "<dt><span style='font-weight:bolder'>Total Alkalinity: </span> </dt> <dd>" + d.properties.Alkalinity_Total + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Bicarbonate (mg/L): </span> </dt> <dd>" + d.properties.Bicarbonate + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Calcium (Ca) (mg/L): </span> </dt> <dd>" + d.properties.Ca + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Conductivity (&mu;s/cm): </span> </dt> <dd>" + d.properties.Conductivity + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Dissolved Oxygen (&mu;g/L): </span> </dt> <dd>" + d.properties.DissolvedOxygen + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Hardness (mg/L as CaCO3): </span> </dt> <dd>" + d.properties.Hardness + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Sodium (Na) (mg/L): </span> </dt> <dd>" + d.properties.Na + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Salinity (mg/L): </span> </dt> <dd>" + d.properties.Salinity + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Specific Conductance (uS/cm at 25&deg;C): </span> </dt> <dd>" + d.properties.SpecificConductance + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Temperature (&deg;C): </span> </dt> <dd>" + d.properties.Temperature + ";<dd>"
                            // Other Analytes
                            + "<br><dt><span style='font-weight:bolder'><i><u>Other Analytes</u></i></dt>"
                            + "<dt><span style='font-weight:bolder'>Bromide (Br-) (mg/L): </span> </dt> <dd>" + d.properties.Bromide + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Potassium (K) (mg/L): </span> </dt> <dd>" + d.properties.K + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Magnesium (Mg) (mg/L): </span> </dt> <dd>" + d.properties.Mg + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Molybdenum (Mo) (&mu;g/L): </span> </dt> <dd>" + d.properties.Mo + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Nickel (Ni) (&mu;g/L): </span> </dt> <dd>" + d.properties.Ni + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Phosphate (PO<sub>4</sub><sup>3-</sup>) (mg/L): </span> </dt> <dd>" + d.properties.Phosphate + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Tin (Sn) (&mu;g/L): </span> </dt> <dd>" + d.properties.Sn + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Strontium (Sr) (&mu;g/L): </span> </dt> <dd>" + d.properties.Sr + ";<dd>"
                            + "<dt><span style='font-weight:bolder'>Vanadium (V) (&mu;g/L): </span> </dt> <dd>" + d.properties.V + ";<dd>"
                            // More Information
                            + "<br><br><dd><small><i>More information on primary and secondary water contaminants can be found <a href='https://www.epa.gov/ground-water-and-drinking-water/national-primary-drinking-water-regulations' target='_blank'>here</a>.</i></small><dd>"
                            + "</dl>"
                        );
                        wellMarkers.addLayer(marker);
                    });
                    // New Map pane so markers render on top of geojson (chapters)
                    map.createPane('markers');
                    map.getPane('markers').style.zIndex = 650;
                    // Add markers to map:
                    map.addLayer(wellMarkers);
                    map.fitBounds(wellMarkers.getBounds());
                    // Label chapters using this example: http://bl.ocks.org/katossky/367a68ffb7d70f59d070
                    // But be sure they don't clutter when zoomed out
                    // If I can't get it to work, implement search function on next iteration
                    // using this SO answer: https://stackoverflow.com/questions/70284344/filtering-leaflet-map-based-on-dropdown-selection-in-d3
                    // and this: http://www.d3noob.org/2014/02/searching-leafletjs-map-using.html

                });
            dc.renderAll();
        });

        //global variable that have initial inputs of default analytes and will have the dropdown analytes after click.
        window.input1 = "As";
        window.input2 = "Ca";
        window.input3 = "Ra_Total";
        window.input4 = "U";

        //event listeners to update after clicking "update plots button".
        plotBtn_eventlisteners = document.getElementById("updatePlot_btn");
        plotBtn_eventlisteners.addEventListener("click", () => {

            selectAnalyte();
            updateScatterplotMatrix();

        });

        // Scatterplot matrix
        // Event handler for d3 version
        window.updateScatterplotMatrix = function () {

            require.config({
                paths: {
                    "d3": "JS_CSS_downladed_libraries/d3.v.6.3.1",
                    "dc": "JS_CSS_downladed_libraries/dc.v.4.2.4"
                },
            });

            require(["d3", "dc"], function (d3, dc) {
                // var fields = [];
                var fields = [input1, input2, input3, input4];
                var rows = [],
                    cols = [];
                var rows = ['heading'].concat(fields.slice(0).reverse()),
                    cols = ['heading'].concat(fields);

                if (location.search.indexOf('nowait') !== -1) {
                    dc.constants.EVENT_DELAY = 0;
                    d3.select('#wait-verb').text('remove')
                    d3.select('#wait-prep').text('with');
                    d3.select('#wait-url').attr('href', location.origin + location.pathname);
                } else {
                    d3.select('#wait-url').attr('href', location.origin + location.pathname + '?nowait');
                }

                d3.csv('data/AnalytesSel.csv').then(function (analyte) {
                    analyte.forEach(function (d) {
                        Object.keys(fields).forEach(function (ab) {
                            d[fields[ab]] = +d[fields[ab]];
                        });
                    });
                    var data = crossfilter(analyte);

                    function make_dimension(var1, var2) {
                        return data.dimension(function (d) {
                            return [d[var1], d[var2], d.USE];
                        });
                    }
                    function key_part(i) {
                        return function (kv) {
                            return kv.key[i];
                        };
                    }

                    var charts = [];

                    d3.select('#content')
                        .selectAll('tr')
                        .data(data)
                        .exit()
                        .remove();

                    d3.select('#content')
                        .selectAll('tr').data(rows)
                        .enter().append('tr').attr('class', function (d) {
                            return d === 'heading' ? 'heading row' : 'row';
                        })
                        .each(function (row, y) {
                            d3.select(this).selectAll('td').data(cols)
                                .enter().append('td').attr('class', function (d) {
                                    return d === 'heading' ? 'heading entry' : 'entry';
                                })
                                .each(function (col, x) {
                                    var cdiv = d3.select(this).append('div')
                                    if (row === 'heading') {
                                        if (col !== 'heading')
                                            cdiv.text(col.replace('_', ' '))
                                        return;
                                    }
                                    else if (col === 'heading') {
                                        cdiv.text(row.replace('_', ' '))
                                        return;
                                    }
                                    cdiv.attr('class', 'chart-holder');
                                    var chart = new dc.ScatterPlot(cdiv);
                                    var dim = make_dimension(col, row),
                                        group = dim.group();
                                    var showYAxis = x === 1, showXAxis = y === 4;
                                    chart
                                        .transitionDuration(0)
                                        .width(125 + (showYAxis ? 25 : 0))
                                        .height(125 + (showXAxis ? 20 : 0))
                                        .margins({
                                            left: showYAxis ? 25 : 8,
                                            top: 5,
                                            right: 2.75,
                                            bottom: showXAxis ? 20 : 5
                                        })
                                        .dimension(dim).group(group)
                                        .keyAccessor(key_part(0))
                                        .valueAccessor(key_part(1))
                                        .colorAccessor(key_part(2))
                                        .colorDomain(["Livestock", "Unknown", "Domestic", "Municipal", "Agriculture", "Other", "Independent", "Recreation", "Domestic Irrigation"])
                                        .ordinalColors(["#a6611a", "#000000", "#018571", "#80cdc1", "#dfc27d", "#dfc27d", "#dfc27d", "#dfc27d", "#dfc27d"])
                                        .x(d3.scaleLinear()).xAxisPadding("0.001%")
                                        .y(d3.scaleLinear()).yAxisPadding("0.001%")
                                        .brushOn(true)
                                        .elasticX(true)
                                        .elasticY(true)
                                        .symbolSize(5)
                                        .nonemptyOpacity(0.7)
                                        .emptySize(1)
                                        .emptyColor('#000000')
                                        .emptyOpacity(0.7)
                                        .excludedSize(1)
                                        .excludedColor('#000000')
                                        .excludedOpacity(0.7)
                                        .renderHorizontalGridLines(true)
                                        .renderVerticalGridLines(true);
                                    chart.xAxis().ticks(3)
                                    chart.yAxis().ticks(6);
                                    chart.on('postRender', function (chart) {
                                        // remove axes unless at left or bottom
                                        if (!showXAxis)
                                            chart.select('.x.axis').attr('display', 'none');
                                        if (!showYAxis)
                                            chart.select('.y.axis').attr('display', 'none');
                                        // remove clip path, allow dots to display outside
                                        chart.select('.chart-body').attr('clip-path', null);
                                    });
                                    // only filter on one chart at a time
                                    chart.on('filtered', function (_, filter) {
                                        if (!filter)
                                            return;
                                        charts.forEach(function (c) {
                                            if (c !== chart)
                                                c.filter(null);
                                        });
                                    });
                                    charts.push(chart);
                                });
                        });
                    dc.renderAll();
                });
            });
        }

        //Call function to render scatterplot
        updateScatterplotMatrix();

        // Scatterplot matrix //
        // source: https://observablehq.com/@d3/brushable-scatterplot-matrix

        // This function is triggered on clicking the button
        window.selectAnalyte = function () {

            //the value if selected analyte from dropwdown 1 is stored in input 1
            selected1 = document.getElementById("selectbox1");
            input1 = selected1.options[selected1.selectedIndex].value;

            //the value if selected analyte from dropwdown 2 is stored in input 2
            selected2 = document.getElementById("selectbox2");
            input2 = selected2.options[selected2.selectedIndex].value;

            //the value if selected analyte from dropwdown 3 is stored in input 3
            selected3 = document.getElementById("selectbox3");
            input3 = selected3.options[selected3.selectedIndex].value;

            //the value if selected analyte from dropwdown 4 is stored in input 4
            selected4 = document.getElementById("selectbox4");
            input4 = selected4.options[selected4.selectedIndex].value;

            d3.json('data/AnalytesSel_new.json', function (error, data) {
                var wellData = data.features;
                _.each(wellData, function (d) {
                    d.count = +d.count;
                    d.As = Math.round(+d.properties.As / 50) * 50;
                    d.Ba = Math.round(+d.properties.Ba / 1) * 1;
                    d.Ca = Math.round(+d.properties.Ca / 100) * 100;
                    d.Chloride = Math.round(+d.properties.Chloride / 1) * 1;
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

                var AsDim = ndx.dimension(function (d) { return d.properties.As; });
                var BaDim = ndx.dimension(function (d) { return d.properties.Ba; });
                var CaDim = ndx.dimension(function (d) { return d.properties.Ca; });
                var ChlorideDim = ndx.dimension(function (d) { return d.properties.Chloride; });
                var CrDim = ndx.dimension(function (d) { return d.properties.Cr; });
                var GrossAlpha_U_NatDim = ndx.dimension(function (d) { return d.properties.GrossAlpha_U_Nat; });
                var NitrateDim = ndx.dimension(function (d) { return d.properties.Nitrate; });
                var PbDim = ndx.dimension(function (d) { return d.properties.Pb; });
                var Ra_TotalDim = ndx.dimension(function (d) { return d.properties.Ra_Total; });
                var SeDim = ndx.dimension(function (d) { return d.properties.Se; });
                var UDim = ndx.dimension(function (d) { return d.properties.U; });
                var NoneDim = ndx.dimension(function (d) { return d.None; });
                var allDim = ndx.dimension(function (d) { return d; });
                var all = ndx.groupAll();

                //countPerAnalyte
                var countPerAs = AsDim.group().reduceCount();
                var countPerBa = BaDim.group().reduceCount();
                var countPerCa = CaDim.group().reduceCount();
                var countPerChloride = ChlorideDim.group().reduceCount();
                var countPerCr = CrDim.group().reduceCount();
                var countPerGrossAlpha_U_Nat = GrossAlpha_U_NatDim.group().reduceCount();
                var countPerNitrate = NitrateDim.group().reduceCount();
                var countPerPb = PbDim.group().reduceCount();
                var countPerRa_Total = Ra_TotalDim.group().reduceCount();
                var countPerSe = SeDim.group().reduceCount();
                var countPerU = UDim.group().reduceCount();
                var countPerNone = NoneDim.group().reduceCount();

                //Dynamic Charts
                var histogram1 = dc.barChart('#histogram1');
                var histogram2 = dc.barChart('#histogram2');
                var histogram3 = dc.barChart('#histogram3');
                var histogram4 = dc.barChart('#histogram4');
                //dataCount
                var dataCountNew = dc.dataCount('#data-count');
                var dataTableNew = dc.dataTable('#data-table');
                var dataHistogram1;
                var dataHistogram2;
                var dataHistogram3;
                var dataHistogram4;

                if (input1 == "As") {
                    histogram1
                        .width(250)
                        .height(250)
                        .dimension(AsDim)
                        .group(countPerAs)
                        .x(d3.scale.linear().domain([0, 282]))
                        .y(d3.scale.linear().domain([0, 30]))
                        .xUnits(function () { return 282; })
                        .elasticY(false)
                        .centerBar(true)
                        .barPadding(3)
                        .yAxisLabel('Count')
                        .margins({ top: 10, right: 20, bottom: 50, left: 50 })
                        .on('pretransition', function (mcl) {
                            var x_vert = 10; // MCL for As is 10
                            var As_MCL = [ // Array to define vertical line starting at (MCL, 0)
                                { x: mcl.x()(x_vert), y: 0 },
                                { x: mcl.x()(x_vert), y: histogram1.effectiveHeight() }
                            ];
                            var line = d3.svg.line()
                                .x(function (d) { return d.x; })
                                .y(function (d) { return d.y; })
                                .interpolate('linear')
                            var chartBody = histogram1.select('g.chart-body');
                            var path = chartBody.selectAll('path.extra').data([As_MCL]);
                            path.enter()
                                .append('path')
                                .attr('class', 'oeExtra')
                                .attr('stroke', 'red')
                                .attr('id', 'oeLine')
                                .attr("stroke-width", 2)
                                .style("stroke-dasharray", ("4,3"))
                            path.attr('d', line)
                            path.exit().remove()
                                ;
                        });
                    ;
                    histogram1.xAxis().tickValues([10, 125, 250, 375, 500]); //Lowest tick value set at MCL
                    dataHistogram1 = function (d) { return d.properties.As; };
                }

                else if (input1 == "Ba") {
                    histogram1
                        .width(250)
                        .height(250)
                        .dimension(BaDim)
                        .group(countPerBa)
                        .x(d3.scale.linear().domain([0, 2401]))
                        .y(d3.scale.linear().domain([0, 30]))
                        .xUnits(function () { return 2401 })
                        .elasticY(false)
                        .centerBar(true)
                        .barPadding(3)
                        .yAxisLabel('Count')
                        .margins({ top: 10, right: 20, bottom: 50, left: 50 })
                        .on('pretransition', function (mcl) {
                            var x_vert = 2000; // MCL for Ba is 2000
                            var Ba_MCL = [ // Array to define vertical line starting at (MCL, 0)
                                { x: mcl.x()(x_vert), y: 0 },
                                { x: mcl.x()(x_vert), y: histogram1.effectiveHeight() }
                            ];
                            var line = d3.svg.line()
                                .x(function (d) { return d.x; })
                                .y(function (d) { return d.y; })
                                .interpolate('linear')
                            var chartBody = histogram1.select('g.chart-body');
                            var path = chartBody.selectAll('path.extra').data([Ba_MCL]);
                            path.enter()
                                .append('path')
                                .attr('class', 'oeExtra')
                                .attr('stroke', 'red')
                                .attr('id', 'oeLine')
                                .attr("stroke-width", 2)
                                .style("stroke-dasharray", ("4,3"))
                            path.attr('d', line)
                            path.exit().remove()
                                ;
                        })
                        ;
                    ;
                    histogram1.xAxis().tickValues([2, 300, 600, 900, 1200, 1500]);
                    dataHistogram1 = function (d) { return d.properties.Ba; };
                }

                else if (input1 == "Ca") {

                    histogram1
                        .width(250)
                        .height(250)
                        .dimension(CaDim)
                        .group(countPerCa)
                        .x(d3.scale.linear().domain([0, 976]))
                        .y(d3.scale.linear().domain([0, 13]))
                        .xUnits(function () { return 976 })
                        .elasticY(false)
                        .centerBar(true)
                        .barPadding(3)
                        .yAxisLabel('Count')
                        .margins({ top: 10, right: 20, bottom: 50, left: 50 })
                        ;
                    histogram1.xAxis().tickValues([0, 200, 400, 600, 800, 1000]);

                    dataHistogram1 = function (d) { return d.properties.Ca; };
                }
                else if (input1 == "Chloride") {

                    histogram1
                        .width(250)
                        .height(250)
                        .dimension(ChlorideDim)
                        .group(countPerChloride)
                        .x(d3.scale.linear().domain([0, 41800]))
                        .y(d3.scale.linear().domain([0, 3]))
                        .elasticY(false)
                        .centerBar(true)
                        .barPadding(3)
                        .yAxisLabel('Count')
                        .margins({ top: 10, right: 20, bottom: 50, left: 50 })
                        .on('pretransition', function (mcl) {
                            var x_vert = 250; // MCL for chloride is 250
                            var Cl_MCL = [ // Array to define vertical line starting at (MCL, 0)
                                { x: mcl.x()(x_vert), y: 0 },
                                { x: mcl.x()(x_vert), y: histogram1.effectiveHeight() }
                            ];
                            var line = d3.svg.line()
                                .x(function (d) { return d.x; })
                                .y(function (d) { return d.y; })
                                .interpolate('linear')
                            var chartBody = histogram1.select('g.chart-body');
                            var path = chartBody.selectAll('path.extra').data([Cl_MCL]);
                            path.enter()
                                .append('path')
                                .attr('class', 'oeExtra')
                                .attr('stroke', 'yellow')
                                .attr('id', 'oeLine')
                                .attr("stroke-width", 2)
                                .style("stroke-dasharray", ("4,3"))
                            path.attr('d', line)
                            path.exit().remove()
                                ;
                        });
                    histogram1.xAxis().tickValues([250, 10000, 20000, 30000, 40000]);

                    dataHistogram1 = function (d) { return d.properties.Chloride; };
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
                        .yAxisLabel('Count')
                        .margins({ top: 10, right: 20, bottom: 50, left: 50 })
                        .on('pretransition', function (mcl) {
                            var x_vert = 10; // MCL for Nitrate is 10
                            var Ni_MCL = [ // Array to define vertical line starting at (MCL, 0)
                                { x: mcl.x()(x_vert), y: 0 },
                                { x: mcl.x()(x_vert), y: histogram1.effectiveHeight() }
                            ];
                            var line = d3.svg.line()
                                .x(function (d) { return d.x; })
                                .y(function (d) { return d.y; })
                                .interpolate('linear')
                            var chartBody = histogram1.select('g.chart-body');
                            var path = chartBody.selectAll('path.extra').data([Ni_MCL]);
                            path.enter()
                                .append('path')
                                .attr('class', 'oeExtra')
                                .attr('stroke', 'red')
                                .attr('id', 'oeLine')
                                .attr("stroke-width", 2)
                                .style("stroke-dasharray", ("4,3"))
                            path.attr('d', line)
                            path.exit().remove()
                                ;
                        })
                        ;
                    histogram1.xAxis().tickValues([10, 50, 100, 150, 200, 250]);

                    dataHistogram1 = function (d) { return d.properties.Nitrate; };
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
                        .yAxisLabel('Count')
                        .margins({ top: 10, right: 20, bottom: 50, left: 50 })
                        .on('pretransition', function (mcl) {
                            var x_vert = 0; // MCL for Pb is 0
                            var Pb_MCL = [ // Array to define vertical line starting at (MCL, 0)
                                { x: mcl.x()(x_vert), y: 0 },
                                { x: mcl.x()(x_vert), y: histogram1.effectiveHeight() }
                            ];
                            var line = d3.svg.line()
                                .x(function (d) { return d.x; })
                                .y(function (d) { return d.y; })
                                .interpolate('linear')
                            var chartBody = histogram1.select('g.chart-body');
                            var path = chartBody.selectAll('path.extra').data([Pb_MCL]);
                            path.enter()
                                .append('path')
                                .attr('class', 'oeExtra')
                                .attr('stroke', 'red')
                                .attr('id', 'oeLine')
                                .attr("stroke-width", 2)
                                .style("stroke-dasharray", ("4,3"))
                            path.attr('d', line)
                            path.exit().remove()
                                ;
                        })
                        ;
                    histogram1.xAxis().tickValues([0, 100, 200, 300]);

                    dataHistogram1 = function (d) { return d.properties.Pb; };
                }
                else if (input1 == "Ra_Total") {
                    histogram1
                        .width(250)
                        .height(250)
                        .dimension(Ra_TotalDim)
                        .group(countPerRa_Total)
                        .x(d3.scale.linear().domain([0, 111]))
                        .y(d3.scale.linear().domain([0, 25]))
                        .xUnits(function () { return 111; })
                        .elasticY(false)
                        .centerBar(true)
                        .barPadding(3)
                        .yAxisLabel('Count')
                        .margins({ top: 10, right: 20, bottom: 50, left: 50 });
                    histogram1.xAxis().tickValues([0, 25, 50, 75, 100]);

                    dataHistogram1 = function (d) { return d.properties.Ra_Total; };


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
                        .yAxisLabel('Count')
                        .margins({ top: 10, right: 20, bottom: 50, left: 50 })
                        .on('pretransition', function (mcl) {
                            var x_vert = 0.05; // MCL for BSe is 0.05
                            var Se_MCL = [ // Array to define vertical line starting at (MCL, 0)
                                { x: mcl.x()(x_vert), y: 0 },
                                { x: mcl.x()(x_vert), y: histogram1.effectiveHeight() }
                            ];
                            var line = d3.svg.line()
                                .x(function (d) { return d.x; })
                                .y(function (d) { return d.y; })
                                .interpolate('linear')
                            var chartBody = histogram1.select('g.chart-body');
                            var path = chartBody.selectAll('path.extra').data([Se_MCL]);
                            path.enter()
                                .append('path')
                                .attr('class', 'oeExtra')
                                .attr('stroke', 'red')
                                .attr('id', 'oeLine')
                                .attr("stroke-width", 2)
                                .style("stroke-dasharray", ("4,3"))
                            path.attr('d', line)
                            path.exit().remove()
                                ;
                        })
                        ;
                    histogram1.xAxis().tickValues([0.05, 50, 100, 150, 200, 250]);

                    dataHistogram1 = function (d) { return d.properties.Se; };
                }
                else if (input1 == "U") {

                    histogram1
                        .width(250)
                        .height(250)
                        .dimension(UDim)
                        .group(countPerU)
                        .x(d3.scale.linear().domain([0, 700]))
                        .y(d3.scale.linear().domain([0, 20]))
                        .xUnits(function () { return 700; })
                        .elasticY(false)
                        .centerBar(true)
                        .barPadding(3)
                        .yAxisLabel('Count')
                        .margins({ top: 10, right: 20, bottom: 50, left: 50 })
                        .on('pretransition', function (mcl) {
                            var x_vert = 30; // MCL for U is 30
                            var extra_data = [ // Array to define vertical line starting at (MCL, 0)
                                { x: mcl.x()(x_vert), y: 0 },
                                { x: mcl.x()(x_vert), y: histogram1.effectiveHeight() }
                            ];
                            var line = d3.svg.line()
                                .x(function (d) { return d.x; })
                                .y(function (d) { return d.y; })
                                .interpolate('linear')
                            var chartBody = histogram1.select('g.chart-body');
                            var path = chartBody.selectAll('path.extra').data([extra_data]);
                            path.enter()
                                .append('path')
                                .attr('class', 'oeExtra')
                                .attr('stroke', 'red')
                                .attr('id', 'oeLine')
                                .attr("stroke-width", 2)
                                .style("stroke-dasharray", ("4,3"))
                            path.attr('d', line)
                            path.exit().remove()
                                ;
                        });
                    ;
                    histogram1.xAxis().tickValues([30, 200, 400, 600])

                    dataHistogram1 = function (d) { return d.properties.U; };
                }

                else if (input1 == "None") {

                    histogram1
                        .width(250)
                        .height(250)
                        .dimension(NoneDim)
                        .group(countPerNone)
                        .x(d3.scale.linear().domain([0, 0]))
                        .elasticY(false)
                        .centerBar(true)
                        .barPadding(3)
                        .yAxisLabel('Count')
                        .margins({ top: 10, right: 20, bottom: 50, left: 50 });
                    histogram1.xAxis().tickValues([0, 0, 0, 0, 0, 0]);
                    histogram1.yAxis().tickValues([0, 0, 0, 0]);

                    dataHistogram1 = function (d) { return d.properties.None; };
                }

                if (input2 == "As") {
                    histogram2
                        .width(250)
                        .height(250)
                        .dimension(AsDim)
                        .group(countPerAs)
                        .x(d3.scale.linear().domain([0, 282]))
                        .y(d3.scale.linear().domain([0, 30]))
                        .xUnits(function () { return 282; })
                        .elasticY(false)
                        .centerBar(true)
                        .barPadding(3)
                        .yAxisLabel('Count')
                        .margins({ top: 10, right: 20, bottom: 50, left: 50 })
                        .on('pretransition', function (mcl) {
                            var x_vert = 10; // MCL for As is 10
                            var As_MCL = [ // Array to define vertical line starting at (MCL, 0)
                                { x: mcl.x()(x_vert), y: 0 },
                                { x: mcl.x()(x_vert), y: histogram2.effectiveHeight() }
                            ];
                            var line = d3.svg.line()
                                .x(function (d) { return d.x; })
                                .y(function (d) { return d.y; })
                                .interpolate('linear')
                            var chartBody = histogram2.select('g.chart-body');
                            var path = chartBody.selectAll('path.extra').data([As_MCL]);
                            path.enter()
                                .append('path')
                                .attr('class', 'oeExtra')
                                .attr('stroke', 'red')
                                .attr('id', 'oeLine')
                                .attr("stroke-width", 2)
                                .style("stroke-dasharray", ("4,3"))
                            path.attr('d', line)
                            path.exit().remove()
                                ;
                        });
                    ;
                    histogram2.xAxis().tickValues([10, 125, 250, 375, 500]); //Lowest tick value set at MCL
                    dataHistogram2 = function (d) { return d.properties.As; };
                }

                else if (input2 == "Ba") {
                    histogram2
                        .width(250)
                        .height(250)
                        .dimension(BaDim)
                        .group(countPerBa)
                        .x(d3.scale.linear().domain([0, 2401]))
                        .y(d3.scale.linear().domain([0, 30]))
                        .xUnits(function () { return 2401 })
                        .elasticY(false)
                        .centerBar(true)
                        .barPadding(3)
                        .yAxisLabel('Count')
                        .margins({ top: 10, right: 20, bottom: 50, left: 50 })
                        .on('pretransition', function (mcl) {
                            var x_vert = 2000; // MCL for Ba is 2000
                            var Ba_MCL = [ // Array to define vertical line starting at (MCL, 0)
                                { x: mcl.x()(x_vert), y: 0 },
                                { x: mcl.x()(x_vert), y: histogram2.effectiveHeight() }
                            ];
                            var line = d3.svg.line()
                                .x(function (d) { return d.x; })
                                .y(function (d) { return d.y; })
                                .interpolate('linear')
                            var chartBody = histogram2.select('g.chart-body');
                            var path = chartBody.selectAll('path.extra').data([Ba_MCL]);
                            path.enter()
                                .append('path')
                                .attr('class', 'oeExtra')
                                .attr('stroke', 'red')
                                .attr('id', 'oeLine')
                                .attr("stroke-width", 2)
                                .style("stroke-dasharray", ("4,3"))
                            path.attr('d', line)
                            path.exit().remove()
                                ;
                        })
                        ;
                    ;
                    histogram2.xAxis().tickValues([2, 300, 600, 900, 1200, 1500]);
                    dataHistogram2 = function (d) { return d.properties.Ba; };
                }

                else if (input2 == "Ca") {

                    histogram2
                        .width(250)
                        .height(250)
                        .dimension(CaDim)
                        .group(countPerCa)
                        .x(d3.scale.linear().domain([0, 976]))
                        .y(d3.scale.linear().domain([0, 13]))
                        .xUnits(function () { return 976 })
                        .elasticY(false)
                        .centerBar(true)
                        .barPadding(3)
                        .yAxisLabel('Count')
                        .margins({ top: 10, right: 20, bottom: 50, left: 50 })
                        ;
                    histogram2.xAxis().tickValues([0, 200, 400, 600, 800, 1000]);

                    dataHistogram2 = function (d) { return d.properties.Ca; };
                }
                else if (input2 == "Chloride") {

                    histogram2
                        .width(250)
                        .height(250)
                        .dimension(ChlorideDim)
                        .group(countPerChloride)
                        .x(d3.scale.linear().domain([0, 41800]))
                        .y(d3.scale.linear().domain([0, 3]))
                        .elasticY(false)
                        .centerBar(true)
                        .barPadding(3)
                        .yAxisLabel('Count')
                        .margins({ top: 10, right: 20, bottom: 50, left: 50 })
                        .on('pretransition', function (mcl) {
                            var x_vert = 250; // MCL for chloride is 250
                            var Cl_MCL = [ // Array to define vertical line starting at (MCL, 0)
                                { x: mcl.x()(x_vert), y: 0 },
                                { x: mcl.x()(x_vert), y: histogram2.effectiveHeight() }
                            ];
                            var line = d3.svg.line()
                                .x(function (d) { return d.x; })
                                .y(function (d) { return d.y; })
                                .interpolate('linear')
                            var chartBody = histogram2.select('g.chart-body');
                            var path = chartBody.selectAll('path.extra').data([Cl_MCL]);
                            path.enter()
                                .append('path')
                                .attr('class', 'oeExtra')
                                .attr('stroke', 'yellow')
                                .attr('id', 'oeLine')
                                .attr("stroke-width", 2)
                                .style("stroke-dasharray", ("4,3"))
                            path.attr('d', line)
                            path.exit().remove()
                                ;
                        });
                    histogram2.xAxis().tickValues([250, 10000, 20000, 30000, 40000]);

                    dataHistogram2 = function (d) { return d.properties.Chloride; };
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
                        .yAxisLabel('Count')
                        .margins({ top: 10, right: 20, bottom: 50, left: 50 })
                        .on('pretransition', function (mcl) {
                            var x_vert = 10; // MCL for Nitrate is 10
                            var Ni_MCL = [ // Array to define vertical line starting at (MCL, 0)
                                { x: mcl.x()(x_vert), y: 0 },
                                { x: mcl.x()(x_vert), y: histogram2.effectiveHeight() }
                            ];
                            var line = d3.svg.line()
                                .x(function (d) { return d.x; })
                                .y(function (d) { return d.y; })
                                .interpolate('linear')
                            var chartBody = histogram2.select('g.chart-body');
                            var path = chartBody.selectAll('path.extra').data([Ni_MCL]);
                            path.enter()
                                .append('path')
                                .attr('class', 'oeExtra')
                                .attr('stroke', 'red')
                                .attr('id', 'oeLine')
                                .attr("stroke-width", 2)
                                .style("stroke-dasharray", ("4,3"))
                            path.attr('d', line)
                            path.exit().remove()
                                ;
                        })
                        ;
                    histogram2.xAxis().tickValues([10, 50, 100, 150, 200, 250]);

                    dataHistogram2 = function (d) { return d.properties.Nitrate; };
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
                        .yAxisLabel('Count')
                        .margins({ top: 10, right: 20, bottom: 50, left: 50 })
                        .on('pretransition', function (mcl) {
                            var x_vert = 0; // MCL for Pb is 0
                            var Pb_MCL = [ // Array to define vertical line starting at (MCL, 0)
                                { x: mcl.x()(x_vert), y: 0 },
                                { x: mcl.x()(x_vert), y: histogram2.effectiveHeight() }
                            ];
                            var line = d3.svg.line()
                                .x(function (d) { return d.x; })
                                .y(function (d) { return d.y; })
                                .interpolate('linear')
                            var chartBody = histogram2.select('g.chart-body');
                            var path = chartBody.selectAll('path.extra').data([Pb_MCL]);
                            path.enter()
                                .append('path')
                                .attr('class', 'oeExtra')
                                .attr('stroke', 'red')
                                .attr('id', 'oeLine')
                                .attr("stroke-width", 2)
                                .style("stroke-dasharray", ("4,3"))
                            path.attr('d', line)
                            path.exit().remove()
                                ;
                        })
                        ;
                    histogram2.xAxis().tickValues([0, 100, 200, 300]);

                    dataHistogram2 = function (d) { return d.properties.Pb; };
                }
                else if (input2 == "Ra_Total") {
                    histogram2
                        .width(250)
                        .height(250)
                        .dimension(Ra_TotalDim)
                        .group(countPerRa_Total)
                        .x(d3.scale.linear().domain([0, 111]))
                        .y(d3.scale.linear().domain([0, 25]))
                        .xUnits(function () { return 111; })
                        .elasticY(false)
                        .centerBar(true)
                        .barPadding(3)
                        .yAxisLabel('Count')
                        .margins({ top: 10, right: 20, bottom: 50, left: 50 });
                    histogram2.xAxis().tickValues([0, 25, 50, 75, 100]);

                    dataHistogram2 = function (d) { return d.properties.Ra_Total; };
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
                        .yAxisLabel('Count')
                        .margins({ top: 10, right: 20, bottom: 50, left: 50 })
                        .on('pretransition', function (mcl) {
                            var x_vert = 0.05; // MCL for BSe is 0.05
                            var Se_MCL = [ // Array to define vertical line starting at (MCL, 0)
                                { x: mcl.x()(x_vert), y: 0 },
                                { x: mcl.x()(x_vert), y: histogram2.effectiveHeight() }
                            ];
                            var line = d3.svg.line()
                                .x(function (d) { return d.x; })
                                .y(function (d) { return d.y; })
                                .interpolate('linear')
                            var chartBody = histogram2.select('g.chart-body');
                            var path = chartBody.selectAll('path.extra').data([Se_MCL]);
                            path.enter()
                                .append('path')
                                .attr('class', 'oeExtra')
                                .attr('stroke', 'red')
                                .attr('id', 'oeLine')
                                .attr("stroke-width", 2)
                                .style("stroke-dasharray", ("4,3"))
                            path.attr('d', line)
                            path.exit().remove()
                                ;
                        })
                        ;
                    histogram2.xAxis().tickValues([0.05, 50, 100, 150, 200, 250]);

                    dataHistogram2 = function (d) { return d.properties.Se; };
                }
                else if (input2 == "U") {

                    histogram2
                        .width(250)
                        .height(250)
                        .dimension(UDim)
                        .group(countPerU)
                        .x(d3.scale.linear().domain([0, 700]))
                        .y(d3.scale.linear().domain([0, 20]))
                        .xUnits(function () { return 700; })
                        .elasticY(false)
                        .centerBar(true)
                        .barPadding(3)
                        .yAxisLabel('Count')
                        .margins({ top: 10, right: 20, bottom: 50, left: 50 })
                        .on('pretransition', function (mcl) {
                            var x_vert = 30; // MCL for U is 30
                            var extra_data = [ // Array to define vertical line starting at (MCL, 0)
                                { x: mcl.x()(x_vert), y: 0 },
                                { x: mcl.x()(x_vert), y: histogram2.effectiveHeight() }
                            ];
                            var line = d3.svg.line()
                                .x(function (d) { return d.x; })
                                .y(function (d) { return d.y; })
                                .interpolate('linear')
                            var chartBody = histogram2.select('g.chart-body');
                            var path = chartBody.selectAll('path.extra').data([extra_data]);
                            path.enter()
                                .append('path')
                                .attr('class', 'oeExtra')
                                .attr('stroke', 'red')
                                .attr('id', 'oeLine')
                                .attr("stroke-width", 2)
                                .style("stroke-dasharray", ("4,3"))
                            path.attr('d', line)
                            path.exit().remove()
                                ;
                        });
                    ;
                    histogram2.xAxis().tickValues([30, 200, 400, 600])

                    dataHistogram2 = function (d) { return d.properties.U; };
                }



                else if (input2 == "None") {

                    histogram2
                        .width(250)
                        .height(250)
                        .dimension(NoneDim)
                        .group(countPerNone)
                        .x(d3.scale.linear().domain([0, 0]))
                        .elasticY(false)
                        .centerBar(true)
                        .barPadding(3)
                        .yAxisLabel('Count')
                        .margins({ top: 10, right: 20, bottom: 50, left: 50 });
                    histogram2.xAxis().tickValues([0, 0, 0, 0, 0, 0]);
                    histogram2.yAxis().tickValues([0, 0, 0, 0]);

                    dataHistogram2 = function (d) { return d.properties.None; };
                }

                if (input3 == "As") {
                    histogram3
                        .width(250)
                        .height(250)
                        .dimension(AsDim)
                        .group(countPerAs)
                        .x(d3.scale.linear().domain([0, 282]))
                        .y(d3.scale.linear().domain([0, 30]))
                        .xUnits(function () { return 282; })
                        .elasticY(false)
                        .centerBar(true)
                        .barPadding(3)
                        .yAxisLabel('Count')
                        .margins({ top: 10, right: 20, bottom: 50, left: 50 })
                        .on('pretransition', function (mcl) {
                            var x_vert = 10; // MCL for As is 10
                            var As_MCL = [ // Array to define vertical line starting at (MCL, 0)
                                { x: mcl.x()(x_vert), y: 0 },
                                { x: mcl.x()(x_vert), y: histogram3.effectiveHeight() }
                            ];
                            var line = d3.svg.line()
                                .x(function (d) { return d.x; })
                                .y(function (d) { return d.y; })
                                .interpolate('linear')
                            var chartBody = histogram3.select('g.chart-body');
                            var path = chartBody.selectAll('path.extra').data([As_MCL]);
                            path.enter()
                                .append('path')
                                .attr('class', 'oeExtra')
                                .attr('stroke', 'red')
                                .attr('id', 'oeLine')
                                .attr("stroke-width", 2)
                                .style("stroke-dasharray", ("4,3"))
                            path.attr('d', line)
                            path.exit().remove()
                                ;
                        });
                    ;
                    histogram3.xAxis().tickValues([10, 125, 250, 375, 500]); //Lowest tick value set at MCL
                    dataHistogram3 = function (d) { return d.properties.As; };
                }

                else if (input3 == "Ba") {
                    histogram3
                        .width(250)
                        .height(250)
                        .dimension(BaDim)
                        .group(countPerBa)
                        .x(d3.scale.linear().domain([0, 2401]))
                        .y(d3.scale.linear().domain([0, 30]))
                        .xUnits(function () { return 2401 })
                        .elasticY(false)
                        .centerBar(true)
                        .barPadding(3)
                        .yAxisLabel('Count')
                        .margins({ top: 10, right: 20, bottom: 50, left: 50 })
                        .on('pretransition', function (mcl) {
                            var x_vert = 2000; // MCL for Ba is 2000
                            var Ba_MCL = [ // Array to define vertical line starting at (MCL, 0)
                                { x: mcl.x()(x_vert), y: 0 },
                                { x: mcl.x()(x_vert), y: histogram3.effectiveHeight() }
                            ];
                            var line = d3.svg.line()
                                .x(function (d) { return d.x; })
                                .y(function (d) { return d.y; })
                                .interpolate('linear')
                            var chartBody = histogram3.select('g.chart-body');
                            var path = chartBody.selectAll('path.extra').data([Ba_MCL]);
                            path.enter()
                                .append('path')
                                .attr('class', 'oeExtra')
                                .attr('stroke', 'red')
                                .attr('id', 'oeLine')
                                .attr("stroke-width", 2)
                                .style("stroke-dasharray", ("4,3"))
                            path.attr('d', line)
                            path.exit().remove()
                                ;
                        })
                        ;
                    ;
                    histogram3.xAxis().tickValues([2, 300, 600, 900, 1200, 1500]);
                    dataHistogram3 = function (d) { return d.properties.Ba; };
                }

                else if (input3 == "Ca") {

                    histogram3
                        .width(250)
                        .height(250)
                        .dimension(CaDim)
                        .group(countPerCa)
                        .x(d3.scale.linear().domain([0, 976]))
                        .y(d3.scale.linear().domain([0, 13]))
                        .xUnits(function () { return 976 })
                        .elasticY(false)
                        .centerBar(true)
                        .barPadding(3)
                        .yAxisLabel('Count')
                        .margins({ top: 10, right: 20, bottom: 50, left: 50 })
                        ;
                    histogram3.xAxis().tickValues([0, 200, 400, 600, 800, 1000]);

                    dataHistogram3 = function (d) { return d.properties.Ca; };
                }
                else if (input3 == "Chloride") {

                    histogram3
                        .width(250)
                        .height(250)
                        .dimension(ChlorideDim)
                        .group(countPerChloride)
                        .x(d3.scale.linear().domain([0, 41800]))
                        .y(d3.scale.linear().domain([0, 3]))
                        .elasticY(false)
                        .centerBar(true)
                        .barPadding(3)
                        .yAxisLabel('Count')
                        .margins({ top: 10, right: 20, bottom: 50, left: 50 })
                        .on('pretransition', function (mcl) {
                            var x_vert = 250; // MCL for chloride is 250
                            var Cl_MCL = [ // Array to define vertical line starting at (MCL, 0)
                                { x: mcl.x()(x_vert), y: 0 },
                                { x: mcl.x()(x_vert), y: histogram3.effectiveHeight() }
                            ];
                            var line = d3.svg.line()
                                .x(function (d) { return d.x; })
                                .y(function (d) { return d.y; })
                                .interpolate('linear')
                            var chartBody = histogram3.select('g.chart-body');
                            var path = chartBody.selectAll('path.extra').data([Cl_MCL]);
                            path.enter()
                                .append('path')
                                .attr('class', 'oeExtra')
                                .attr('stroke', 'yellow')
                                .attr('id', 'oeLine')
                                .attr("stroke-width", 2)
                                .style("stroke-dasharray", ("4,3"))
                            path.attr('d', line)
                            path.exit().remove()
                                ;
                        });
                    histogram3.xAxis().tickValues([250, 10000, 20000, 30000, 40000]);

                    dataHistogram3 = function (d) { return d.properties.Chloride; };
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
                        .yAxisLabel('Count')
                        .margins({ top: 10, right: 20, bottom: 50, left: 50 })
                        .on('pretransition', function (mcl) {
                            var x_vert = 10; // MCL for Nitrate is 10
                            var Ni_MCL = [ // Array to define vertical line starting at (MCL, 0)
                                { x: mcl.x()(x_vert), y: 0 },
                                { x: mcl.x()(x_vert), y: histogram3.effectiveHeight() }
                            ];
                            var line = d3.svg.line()
                                .x(function (d) { return d.x; })
                                .y(function (d) { return d.y; })
                                .interpolate('linear')
                            var chartBody = histogram3.select('g.chart-body');
                            var path = chartBody.selectAll('path.extra').data([Ni_MCL]);
                            path.enter()
                                .append('path')
                                .attr('class', 'oeExtra')
                                .attr('stroke', 'red')
                                .attr('id', 'oeLine')
                                .attr("stroke-width", 2)
                                .style("stroke-dasharray", ("4,3"))
                            path.attr('d', line)
                            path.exit().remove()
                                ;
                        })
                        ;
                    histogram3.xAxis().tickValues([10, 50, 100, 150, 200, 250]);

                    dataHistogram3 = function (d) { return d.properties.Nitrate; };
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
                        .yAxisLabel('Count')
                        .margins({ top: 10, right: 20, bottom: 50, left: 50 })
                        .on('pretransition', function (mcl) {
                            var x_vert = 0; // MCL for Pb is 0
                            var Pb_MCL = [ // Array to define vertical line starting at (MCL, 0)
                                { x: mcl.x()(x_vert), y: 0 },
                                { x: mcl.x()(x_vert), y: histogram3.effectiveHeight() }
                            ];
                            var line = d3.svg.line()
                                .x(function (d) { return d.x; })
                                .y(function (d) { return d.y; })
                                .interpolate('linear')
                            var chartBody = histogram3.select('g.chart-body');
                            var path = chartBody.selectAll('path.extra').data([Pb_MCL]);
                            path.enter()
                                .append('path')
                                .attr('class', 'oeExtra')
                                .attr('stroke', 'red')
                                .attr('id', 'oeLine')
                                .attr("stroke-width", 2)
                                .style("stroke-dasharray", ("4,3"))
                            path.attr('d', line)
                            path.exit().remove()
                                ;
                        })
                        ;
                    histogram3.xAxis().tickValues([0, 100, 200, 300]);

                    dataHistogram3 = function (d) { return d.properties.Pb; };
                }
                else if (input3 == "Ra_Total") {
                    histogram3
                        .width(250)
                        .height(250)
                        .dimension(Ra_TotalDim)
                        .group(countPerRa_Total)
                        .x(d3.scale.linear().domain([0, 111]))
                        .y(d3.scale.linear().domain([0, 25]))
                        .xUnits(function () { return 111; })
                        .elasticY(false)
                        .centerBar(true)
                        .barPadding(3)
                        .yAxisLabel('Count')
                        .margins({ top: 10, right: 20, bottom: 50, left: 50 });
                    histogram3.xAxis().tickValues([0, 25, 50, 75, 100]);

                    dataHistogram3 = function (d) { return d.properties.Ra_Total; };
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
                        .yAxisLabel('Count')
                        .margins({ top: 10, right: 20, bottom: 50, left: 50 })
                        .on('pretransition', function (mcl) {
                            var x_vert = 0.05; // MCL for BSe is 0.05
                            var Se_MCL = [ // Array to define vertical line starting at (MCL, 0)
                                { x: mcl.x()(x_vert), y: 0 },
                                { x: mcl.x()(x_vert), y: histogram3.effectiveHeight() }
                            ];
                            var line = d3.svg.line()
                                .x(function (d) { return d.x; })
                                .y(function (d) { return d.y; })
                                .interpolate('linear')
                            var chartBody = histogram3.select('g.chart-body');
                            var path = chartBody.selectAll('path.extra').data([Se_MCL]);
                            path.enter()
                                .append('path')
                                .attr('class', 'oeExtra')
                                .attr('stroke', 'red')
                                .attr('id', 'oeLine')
                                .attr("stroke-width", 2)
                                .style("stroke-dasharray", ("4,3"))
                            path.attr('d', line)
                            path.exit().remove()
                                ;
                        })
                        ;
                    histogram3.xAxis().tickValues([0.05, 50, 100, 150, 200, 250]);

                    dataHistogram3 = function (d) { return d.properties.Se; };
                }
                else if (input3 == "U") {

                    histogram3
                        .width(250)
                        .height(250)
                        .dimension(UDim)
                        .group(countPerU)
                        .x(d3.scale.linear().domain([0, 700]))
                        .y(d3.scale.linear().domain([0, 20]))
                        .xUnits(function () { return 700; })
                        .elasticY(false)
                        .centerBar(true)
                        .barPadding(3)
                        .yAxisLabel('Count')
                        .margins({ top: 10, right: 20, bottom: 50, left: 50 })
                        .on('pretransition', function (mcl) {
                            var x_vert = 30; // MCL for U is 30
                            var extra_data = [ // Array to define vertical line starting at (MCL, 0)
                                { x: mcl.x()(x_vert), y: 0 },
                                { x: mcl.x()(x_vert), y: histogram3.effectiveHeight() }
                            ];
                            var line = d3.svg.line()
                                .x(function (d) { return d.x; })
                                .y(function (d) { return d.y; })
                                .interpolate('linear')
                            var chartBody = histogram3.select('g.chart-body');
                            var path = chartBody.selectAll('path.extra').data([extra_data]);
                            path.enter()
                                .append('path')
                                .attr('class', 'oeExtra')
                                .attr('stroke', 'red')
                                .attr('id', 'oeLine')
                                .attr("stroke-width", 2)
                                .style("stroke-dasharray", ("4,3"))
                            path.attr('d', line)
                            path.exit().remove()
                                ;
                        });
                    ;
                    histogram3.xAxis().tickValues([30, 200, 400, 600])

                    dataHistogram3 = function (d) { return d.properties.U; };
                }



                else if (input3 == "None") {

                    histogram3
                        .width(250)
                        .height(250)
                        .dimension(NoneDim)
                        .group(countPerNone)
                        .x(d3.scale.linear().domain([0, 0]))
                        .elasticY(false)
                        .centerBar(true)
                        .barPadding(3)
                        .yAxisLabel('Count')
                        .margins({ top: 10, right: 20, bottom: 50, left: 50 });
                    histogram3.xAxis().tickValues([0, 0, 0, 0, 0, 0]);
                    histogram3.yAxis().tickValues([0, 0, 0, 0]);

                    dataHistogram3 = function (d) { return d.properties.None; };
                }

                if (input4 == "As") {
                    histogram4
                        .width(250)
                        .height(250)
                        .dimension(AsDim)
                        .group(countPerAs)
                        .x(d3.scale.linear().domain([0, 282]))
                        .y(d3.scale.linear().domain([0, 30]))
                        .xUnits(function () { return 282; })
                        .elasticY(false)
                        .centerBar(true)
                        .barPadding(3)
                        .yAxisLabel('Count')
                        .margins({ top: 10, right: 20, bottom: 50, left: 50 })
                        .on('pretransition', function (mcl) {
                            var x_vert = 10; // MCL for As is 10
                            var As_MCL = [ // Array to define vertical line starting at (MCL, 0)
                                { x: mcl.x()(x_vert), y: 0 },
                                { x: mcl.x()(x_vert), y: histogram4.effectiveHeight() }
                            ];
                            var line = d3.svg.line()
                                .x(function (d) { return d.x; })
                                .y(function (d) { return d.y; })
                                .interpolate('linear')
                            var chartBody = histogram4.select('g.chart-body');
                            var path = chartBody.selectAll('path.extra').data([As_MCL]);
                            path.enter()
                                .append('path')
                                .attr('class', 'oeExtra')
                                .attr('stroke', 'red')
                                .attr('id', 'oeLine')
                                .attr("stroke-width", 2)
                                .style("stroke-dasharray", ("4,3"))
                            path.attr('d', line)
                            path.exit().remove()
                                ;
                        });
                    ;
                    histogram4.xAxis().tickValues([10, 125, 250, 375, 500]); //Lowest tick value set at MCL
                    dataHistogram4 = function (d) { return d.properties.As; };
                }

                else if (input4 == "Ba") {
                    histogram4
                        .width(250)
                        .height(250)
                        .dimension(BaDim)
                        .group(countPerBa)
                        .x(d3.scale.linear().domain([0, 2401]))
                        .y(d3.scale.linear().domain([0, 30]))
                        .xUnits(function () { return 2401 })
                        .elasticY(false)
                        .centerBar(true)
                        .barPadding(3)
                        .yAxisLabel('Count')
                        .margins({ top: 10, right: 20, bottom: 50, left: 50 })
                        .on('pretransition', function (mcl) {
                            var x_vert = 2000; // MCL for Ba is 2000
                            var Ba_MCL = [ // Array to define vertical line starting at (MCL, 0)
                                { x: mcl.x()(x_vert), y: 0 },
                                { x: mcl.x()(x_vert), y: histogram4.effectiveHeight() }
                            ];
                            var line = d3.svg.line()
                                .x(function (d) { return d.x; })
                                .y(function (d) { return d.y; })
                                .interpolate('linear')
                            var chartBody = histogram4.select('g.chart-body');
                            var path = chartBody.selectAll('path.extra').data([Ba_MCL]);
                            path.enter()
                                .append('path')
                                .attr('class', 'oeExtra')
                                .attr('stroke', 'red')
                                .attr('id', 'oeLine')
                                .attr("stroke-width", 2)
                                .style("stroke-dasharray", ("4,3"))
                            path.attr('d', line)
                            path.exit().remove()
                                ;
                        })
                        ;
                    ;
                    histogram4.xAxis().tickValues([2, 300, 600, 900, 1200, 1500]);
                    dataHistogram4 = function (d) { return d.properties.Ba; };
                }

                else if (input4 == "Ca") {

                    histogram4
                        .width(250)
                        .height(250)
                        .dimension(CaDim)
                        .group(countPerCa)
                        .x(d3.scale.linear().domain([0, 976]))
                        .y(d3.scale.linear().domain([0, 13]))
                        .xUnits(function () { return 976 })
                        .elasticY(false)
                        .centerBar(true)
                        .barPadding(3)
                        .yAxisLabel('Count')
                        .margins({ top: 10, right: 20, bottom: 50, left: 50 })
                        ;
                    histogram4.xAxis().tickValues([0, 200, 400, 600, 800, 1000]);

                    dataHistogram4 = function (d) { return d.properties.Ca; };
                }
                else if (input4 == "Chloride") {

                    histogram4
                        .width(250)
                        .height(250)
                        .dimension(ChlorideDim)
                        .group(countPerChloride)
                        .x(d3.scale.linear().domain([0, 41800]))
                        .y(d3.scale.linear().domain([0, 3]))
                        .elasticY(false)
                        .centerBar(true)
                        .barPadding(3)
                        .yAxisLabel('Count')
                        .margins({ top: 10, right: 20, bottom: 50, left: 50 })
                        .on('pretransition', function (mcl) {
                            var x_vert = 250; // MCL for chloride is 250
                            var Cl_MCL = [ // Array to define vertical line starting at (MCL, 0)
                                { x: mcl.x()(x_vert), y: 0 },
                                { x: mcl.x()(x_vert), y: histogram4.effectiveHeight() }
                            ];
                            var line = d3.svg.line()
                                .x(function (d) { return d.x; })
                                .y(function (d) { return d.y; })
                                .interpolate('linear')
                            var chartBody = histogram4.select('g.chart-body');
                            var path = chartBody.selectAll('path.extra').data([Cl_MCL]);
                            path.enter()
                                .append('path')
                                .attr('class', 'oeExtra')
                                .attr('stroke', 'yellow')
                                .attr('id', 'oeLine')
                                .attr("stroke-width", 2)
                                .style("stroke-dasharray", ("4,3"))
                            path.attr('d', line)
                            path.exit().remove()
                                ;
                        });
                    histogram4.xAxis().tickValues([250, 10000, 20000, 30000, 40000]);

                    dataHistogram4 = function (d) { return d.properties.Chloride; };
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
                        .yAxisLabel('Count')
                        .margins({ top: 10, right: 20, bottom: 50, left: 50 })
                        .on('pretransition', function (mcl) {
                            var x_vert = 10; // MCL for Nitrate is 10
                            var Ni_MCL = [ // Array to define vertical line starting at (MCL, 0)
                                { x: mcl.x()(x_vert), y: 0 },
                                { x: mcl.x()(x_vert), y: histogram4.effectiveHeight() }
                            ];
                            var line = d3.svg.line()
                                .x(function (d) { return d.x; })
                                .y(function (d) { return d.y; })
                                .interpolate('linear')
                            var chartBody = histogram4.select('g.chart-body');
                            var path = chartBody.selectAll('path.extra').data([Ni_MCL]);
                            path.enter()
                                .append('path')
                                .attr('class', 'oeExtra')
                                .attr('stroke', 'red')
                                .attr('id', 'oeLine')
                                .attr("stroke-width", 2)
                                .style("stroke-dasharray", ("4,3"))
                            path.attr('d', line)
                            path.exit().remove()
                                ;
                        })
                        ;
                    histogram4.xAxis().tickValues([10, 50, 100, 150, 200, 250]);

                    dataHistogram4 = function (d) { return d.properties.Nitrate; };
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
                        .yAxisLabel('Count')
                        .margins({ top: 10, right: 20, bottom: 50, left: 50 })
                        .on('pretransition', function (mcl) {
                            var x_vert = 0; // MCL for Pb is 0
                            var Pb_MCL = [ // Array to define vertical line starting at (MCL, 0)
                                { x: mcl.x()(x_vert), y: 0 },
                                { x: mcl.x()(x_vert), y: histogram4.effectiveHeight() }
                            ];
                            var line = d3.svg.line()
                                .x(function (d) { return d.x; })
                                .y(function (d) { return d.y; })
                                .interpolate('linear')
                            var chartBody = histogram4.select('g.chart-body');
                            var path = chartBody.selectAll('path.extra').data([Pb_MCL]);
                            path.enter()
                                .append('path')
                                .attr('class', 'oeExtra')
                                .attr('stroke', 'red')
                                .attr('id', 'oeLine')
                                .attr("stroke-width", 2)
                                .style("stroke-dasharray", ("4,3"))
                            path.attr('d', line)
                            path.exit().remove()
                                ;
                        })
                        ;
                    histogram4.xAxis().tickValues([0, 100, 200, 300]);

                    dataHistogram4 = function (d) { return d.properties.Pb; };
                }
                else if (input4 == "Ra_Total") {
                    histogram4
                        .width(250)
                        .height(250)
                        .dimension(Ra_TotalDim)
                        .group(countPerRa_Total)
                        .x(d3.scale.linear().domain([0, 111]))
                        .y(d3.scale.linear().domain([0, 25]))
                        .xUnits(function () { return 111; })
                        .elasticY(false)
                        .centerBar(true)
                        .barPadding(3)
                        .yAxisLabel('Count')
                        .margins({ top: 10, right: 20, bottom: 50, left: 50 });
                    histogram4.xAxis().tickValues([0, 25, 50, 75, 100]);
                    
                    dataHistogram4 = function (d) { return d.properties.Ra_Total; };
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
                        .yAxisLabel('Count')
                        .margins({ top: 10, right: 20, bottom: 50, left: 50 })
                        .on('pretransition', function (mcl) {
                            var x_vert = 0.05; // MCL for BSe is 0.05
                            var Se_MCL = [ // Array to define vertical line starting at (MCL, 0)
                                { x: mcl.x()(x_vert), y: 0 },
                                { x: mcl.x()(x_vert), y: histogram4.effectiveHeight() }
                            ];
                            var line = d3.svg.line()
                                .x(function (d) { return d.x; })
                                .y(function (d) { return d.y; })
                                .interpolate('linear')
                            var chartBody = histogram4.select('g.chart-body');
                            var path = chartBody.selectAll('path.extra').data([Se_MCL]);
                            path.enter()
                                .append('path')
                                .attr('class', 'oeExtra')
                                .attr('stroke', 'red')
                                .attr('id', 'oeLine')
                                .attr("stroke-width", 2)
                                .style("stroke-dasharray", ("4,3"))
                            path.attr('d', line)
                            path.exit().remove()
                                ;
                        })
                        ;
                    histogram4.xAxis().tickValues([0.05, 50, 100, 150, 200, 250]);

                    dataHistogram4 = function (d) { return d.properties.Se; };
                }
                else if (input4 == "U") {

                    histogram4
                        .width(250)
                        .height(250)
                        .dimension(UDim)
                        .group(countPerU)
                        .x(d3.scale.linear().domain([0, 700]))
                        .y(d3.scale.linear().domain([0, 20]))
                        .xUnits(function () { return 700; })
                        .elasticY(false)
                        .centerBar(true)
                        .barPadding(3)
                        .yAxisLabel('Count')
                        .margins({ top: 10, right: 20, bottom: 50, left: 50 })
                        .on('pretransition', function (mcl) {
                            var x_vert = 30; // MCL for U is 30
                            var extra_data = [ // Array to define vertical line starting at (MCL, 0)
                                { x: mcl.x()(x_vert), y: 0 },
                                { x: mcl.x()(x_vert), y: histogram4.effectiveHeight() }
                            ];
                            var line = d3.svg.line()
                                .x(function (d) { return d.x; })
                                .y(function (d) { return d.y; })
                                .interpolate('linear')
                            var chartBody = histogram4.select('g.chart-body');
                            var path = chartBody.selectAll('path.extra').data([extra_data]);
                            path.enter()
                                .append('path')
                                .attr('class', 'oeExtra')
                                .attr('stroke', 'red')
                                .attr('id', 'oeLine')
                                .attr("stroke-width", 2)
                                .style("stroke-dasharray", ("4,3"))
                            path.attr('d', line)
                            path.exit().remove()
                                ;
                        });
                    ;
                    histogram4.xAxis().tickValues([30, 200, 400, 600])

                    dataHistogram4 = function (d) { return d.properties.U; };
                }

                else if (input4 == "None") {

                    histogram4
                        .width(250)
                        .height(250)
                        .dimension(NoneDim)
                        .group(countPerNone)
                        .x(d3.scale.linear().domain([0, 0]))
                        .elasticY(false)
                        .centerBar(true)
                        .barPadding(3)
                        .yAxisLabel('Count')
                        .margins({ top: 10, right: 20, bottom: 50, left: 50 });
                    histogram4.xAxis().tickValues([0, 0, 0, 0, 0, 0]);
                    histogram4.yAxis().tickValues([0, 0, 0, 0]);

                    dataHistogram4 = function (d) { return d.properties.None; };
                }

                dataCountNew
                    .dimension(ndx)
                    .group(all);


                //Code for DataTable
                dataTableNew
                    .dimension(allDim)
                    .group(function (d) { return 'dc.js insists on putting a row here so I remove it using JS'; })
                    .size(1001)
                    .columns([
                        {
                            label: "Well No.",
                            format: function (d) {
                                return d.properties.well_no
                            }
                        },
                        {
                            label: "Chapter",
                            format: function (d) {
                                return d.properties.Chapter
                            }
                        },
                        {
                            label: "Agency",
                            format: function (d) {
                                return d.properties.nn_agency
                            }
                        },
                        {
                            label: "Lat",
                            format: function (d) {
                                return d.properties.lat
                            }
                        },
                        {
                            label: "Long",
                            format: function (d) {
                                return d.properties.long
                            }
                        },
                        {
                            label: input1,
                            format: dataHistogram1
                        },
                        {
                            label: input2,
                            format: dataHistogram2
                        },
                        {
                            label: input3,
                            format: dataHistogram3
                        },
                        {
                            label: input4,
                            format: dataHistogram4
                        },

                    ])
                    .on('renderlet', function (table) {
                        table.select('tr.dc-table-group').remove();

                        wellMarkers.clearLayers();
                        _.each(allDim.top(Infinity), function (d) {
                            var filLoc = d.properties;

                            // Color based on well use
                            function getColor(wUse) {
                                switch (wUse) {
                                    case "Independent":
                                        return "#dfc27d";
                                    case "Agriculture":
                                        return "#dfc27d";
                                    case "Domestic":
                                        return "#018571";
                                    case "Livestock":
                                        return "#a6611a";
                                    case "Other":
                                        return "#dfc27d";
                                    case "Municipal":
                                        return "#80cdc1";
                                    case "Domestic Irrigation":
                                        return "#dfc27d";
                                    case "Recreation":
                                        return "#dfc27d";
                                    default:
                                        return "#666666";
                                }
                            }
                            var markerOptions = {
                                radius: 3.5,
                                fillColor: getColor(d.properties.USE),
                                color: "black",
                                weight: 0.4,
                                opacity: 1,
                                fillOpacity: 0.7
                            };

                            // Add circle markers
                            var marker = L.circleMarker([filLoc.lat, filLoc.long], markerOptions);

                            marker.bindPopup(
                                "<dl><dt> <h5><b><i>WELL INFORMATION- NAVAJO NATION WELL</i></b></h5><br>"
                                + "<dl>"
                                // General Well Info
                                + "<dt><span style='font-weight:bolder'><i><u>General Information</u></i></dt>"
                                + "<dt><span style='font-weight:bolder'>Chapter: </span> </dt> <dd>" + d.properties.Chapter + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Agency: </span> </dt> <dd>" + d.properties.nn_agency + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Latitude: </span> </dt> <dd>" + d.properties.lat + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Longitude: </span> </dt> <dd>" + d.properties.long + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Well No.: </span> </dt> <dd>" + d.properties.well_no + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Well Name: </span> </dt> <dd>" + d.properties.well_name + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Alternate Name 1: </span> </dt> <dd>" + d.properties.aka2 + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Alternate Name 2: </span> </dt> <dd>" + d.properties.aka3 + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Owner: </span> </dt> <dd>" + d.properties.owner + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Depth (ft.): </span> </dt> <dd>" + d.properties.depth + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Public Water Sys. ID: </span> </dt> <dd>" + d.properties.pwsid + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>USGS ID: </span> </dt> <dd>" + d.properties.usgs_id + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Data Source: </span> </dt> <dd>" + d.properties.data_sourc + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Comment(s): </span> </dt> <dd>" + d.properties.comments + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Status: </span> </dt> <dd>" + d.properties.well_statu + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Well Use: </span> </dt> <dd>" + d.properties.USE + ";<dd>"
                                // Primary Contaminants: Radionuclides
                                + "<br><dt><span style='font-weight:bolder'><i><u>Primary Contaminants: Radionuclides</u></i></dt>"
                                + "<dt><span style='font-weight:bolder'>Radium-226 (Ra-226) (pCi/L): </span> </dt> <dd>" + d.properties.Ra_226 + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Radium-228 (Ra-228) (pCi/L): </span> </dt> <dd>" + d.properties.Ra_228 + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Total Radium (Ra) (pCi/L): </span> </dt> <dd>" + d.properties.Ra_Total + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Uranium (U) (&mu;g/L): </span> </dt> <dd>" + d.properties.U + ";<dd>"
                                // Primary Contaminants: Inorganic Chemicals
                                + "<br><dt><span style='font-weight:bolder'><i><u>Primary Contaminants: Inorganic Chemicals</u></i></dt>"
                                + "<dt><span style='font-weight:bolder'>Arsenic (As) (&mu;g/L): </span> </dt> <dd>" + d.properties.As + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Barium (Ba) (&mu;g/L): </span> </dt> <dd>" + d.properties.Ba + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Beryllium (Be) (&mu;g/L): </span> </dt> <dd>" + d.properties.Be + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Cd (&mu;g/L): </span> </dt> <dd>" + d.properties.Cd + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Cr (&mu;g/L): </span> </dt> <dd>" + d.properties.Cr + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Chromium (Cr) (&mu;g/L): </span> </dt> <dd>" + d.properties.Cr + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Copper (Cu) (&mu;g/L): </span> </dt> <dd>" + d.properties.Cu + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Mercury (Hg) (&mu;g/L): </span> </dt> <dd>" + d.properties.Hg + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Nitrate (NO3-) (Mg/L): </span> </dt> <dd>" + d.properties.Nitrate + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Nitrite (NO2-) (Mg/L): </span> </dt> <dd>" + d.properties.Nitrite + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Lead (Pb) (&mu;g/L): </span> </dt> <dd>" + d.properties.Pb + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Antimony (Sb) (&mu;g/L): </span> </dt> <dd>" + d.properties.Sb + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Selenium (Se) (&mu;g/L): </span> </dt> <dd>" + d.properties.Se + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Thallium (Tl) (&mu;g/L): </span> </dt> <dd>" + d.properties.Tl + ";<dd>"
                                // Primary Contaminants: Microorganisms
                                + "<br><dt><span style='font-weight:bolder'><i><u>Primary Contaminants: Microorganisms</u></i></dt>"
                                + "<dt><span style='font-weight:bolder'>Turbidity (NTU): </span> </dt> <dd>" + d.properties.Turbidity + ";<dd>"
                                // Secondary Contaminants
                                + "<br><dt><span style='font-weight:bolder'><i><u>Secondary Contaminants</u></i></dt>"
                                + "<dt><span style='font-weight:bolder'>Aluminum (Al) (mg/L): </span> </dt> <dd>" + d.properties.Al + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Chloride (mg/L): </span> </dt> <dd>" + d.properties.Chloride + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Corrosivity (LSI): </span> </dt> <dd>" + d.properties.Corrosivity + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Iron (Fe) (&mu;g/L): </span> </dt> <dd>" + d.properties.Fe + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Fluoride (F-) (mg/L): </span> </dt> <dd>" + d.properties.Fluoride + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Manganese (Mn) (&mu;g/L): </span> </dt> <dd>" + d.properties.Mn + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>pH: </span> </dt> <dd>" + d.properties.pH + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Sulfate (SO<sub>4</sub><sup>2-</sup>) (mg/L): </span> </dt> <dd>" + d.properties.Sulfate + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Total Dissolved Solids (TDS) (mg/L): </span> </dt> <dd>" + d.properties.TotalDissolvedSolids + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Zinc (Zn) (&mu;g/L): </span> </dt> <dd>" + d.properties.Zn + ";<dd>"
                                // Other Water Chemistry
                                + "<br><dt><span style='font-weight:bolder'><i><u>Other Water Chemistry</u></i></dt>"
                                + "<dt><span style='font-weight:bolder'>Total Alkalinity: </span> </dt> <dd>" + d.properties.Alkalinity_Total + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Bicarbonate (mg/L): </span> </dt> <dd>" + d.properties.Bicarbonate + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Calcium (Ca) (mg/L): </span> </dt> <dd>" + d.properties.Ca + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Conductivity (&mu;s/cm): </span> </dt> <dd>" + d.properties.Conductivity + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Dissolved Oxygen (&mu;g/L): </span> </dt> <dd>" + d.properties.DissolvedOxygen + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Hardness (mg/L as CaCO3): </span> </dt> <dd>" + d.properties.Hardness + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Sodium (Na) (mg/L): </span> </dt> <dd>" + d.properties.Na + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Salinity (mg/L): </span> </dt> <dd>" + d.properties.Salinity + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Specific Conductance (uS/cm at 25&deg;C): </span> </dt> <dd>" + d.properties.SpecificConductance + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Temperature (&deg;C): </span> </dt> <dd>" + d.properties.Temperature + ";<dd>"
                                // Other Analytes
                                + "<br><dt><span style='font-weight:bolder'><i><u>Other Analytes</u></i></dt>"
                                + "<dt><span style='font-weight:bolder'>Bromide (Br-) (mg/L): </span> </dt> <dd>" + d.properties.Bromide + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Potassium (K) (mg/L): </span> </dt> <dd>" + d.properties.K + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Magnesium (Mg) (mg/L): </span> </dt> <dd>" + d.properties.Mg + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Molybdenum (Mo) (&mu;g/L): </span> </dt> <dd>" + d.properties.Mo + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Nickel (Ni) (&mu;g/L): </span> </dt> <dd>" + d.properties.Ni + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Phosphate (PO<sub>4</sub><sup>3-</sup>) (mg/L): </span> </dt> <dd>" + d.properties.Phosphate + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Tin (Sn) (&mu;g/L): </span> </dt> <dd>" + d.properties.Sn + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Strontium (Sr) (&mu;g/L): </span> </dt> <dd>" + d.properties.Sr + ";<dd>"
                                + "<dt><span style='font-weight:bolder'>Vanadium (V) (&mu;g/L): </span> </dt> <dd>" + d.properties.V + ";<dd>"
                                // More Information
                                + "<br><br><dd><small><i>More information on primary and secondary water contaminants can be found <a href='https://www.epa.gov/ground-water-and-drinking-water/national-primary-drinking-water-regulations' target='_blank'>here</a>.</i></small><dd>"
                                + "</dl>"
                            );
                            wellMarkers.addLayer(marker);
                        });

                        // Add markers to map:
                        map.addLayer(wellMarkers);
                        map.fitBounds(wellMarkers.getBounds());

                    });
                dc.renderAll();
            });
        }
    }
//     )
// }