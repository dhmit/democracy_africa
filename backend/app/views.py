"""
These classes describe one way of entering into the web site.
"""

from pathlib import Path
import json
import csv

from rest_framework.decorators import api_view
from rest_framework.response import Response

from django.conf import settings


def load_africa_geojson() -> dict:
    """
    Read the GeoJSON file of the countries in Africa from disk
    and return a dict of the parsed json
    """
    filename = 'africa.geo.json'
    path = Path(settings.BACKEND_DATA_DIR, filename)
    with open(path, encoding='utf-8') as africa_geojson_file:
        africa_geojson_string = africa_geojson_file.read()
    return json.loads(africa_geojson_string)


@api_view(['GET'])
def africa_map_geojson(request):
    """
    Load Africa map GeoJSON for frontend
    """
    africa_geojson = load_africa_geojson()
    return Response(africa_geojson)


def load_democracy_data():
    """
    Read the CSV file of the democracy scores in Africa from disk
    and return a parsed json array along with a dictionary that has
    all the max values for each score so that we can normalize
    it later
    """

    filename = 'lieberman_afr_data.csv'
    path = Path(settings.BACKEND_DATA_DIR, filename)
    democracy_data = []
    country_name_index = 0
    country_text_id_index = 1
    year_index = 2
    with open(path, encoding='utf-8') as democracy_score_file:
        reader = csv.reader(democracy_score_file, delimiter=',')
        headers = next(reader)
        # 3 is the start of the democracy scores
        max_values = {headers[j]: None for j in range(3, len(headers))}
        current_country_data = {"democracy_scores": {}}
        for row in reader:
            country_name = row[country_name_index]
            year = row[year_index]
            if "country_name" not in current_country_data:
                current_country_data["country_name"] = country_name
            elif current_country_data["country_name"] != country_name:
                democracy_data.append(current_country_data)
                current_country_data = {"democracy_scores": {}, "country_name": country_name}

            if "country_text_id" not in current_country_data:
                current_country_data["country_text_id"] = row[country_text_id_index]

            # 3 is the start of the democracy scores
            if year not in current_country_data["democracy_scores"]:
                year_scores = {}
                for j in range(3, len(row)):
                    year_scores[headers[j]] = row[j]
                    previous_max_value = max_values[headers[j]]
                    if not previous_max_value or row[j] > max_values[headers[j]]:
                        max_values[headers[j]] = row[j]
                current_country_data["democracy_scores"][year] = year_scores

        democracy_data.append(current_country_data)  # append Zimbabwe
    return democracy_data, max_values


@api_view(['GET'])
def democracy_score_json(request):
    """
    Load Africa map GeoJSON for frontend
    """
    democracy_data, max_values = load_democracy_data()
    for data in democracy_data:
        for year in data["democracy_scores"]:
            data["democracy_scores"][year] = normalize(data["democracy_scores"][year], max_values)
    return Response(json.dumps(democracy_data))


def normalize(data, max_values):
    """
    Normalizes the democracy scores based on the max values of each score type
    If there is no score for that score type, it just leaves it as is
    """
    for score_type in data:
        if data[score_type] == "" or max_values == "":
            continue
        if float(max_values[score_type]) != 0:
            data[score_type] = float(data[score_type]) / float(max_values[score_type])
    return data
