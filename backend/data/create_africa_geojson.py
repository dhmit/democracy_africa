"""

This is a data preprocessing script that is not part of the main system.

We take the raw GeoJSON data from natural earth vectors and extract
the countries we want + the disputed territories that we want on the map.

This script requires the following two data sources in the same directory as it.
These are not committed to the repo because they're too big!
    https://github.com/nvkelso/natural-earth-vector/blob/master/
        geojson/ne_50m_admin_0_countries.geojson

    https://github.com/nvkelso/natural-earth-vector/blob/master/
        geojson/ne_50m_admin_0_breakaway_disputed_areas.geojson

"""

import csv
import json


def load_iso_name_dict():
    """
    Read the CSV file from our v-dem based dataset and return
    a dict mapping ISO A3 codes to country names
    """
    csv_name_index = 0
    csv_iso_code_index = 1
    iso_name_dict = {}
    filename = 'lieberman_afr_data.csv'
    with open(filename, encoding='utf-8') as democracy_score_file:
        reader = csv.reader(democracy_score_file, delimiter=',')
        _ = next(reader)  # skip headers
        for row in reader:
            iso = row[csv_iso_code_index]
            name = row[csv_name_index]
            iso_name_dict[iso] = name

    return iso_name_dict


def load_geojson(filename) -> dict:
    """
    Read a GeoJSON file from disc
    and return a dict of the parsed json
    """
    with open(filename, encoding='utf-8') as geojson:
        geojson_string = geojson.read()
    return json.loads(geojson_string)


if __name__ == '__main__':
    iso_name_dict = load_iso_name_dict()

    all_countries_filename = 'ne_50m_admin_0_countries.geojson'
    geojson = load_geojson(all_countries_filename)

    disputed_filename = 'ne_50m_admin_0_breakaway_disputed_areas.geojson'
    disputed_geojson = load_geojson(disputed_filename)

    all_countries_features = geojson['features']
    disputed_features = disputed_geojson['features']

    africa_features = []
    africa_iso_codes = iso_name_dict.keys()
    africa_geojson = {
        'type': 'FeatureCollection',
        'features': africa_features,
    }

    # Construct the new GeoJSON for Africa
    for country in all_countries_features:
        properties = country['properties']
        iso_a3 = properties['ISO_A3']
        if iso_a3 in africa_iso_codes:

            if iso_a3 == 'ZAF':  # South Africa
                # This removes the coordinates for Marion Island from South Africa's geometry,
                coords = country['geometry']['coordinates']
                coords.pop()

            new_props = {
                'ISO_A3': iso_a3,
                'name': iso_name_dict[iso_a3],
            }
            country['properties'] = new_props
            africa_features.append(country)
    assert(len(africa_features) == 54)  # sanity check

    # sort by name
    africa_features.sort(key=lambda feature: feature['properties']['name'])

    # Add Western Saraha and Somaliland geometries
    western_sahara_fid = 18
    somaliland_fid = 19
    for territory in disputed_features:
        fid = territory['properties']['FID']
        if fid in [western_sahara_fid, somaliland_fid]:
            africa_features.append(territory)

    # serialize and write out to disk
    africa_geojson_json = json.dumps(africa_geojson)
    with open('africa.geo.json', 'w', encoding='utf-8') as out_file:
        out_file.write(africa_geojson_json)
