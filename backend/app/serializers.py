"""
Serializers take models or other data structures and present them
in ways that can be transported across the backend/frontend divide, or
allow the frontend to suggest changes to the backend/database.
"""
from rest_framework import serializers


class CitizenSerializer(serializers.Serializer):
    """Serializes citizens class and its related attributes"""
    name = serializers.ReadOnlyField()
    province = serializers.ReadOnlyField()
    traits = serializers.ReadOnlyField()
    will_support = serializers.ReadOnlyField()

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
