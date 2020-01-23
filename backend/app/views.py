"""
These classes describe one way of entering into the web site.
"""

from pathlib import Path
import json
import math

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
from .models import Citizen
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

    yay = 0
    # TODO: for each citizen, call will_vote() and accumulate the yays and nays
    for citizen in population:

        # track just the needs of this citizen
        needs = [trait for trait in citizen["traits"].keys()
                 if not citizen["traits"][trait]]
        num_of_needs = len(needs)

        # if person has no needs they wont vote
        if num_of_needs == 0:
            continue
        else:
            num_to_vote = math.ceil(num_of_needs / 2.0)
            cutoff = .8 / num_of_needs

        # check first if it is a need, then check if amount is sufficient
        num_of_needs_met = 0
        for resource, proposal in budget.items():
            proposal = float(proposal)
            # if proposed amount is 0 automatically satisfies no needs 
            if proposal == 0:
                continue
            elif resource == 'infrastructure' and 'lives_in_rural_area' in needs:
                if proposal >= cutoff:
                    num_of_needs_met += 1
            elif resource == 'education' and 'is_educated' in needs:
                if proposal >= cutoff:
                    num_of_needs_met += 1
            elif resource == 'water' and 'has_access_to_water' in needs:
                if proposal >= cutoff:
                    num_of_needs_met += 1
            elif resource == 'sanitation' and 'has_access_to_sanitation' in needs:
                if proposal >= cutoff:
                    num_of_needs_met += 1
            elif resource == 'electricity' and 'has_access_to_electricity' in needs:
                if proposal >= cutoff:
                    num_of_needs_met += 1

        if num_of_needs_met >= num_to_vote:
            yay += 1

    return Response({
        "will_support": yay,
    })


@api_view(['GET'])
def population(request):
    """
    Load Africa map GeoJSON for frontend
    """
    population_obj = Population()
    population_obj.create_citizens(100)
    serializer = PopulationSerializer(instance=population_obj)
    return Response(serializer.data)

