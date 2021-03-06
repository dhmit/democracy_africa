"""
Models for the democracy_africa app.
"""
# from django.db import models
import random

# Demographics from Afrobarometer 2016/2018 results
# https://www.afrobarometer.org/online-data-analysis/analyse-online?fbclid=IwAR1iKKoydnKdD0UTDPIqH_PEn6bJuJjYPuVvOA657hrNaN6HHsfpp6vxBpg
africa_demographics_by_country = {
    'Botswana': {
        'electricity_access': 93.2,
        'rural_households': 31.0,
        'piped_water_access': 90.1,
        'sewage_system_access': 41.7,
        'some_formal_education': 88.8,
    },
    'Cameroon': {
        'electricity_access': 78.0,
        'rural_households': 47.6,
        'piped_water_access': 75.7,
        'sewage_system_access': 49.1,
        'some_formal_education': 88.3,
    },
    'Ghana': {
        'electricity_access': 91.3,
        'rural_households': 45.6,
        'piped_water_access': 85.6,
        'sewage_system_access': 43.5,
        'some_formal_education': 84.1,
    },
    'Guinea': {
        'electricity_access': 32.2,
        'rural_households': 67.5,
        'piped_water_access': 24.0,
        'sewage_system_access': 10.4,
        'some_formal_education': 58.0,
    },
    'Kenya': {
        'electricity_access': 74.8,
        'rural_households': 64.0,
        'piped_water_access': 40.8,
        'sewage_system_access': 21.6,
        'some_formal_education': 93.0,
    },
    'Nigeria': {
        'electricity_access': 83.3,
        'rural_households': 56.5,
        'piped_water_access': 38.5,
        'sewage_system_access': 35.1,
        'some_formal_education': 92.6,
    },
    'South Africa': {
        'electricity_access': 94.2,
        'rural_households': 31.2,
        'piped_water_access': 78.3,
        'sewage_system_access': 62.7,
        'some_formal_education': 92.6,
    },
    'Sudan': {
        'electricity_access': 76.3,
        'rural_households': 62.2,
        'piped_water_access': 58.4,
        'sewage_system_access': 20.3,
        'some_formal_education': 91.2,
    },
    'Tanzania': {
        'electricity_access': 55.5,
        'rural_households': 66.8,
        'piped_water_access': 38.8,
        'sewage_system_access': 5.4,
        'some_formal_education': 88.2,
    },
    'Uganda': {
        'electricity_access': 35.3,
        'rural_households': 75.1,
        'piped_water_access': 25.0,
        'sewage_system_access': 15.5,
        'some_formal_education': 88.7,
    }
}


class Citizen:
    """
    Class that models a Person in the population. Attributes are randomly generated using
    data from the distribution at the bottom (hard coded the values rather than accessing them
    for now).
    """

    def __init__(self, name):
        self.name = name
        self.province = ""
        self.traits = {}
        self.will_support = False

    def __str__(self):
        """
        Just to print out information on the Citizen for debugging, no actual use
        :return: String representation of the Citizen
        """
        return_string = self.name + "\n" + str(self.traits)

        return return_string


class Population:
    """
    Model for an entire population. Creates the citizens and stores them in a list.
    """

    def __init__(self, citizen_list=None, country="South Africa"):
        if citizen_list is None:
            self.citizen_list = []
            self.population_size = 0
        else:
            self.citizen_list = citizen_list
            self.population_size = len(citizen_list)
        self.country = country
        self.population_size = 0

    def create_citizens_campaign_game(self, number_to_create, demographic_data=None):
        """
        Citizens are randomly generated (from the distribution) and added to citizen list
        based on demographic data of provinces
        :param number_to_create: Number of citizens to make
        :param demographic_data: demographic data to base citizen creation on
        :return: Nothing, just saves it to a class attribute
        """
        provinces = demographic_data["provinces"]
        country_population = sum([province['population'] for province in provinces])
        for province in provinces:
            province['population'] = round(number_to_create * (province['population'] /
                                                               country_population))
        for k, province in enumerate(provinces):
            people_to_create = province['population'] if k < len(provinces) - 1 \
                else number_to_create - len(self.citizen_list)
            for i in range(people_to_create):
                current_citizen = Citizen(str(self.population_size + 1))
                current_citizen.province = province['name']

                for topic in province['topic_preferences']:
                    preference_choice = random.randint(0, 100)
                    accumulate = 0

                    for j, percent in enumerate(topic['preferences']):
                        accumulate += percent
                        if preference_choice <= accumulate:
                            # The data in the JSON file goes from bad to good
                            # So if the government isn't giving you something, you would want it.
                            current_citizen.traits[topic['name']] = 5 - j
                            break
                self.citizen_list.append(current_citizen)
                self.population_size += 1

    def create_citizens_budget_sim(self, number_to_create):
        """
        citizens are randomly generated (from the distribution) and added to citizen list
        :param number_to_create: Number of citizens to make
        :return: Nothing, just saves it to a class attribute
        """
        for i in range(number_to_create):
            current_citizen = Citizen(str(self.population_size + 1))
            self.assign_demographic_properties(current_citizen)
            self.citizen_list.append(current_citizen)
            self.population_size += 1

    def assign_demographic_properties(self, citizen):
        """
        citizen is randomly assigned demographic properties based on hardcoded distributions
        :param citizen: Takes in a default citizen object (has name, but all properties are false)
        :return: The citizen with its new values, if it was assigned any
        """
        # TODO generalize function to take in statistical distributions instead of hardcoding them
        rural_area = random.randint(0, 100)
        electricity_access = random.randint(0, 100)
        water_access = random.randint(0, 100)
        sanitation_access = random.randint(0, 100)
        educated = random.randint(0, 100)

        citizen.traits["lives_in_rural_area"] = rural_area < \
            africa_demographics_by_country[self.country]["rural_households"]

        citizen.traits["has_access_to_electricity"] = electricity_access < \
            africa_demographics_by_country[self.country]["electricity_access"]

        citizen.traits["has_access_to_water"] = water_access < \
            africa_demographics_by_country[self.country]["piped_water_access"]

        citizen.traits["has_access_to_sanitation"] = sanitation_access <\
            africa_demographics_by_country[self.country]["sewage_system_access"]

        citizen.traits["is_educated"] = educated <\
            africa_demographics_by_country[self.country]["some_formal_education"]

        return citizen


class StatisticalDistributions:
    """
    Considering using a class or function that will allow for easily adding and working with real
    life distributions of certain traits. Currently these are all hardcoded and unused (the values
    are used, but by just hardcoding magic numbers into the assign_demographic_properties function
    """
    # TODO: Once we determine how we will use the simulation, make this class into a usable way
    #  to gather real life distributions of usable data that can then be accessed by the
    #  Population class
    def __init__(self):
        self.stats = {
            'housing': {
                'formal dwelling': .776,
                'informal dwelling': 13.6,
                'traditional dwelling': 7.9,
                'Other': .9
            },
            'sex': {
                'male': .482,
                'female': .518
            },
            'education': {
                'none': .086,
                'some primary': .123,
                'completed primary': .046,
                'some secondary': .339,
                'grade 12': .285,
                'higher': .121
            },
            'water_access': {
                'none': .088,
                'outside the yard': .179,
                'inside dwelling/yard': .734
            },
            'housing_tenure': {
                'own/paid off': .413,
                'own/not paid off': .118,
                'rent': .25,
                'rent-free': .186
            },
            'refuse_disposal': {
                'weekly by local authority': .621,
                'local authority': .015,
                'communal dump': .019,
                'own dump': .282,
                'no disposal': .054
            },
            'toilet_access': {
                'flush w/ sewage system': .57,
                'flush w/ septic tank': .031,
                'pit w/ ventilation': .088,
                'pit w/o ventilation': .193,
                'chemical toilet': .025,
                'bucket toilet': .021,
                'none': .052
            },
            'electricity_access': {
                'yes': .842,
                'no': .158
            },
            'house_location': {
                'rural': .357,
                'urban': .643
            }
        }
