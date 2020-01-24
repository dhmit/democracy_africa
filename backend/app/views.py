"""
These classes describe one way of entering into the web site.
"""

from pathlib import Path
import json
import math

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
    Takes in budget allocation and population
    and returns the number of people who will support the budget
    """
    budget = request.data.get('budget')
    sample_population = Population(request.data.get('population'))
    supportive_people = sample_population.will_support(budget)

    return Response({
        "will_support": supportive_people,
    })


@api_view(['GET'])
def population(request):
    """
    Generates a population of Citizen objects that then get passed into the frontend
    """
    population_obj = Population()
    population_obj.create_citizens(1000)
    serializer = PopulationSerializer(instance=population_obj)
    return Response(serializer.data)
