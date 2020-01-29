"""
Serializers take models or other data structures and present them
in ways that can be transported across the backend/frontend divide, or
allow the frontend to suggest changes to the backend/database.
"""
from rest_framework import serializers

# from .models import (
#     Citizen,
# )

#  TODO: implement once we want to move to Django models, but not yet!

class CitizenSerializer(serializers.Serializer):
    """Serializes citizens class and its related attributes"""
    name = serializers.ReadOnlyField()
    lives_in_rural_area = serializers.ReadOnlyField()
    has_access_to_electricity = serializers.ReadOnlyField()
    has_access_to_water = serializers.ReadOnlyField()
    has_access_to_sanitation = serializers.ReadOnlyField()
    is_educated = serializers.ReadOnlyField()
    traits = serializers.ReadOnlyField()

    def create(self, validated_data):
        """ We will not create new objects using this serializer """

    def update(self, instance, validated_data):
        """ We will not update data using this serializer """


class PopulationSerializer(serializers.Serializer):
    """ Serializes population class """
    citizen_list = CitizenSerializer(many=True)

    def create(self, validated_data):
        """ We will not create new objects using this serializer """

    def update(self, instance, validated_data):
        """ We will not update data using this serializer """
