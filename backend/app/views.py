"""
These classes describe one way of entering into the web site.
"""

from pathlib import Path
import json

from rest_framework.decorators import api_view
from rest_framework.response import Response

from django.conf import settings

@api_view(['GET'])
def africa_map_geojson(request):
    """
    Load Africa map GeoJSON for frontend
    """
    filename = 'africa.geo.json'
    path = Path(settings.BACKEND_DATA_DIR, filename)
    with open(path, encoding='utf-8') as africa_geojson_file:
        africa_geojson_string = africa_geojson_file.read()

    africa_geojson = json.loads(africa_geojson_string)
    print(africa_geojson)

    return Response(africa_geojson)
