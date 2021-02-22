window.onload = function () {
  // Call leaflet map into map frame
  var map = L.map('map').setView([36.292, -110.090], 8);
  var HikeBike_HikeBike = L.tileLayer('https://tiles.wmflabs.org/hikebike/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });
  HikeBike_HikeBike.addTo(map);

  //change to circle
  "use sctrict"; //JS strict mode
  function pointToCircle(feature, latlng) {
    if (feature.properties.USE == "Independent") {
      fillCOlor_Var = "black";
    }
    else if (feature.properties.USE == "Agriculture") {
      fillCOlor_Var = "lime";
    }
    else if (feature.properties.USE == "Domestic") {
      fillCOlor_Var = "blue";
    }
    else if (feature.properties.USE == "Livestock") {
      fillCOlor_Var = "red";
    }
    else if (feature.properties.USE == "Other") {
      fillCOlor_Var = "grey";
    }
    else if (feature.properties.USE == "Municipal") {
      fillCOlor_Var = "purple";
    }
    else if (feature.properties.USE == "Domestic Irrigaiton") {
      fillCOlor_Var = "green";
    }
    // if USE == Unknown
    else {
      fillCOlor_Var = "yellow";
    }
    var geojsonMarkerOptions = {
      radius: 7,
      //fillColor: "#F46B06",
      fillColor: fillCOlor_Var,
      color: "black",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.7
    };
    var circleMarker = L.circleMarker(latlng, geojsonMarkerOptions);
    return circleMarker;
  }

  //function to add popup info to the wells
  function addPopups(feature, layer) {
    var full_list = "<dl><dt> WELL INFORMATION- NAVAJO NATION WELL" + "<dt>FID:" + feature.properties.FID + ";<dd>" + "<dt> OBJECTID:" + feature.properties.OBJECTID + ";<dd>" + "<dt> well_no:" + feature.properties.well_no + ";<dd>" + "<dt> well_id:" + feature.properties.well_id + ";<dd>" + "<dt> well_name:" + feature.properties.well_name + ";<dd>" + "<dt> owner:" + feature.properties.owner + ";<dd>" + "<dt> depth:" + feature.properties.depth + ";<dd>" + "<dt> aquifer_co:" + feature.properties.aquifer_co + ";<dd>" + "<dt> swl:" + feature.properties.swl + ";<dd>" + "<dt> pwsid:" + feature.properties.pwsid + ";<dd>" + "<dt> usgs_id:" + feature.properties.usgs_id + ";<dd>" + "<dt> data_sourc:" + feature.properties.data_sourc + ";<dd>" + "<dt> comments:" + feature.properties.comments + ";<dd>" + "<dt> aka2:" + feature.properties.aka2 + ";<dd>" + "<dt> aka3:" + feature.properties.aka3 + ";<dd>" + "<dt> chapid:" + feature.properties.chapid + ";<dd>" + "<dt> grazing_di:" + feature.properties.grazing_di + ";<dd>" + "<dt> welltype:" + feature.properties.welltype + ";<dd>" + "<dt> well_use:" + feature.properties.well_use + ";<dd>" + "<dt> well_statu:" + feature.properties.well_statu + ";<dd>" + "<dt> sdwa_type:" + feature.properties.sdwa_type + ";<dd>" + "<dt> nn_agency:" + feature.properties.nn_agency + ";<dd>" + "<dt> USE:" + feature.properties.USE + ";<dd>" + "<dt> FID_ :" + feature.properties.FID_ + ";<dd>" + "<dt> well_id_1:" + feature.properties.well_id_1 + ";<dd>" + "<dt> Alkalinity:" + feature.properties.Alkalinity + ";<dd>" + "<dt> Alkalini_1:" + feature.properties.Alkalini_1 + ";<dd>" + "<dt> As_:" + feature.properties.As_ + ";<dd>" + "<dt> Ba:" + feature.properties.Ba + ";<dd>" + "<dt> Be:" + feature.properties.Be + ";<dd>" + "<dt> Br_:" + feature.properties.Br_ + ";<dd>" + "<dt> Ca:" + feature.properties.Ca + ";<dd>" + "<dt> Cd:" + feature.properties.Cd + ";<dd>" + "<dt> Cl_:" + feature.properties.Cl_ + ";<dd>" + "<dt> Conductivity:" + feature.properties.Conductivi + ";<dd>" + "<dt> Cr:" + feature.properties.Cr + ";<dd>" + "<dt> DO:" + feature.properties.DO + ";<dd>" + "<dt> Electrical:" + feature.properties.Electrical + ";<dd>" + "<dt> Gross_alph:" + feature.properties.Gross_alph + ";<dd>" + "<dt> GrossAplha:" + feature.properties.GrossAplha + ";<dd>" + "<dt> GrossBeta:" + feature.properties.GrossBeta + ";<dd>" + "<dt> GrossBeta_:" + feature.properties.GrossBeta_ + ";<dd>" + "<dt> Hardness:" + feature.properties.Hardness + ";<dd>" + "<dt> Hardness_T:" + feature.properties.Hardness_T + ";<dd>" + "<dt> Hg:" + feature.properties.Hg + ";<dd>" + "<dt> Hydroxide:" + feature.properties.Hydroxide + ";<dd>" + "<dt> K:" + feature.properties.K + ";<dd>" + "<dt> Mg:" + feature.properties.Mg + ";<dd>" + "<dt> Mn:" + feature.properties.Mn + ";<dd>" + "<dt> Na:" + feature.properties.Na + ";<dd>" + "<dt> Na_Fractio:" + feature.properties.Na_Fractio + ";<dd>" + "<dt> Na_K:" + feature.properties.Na_K + ";<dd>" + "<dt> Nitrate:" + feature.properties.Nitrate + ";<dd>" + "<dt> Nitrate_Ni:" + feature.properties.Nitrate_Ni + ";<dd>" + "<dt> NO2_:" + feature.properties.NO2_ + ";<dd>" + "<dt> NO3_:" + feature.properties.NO3_ + ";<dd>" + "<dt> ORP:" + feature.properties.ORP + ";<dd>" + "<dt> Pb:" + feature.properties.Pb + ";<dd>" + "<dt> Ra_226:" + feature.properties.Ra_226 + ";<dd>" + "<dt> Ra_228:" + feature.properties.Ra_228 + ";<dd>" + "<dt> Ra_Total:" + feature.properties.Ra_Total + ";<dd>" + "<dt> Sb:" + feature.properties.Sb + ";<dd>" + "<dt> Se:" + feature.properties.Se + ";<dd>" + "<dt> Temperature:" + feature.properties.Temperatur + ";<dd>" + "<dt> Tl:" + feature.properties.Tl + ";<dd>" + "<dt> Turbidity:" + feature.properties.Turbidity + ";<dd>" + "<dt> U:" + feature.properties.U + ".<dt><dl>";
    layer.bindPopup(full_list);
  }

  L.geoJSON(nvWells, {
    onEachFeature: addPopups,
    pointToLayer: pointToCircle
  }).addTo(map);

}