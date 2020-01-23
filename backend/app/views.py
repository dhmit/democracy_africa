"""
These classes describe one way of entering into the web site.
"""

from pathlib import Path
import json

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import (
    Citizen,
)
# from .serializers import (
#     CitizenSerializer,
# )

from django.conf import settings

from .models import Population
from.serializers import PopulationSerializer


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


@api_view(['POST'])
def budget_response(request):
    """
    Takes in budget allocation and citizen
    and returns the percentage of yays and nays
    """
    budget = request.data.get('budget')
    population = request.data.get('population')

    # yay = 0
    # # TODO: for each citizen, call will_vote() and accumulate the yays and nays
    # for citizen in population:
    #     if citizen.will_support():
    #         yay += 1
    #
    return Response({
        "budget" : budget,
        "population": population,
    })


@api_view(['GET'])
def population(request):
    """
    Load Africa map GeoJSON for frontend
    """
    population_obj = Population()
    serializer = PopulationSerializer(instance=population_obj)
    return Response(serializer.data)

