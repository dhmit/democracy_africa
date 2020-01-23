"""
Serializers take models or other data structures and present them
in ways that can be transported across the backend/frontend divide, or
allow the frontend to suggest changes to the backend/database.
"""
from rest_framework import serializers
from .models import (
    Citizen,
)

#  TODO: implement me!
# class CitizenSerializer(serializers.modelSerializer):
#     """
#     Serializes a Citizen
#     """
#
#     class Meta:
#         model = Citizen
#         fields = (
#             'id',
#             'name',
#         )


class PopulationSerializer(serializers.Serializer):
    """ Serializes population class """
    get_population = serializers.ReadOnlyField()

    def create(self, validated_data):
        """ We will not create new objects using this serializer """

    def update(self, instance, validated_data):
        """ We will not update data using this serializer """
