"""
Tests for the main app.
"""

from django.test import TestCase


class MainTests(TestCase):
    def test_is_this_on(self):
        """ Trivial test to make sure the testing system is working """
        self.assertTrue(2+2 == 4)
