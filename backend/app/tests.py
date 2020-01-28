"""
Django tests
"""

from django.test import TestCase

from config.selenium import SeleniumTestCase

from .models import Population
from .models import Citizen
from .views import load_democracy_data, normalize


class DjangoTests(TestCase):
    """
    Tests for the models of Citizen and Population
    """

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
        """
        Test the create_citizens function
        :return: Nothing
        """
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
        self.assertEqual(len(empty_population.citizen_list), 0)
        self.assertEqual(len(other_population.citizen_list), 1)
        self.assertEqual(len(cits_population.citizen_list), 10)
        self.assertEqual(len(fake_cits_population.citizen_list), 10)

        # Test that the population is in fact a list of citizens (or empty list rather than none)
        self.assertEqual(empty_population.citizen_list, [])
        for citizen in other_population.citizen_list:
            self.assertIsInstance(citizen, Citizen)

    def test_will_support(self):
        """
        Tests the will_support function
        :return:
        """
        # Note: not going to test the randomly generated one, yet, due to the randomness factor
        empty_population = self.empty_population
        cits_population = self.population_with_citizens
        fake_cits_population = self.population_with_fake_citizens

        sample_budget_1 = {
            "infrastructure": "0",
            "electricity": "0",
            "sanitation": ".9",
            "water": "0",
            "education": "0"
        }

        sample_budget_2 = {
            "infrastructure": "0",
            "electricity": "0",
            "sanitation": "0",
            "water": "0",
            "education": "0"
        }

        sample_budget_3 = {
            "infrastructure": "0",
            "electricity": "0",
            "sanitation": ".75",
            "water": ".25",
            "education": "0"
        }

        sample_budget_4 = {
            "infrastructure": ".2",
            "electricity": ".2",
            "sanitation": ".2",
            "water": ".2",
            "education": ".2"
        }

        sample_budget_5 = {
            "infrastructure": ".3",
            "electricity": ".2",
            "sanitation": ".1",
            "water": ".4",
            "education": "0"
        }

        cit_pop_results = []
        fake_cit_pop_results = []

        cit_pop_expected_results = [1, 0, 2, 2, 2]
        for budget in [
            sample_budget_1, sample_budget_2, sample_budget_3, sample_budget_4, sample_budget_5
        ]:
            empty_pop_result = empty_population.will_support(budget)
            self.assertEqual(empty_pop_result, 0)

            cit_pop_results.append(cits_population.will_support(budget))
            fake_cit_pop_results.append(fake_cits_population.will_support(budget))

        for i in range(5):
            self.assertEqual(cit_pop_expected_results[i], cit_pop_results[i])
            self.assertEqual(cit_pop_expected_results[i], fake_cit_pop_results[i])

    def test_loading_democracy_data(self):
        """
        Tests for democracy heat map backend
        :return:
        """
        democracy_data, max_values = load_democracy_data()
        max_value_headers = [
            'v2x_polyarchy', 'v2x_partipdem', 'v2x_freexp_altinf', 'v2x_cspart',
            'v2xel_locelec', 'v2elboycot', 'v2lpname', 'v2slpname', 'v2tlpname',
            'v2psnatpar', 'v2excrptps', 'v2juaccnt', 'v2svstterr', 'v2meharjrn',
            'v2peprisch', 'v2pesecsch', 'v2smonex', 'e_migdppc', 'e_mipopula',
            'gdpcapl', 'ethfrac', 'relfrac', 'numlang', 'colbrit', 'colfra',
            'gdpcap_currusd', 'adultliteracy', 'elecaccessrur'
        ]
        # Assures that max_value has all of the score types
        self.assertEqual(max_value_headers, list(max_values.keys()))

        # Assures that max_value does not have any empty strings as the max value
        for score_type in max_values:
            self.assertNotEqual(max_values[score_type], "")

        # Change it to include other missing countries
        # Assures that all 54 countries are in the data
        # self.assertEqual(54, len(democracy_data))

        # Once all years get added in, this test will pass
        # Assures that each country data has the correct keys and has years from 1981 - 2018
        for country_data in democracy_data:
            self.assertEqual(
                list(country_data.keys()),
                ["democracy_scores", "country_name", "country_text_id"]
            )
            # Eritrea became an independent nation in 1993
            if country_data["country_name"] == "Eritrea":
                self.assertEqual(
                    list(country_data["democracy_scores"].keys()),
                    [str(i) for i in range(1993, 2019)]
                )
            # South Sudan became an independent nation in 2011
            elif country_data["country_name"] == "South Sudan":
                self.assertEqual(
                    list(country_data["democracy_scores"].keys()),
                                 [str(i) for i in range(2011, 2019)])
            else:
                self.assertEqual(list(country_data["democracy_scores"].keys()),
                                 [str(i) for i in range(1981, 2019)])

    def test_normalize(self):
        """
        Tests the normalize function for normalizing democracy scores
        :return:
        """
        test_data = {"a": 93, "b": 64, "c": 21, "d": 5}
        test_max_values = {"a": 100, "b": 80, "c": 30, "d": 6}

        expected_normalized_data = {"a": 0.93, "b": 0.8, "c": 0.7, "d": 0.83333333333333}
        actual_normalized_data = normalize(test_data, test_max_values)
        for k in test_data:
            self.assertAlmostEqual(actual_normalized_data[k], expected_normalized_data[k])


class SeleniumTests(SeleniumTestCase):
    def test_democracy_viz_year_select(self):
        self.get('/democracy_viz/')

        # just check that the svg is there
        self.el('svg')

        # get the year select element
        year_select = self.el('#year-select')
        year_select.click()
        self.headed_sleep(2)

        # get the option and click it
        option_el = year_select.find_element_by_id('year-option-1999')
        option_el.click()
        year_select.click()
        self.headed_sleep(5)

        # TODO: check that something reasonable happened...

        self.check_log_for_errors()

