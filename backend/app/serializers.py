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
    """ Serializes analysis class """
    total_and_median_view_time = serializers.ReadOnlyField()
    mean_reading_vs_rereading_time = serializers.ReadOnlyField()
    get_number_of_unique_students = serializers.ReadOnlyField()
    relevant_words_by_question = serializers.ReadOnlyField()
    percent_using_relevant_words_by_question = serializers.ReadOnlyField()
    get_all_heat_maps = serializers.ReadOnlyField()
    all_responses = serializers.ReadOnlyField()
    most_common_words_by_question = serializers.ReadOnlyField()

    def create(self, validated_data):
        """ We will not create new objects using this serializer """

    def update(self, instance, validated_data):
        """ We will not update data using this serializer """
