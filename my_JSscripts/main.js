window.onload = function () {

    // Get the loading overlay element
    const loadingOverlay = document.querySelector('.loading-overlay');

    // Function to hide the loading overlay
    function hideLoadingOverlay() {
        loadingOverlay.style.opacity = 0;
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 1000); // Delay for 1 second to ensure the fade-out effect
    }

    // Automatically hide the loading overlay after 4 seconds (4000 milliseconds)
    setTimeout(hideLoadingOverlay, 4000);

    function clearMarkers() {
        map.eachLayer(function (layer) {
            if (layer instanceof L.MarkerClusterGroup) {
                layer.clearLayers();
            }
        });
    }

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
    var chapter1Marker = L.marker([35.854359, -111.596276]);
    var chapter2Marker = L.marker([36.295128, -111.617351]);
    var chapter3Marker = L.marker([36.573259, -111.454201]);
    var chapter4Marker = L.marker([36.260344, -111.219877]);
    var chapter5Marker = L.marker([35.841619, -111.188685]);
    var chapter6Marker = L.marker([35.316745, -111.111526]);
    var chapter7Marker = L.marker([36.744196, -111.290189]);
    var chapter8Marker = L.marker([36.663304, -111.047236]);
    var chapter9Marker = L.marker([36.402562, -110.969491]);
    var chapter10Marker = L.marker([36.803719, -110.959495]);
    var chapter11Marker = L.marker([35.48254, -110.907713]);
    var chapter12Marker = L.marker([35.261735, -110.733304]);
    var chapter13Marker = L.marker([37.033103, -110.782274]);
    var chapter14Marker = L.marker([36.662394, -110.597599]);
    var chapter15Marker = L.marker([36.688746, -110.305346]);
    var chapter16Marker = L.marker([36.32778, -110.297442]);
    var chapter17Marker = L.marker([36.103359, -110.47536]);
    var chapter18Marker = L.marker([35.464345, -110.47369]);
    var chapter19Marker = L.marker([35.311866, -110.399548]);
    var chapter20Marker = L.marker([35.554114, -110.128561]);
    var chapter21Marker = L.marker([35.77035, -110.058503]);
    var chapter22Marker = L.marker([35.945223, -109.972888]);
    var chapter23Marker = L.marker([35.762918, -109.829705]);
    var chapter24Marker = L.marker([36.023184, -110.093109]);
    var chapter25Marker = L.marker([36.107762, -110.22202]);
    var chapter26Marker = L.marker([35.331335, -110.097371]);
    var chapter27Marker = L.marker([35.43493, -109.891448]);
    var chapter28Marker = L.marker([35.333932, -109.563239]);
    var chapter29Marker = L.marker([35.50801, -109.53679]);
    var chapter30Marker = L.marker([35.625297, -109.687522]);
    var chapter31Marker = L.marker([35.746783, -109.571015]);
    var chapter32Marker = L.marker([36.024685, -109.794542]);
    var chapter33Marker = L.marker([35.948643, -109.42883]);
    var chapter34Marker = L.marker([35.748142, -109.318498]);
    var chapter35Marker = L.marker([36.16049, -109.992571]);
    var chapter36Marker = L.marker([36.332415, -110.033454]);
    var chapter37Marker = L.marker([36.374207, -109.558864]);
    var chapter38Marker = L.marker([36.168278, -109.580283]);
    var chapter39Marker = L.marker([36.529027, -109.449944]);
    var chapter40Marker = L.marker([36.392616, -109.783876]);
    var chapter41Marker = L.marker([36.655991, -109.589476]);
    var chapter42Marker = L.marker([36.840412, -109.838163]);
    var chapter43Marker = L.marker([36.553807, -110.021987]);
    var chapter44Marker = L.marker([37.074655, -110.217268]);
    var chapter45Marker = L.marker([36.812634, -109.362195]);
    var chapter46Marker = L.marker([37.012045, -109.607465]);
    var chapter47Marker = L.marker([37.146433, -109.378818]);
    var chapter48Marker = L.marker([37.300522, -109.205827]);
    var chapter49Marker = L.marker([36.960042, -109.162218]);
    var chapter50Marker = L.marker([36.243735, -109.231646]);
    var chapter51Marker = L.marker([35.293327, -109.275328]);
    var chapter52Marker = L.marker([35.26812, -109.11371]);
    var chapter53Marker = L.marker([35.46296, -109.173451]);
    var chapter54Marker = L.marker([35.617939, -109.127031]);
    var chapter55Marker = L.marker([35.76124, -109.047576]);
    var chapter56Marker = L.marker([35.888682, -109.038602]);
    var chapter57Marker = L.marker([36.004919, -109.180546]);
    var chapter58Marker = L.marker([36.067849, -109.024308]);
    var chapter59Marker = L.marker([36.45229, -108.842877]);
    var chapter60Marker = L.marker([36.830323, -108.939227]);
    var chapter61Marker = L.marker([36.06072023900711, -110.04985857478128]);
    var chapter62Marker = L.marker([35.38620835864987, -109.28792539640408]);
    var chapter63Marker = L.marker([36.80478327439627, -109.095361974349]);
    var chapter64Marker = L.marker([36.3611436343144, -109.25089370154812]);
    var chapter65Marker = L.marker([35.12531684429638, -109.36576545631557]);
    var chapter66Marker = L.marker([36.4657581748412, -109.11103357081461]);
    var chapter67Marker = L.marker([36.99777267121339, -108.652046466324]);
    var chapter68Marker = L.marker([36.771580977972334, -108.63523242461984]);
    var chapter69Marker = L.marker([36.73619267417381, -108.25770172790521]);
    var chapter70Marker = L.marker([36.84339943998291, -108.65253382684824]);
    var chapter71Marker = L.marker([36.74962986428461, -108.63183968998209]);
    var chapter72Marker = L.marker([36.22798303269989, -108.7217663239343]);
    var chapter73Marker = L.marker([36.22114882754804, -108.55186997220717]);
    var chapter74Marker = L.marker([36.21450431643332, -108.27178291470794]);
    var chapter75Marker = L.marker([36.209347608644826, -108.27185399981917]);
    var chapter76Marker = L.marker([35.76311202328424, -108.70219083204088]);
    var chapter77Marker = L.marker([35.70006475771182, -108.26973987545387]);
    var chapter78Marker = L.marker([35.80566911629855, -108.28589464093857]);
    var chapter79Marker = L.marker([35.6597450765023, -108.49299293154112]);
    var chapter80Marker = L.marker([35.659862190442986, -108.73123378112044]);
    var chapter81Marker = L.marker([35.984775930048286, -108.86323901482454]);
    var chapter82Marker = L.marker([36.22798303269986, -108.72176632393432]);
    var chapter83Marker = L.marker([35.535786612503756, -108.86404098510506]);
    var chapter84Marker = L.marker([36.18085557706471, -108.0591848773362]);
    var chapter85Marker = L.marker([36.724948369143014, -108.24930407733068]);
    var chapter86Marker = L.marker([35.81255292602995, -108.00293712252764]);
    var chapter87Marker = L.marker([35.78374481387582, -108.25264879206023]);
    var chapter88Marker = L.marker([35.50054336285875, -107.86597217915593]);
    var chapter89Marker = L.marker([35.61691643782455, -108.12817322204432]);
    var chapter90Marker = L.marker([35.33397829054442, -107.92880507994455]);
    var chapter91Marker = L.marker([35.40512918648576, -108.21812645136667]);
    var chapter92Marker = L.marker([35.56695398510084, -108.41458385629879]);
    var chapter93Marker = L.marker([36.33591553648302, -107.74967442966137]);
    var chapter94Marker = L.marker([36.02012393069316, -107.32389959718378]);
    var chapter95Marker = L.marker([35.99904046242444, -107.37748734079616]);
    var chapter96Marker = L.marker([35.65327295966712, -107.3977233373563]);
    var chapter97Marker = L.marker([35.81852912135637, -107.59427132747203]);
    var chapter98Marker = L.marker([35.64593000882607, -107.2952705897397]);
    var chapter99Marker = L.marker([34.71190920419565, -108.3447006429268]);
    var chapter100Marker = L.marker([34.376358011223935, -107.56372903626131]);
    var chapter101Marker = L.marker([35.059061877166315, -106.97478970891673]);
    var chapter102Marker = L.marker([35.386749939875315, -108.91884406540585]);
    var chapter103Marker = L.marker([35.47969841753586, -108.75986189082802]);
    var chapter104Marker = L.marker([35.65234527036743, -108.37011865828237]);
    var chapter105Marker = L.marker([35.55493386576171, -108.05176263465754]);
    var chapter106Marker = L.marker([35.55113196195737, -107.97660875106943]);
    var chapter107Marker = L.marker([35.501312511658476, -108.71128639919819]);
    var chapter108Marker = L.marker([35.33573702875052, -108.60028073692013]);
    var chapter109Marker = L.marker([35.34277074312719, -108.79501399974022]);
    var chapter110Marker = L.marker([35.65997489859645, -108.87043265176675]);
    var chapter111Marker = L.marker([35.53727580734836, -108.72460499325837]);
    var chapter112Marker = L.marker([36.00238172121207, -108.3762642258194]);

    var chapterBounds = {
        "Cameron": L.latLngBounds([chapter1Marker.getLatLng()]),
        "Bodaway Gap": L.latLngBounds([chapter2Marker.getLatLng()]),
        "Coppermine": L.latLngBounds([chapter3Marker.getLatLng()]),
        "Tuba City": L.latLngBounds([chapter4Marker.getLatLng()]),
        "Coalmine Mesa": L.latLngBounds([chapter5Marker.getLatLng()]),
        "Leupp": L.latLngBounds([chapter6Marker.getLatLng()]),
        "Lechee": L.latLngBounds([chapter7Marker.getLatLng()]),
        "Kaibeto": L.latLngBounds([chapter8Marker.getLatLng()]),
        "Tonalea": L.latLngBounds([chapter9Marker.getLatLng()]),
        "Inscription House": L.latLngBounds([chapter10Marker.getLatLng()]),
        "Tolani Lake": L.latLngBounds([chapter11Marker.getLatLng()]),
        "Bird Springs": L.latLngBounds([chapter12Marker.getLatLng()]),
        "Navajo Mountain": L.latLngBounds([chapter13Marker.getLatLng()]),
        "Shonto": L.latLngBounds([chapter14Marker.getLatLng()]),
        "Kayenta": L.latLngBounds([chapter15Marker.getLatLng()]),
        "Forest Lake": L.latLngBounds([chapter16Marker.getLatLng()]),
        "Hard Rock": L.latLngBounds([chapter17Marker.getLatLng()]),
        "Teesto": L.latLngBounds([chapter18Marker.getLatLng()]),
        "Dilkon": L.latLngBounds([chapter19Marker.getLatLng()]),
        "White Cone": L.latLngBounds([chapter20Marker.getLatLng()]),
        "Jeddito": L.latLngBounds([chapter21Marker.getLatLng()]),
        "Low Mountain": L.latLngBounds([chapter22Marker.getLatLng()]),
        "Steamboat": L.latLngBounds([chapter23Marker.getLatLng()]),
        "Whippoorwill": L.latLngBounds([chapter24Marker.getLatLng()]),
        "Pinon": L.latLngBounds([chapter25Marker.getLatLng()]),
        "Indian Wells": L.latLngBounds([chapter26Marker.getLatLng()]),
        "Greasewood Springs": L.latLngBounds([chapter27Marker.getLatLng()]),
        "Wide Ruins": L.latLngBounds([chapter28Marker.getLatLng()]),
        "Klagetoh": L.latLngBounds([chapter29Marker.getLatLng()]),
        "Cornfields": L.latLngBounds([chapter30Marker.getLatLng()]),
        "Ganado": L.latLngBounds([chapter31Marker.getLatLng()]),
        "Tselani": L.latLngBounds([chapter32Marker.getLatLng()]),
        "Nazlini": L.latLngBounds([chapter33Marker.getLatLng()]),
        "Kinlichee": L.latLngBounds([chapter34Marker.getLatLng()]),
        "Blue Gap/Tachee": L.latLngBounds([chapter35Marker.getLatLng()]),
        "Black Mesa": L.latLngBounds([chapter36Marker.getLatLng()]),
        "Many Farms": L.latLngBounds([chapter37Marker.getLatLng()]),
        "Chinle": L.latLngBounds([chapter38Marker.getLatLng()]),
        "Round Rock": L.latLngBounds([chapter39Marker.getLatLng()]),
        "Rough Rock": L.latLngBounds([chapter40Marker.getLatLng()]),
        "Rock Point": L.latLngBounds([chapter41Marker.getLatLng()]),
        "Dennehotso": L.latLngBounds([chapter42Marker.getLatLng()]),
        "Chilchinbeto": L.latLngBounds([chapter43Marker.getLatLng()]),
        "Oljato": L.latLngBounds([chapter44Marker.getLatLng()]),
        "Sweet Water": L.latLngBounds([chapter45Marker.getLatLng()]),
        "Mexican Water": L.latLngBounds([chapter46Marker.getLatLng()]),
        "Red Mesa": L.latLngBounds([chapter47Marker.getLatLng()]),
        "Aneth": L.latLngBounds([chapter48Marker.getLatLng()]),
        "Teec Nos Pos": L.latLngBounds([chapter49Marker.getLatLng()]),
        "Tsaile/Wheatfields": L.latLngBounds([chapter50Marker.getLatLng()]),
        "Houck": L.latLngBounds([chapter51Marker.getLatLng()]),
        "Lupton": L.latLngBounds([chapter52Marker.getLatLng()]),
        "Oak Springs": L.latLngBounds([chapter53Marker.getLatLng()]),
        "Saint Michaels": L.latLngBounds([chapter54Marker.getLatLng()]),
        "Fort Defiance": L.latLngBounds([chapter55Marker.getLatLng()]),
        "Red Lake": L.latLngBounds([chapter56Marker.getLatLng()]),
        "Sawmill": L.latLngBounds([chapter57Marker.getLatLng()]),
        "Crystal": L.latLngBounds([chapter58Marker.getLatLng()]),
        "Sanostee": L.latLngBounds([chapter59Marker.getLatLng()]),
        "Beclahbito": L.latLngBounds([chapter60Marker.getLatLng()]),
        "Whippoorwill": L.latLngBounds([chapter61Marker.getLatLng()]),
        "Wide Ruins": L.latLngBounds([chapter62Marker.getLatLng()]),
        "Red Valley": L.latLngBounds([chapter63Marker.getLatLng()]),
        "Lukachukai": L.latLngBounds([chapter64Marker.getLatLng()]),
        "Nahat'a'dzil": L.latLngBounds([chapter65Marker.getLatLng()]),
        "Cove": L.latLngBounds([chapter66Marker.getLatLng()]),
        "Gadaihai": L.latLngBounds([chapter67Marker.getLatLng()]),
        "San Juan/Nenahnezad": L.latLngBounds([chapter68Marker.getLatLng()]),
        "Upper Fruitland": L.latLngBounds([chapter69Marker.getLatLng()]),
        "Shiprock": L.latLngBounds([chapter70Marker.getLatLng()]),
        "Hogback": L.latLngBounds([chapter71Marker.getLatLng()]),
        "Two Grey Hills": L.latLngBounds([chapter72Marker.getLatLng()]),
        "Sheep Springs": L.latLngBounds([chapter73Marker.getLatLng()]),
        "Burnham": L.latLngBounds([chapter74Marker.getLatLng()]),
        "Whiterock": L.latLngBounds([chapter75Marker.getLatLng()]),
        "Tohatchi": L.latLngBounds([chapter76Marker.getLatLng()]),
        "Nahodishgish": L.latLngBounds([chapter77Marker.getLatLng()]),
        "Standing Rock": L.latLngBounds([chapter78Marker.getLatLng()]),
        "Coyote Canyon": L.latLngBounds([chapter79Marker.getLatLng()]),
        "Twin Lakes": L.latLngBounds([chapter80Marker.getLatLng()]),
        "Mexican Springs": L.latLngBounds([chapter81Marker.getLatLng()]),
        "Newcomb": L.latLngBounds([chapter82Marker.getLatLng()]),
        "Tsayatoh": L.latLngBounds([chapter83Marker.getLatLng()]),
        "Lake Valley": L.latLngBounds([chapter84Marker.getLatLng()]),
        "Huerfano": L.latLngBounds([chapter85Marker.getLatLng()]),
        "Becenti": L.latLngBounds([chapter86Marker.getLatLng()]),
        "Crownpoint": L.latLngBounds([chapter87Marker.getLatLng()]),
        "Littlewater": L.latLngBounds([chapter88Marker.getLatLng()]),
        "Mariano Lake": L.latLngBounds([chapter89Marker.getLatLng()]),
        "Baca/Prewitt": L.latLngBounds([chapter90Marker.getLatLng()]),
        "Thoreau": L.latLngBounds([chapter91Marker.getLatLng()]),
        "Iyanbito": L.latLngBounds([chapter92Marker.getLatLng()]),
        "Nageezi": L.latLngBounds([chapter93Marker.getLatLng()]),
        "Counselor": L.latLngBounds([chapter94Marker.getLatLng()]),
        "Ojo Encino": L.latLngBounds([chapter95Marker.getLatLng()]),
        "Whitehorse Lake": L.latLngBounds([chapter96Marker.getLatLng()]),
        "Pueblo Pintado": L.latLngBounds([chapter97Marker.getLatLng()]),
        "Torreon": L.latLngBounds([chapter98Marker.getLatLng()]),
        "Ramah": L.latLngBounds([chapter99Marker.getLatLng()]),
        "Alamo": L.latLngBounds([chapter100Marker.getLatLng()]),
        "Tohajilee": L.latLngBounds([chapter101Marker.getLatLng()]),
        "Manuelito": L.latLngBounds([chapter102Marker.getLatLng()]),
        "Red Rock": L.latLngBounds([chapter103Marker.getLatLng()]),
        "Pinedale": L.latLngBounds([chapter104Marker.getLatLng()]),
        "Smith Lake": L.latLngBounds([chapter105Marker.getLatLng()]),
        "Casamero Lake": L.latLngBounds([chapter106Marker.getLatLng()]),
        "Church Rock": L.latLngBounds([chapter107Marker.getLatLng()]),
        "Baahaalii": L.latLngBounds([chapter108Marker.getLatLng()]),
        "Chichiltah": L.latLngBounds([chapter109Marker.getLatLng()]),
        "Rock Springs": L.latLngBounds([chapter110Marker.getLatLng()]),
        "City of Gallup": L.latLngBounds([chapter111Marker.getLatLng()]),
        "Naschitti": L.latLngBounds([chapter112Marker.getLatLng()]),
    };

    // When a user selects a chapter, update the map's view to the bounds of the corresponding marker
    // Get all the chapter bounds
    var allChapterBounds = [];
    for (var chapterName in chapterBounds) {
        allChapterBounds.push(chapterBounds[chapterName]);
    }

    // Create a bounding box that encompasses all the chapter bounds
    var combinedBounds = L.latLngBounds(allChapterBounds);

    // When a user selects a chapter or 'all', update the map's view accordingly
    function selectChapter(chapter) {
        if (chapter === 'all') {
            map.fitBounds(combinedBounds, { padding: [150, 150], maxZoom: 11 });
        } else if (chapterBounds[chapter]) {
            map.fitBounds(chapterBounds[chapter], { padding: [150, 150], maxZoom: 11 });
        } else {
            console.log('Chapter not found in bounds object');
        }
    }

    var chapterDropdown = document.getElementById('chapter-dropdown');
    chapterDropdown.addEventListener('change', function () {
        selectChapter(chapterDropdown.value);
    });



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
    d3.json('data/20231001analytesSel.json', function (error, data) {
        var wellData = data.features;
        _.each(wellData, function (d) {
            d.count = +d.count;
            // round to the nearest 200
            d.Al = Math.round(+d.properties.Al / 50) * 50;
            d.As = Math.round(+d.properties.As / 50) * 50;
            d.Ba = Math.round(+d.properties.Ba / 50) * 50;
            d.Cd = Math.round(+d.properties.Cd / 50) * 50;
            d.Cu = Math.round(+d.properties.Cu / 50) * 50;
            d.Fe = Math.round(+d.properties.Fe / 50) * 50;
            d.Mn = Math.round(+d.properties.Mn / 50) * 50;
            d.Pb = Math.round(+d.properties.Pb / 50) * 50;
            d.Se = Math.round(+d.properties.Se / 50) * 50;
            d.U = Math.round(+d.properties.U / 100) * 100;
        });

        // set crossfilter
        var ndx = crossfilter(wellData);

        // Dimensions
        var AlDim = ndx.dimension(function (d) { return d.properties.Al; });
        var AsDim = ndx.dimension(function (d) { return d.properties.As; });
        var BaDim = ndx.dimension(function (d) { return d.properties.Ba; });
        var CdDim = ndx.dimension(function (d) { return d.properties.Cd; });
        var CuDim = ndx.dimension(function (d) { return d.properties.Cu; });
        var FeDim = ndx.dimension(function (d) { return d.properties.Fe; });
        var MnDim = ndx.dimension(function (d) { return d.properties.Mn; });
        var PbDim = ndx.dimension(function (d) { return d.properties.Pb; });
        var SeDim = ndx.dimension(function (d) { return d.properties.Se; });
        var UDim = ndx.dimension(function (d) { return d.properties.U; });
        var recDim = ndx.dimension(function (d) { return d.properties.recConfidence; });
        var avoidDim = ndx.dimension(function (d) { return d.properties.Avoid; });
        var irrigationDim = ndx.dimension(function (d) { return d.properties.Irrigation; });
        var householdDim = ndx.dimension(function (d) { return d.properties.Household; });
        var livestockDim = ndx.dimension(function (d) { return d.properties.Livestock; });


        // Draw features according to use
        var allDim = ndx.dimension(function (d) { return d; });

        // Create groups (y-axis values)
        var all = ndx.groupAll();
        var countPerAl = AlDim.group().reduceCount();
        var countPerAs = AsDim.group().reduceCount();
        var countPerBa = BaDim.group().reduceCount();
        var countPerCd = CdDim.group().reduceCount();
        var countPerCu = CuDim.group().reduceCount();
        var countPerFe = FeDim.group().reduceCount();
        var countPerMn = MnDim.group().reduceCount();
        var countPerPb = PbDim.group().reduceCount();
        var countPerSe = SeDim.group().reduceCount();
        var countPerU = UDim.group().reduceCount();
        var countPerRec = recDim.group().reduceCount();
        var avoidGroup = avoidDim.group();
        var irrigationGroup = irrigationDim.group();
        var householdGroup = householdDim.group();
        var livestockGroup = livestockDim.group();

        // Specify charts

        var alCountChart = dc.barChart('#histogram1');
        var as_CountChart = dc.barChart('#histogram2');
        var baCountChart = dc.barChart('#histogram3');
        var cdCountChart = dc.barChart('#histogram4');
        var cuCountChart = dc.barChart('#histogram5');
        var feCountChart = dc.barChart('#histogram6');
        var mnCountChart = dc.barChart('#histogram7');
        var pbCountChart = dc.barChart('#histogram8');
        var seCountChart = dc.barChart('#histogram9');
        var uCountChart = dc.barChart('#histogram10');
        var recChart = dc.pieChart('#donut');
        var avoidChart = dc.pieChart('.avoidChart');
        var irrigationChart = dc.pieChart('.irrigationChart');
        var householdChart = dc.pieChart('.householdChart');
        var livestockChart = dc.pieChart('.livestockChart');

        // Declare data table
        var dataTable = dc.dataTable('#data-table');

        // Register handler
        d3.selectAll('a#all').on('click', function () {
            dc.filterAll();
            dc.renderAll();
        })

        // Default histograms
        // Aluminum
        alCountChart
            .width(250)
            .height(250)
            .dimension(AlDim)
            .group(countPerAl)
            .x(d3.scale.linear().domain([0, 62000]))
            .y(d3.scale.linear().domain([0, 20]))
            .xUnits(function () { return 62000 })
            .elasticY(false)
            .centerBar(true)
            .barPadding(3)
            .yAxisLabel('Count')
            .xAxisLabel('Aluminum (mg/L)')
            .margins({ top: 10, right: 20, bottom: 50, left: 50 })
            .on('pretransition', function (chart) {
                if (!mclDrawn) {
                    var x_vert = 1000; // Secondary MCL for Al is 1000
                    var extra_data = [ // Array to define vertical line starting at (MCL, 0)
                        { x: chart.x()(x_vert), y: 0 },
                        { x: chart.x()(x_vert), y: chart.effectiveHeight() }
                    ];
                    var line = d3.svg.line()
                        .x(function (d) { return d.x; })
                        .y(function (d) { return d.y; })
                        .interpolate('linear');
                    var chartBody = chart.select('g.chart-body'); //select g.chart-body will select the rect object within the svg
                    var path = chartBody.selectAll('path.extra').data([extra_data]);
                    path.enter()
                        .append('path')
                        .attr('class', 'oeExtra')
                        .attr('stroke', 'yellow')
                        .attr('id', 'oeLine')
                        .attr("stroke-width", 2)
                        .style("stroke-dasharray", ("4,3"))
                        .attr('d', line);
                    mclDrawn = false
                }
            });
        alCountChart.xAxis().tickValues([0, 30000, 60000]);
        alCountChart.yAxis().tickValues([0, 5, 10, 15, 20]);

        // Arsenic
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
            .xAxisLabel('Arsenic (μg/L)')
            .margins({ top: 10, right: 20, bottom: 50, left: 50 })
            // Add vertical line at MCL using example from https://github.com/dc-js/dc.js/blob/develop/web-src/examples/row-vertical-line.html
            .on('pretransition', function (chart) {
                if (!mclDrawn) {
                    var x_vert = 10; // MCL for As is 10
                    var extra_data = [ // Array to define vertical line starting at (MCL, 0)
                        { x: chart.x()(x_vert), y: 0 },
                        { x: chart.x()(x_vert), y: chart.effectiveHeight() }
                    ];
                    var line = d3.svg.line()
                        .x(function (d) { return d.x; })
                        .y(function (d) { return d.y; })
                        .interpolate('linear');
                    var chartBody = chart.select('g.chart-body'); //select g.chart-body will select the rect object within the svg
                    var path = chartBody.selectAll('path.extra').data([extra_data]);
                    path.enter()
                        .append('path')
                        .attr('class', 'oeExtra')
                        .attr('stroke', 'red')
                        .attr('id', 'oeLine')
                        .attr("stroke-width", 2)
                        .style("stroke-dasharray", ("4,3"))
                        .attr('d', line);
                    mclDrawn = false
                }
            });
        ;
        as_CountChart.xAxis().tickValues([10, 125, 250, 375, 500]); //Lowest tick value set at MCL

        // Barium
        baCountChart
            .width(250)
            .height(250)
            .dimension(BaDim)
            .group(countPerBa)
            .x(d3.scale.linear().domain([0, 2500]))
            .y(d3.scale.linear().domain([0, 30]))
            .xUnits(function () { return 2500 })
            .elasticY(false)
            .centerBar(true)
            .barPadding(3)
            .yAxisLabel('Count')
            .xAxisLabel('Barium (μg/L)')
            .margins({ top: 10, right: 20, bottom: 50, left: 50 })
            .on('pretransition', function (chart) {
                if (!mclDrawn) {
                    var x_vert = 2000; // MCL for Ba is 2000
                    var extra_data = [ // Array to define vertical line starting at (MCL, 0)
                        { x: chart.x()(x_vert), y: 0 },
                        { x: chart.x()(x_vert), y: chart.effectiveHeight() }
                    ];
                    var line = d3.svg.line()
                        .x(function (d) { return d.x; })
                        .y(function (d) { return d.y; })
                        .interpolate('linear');
                    var chartBody = chart.select('g.chart-body'); //select g.chart-body will select the rect object within the svg
                    var path = chartBody.selectAll('path.extra').data([extra_data]);
                    path.enter()
                        .append('path')
                        .attr('class', 'oeExtra')
                        .attr('stroke', 'red')
                        .attr('id', 'oeLine')
                        .attr("stroke-width", 2)
                        .style("stroke-dasharray", ("4,3"))
                        .attr('d', line);
                    mclDrawn = false
                }
            });
        baCountChart.xAxis().tickValues([0, 1000, 2000]);

        // Cadmium
        cdCountChart
            .width(250)
            .height(250)
            .dimension(CdDim)
            .group(countPerCd)
            .x(d3.scale.linear().domain([0, 25]))
            .y(d3.scale.linear().domain([0, 30]))
            .xUnits(function () { return 25; })
            .elasticY(false)
            .centerBar(true)
            .barPadding(3)
            .yAxisLabel('Count')
            .xAxisLabel('Cadmium (μg/L)')
            .margins({ top: 10, right: 20, bottom: 50, left: 50 })
            // Add vertical line at MCL using example from https://github.com/dc-js/dc.js/blob/develop/web-src/examples/row-vertical-line.html
            .on('pretransition', function (chart) {
                if (!mclDrawn) {
                    var x_vert = 5; // MCL for Cd is 5
                    var extra_data = [ // Array to define vertical line starting at (MCL, 0)
                        { x: chart.x()(x_vert), y: 0 },
                        { x: chart.x()(x_vert), y: chart.effectiveHeight() }
                    ];
                    var line = d3.svg.line()
                        .x(function (d) { return d.x; })
                        .y(function (d) { return d.y; })
                        .interpolate('linear');
                    var chartBody = chart.select('g.chart-body'); //select g.chart-body will select the rect object within the svg
                    var path = chartBody.selectAll('path.extra').data([extra_data]);
                    path.enter()
                        .append('path')
                        .attr('class', 'oeExtra')
                        .attr('stroke', 'red')
                        .attr('id', 'oeLine')
                        .attr("stroke-width", 2)
                        .style("stroke-dasharray", ("4,3"))
                        .attr('d', line);
                    mclDrawn = false
                }
            });
        ;
        cdCountChart.xAxis().tickValues([0, 10, 20]);

        // Copper
        cuCountChart
            .width(250)
            .height(250)
            .dimension(CuDim)
            .group(countPerCu)
            .x(d3.scale.linear().domain([0, 5000]))
            .y(d3.scale.linear().domain([0, 30]))
            .xUnits(function () { return 5000; })
            .elasticY(false)
            .centerBar(true)
            .barPadding(3)
            .yAxisLabel('Count')
            .xAxisLabel('Copper (μg/L)')
            .margins({ top: 10, right: 20, bottom: 50, left: 50 })
            // Add vertical line at MCL using example from https://github.com/dc-js/dc.js/blob/develop/web-src/examples/row-vertical-line.html
            .on('pretransition', function (chart) {
                if (!mclDrawn) {
                    var x_vert = 1300; // MCL for Cu is 1300
                    var extra_data = [ // Array to define vertical line starting at (MCL, 0)
                        { x: chart.x()(x_vert), y: 0 },
                        { x: chart.x()(x_vert), y: chart.effectiveHeight() }
                    ];
                    var line = d3.svg.line()
                        .x(function (d) { return d.x; })
                        .y(function (d) { return d.y; })
                        .interpolate('linear');
                    var chartBody = chart.select('g.chart-body'); //select g.chart-body will select the rect object within the svg
                    var path = chartBody.selectAll('path.extra').data([extra_data]);
                    path.enter()
                        .append('path')
                        .attr('class', 'oeExtra')
                        .attr('stroke', 'red')
                        .attr('id', 'oeLine')
                        .attr("stroke-width", 2)
                        .style("stroke-dasharray", ("4,3"))
                        .attr('d', line);
                    mclDrawn = false
                }
            });
        ;
        cuCountChart.xAxis().tickValues([0, 2000, 4000]);

        // Iron
        feCountChart
            .width(250)
            .height(250)
            .dimension(FeDim)
            .group(countPerFe)
            .x(d3.scale.linear().domain([0, 150010]))
            .y(d3.scale.linear().domain([0, 30]))
            .xUnits(function () { return 150010; })
            .elasticY(false)
            .centerBar(true)
            .barPadding(3)
            .yAxisLabel('Count')
            .xAxisLabel('Iron (μg/L)')
            .margins({ top: 10, right: 20, bottom: 50, left: 50 })
            // Add vertical line at MCL using example from https://github.com/dc-js/dc.js/blob/develop/web-src/examples/row-vertical-line.html
            .on('pretransition', function (chart) {
                if (!mclDrawn) {
                    var x_vert = 300; // Secondary MCL for Fe is 300
                    var extra_data = [ // Array to define vertical line starting at (MCL, 0)
                        { x: chart.x()(x_vert), y: 0 },
                        { x: chart.x()(x_vert), y: chart.effectiveHeight() }
                    ];
                    var line = d3.svg.line()
                        .x(function (d) { return d.x; })
                        .y(function (d) { return d.y; })
                        .interpolate('linear');
                    var chartBody = chart.select('g.chart-body'); //select g.chart-body will select the rect object within the svg
                    var path = chartBody.selectAll('path.extra').data([extra_data]);
                    path.enter()
                        .append('path')
                        .attr('class', 'oeExtra')
                        .attr('stroke', 'yellow')
                        .attr('id', 'oeLine')
                        .attr("stroke-width", 2)
                        .style("stroke-dasharray", ("4,3"))
                        .attr('d', line);
                    mclDrawn = false
                }
            });
        ;
        feCountChart.xAxis().tickValues([0, 60000, 120000]);

        // Manganese
        mnCountChart
            .width(250)
            .height(250)
            .dimension(MnDim)
            .group(countPerMn)
            .x(d3.scale.linear().domain([0, 4500]))
            .y(d3.scale.linear().domain([0, 30]))
            .xUnits(function () { return 4500; })
            .elasticY(false)
            .centerBar(true)
            .barPadding(3)
            .yAxisLabel('Count')
            .xAxisLabel('Manganese (μg/L)')
            .margins({ top: 10, right: 20, bottom: 50, left: 50 })
            // Add vertical line at MCL using example from https://github.com/dc-js/dc.js/blob/develop/web-src/examples/row-vertical-line.html
            .on('pretransition', function (chart) {
                if (!mclDrawn) {
                    var x_vert = 50; // Secondary MCL for Mn is 50
                    var extra_data = [ // Array to define vertical line starting at (MCL, 0)
                        { x: chart.x()(x_vert), y: 0 },
                        { x: chart.x()(x_vert), y: chart.effectiveHeight() }
                    ];
                    var line = d3.svg.line()
                        .x(function (d) { return d.x; })
                        .y(function (d) { return d.y; })
                        .interpolate('linear');
                    var chartBody = chart.select('g.chart-body'); //select g.chart-body will select the rect object within the svg
                    var path = chartBody.selectAll('path.extra').data([extra_data]);
                    path.enter()
                        .append('path')
                        .attr('class', 'oeExtra')
                        .attr('stroke', 'yellow')
                        .attr('id', 'oeLine')
                        .attr("stroke-width", 2)
                        .style("stroke-dasharray", ("4,3"))
                        .attr('d', line);
                    mclDrawn = false
                }
            });
        ;
        mnCountChart.xAxis().tickValues([0, 1800, 3600]);

        // Lead
        pbCountChart
            .width(250)
            .height(250)
            .dimension(PbDim)
            .group(countPerPb)
            .x(d3.scale.linear().domain([0, 350]))
            .y(d3.scale.linear().domain([0, 15]))
            .xUnits(function () { return 350; })
            .elasticY(false)
            .centerBar(true)
            .barPadding(3)
            .yAxisLabel('Count')
            .xAxisLabel('Lead (μg/L)')
            .margins({ top: 10, right: 20, bottom: 50, left: 50 })
            // Add vertical line at MCL using example from https://github.com/dc-js/dc.js/blob/develop/web-src/examples/row-vertical-line.html
            .on('pretransition', function (chart) {
                if (!mclDrawn) {
                    var x_vert = 0; // MCL for Pb is 0
                    var extra_data = [ // Array to define vertical line starting at (MCL, 0)
                        { x: chart.x()(x_vert), y: 0 },
                        { x: chart.x()(x_vert), y: chart.effectiveHeight() }
                    ];
                    var line = d3.svg.line()
                        .x(function (d) { return d.x; })
                        .y(function (d) { return d.y; })
                        .interpolate('linear');
                    var chartBody = chart.select('g.chart-body'); //select g.chart-body will select the rect object within the svg
                    var path = chartBody.selectAll('path.extra').data([extra_data]);
                    path.enter()
                        .append('path')
                        .attr('class', 'oeExtra')
                        .attr('stroke', 'red')
                        .attr('id', 'oeLine')
                        .attr("stroke-width", 2)
                        .style("stroke-dasharray", ("4,3"))
                        .attr('d', line);
                    mclDrawn = false
                }
            });
        ;
        pbCountChart.xAxis().tickValues([0, 140, 280]);

        // Selenium
        seCountChart
            .width(250)
            .height(250)
            .dimension(SeDim)
            .group(countPerSe)
            .x(d3.scale.linear().domain([0, 1000]))
            .y(d3.scale.linear().domain([0, 15]))
            .xUnits(function () { return 1000; })
            .elasticY(false)
            .centerBar(true)
            .barPadding(3)
            .yAxisLabel('Count')
            .xAxisLabel('Selenium (μg/L)')
            .margins({ top: 10, right: 20, bottom: 50, left: 50 })
            // Add vertical line at MCL using example from https://github.com/dc-js/dc.js/blob/develop/web-src/examples/row-vertical-line.html
            .on('pretransition', function (chart) {
                if (!mclDrawn) {
                    var x_vert = 50; // MCL for Se is 50
                    var extra_data = [ // Array to define vertical line starting at (MCL, 0)
                        { x: chart.x()(x_vert), y: 0 },
                        { x: chart.x()(x_vert), y: chart.effectiveHeight() }
                    ];
                    var line = d3.svg.line()
                        .x(function (d) { return d.x; })
                        .y(function (d) { return d.y; })
                        .interpolate('linear');
                    var chartBody = chart.select('g.chart-body'); //select g.chart-body will select the rect object within the svg
                    var path = chartBody.selectAll('path.extra').data([extra_data]);
                    path.enter()
                        .append('path')
                        .attr('class', 'oeExtra')
                        .attr('stroke', 'red')
                        .attr('id', 'oeLine')
                        .attr("stroke-width", 2)
                        .style("stroke-dasharray", ("4,3"))
                        .attr('d', line);
                    mclDrawn = false
                }
            });
        ;
        seCountChart.xAxis().tickValues([0, 400, 800]);

        // Uranium
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
            .xAxisLabel('Uranium (μg/L)')
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
                    .attr('d', line);
                mclDrawn = true;
            });
        ;
        uCountChart.xAxis().tickValues([30, 300, 600])
        var mclDrawn = false;

        // Donut chart
        // Define color scale
        var recColors = d3.scale.ordinal()
            .domain(['RED', 'YELLOW', 'GREEN'])
            .range(['#d7191c', '#fdae61', '#1a9641']);
        recChart
            .width(200)
            .height(200)
            .dimension(recDim)
            .group(countPerRec)
            .innerRadius(40)
            .colors(recColors)
            .label(function (d) {
                return '';
            })
            .filter = function () { };

        // Pie charts
        avoidChart
            .ordinalColors(['#cccccc', '#007A86']) // Set colors for 0 and 1
            .dimension(avoidDim)
            .group(avoidGroup)
            .width(150)
            .height(150)
            .radius(60)
            .minAngleForLabel(0.000001) // Set the minimum angle for the label to 0
            .label(function (d) {
                if (d.key === 1) {
                    return 'Avoid: ' + ((d.value / avoidGroup.all().reduce(function (acc, obj) { return acc + obj.value; }, 0)) * 100).toFixed(2) + '%';
                }
                // Return an empty string for other values to hide their labels
                return '';
            })
            .filter = function () { };

        irrigationChart
            .ordinalColors(['#cccccc', '#007A86']) // Set colors for 0 and 1
            .dimension(irrigationDim)
            .group(irrigationGroup)
            .width(150)
            .height(150)
            .radius(60)
            .minAngleForLabel(0.000001) // Set the minimum angle for the label to 0
            .label(function (d) {
                if (d.key === 1) {
                    return 'Irrigation: ' + ((d.value / irrigationGroup.all().reduce(function (acc, obj) { return acc + obj.value; }, 0)) * 100).toFixed(2) + '%';
                }
                // Return an empty string for other values to hide their labels
                return '';
            })
            .filter = function () { };

        householdChart
            .ordinalColors(['#cccccc', '#007A86']) // Set colors for 0 and 1
            .dimension(householdDim)
            .group(householdGroup)
            .width(150)
            .height(150)
            .radius(60)
            .minAngleForLabel(0.000001) // Set the minimum angle for the label to 0
            .label(function (d) {
                if (d.key === 1) {
                    return 'Household: ' + ((d.value / householdGroup.all().reduce(function (acc, obj) { return acc + obj.value; }, 0)) * 100).toFixed(2) + '%';
                }
                // Return an empty string for other values to hide their labels
                return '';
            })
            .filter = function () { };

        livestockChart
            .ordinalColors(['#cccccc', '#007A86']) // Set colors for 0 and 1
            .dimension(livestockDim)
            .group(livestockGroup)
            .width(150)
            .height(150)
            .radius(60)
            .minAngleForLabel(0.000001) // Set the minimum angle for the label to 0
            .label(function (d) {
                if (d.key === 1) {
                    return 'Livestock: ' + ((d.value / livestockGroup.all().reduce(function (acc, obj) { return acc + obj.value; }, 0)) * 100).toFixed(2) + '%';
                }
                // Return an empty string for other values to hide their labels
                return '';
            })
            .filter = function () { };

        avoidChart.render();
        irrigationChart.render();
        householdChart.render();
        livestockChart.render();

        // Check data for avoid chart
        console.log("Avoid Data:", avoidGroup.all());

        // Check data for irrigation chart
        console.log("Irrigation Data:", irrigationGroup.all());

        // Check data for household chart
        console.log("Household Data:", householdGroup.all());

        // Check data for livestock chart
        console.log("Livestock Data:", livestockGroup.all());

        var column2 = function (d) { return d.properties.Al.toFixed(3); };
        var column3 = function (d) { return d.properties.As.toFixed(3); };
        var column4 = function (d) { return d.properties.Ba.toFixed(3); };
        var column5 = function (d) { return d.properties.Cd.toFixed(3); };
        var column6 = function (d) { return d.properties.Cu.toFixed(3); };
        var column7 = function (d) { return d.properties.Fe.toFixed(3); };
        var column8 = function (d) { return d.properties.Mn.toFixed(3); };
        var column9 = function (d) { return d.properties.Pb.toFixed(3); };
        var column10 = function (d) { return d.properties.Se.toFixed(3); };
        var column11 = function (d) { return d.properties.U.toFixed(3); };


        //default dataTable
        dataTable
            .dimension(allDim)
            .group(function (d) { return ''; }) // Remove empty top row 
            .size(1000)
            .columns([
                function (d) { return d.properties.well_no; },
                function (d) { return d.properties.Chapter },
                function (d) { return d.properties.nn_agency },
                function (d) { return d.properties.lat.toFixed(5); },
                function (d) { return d.properties.long.toFixed(5); },
                column2,
                column3,
                column4,
                column5,
                column6,
                column7,
                column8,
                column9,
                column10,
                column11
            ])
            .on('pretransition', function (table) {

                table.select('tr.dc-table-group').remove();

                // Create marker cluster groups
                var clustersAll = L.markerClusterGroup();
                var clustersAvoid = L.markerClusterGroup();
                var clustersHousehold = L.markerClusterGroup();
                var clustersIrrigation = L.markerClusterGroup();
                var clustersLivestock = L.markerClusterGroup();

                // Create a variable to store the currently active cluster group
                var activeClusterGroup = clustersAll;

                // Add an event listener to the radio buttons to update displayed markers
                document.querySelectorAll('input[name="marker-option"]').forEach(function (radio) {
                    radio.addEventListener('change', function () {
                        console.log("Radio button changed");
                        displayMarkers(this.value);
                    });
                });

                // Declare markerCount outside of the displayMarkers function
                var markerCount = 0;

                function displayMarkers(option) {
                    // Clear the active cluster group
                    activeClusterGroup.clearLayers();

                    // Get the filtered data based on the data table's dimension
                    var filteredData = allDim.top(Infinity);

                    // Reset the marker count for each call to displayMarkers
                    markerCount = 0;

                    filteredData.forEach(function (d) {
                        var fillColor = "#404040"; // Default color

                        if (
                            option === 'all' ||
                            (option === 'avoid' && d.properties.Avoid === 1) ||
                            (option === 'household' && d.properties.Household === 1) ||
                            (option === 'irrigation' && d.properties.Irrigation === 1) ||
                            (option === 'livestock' && d.properties.Livestock === 1)
                        ) {
                            // Check if the option is not 'all'
                            if (option !== 'all') {
                                // Set fillColor based on recConfidence
                                switch (d.properties.recConfidence) {
                                    case "RED":
                                        fillColor = "#d7191c";
                                        break;
                                    case "YELLOW":
                                        fillColor = "#fdae61";
                                        break;
                                    case "GREEN":
                                        fillColor = "#1a9641";
                                        break;
                                }
                            }

                            // Create marker with appropriate options
                            var markerOptions = {
                                radius: 6.5,
                                fillColor: fillColor,
                                color: option === 'all' ? "black" : "black", // Set color to black for "all", or use black for others
                                weight: 0.6,
                                fillOpacity: 0.75,
                            };

                            var marker = L.circleMarker([d.properties.lat, d.properties.long], markerOptions);

                            // Add popup content here
                            marker.bindPopup(
                                "<dl><dt> <h5><b><i>WELL NAME:<br>" + d.properties.well_name + "</i></b></h5>"
                                + "<dt><span style='font-weight:bolder'></span></dt>" // Damn thing won't center without this

                                // Conditional Recommendations with images
                                + "<div class='popup-content'>" + // Apply the CSS class to center-align content
                                "<dt><span style='font-weight:bolder'><i><u>Recommended Uses:</u></i><br> </span></dt>"
                                + (d.properties.Avoid == 1 ? '<img src="myCSS_styleFiles/images/avoid.png" height="75px"><b>We recommend <i>AVOIDING</i> this water source.</b>' :
                                    ((d.properties.Household == 1 ? '<br><b>Household</b><br><img src="myCSS_styleFiles/images/broom.png" height="65px">' : "<br>") +
                                        (d.properties.Irrigation == 1 ? '<br><b>Irrigation</b><br><img src="myCSS_styleFiles/images/corn.png" height="65px">' : "<br>") +
                                        (d.properties.Livestock == 1 ? '<br><b>Livestock</b><br><img src="myCSS_styleFiles/images/goat.png" height="65px">' : "<br>")).replace(/, $/, "") // Remove trailing comma
                                ) + "</dd>"
                                + "<dl>"

                                // Conditional Image Display with Confidence Level Text

                                + "<br><b>Confidence: </b>"
                                + (d.properties.recConfidence === "RED" ? '<img src="myCSS_styleFiles/images/red.png" height="60px"><br>Our confidence level for this recommendation is <i>LOW</i>. This may be due to missing data that we might have interpolated, the standard error of our interpolation, old observational data, or few laboratory samples.' :
                                    (d.properties.recConfidence === "YELLOW" ? '<img src="myCSS_styleFiles/images/yellow.png" height="60px"><br>Our confidence level for this recommendation is MODERATE. There is at least one laboratory sample available from a list of 10 key analytes to support our conclusion.' :
                                        (d.properties.recConfidence === "GREEN" ? '<img src="myCSS_styleFiles/images/green.png" height="60px"><br>Our confidence level for this recommendation is HIGH. There are sufficient field samples taken within the last decade to support our conclusion.' : '')
                                    )
                                ) + "</dd>"
                                + "<br><br>Click <a href='index.html#section-data' target = '_blank'>here</a> for more information about our recommendations."
                                + "</dl></div>"

                                // General Well Info
                                + "<dt><span style='font-weight:bolder'><i><u>General Information</u></i></dt>"
                                + "<dt><span style='font-weight:bolder'>Chapter: </span> " + d.properties.Chapter + "</dt>"
                                + "<dt><span style='font-weight:bolder'>Agency: </span> " + d.properties.nn_agency + "</dt>"
                                + "<dt><span style='font-weight:bolder'>Latitude: </span> " + d.properties.lat + "</dt>"
                                + "<dt><span style='font-weight:bolder'>Longitude: </span> " + d.properties.long + "</dt>"
                                + "<dt><span style='font-weight:bolder'>Well No.: </span> " + d.properties.well_no + "</dt>"
                                + "<dt><span style='font-weight:bolder'>Well Name: </span> " + d.properties.well_name + "</dt>"
                                + "<dt><span style='font-weight:bolder'>Alternate Name 1: </span> " + d.properties.aka2 + "</dt>"
                                + "<dt><span style='font-weight:bolder'>Alternate Name 2: </span> " + d.properties.aka3 + "</dt>"
                                + "<dt><span style='font-weight:bolder'>Owner: </span> " + d.properties.owner + "</dt>"
                                + "<dt><span style='font-weight:bolder'>Depth (ft.): </span> " + d.properties.depth + "</dt>"
                                + "<dt><span style='font-weight:bolder'>Public Water Sys. ID: </span> " + d.properties.pwsid + "</dt>"
                                + "<dt><span style='font-weight:bolder'>USGS ID: </span> " + d.properties.usgs_id + "</dt>"
                                + "<dt><span style='font-weight:bolder'>Data Source(s): </span> " + d.properties.information_source + "</dt>"
                                + "<dt><span style='font-weight:bolder'>First Sampling Date: </span> " + d.properties.mindate + "</dt>"
                                + "<dt><span style='font-weight:bolder'>Last Sampling Date: </span> " + d.properties.maxdate + "</dt>"
                                + "</dl"

                                // Primary Contaminants: Radionuclides
                                + "<br><dt><span style='font-weight:bolder'><i><u>Primary Contaminants: Radionuclides</u></i></dt>"
                                + "<dt><span style='font-weight:bolder'>Radium-226 (Ra-226) (pCi/L): </span> </dt> <dd>" + d.properties.Ra_226 + " (" + d.properties.Count_Ra_226 + " sample(s))<dd>"
                                + "<dt><span style='font-weight:bolder'>Radium-228 (Ra-228) (pCi/L): </span> </dt> <dd>" + d.properties.Ra_228 + " (" + d.properties.Count_Ra_228 + " sample(s))<dd>"
                                + "<dt><span style='font-weight:bolder'>Total Radium (Ra) (pCi/L): </span> </dt> <dd>" + d.properties.Ra_Total + " (" + d.properties.Count_Ra_Total + " sample(s))<dd>"
                                + "<dt><span style='font-weight:bolder'>Uranium (U) (&mu;g/L): </span> </dt> <dd>" + d.properties.U + " (" + d.properties.Count_U + " sample(s))<dd>"
                                // Primary Contaminants: Inorganic Chemicals
                                + "<br><dt><span style='font-weight:bolder'><i><u>Primary Contaminants: Inorganic Chemicals</u></i></dt>"
                                + "<dt><span style='font-weight:bolder'>Arsenic (As) (&mu;g/L): </span> </dt> <dd>" + d.properties.As + " (" + d.properties.Count_As + " sample(s))<dd>"
                                + "<dt><span style='font-weight:bolder'>Barium (Ba) (&mu;g/L): </span> </dt> <dd>" + d.properties.Ba + " (" + d.properties.Count_Ba + " sample(s))<dd>"
                                + "<dt><span style='font-weight:bolder'>Beryllium (Be) (&mu;g/L): </span> </dt> <dd>" + d.properties.Be + " (" + d.properties.Count_Be + " sample(s))<dd>"
                                + "<dt><span style='font-weight:bolder'>Cadmium (Cd) (&mu;g/L): </span> </dt> <dd>" + d.properties.Cd + " (" + d.properties.Count_Cd + " sample(s))<dd>"
                                + "<dt><span style='font-weight:bolder'>Chromium (Cr) (&mu;g/L): </span> </dt> <dd>" + d.properties.Cr + " (" + d.properties.Count_Cr + " sample(s))<dd>"
                                + "<dt><span style='font-weight:bolder'>Copper (Cu) (&mu;g/L): </span> </dt> <dd>" + d.properties.Cu + " (" + d.properties.Count_Cu + " sample(s))<dd>"
                                + "<dt><span style='font-weight:bolder'>Mercury (Hg) (&mu;g/L): </span> </dt> <dd>" + d.properties.Hg + " (" + d.properties.Count_Hg + " sample(s))<dd>"
                                + "<dt><span style='font-weight:bolder'>Nitrate (NO3-) (Mg/L): </span> </dt> <dd>" + d.properties.Nitrate + " (" + d.properties.Count_Nitrate + " sample(s))<dd>"
                                + "<dt><span style='font-weight:bolder'>Nitrite (NO2-) (Mg/L): </span> </dt> <dd>" + d.properties.Nitrite + " (" + d.properties.Count_Nitrite + " sample(s))<dd>"
                                + "<dt><span style='font-weight:bolder'>Lead (Pb) (&mu;g/L): </span> </dt> <dd>" + d.properties.Pb + " (" + d.properties.Count_Pb + " sample(s))<dd>"
                                + "<dt><span style='font-weight:bolder'>Antimony (Sb) (&mu;g/L): </span> </dt> <dd>" + d.properties.Sb + " (" + d.properties.Count_Sb + " sample(s))<dd>"
                                + "<dt><span style='font-weight:bolder'>Selenium (Se) (&mu;g/L): </span> </dt> <dd>" + d.properties.Se + " (" + d.properties.Count_Se + " sample(s))<dd>"
                                + "<dt><span style='font-weight:bolder'>Thallium (Tl) (&mu;g/L): </span> </dt> <dd>" + d.properties.Tl + " (" + d.properties.Count_Tl + " sample(s))<dd>"
                                // Primary Contaminants: Microorganisms
                                + "<br><dt><span style='font-weight:bolder'><i><u>Primary Contaminants: Microorganisms</u></i></dt>"
                                + "<dt><span style='font-weight:bolder'>Turbidity (NTU): </span> </dt> <dd>" + d.properties.Turbidity + " (" + d.properties.Count_Turbidity + " sample(s))<dd>"
                                // Secondary Contaminants
                                + "<br><dt><span style='font-weight:bolder'><i><u>Secondary Contaminants</u></i></dt>"
                                + "<dt><span style='font-weight:bolder'>Aluminum (Al) (mg/L): </span> </dt> <dd>" + d.properties.Al + " (" + d.properties.Count_Al + " sample(s))<dd>"
                                + "<dt><span style='font-weight:bolder'>Chloride (mg/L): </span> </dt> <dd>" + d.properties.Chloride + " (" + d.properties.Count_Chloride + " sample(s))<dd>"
                                + "<dt><span style='font-weight:bolder'>Corrosivity (LSI): </span> </dt> <dd>" + d.properties.Corrosivity + " (" + d.properties.Count_Corrosivity + " sample(s))<dd>"
                                + "<dt><span style='font-weight:bolder'>Iron (Fe) (&mu;g/L): </span> </dt> <dd>" + d.properties.Fe + " (" + d.properties.Count_Fe + " sample(s))<dd>"
                                + "<dt><span style='font-weight:bolder'>Fluoride (F-) (mg/L): </span> </dt> <dd>" + d.properties.Fluoride + " (" + d.properties.Count_Fluoride + " sample(s))<dd>"
                                + "<dt><span style='font-weight:bolder'>Manganese (Mn) (&mu;g/L): </span> </dt> <dd>" + d.properties.Mn + " (" + d.properties.Count_Mn + " sample(s))<dd>"
                                + "<dt><span style='font-weight:bolder'>pH: </span> </dt> <dd>" + d.properties.pH + " (" + d.properties.Count_pH + " sample(s))<dd>"
                                + "<dt><span style='font-weight:bolder'>Sulfate (SO<sub>4</sub><sup>2-</sup>) (mg/L): </span> </dt> <dd>" + d.properties.Sulfate + " (" + d.properties.Count_Sulfate + " sample(s))<dd>"
                                + "<dt><span style='font-weight:bolder'>Total Dissolved Solids (TDS) (mg/L): </span> </dt> <dd>" + d.properties.TotalDissolvedSolids + " (" + d.properties.Count_TotalDissolvedSolids + " sample(s))<dd>"
                                + "<dt><span style='font-weight:bolder'>Zinc (Zn) (&mu;g/L): </span> </dt> <dd>" + d.properties.Zn + " (" + d.properties.Count_Zn + " sample(s))<dd>"
                                // Other Water Chemistry
                                + "<br><dt><span style='font-weight:bolder'><i><u>Other Water Chemistry</u></i></dt>"
                                + "<dt><span style='font-weight:bolder'>Total Alkalinity: </span> </dt> <dd>" + d.properties.Alkalinity_Total + " (" + d.properties.Count_Alkalinity_Total + " sample(s))<dd>"
                                + "<dt><span style='font-weight:bolder'>Bicarbonate (mg/L): </span> </dt> <dd>" + d.properties.Bicarbonate + " (" + d.properties.Count_Bicarbonate + " sample(s))<dd>"
                                + "<dt><span style='font-weight:bolder'>Calcium (Ca) (mg/L): </span> </dt> <dd>" + d.properties.Ca + " (" + d.properties.Count_Ca + " sample(s))<dd>"
                                + "<dt><span style='font-weight:bolder'>Conductivity (&mu;s/cm): </span> </dt> <dd>" + d.properties.Conductivity + " (" + d.properties.Count_Conductivity + " sample(s))<dd>"
                                + "<dt><span style='font-weight:bolder'>Dissolved Oxygen (&mu;g/L): </span> </dt> <dd>" + d.properties.DissolvedOxygen + " (" + d.properties.Count_DissolvedOxygen + " sample(s))<dd>"
                                + "<dt><span style='font-weight:bolder'>Hardness (mg/L as CaCO3): </span> </dt> <dd>" + d.properties.Hardness + " (" + d.properties.Count_Hardness + " sample(s))<dd>"
                                + "<dt><span style='font-weight:bolder'>Sodium (Na) (mg/L): </span> </dt> <dd>" + d.properties.Na + " (" + d.properties.Count_Na + " sample(s))<dd>"
                                + "<dt><span style='font-weight:bolder'>Salinity (mg/L): </span> </dt> <dd>" + d.properties.Salinity + " (" + d.properties.Count_Salinity + " sample(s))<dd>"
                                + "<dt><span style='font-weight:bolder'>Specific Conductance (uS/cm at 25&deg;C): </span> </dt> <dd>" + d.properties.SpecificConductance + " (" + d.properties.Count_SpecificConductance + " sample(s))<dd>"
                                + "<dt><span style='font-weight:bolder'>Temperature (&deg;C): </span> </dt> <dd>" + d.properties.Temperature + " (" + d.properties.Count_Temperature + " sample(s))<dd>"
                                // Other Analytes
                                + "<br><dt><span style='font-weight:bolder'><i><u>Other Analytes</u></i></dt>"
                                + "<dt><span style='font-weight:bolder'>Bromide (Br-) (mg/L): </span> </dt> <dd>" + d.properties.Bromide + " (" + d.properties.Count_Bromide + " sample(s))<dd>"
                                + "<dt><span style='font-weight:bolder'>Potassium (K) (mg/L): </span> </dt> <dd>" + d.properties.K + " (" + d.properties.Count_K + " sample(s))<dd>"
                                + "<dt><span style='font-weight:bolder'>Magnesium (Mg) (mg/L): </span> </dt> <dd>" + d.properties.Mg + " (" + d.properties.Count_Mg + " sample(s))<dd>"
                                + "<dt><span style='font-weight:bolder'>Molybdenum (Mo) (&mu;g/L): </span> </dt> <dd>" + d.properties.Mo + " (" + d.properties.Count_Mo + " sample(s))<dd>"
                                + "<dt><span style='font-weight:bolder'>Nickel (Ni) (&mu;g/L): </span> </dt> <dd>" + d.properties.Ni + " (" + d.properties.Count_Ni + " sample(s))<dd>"
                                + "<dt><span style='font-weight:bolder'>Phosphate (PO<sub>4</sub><sup>3-</sup>) (mg/L): </span> </dt> <dd>" + d.properties.Phosphate + " (" + d.properties.Count_Phosphate + " sample(s))<dd>"
                                + "<dt><span style='font-weight:bolder'>Tin (Sn) (&mu;g/L): </span> </dt> <dd>" + d.properties.Sn + " (" + d.properties.Count_Sn + " sample(s))<dd>"
                                + "<dt><span style='font-weight:bolder'>Strontium (Sr) (&mu;g/L): </span> </dt> <dd>" + d.properties.Sr + " (" + d.properties.Count_Sr + " sample(s))<dd>"
                                + "<dt><span style='font-weight:bolder'>Vanadium (V) (&mu;g/L): </span> </dt> <dd>" + d.properties.V + " (" + d.properties.Count_V + " sample(s))<dd>"
                                // More Information
                                + "<br><br><dd><small><i>More information on primary and secondary water contaminants can be found <a href='https://www.epa.gov/ground-water-and-drinking-water/national-primary-drinking-water-regulations' target='_blank'>here</a>.</i></small><dd>"
                                + "</dl>"
                            );//close bind popup
                            activeClusterGroup.addLayer(marker);

                            // Increment marker count
                            markerCount++;
                        }
                    });

                    // Log the marker count
                    document.querySelector('.filter-count').textContent = markerCount;
                    console.log(`Number of markers rendered: ${markerCount}`);

                    // Add the active cluster group to the map
                    map.addLayer(activeClusterGroup);
                    map.fitBounds(activeClusterGroup.getBounds());
                }
                // Call displayMarkers to initialize with 'all' option
                displayMarkers('all');

                // Handle the histogram filter change
                alCountChart.on('filtered', function (chart, filter) {
                    clearMarkers();
                    // Update the markers when the histogram filter changes
                    displayMarkers(document.querySelector('input[name="marker-option"]:checked').value);
                });

                as_CountChart.on('filtered', function (chart, filter) {
                    clearMarkers();
                    // Update the markers when the histogram filter changes
                    displayMarkers(document.querySelector('input[name="marker-option"]:checked').value);
                });

                baCountChart.on('filtered', function (chart, filter) {
                    clearMarkers();
                    // Update the markers when the histogram filter changes
                    displayMarkers(document.querySelector('input[name="marker-option"]:checked').value);
                });

                cdCountChart.on('filtered', function (chart, filter) {
                    clearMarkers();
                    // Update the markers when the histogram filter changes
                    displayMarkers(document.querySelector('input[name="marker-option"]:checked').value);
                });

                cuCountChart.on('filtered', function (chart, filter) {
                    clearMarkers();
                    // Update the markers when the histogram filter changes
                    displayMarkers(document.querySelector('input[name="marker-option"]:checked').value);
                });

                feCountChart.on('filtered', function (chart, filter) {
                    clearMarkers();
                    // Update the markers when the histogram filter changes
                    displayMarkers(document.querySelector('input[name="marker-option"]:checked').value);
                });

                mnCountChart.on('filtered', function (chart, filter) {
                    clearMarkers();
                    // Update the markers when the histogram filter changes
                    displayMarkers(document.querySelector('input[name="marker-option"]:checked').value);
                });

                pbCountChart.on('filtered', function (chart, filter) {
                    clearMarkers();
                    // Update the markers when the histogram filter changes
                    displayMarkers(document.querySelector('input[name="marker-option"]:checked').value);
                });

                seCountChart.on('filtered', function (chart, filter) {
                    clearMarkers();
                    // Update the markers when the histogram filter changes
                    displayMarkers(document.querySelector('input[name="marker-option"]:checked').value);
                });

                uCountChart.on('filtered', function (chart, filter) {
                    clearMarkers();
                    // Update the markers when the histogram filter changes
                    displayMarkers(document.querySelector('input[name="marker-option"]:checked').value);
                });

                recChart.on('filtered', function (chart, filter) {
                    clearMarkers();
                    // Update the markers when the histogram filter changes
                    displayMarkers(document.querySelector('input[name="marker-option"]:checked').value);
                });

                avoidChart.on('filtered', function (chart, filter) {
                    clearMarkers();
                    // Update the markers when the histogram filter changes
                    displayMarkers(document.querySelector('input[name="marker-option"]:checked').value);
                });

                irrigationChart.on('filtered', function (chart, filter) {
                    clearMarkers();
                    // Update the markers when the histogram filter changes
                    displayMarkers(document.querySelector('input[name="marker-option"]:checked').value);
                });

                householdChart.on('filtered', function (chart, filter) {
                    clearMarkers();
                    // Update the markers when the histogram filter changes
                    displayMarkers(document.querySelector('input[name="marker-option"]:checked').value);
                });

                livestockChart.on('filtered', function (chart, filter) {
                    clearMarkers();
                    // Update the markers when the histogram filter changes
                    displayMarkers(document.querySelector('input[name="marker-option"]:checked').value);
                });

                // Add an event listener to the "Clear all filters" button
                document.getElementById('clear-filters-button').addEventListener('click', function () {
                    location.reload();
                });

            });//close on pretransition


        dc.renderAll();
        ;//close data table
    });//close d3.json      
}

$(document).ready(function () {
    $(".navbar-toggle").on("click", function () {
        $(this).toggleClass("active");
        $("#myNavbar").toggleClass("in");
    });
});


