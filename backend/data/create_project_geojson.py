"""

This is a data preprocessing script that is not part of the main system.

We take the raw GeoJSON data from natural earth vectors and extract
the countries we want + the disputed territories that we want on the map.

This script requires the Python package shapely, which is not committed to
our requirements.txt because it's required here and only here. If you want to play
with this, install it manually to your venv:
    pip install shapely

This script requires the following data sources in the same directory as it.
These are not committed to the repo because they're too big!
    Basic country geometries:
    https://github.com/nvkelso/natural-earth-vector/blob/master/
        geojson/ne_50m_admin_0_countries.geojson

    Disputed areas geometries:
    https://github.com/nvkelso/natural-earth-vector/blob/master/
        geojson/ne_50m_admin_0_breakaway_disputed_areas.geojson

    States and provinces:
    https://github.com/nvkelso/natural-earth-vector/blob/master/
        geojson/ne_10m_admin_1_states_provinces.geojson

"""

import csv
import json

from shapely.geometry import MultiPolygon, Polygon, mapping
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
    union_polygon = cascaded_union(polygons)
    new_geometry = mapping(union_polygon)

    merged_geometry = {
        'type': new_geometry['type'],
        'coordinates': new_geometry['coordinates']
    }
    return merged_geometry


def add_bounding_circle(geo: dict, radius: float) -> dict:
    """
    Given a GeoJSON geometry, add a circle-ish polygon around it
    this is so that we can click on small island countries...

    TODO(ra):
        - stop hardcoding the radius
        - for the archipelagos, the centroid of the composite poly doesn't feel
          like the nicest center point for the bounding circle... maybe find something better
    """
    # The archipelagos are MultiPolygons, which we have to handle separately
    if geo['type'] == 'MultiPolygon':
        polygons = [
            Polygon(coord[0]) for coord in geo['coordinates']
        ]
        original_poly: MultiPolygon = MultiPolygon(polygons)
        bounding_circle = original_poly.centroid.buffer(radius)

        # subtract each island polygon from the bounding circle
        new_multi = []
        for poly in original_poly:
            intersection = bounding_circle.intersection(poly)
            remainder = bounding_circle.symmetric_difference(intersection)
            new_multi.append(remainder)
        remainder = MultiPolygon(new_multi)

    else:
        original_poly: Polygon = Polygon(geo['coordinates'][0])
        bounding_circle = original_poly.centroid.buffer(radius)
        intersection = bounding_circle.intersection(original_poly)
        remainder = bounding_circle.symmetric_difference(intersection)

    new_geometry = mapping(remainder)
    merged_geometry = {
        'type': new_geometry['type'],
        'coordinates': new_geometry['coordinates']
    }
    return merged_geometry


def create_africa_geojson():
    """
    Creates country-level Africa geojson file from Natural Earth
    source files and writes it to disk
    """
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

            # South Africa
            if iso_a3 == 'ZAF':
                # South Africa's geometry is a multipolygon, and the last entry in the list
                # of coordinates is the geometry for Marion Island...
                coords = country['geometry']['coordinates']
                coords.pop()  # ... which we remove here

            # combine Somalia and Somaliland geometries
            elif iso_a3 == 'SOM':
                geo = country['geometry']
                country['geometry'] = merge_geometries(geo, somaliland_geometry)

            # combine Morocco and Western Sahara geometries
            elif iso_a3 == 'MAR':
                geo = country['geometry']
                country['geometry'] = merge_geometries(geo, western_sahara_geometry)

            # Cape Verde, Seychelles, Mauritius, Sao Tome and Principe, Comoros
            elif iso_a3 in ['CPV', 'SYC', 'MUS', 'STP', 'COM']:
                geo = country['geometry']
                radius = 1.5
                if iso_a3 == 'CPV':
                    radius = 2.2
                elif iso_a3 == 'STP':
                    radius = 2.0
                country['geometry'] = add_bounding_circle(geo, radius)

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
    with open('africa.geojson', 'w', encoding='utf-8') as out_file:
        out_file.write(africa_geojson_json)


def create_state_geojsons(country_iso_code):
    """
    Create state-level GeoJSON of a single African country given its ISO-3166 A3 code
    and write it to disk
    """
    # load everything
    states_provinces_filename = 'ne_10m_admin_1_states_provinces.geojson'
    geojson = load_geojson(states_provinces_filename)
    all_states_features = geojson['features']

    # Initialize our data structures
    country_features = []
    country_geojson = {
        'type': 'FeatureCollection',
        'features': country_features,
    }

    # Find states that belong to the given country
    for state in all_states_features:
        properties = state['properties']
        iso_a3 = properties['adm0_a3']

        # iso_3166_2 is the ISO code for states/provinces/districts
        # https://en.wikipedia.org/wiki/ISO_3166-2
        if iso_a3 == country_iso_code:
            iso_3166_2 = properties['iso_3166_2']

            # This is the South African province Western Cape,
            # which contains Marion Island and Prince Edward Island, which are way off
            # in the ocean and we want to remove from our map
            # They are the first two items in our MultiPolygon
            if iso_3166_2 == 'ZA-WC':
                geo_coords = state['geometry']['coordinates'][2:]
                state['geometry']['coordinates'] = geo_coords

            new_props = {
                'ISO_3166_2': iso_3166_2,
                'ISO_A3': iso_a3,
                'name': properties['gns_name'],  # TODO(ra) is this the correct name field?
            }
            state['properties'] = new_props
            country_features.append(state)

    # serialize and write out to disk
    country_states_geojson_json = json.dumps(country_geojson)
    with open(f'state_level_maps/{country_iso_code}.geojson', 'w', encoding='utf-8') as \
    out_file:
        out_file.write(country_states_geojson_json)


def create_all_state_geojsons():
    """
    Creates state-level geojson files for all countries in Africa
    """
    iso_name_dict = load_iso_name_dict()
    africa_iso_codes = iso_name_dict.keys()
    for iso in africa_iso_codes:
        create_state_geojsons(iso)


if __name__ == '__main__':
    create_africa_geojson()
    create_all_state_geojsons()


