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


def load_country_demographics(filename, demographic, district_demographics):
    path = Path(settings.BACKEND_DATA_DIR, filename)
    with open(path, encoding='utf-8') as file:
        reader = csv.reader(file, delimiter=',')
        headers = next(reader)
        headers = [header.replace("\n", "") for header in headers]  # removes any newline
        # characters in the headers
        for header in headers:
            if header != "" and header != "\ufeff":
                if header not in district_demographics.keys():
                    district_demographics[header] = {}
                district_demographics[header][demographic] = {}
        next_line = next(reader, "end of the line")
        while next_line != "end of the line":
            category = next_line[0]
            for i in range(1, len(headers)):
                if next_line[i] != "" and category != "":
                    district_demographics[headers[i]][demographic][category] = float(next_line[i])
            next_line = next(reader, "end of the line")
    return district_demographics


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


def generate_all_country_demographics():
    district_demographics = {}

    district_demographics = load_country_demographics("language_spoken_in_home.csv", "Language",
                                                      district_demographics)
    district_demographics = load_country_demographics("tribe_or_ethnic_group.csv", "Ethnic Group",
                                                      district_demographics)
    district_demographics = load_country_demographics("occupation_of_respondent.csv", "Occupation",
                                                      district_demographics)
    district_demographics = load_country_demographics("religion_of_respondent.csv", "Religion",
                                                      district_demographics)
    district_demographics = load_country_demographics("kenya_population.csv", "Population",
                                                      district_demographics)
    return district_demographics


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


@api_view(["GET"])
def demographic_population(request):
    kenya_demographics = generate_all_country_demographics()
    population_obj = Population(country="Kenya")
    population_obj.create_demographic_citizens(1000, kenya_demographics)
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
    population_obj.create_citizens_campaign_game(100, campaign_json)
    serializer = PopulationSerializer(instance=population_obj)
    return Response(serializer.data)


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
