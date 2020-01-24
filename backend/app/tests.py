"""
Tests for the main app.
"""

from django.test import TestCase
from .models import Population
from .models import Citizen

class MainTests(TestCase):
    def test_is_this_on(self):
        """ Trivial test to make sure the testing system is working """
        self.assertTrue(2+2 == 4)

    def setUp(self):
        # Creates three populations:
        # one that will remain empty
        # one that will be randomly filled
        # one that will be filled with Citizens
        # one that will be filled by a list of dicts

        citizen_list = [
            Citizen("Nothing Person"),
            Citizen("One Person", True, False, False, False, False),
            Citizen("Everything Person", True, True, True, True, True),
            Citizen("Two Person", True, True, False, True, True),
            Citizen("Real Person", False, True, False, True, False),
        ]

        fake_citizen_list = [
            {"name": "Nothing Person", "traits": {
                "lives_in_rural_area": False,
                "has_access_to_electricity": False,
                "has_access_to_sanitation": False,
                "has_access_to_water": False,
                "is_educated": False}},
            {"name": "One Person", "traits": {
                "lives_in_rural_area": True,
                "has_access_to_electricity": False,
                "has_access_to_sanitation": False,
                "has_access_to_water": False,
                "is_educated": False}},
            {"name": "Everything Person", "traits": {
                "lives_in_rural_area": True,
                "has_access_to_electricity": True,
                "has_access_to_sanitation": True,
                "has_access_to_water": True,
                "is_educated": True}},
            {"name": "Two Person", "traits": {
                "lives_in_rural_area": True,
                "has_access_to_electricity": True,
                "has_access_to_sanitation": False,
                "has_access_to_water": True,
                "is_educated": True}},
            {"name": "Real Person", "traits": {
                "lives_in_rural_area": False,
                "has_access_to_electricity": True,
                "has_access_to_sanitation": False,
                "has_access_to_water": True,
                "is_educated": False}},
        ]

        self.empty_population = Population()
        self.population_to_fill = Population()
        self.population_with_citizens = Population(citizen_list)
        self.population_with_fake_citizens = Population(fake_citizen_list)

    def test_create_citizens(self):
        empty_population = self.empty_population
        empty_population.create_citizens(0)

        other_population = self.population_to_fill
        other_population.create_citizens(1)

        cits_population = self.population_with_citizens
        cits_population.create_citizens(5)

        fake_cits_population = self.population_with_fake_citizens
        # Creates a list of 5 dictionaries and then 5 Citizen objects
        fake_cits_population.create_citizens(5)

        # Test that the correct number of citizens were created
        self.assertTrue(len(empty_population.citizen_list) == 0)
        self.assertTrue(len(other_population.citizen_list) == 1)
        self.assertTrue(len(cits_population.citizen_list) == 10)
        self.assertTrue(len(fake_cits_population.citizen_list) == 10)

        # Test that the population is in fact a list of citizens (or empty list rather than none)
        self.assertEqual(empty_population.citizen_list, [])
        for citizen in other_population.citizen_list:
            self.assertIsInstance(citizen, Citizen)


