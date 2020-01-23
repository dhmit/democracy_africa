"""
These classes describe one way of entering into the web site.
"""

from pathlib import Path
import json

from rest_framework.decorators import api_view
from rest_framework.response import Response
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
    return Response({"yay": 0.5,
                     "nay": 0.5,})


@api_view(['GET'])
def population(request):
    """
    Load Africa map GeoJSON for frontend
    """
    population_obj = Population()
    serializer = PopulationSerializer(instance=population_obj)
    return Response(serializer.data)

