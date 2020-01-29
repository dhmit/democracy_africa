/**
 * Common.js -- miscellaneous routines useful throughout the system
 */


import * as d3 from "d3";

/**
 * Get the value of a cookie, given its name
 * Adapted from https://docs.djangoproject.com/en/2.2/ref/csrf/#ajax
 * @param {string} name - The name of the cookie
 */
export function getCookie(name) {
    let cookieValue;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (const raw_cookie of cookies) {
            const cookie = raw_cookie.trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export function project_features_and_create_svg_paths(geo_json) {
    const scale = 500;
    const projection = d3.geoMercator()
        .center([0, 25])
        .scale(scale)
        .translate([scale/2, scale/2]);

    const geoGenerator = d3.geoPath().projection(projection);

    const map_data = [];
    for (const feature of geo_json.features) {
        const svg_path = geoGenerator(feature.geometry);
        const name = feature.properties.name;
        const postal = feature.properties.postal;
        const iso = feature.properties.iso_a3; // Not sure if this is the correct ISO code
        map_data.push({svg_path, name, postal, iso});
    }
    return map_data;
}
