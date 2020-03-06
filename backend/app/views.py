"""
These classes describe one way of entering into the web site.
"""

from pathlib import Path
import json
import csv

from rest_framework.decorators import api_view
from rest_framework.response import Response

# We'll use these once we move towards using Django models
# from .models import (
#     Citizen,
# )
# from .serializers import (
#     CitizenSerializer,
# )
# from .models import Citizen

from django.conf import settings

from .models import Population
from .models import africa_demographics_by_country as demographics_dict

from .serializers import PopulationSerializer

def load_json(filename) -> dict:
    """
    Reads the JSON file and returns it as a dictionary
    """
    path = Path(settings.BACKEND_DATA_DIR, filename)
    with open(path, encoding='utf-8') as json_file:
        file_string = json_file.read()
    return json.loads(file_string)

def load_json(filename) -> dict:
    """
    Reads the JSON file and returns it as a dictionary
    """
    path = Path(settings.BACKEND_DATA_DIR, filename)
    with open(path, encoding='utf-8') as json_file:
        file_string = json_file.read()
    return json.loads(file_string)


@api_view(['GET'])
def africa_map_geojson(request):
    """
    Load Africa map GeoJSON for frontend
    """

    africa_geojson = load_json('africa.geojson')
    return Response(africa_geojson)


@api_view(['GET'])
def state_map_geojson(request, map_name):
    """
    Load state_level_map GeoJSON for frontend
    """
    state_geojson = load_json('state_level_maps/' + map_name + '.geojson')
    return Response(state_geojson)


@api_view(['GET'])
def africa_demographics_by_country(request):
    """
    Retrieves list of countries for which demographics were available
    """
    countries = list(demographics_dict.keys())
    return Response(json.dumps(countries))


@api_view(['POST'])
def population(request):
    """
    Generates a population of Citizen objects that then get passed into the frontend
    """
    country_name = request.data.get("country_name")
    population_obj = Population(country=country_name)
    population_obj.create_citizens_budget_sim(1000)
    serializer = PopulationSerializer(instance=population_obj)
    return Response(serializer.data)


@api_view(['POST'])
def campaign_population(request):
    """
    Generates a population of Citizen objects that then get passed into the frontend
    for campaign game
    """
    country_name = request.data.get("country_name")
    campaign_json = load_json('campaign_info.json')[country_name]
    population_obj = Population(country=country_name)
    population_obj.create_citizens_campaign_game(1000, campaign_json)
    serializer = PopulationSerializer(instance=population_obj)
    return Response(serializer.data)


def load_trust_data():
    """
    Returns a json file of interpersonal trust data
    """
    filename = "Nunn_Wantchekon_AER_2011.csv"
    path = Path(settings.BACKEND_DATA_DIR, filename)
    trust_data_list = []
    with open(path, encoding='utf-8') as trust_data_csv_file:
        reader = csv.DictReader(trust_data_csv_file, delimiter=',')
        for row in reader:
            if row["region"] == "altnatique":
                trust_data_list.append(row["region"])
    return trust_data_list


@api_view(['GET'])
def trust_data(request):
    """
    :return: trust_data for frontend
    """
    trust_data_json = load_trust_data()
    return Response(json.dumps(trust_data_json))


# moved it out because tests says that there were too many local variables
country_name_index = 0
country_text_id_index = 1
year_index = 2


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
    for k in max_values:
        if max_values[k] == "":
            max_values[k] = 0
    return democracy_data, max_values


@api_view(['GET'])
def democracy_score_json(request):
    """
    Load democracy score data for frontend
    """
    democracy_data = load_democracy_data()[0]
    return Response(json.dumps(democracy_data))

@api_view(['GET'])
def state_map_geojson(request, map_name):
    """
    Load state_level_map GeoJSON for frontend
    """
    state_geojson = load_json('state_level_maps/' + map_name + '.geojson')
    return Response(state_geojson)

def load_trust_data():
    """
    Returns a json file of interpersonal trust data
    """
    filename = "simplified_trust_data.csv"
    path = Path(settings.BACKEND_DATA_DIR, filename)
    trust_data = []
    with open(path, encoding='utf-8') as trust_data_csv_file:
        reader = csv.DictReader(trust_data_csv_file, delimiter=',')
    for row in reader:
        trust_data.append(row)
    return trust_data


@api_view(['GET'])
def trust_data(request):
    """
    :return: trust_data for frontend
    """
    trust_data_json = load_trust_data()
    return Response(json.dumps(trust_data_json))


def normalize(data, max_values):
    """
    Normalizes the democracy scores based on the max values of each score type
    If there is no score for that score type, it just leaves it as is
    """
    for score_type in data:
        if data[score_type] == "":
            continue
        if float(max_values[score_type]) != 0:
            data[score_type] = float(data[score_type]) / float(max_values[score_type])
    return data
