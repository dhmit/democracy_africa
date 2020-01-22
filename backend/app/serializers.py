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
class CitizenSriealizer(serializers.modelSerializer):
    """
    Serializes a Citizen
    """
