"""

This is a data preprocessing script that is not part of the main system.

We take the raw GeoJSON data from natural earth vectors and extract
the countries we want + the disputed territories that we want on the map.

This script requires the Python package shapely, which is not committed to
our requirements.txt because it's required here and only here. If you want to play
with this, install it manually to your venv:
    pip install shapely

This script requires the following two data sources in the same directory as it.
These are not committed to the repo because they're too big!
    https://github.com/nvkelso/natural-earth-vector/blob/master/
        geojson/ne_50m_admin_0_countries.geojson

    https://github.com/nvkelso/natural-earth-vector/blob/master/
        geojson/ne_50m_admin_0_breakaway_disputed_areas.geojson

"""

import csv
import json

from shapely.geometry import Polygon, mapping
from shapely.ops import cascaded_union


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


def merge_geometries(geo_a: dict, geo_b: dict) -> dict:
    """
    Given two GeoJSON geometries,
    return a single geometry that is the union of both
    """
    polygons = [
        Polygon(geo_a['coordinates'][0]),
        Polygon(geo_b['coordinates'][0]),
    ]
    new_geometry = mapping(cascaded_union(polygons))

    merged_geometry = {
        'type': new_geometry['type'],
        'coordinates': new_geometry['coordinates']
    }
    return merged_geometry


if __name__ == '__main__':
    # Load everything
    iso_name_dict = load_iso_name_dict()
    africa_iso_codes = iso_name_dict.keys()

    all_countries_filename = 'ne_50m_admin_0_countries.geojson'
    geojson = load_geojson(all_countries_filename)

    disputed_filename = 'ne_50m_admin_0_breakaway_disputed_areas.geojson'
    disputed_geojson = load_geojson(disputed_filename)

    all_countries_features = geojson['features']
    disputed_features = disputed_geojson['features']

    # Initialize our data structures
    africa_features = []
    africa_geojson = {
        'type': 'FeatureCollection',
        'features': africa_features,
    }

    # Save geometries for Western Sahara and Somaliland
    # "FID" seems to be a magic number from Natural Earth Vectors... 'feature id'?
    somaliland_fid = 18
    western_sahara_fid = 19
    western_sahara_geometry = None
    somaliland_geometry = None
    for territory in disputed_features:
        properties = territory['properties']
        fid = properties['FID']
        if fid == somaliland_fid:
            somaliland_geometry = territory['geometry']
        elif fid == western_sahara_fid:
            western_sahara_geometry = territory['geometry']
            break  # don't need to loop through any more territories

    # Construct the new GeoJSON for Africa
    for country in all_countries_features:
        properties = country['properties']
        iso_a3 = properties['ISO_A3']
        if iso_a3 in africa_iso_codes:

            # We do a little bit of geometry cleaning by hand
            if iso_a3 == 'ZAF':  # South Africa
                # South Africa's geometry is a multipolygon, and the last entry in the list
                # of coordinates is the geometry for Marion Island...
                coords = country['geometry']['coordinates']
                coords.pop()  # ... which we remove here

            elif iso_a3 == 'SOM':  # combine Somalia and Somaliland geometries
                geo = country['geometry']
                country['geometry'] = merge_geometries(geo, somaliland_geometry)

            elif iso_a3 == 'MAR':  # combine Morocco and Western Sahara geometries
                geo = country['geometry']
                country['geometry'] = merge_geometries(geo, western_sahara_geometry)

            new_props = {
                'ISO_A3': iso_a3,
                'name': iso_name_dict[iso_a3],
            }
            country['properties'] = new_props
            africa_features.append(country)
    assert(len(africa_features) == 54)  # sanity check

    # sort by name
    africa_features.sort(key=lambda feature: feature['properties']['name'])

    # serialize and write out to disk
    africa_geojson_json = json.dumps(africa_geojson)
    with open('africa.geo.json', 'w', encoding='utf-8') as out_file:
        out_file.write(africa_geojson_json)
