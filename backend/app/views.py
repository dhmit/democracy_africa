"""
These classes describe one way of entering into the web site.
"""

from pathlib import Path
import json

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


def load_democracy_data() -> dict:
    """
    Read the CSV file of the democracy scores in Africa from disk
    and return a dict of the parsed json
    """
    filename = 'lieberman_afr_data.csv'
    path = Path(settings.BACKEND_DATA_DIR, filename)
    with open(path, encoding='utf-8') as democracy_score_file:
        democracy_data_string = democracy_score_file.read()
    return json.loads('{"hi": 2}')


@api_view(['GET'])
def democracy_score_json(request):
    """
    Load Africa map GeoJSON for frontend
    """
    democracy_data = load_democracy_data()
    return Response(democracy_data)
