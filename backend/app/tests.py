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
        # and one that will be filled with a predetermined data_set

        self.empty_population = Population()
        self.population_to_fill = Population()

    def test_create_citizens(self):
        self.empty_population.create_citizens(0)
        empty_population = self.empty_population

        self.population_to_fill.create_citizens(1)
        other_population = self.population_to_fill

        # Test that the correct number of citizens were created
        self.assertTrue(len(empty_population) == 0)
        self.assertTrue(len(other_population) == 1)

        # Test that the population is in fact a list of citizens (or empty list rather than none)
        self.assertIsNotNone(empty_population.citizen_list)
        self.assertIsEqual(empty_population.citizens_list, [])
        self.assertIsInstance(other_population.citizen_list[0], Citizen)

