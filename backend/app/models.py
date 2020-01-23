"""
Models for the democracy_africa app.
"""
# from django.db import models
# TODO: implement me!
import random
import math

"""

For the budget allocation, if three needs are met, then the citizen is in favor.
What counts as meets the needs? When a percentage of the budget is allocated to it.

{
    id: String,
    name: String,
    traits: {
        lives_in_rural_area: boolean,                   // affects desire for infrastructure
        has_access_to_electricity: boolean,             // affects desire for furthering electricity
        has_access_to_water: boolean,                   // affects desire for furthering water
        has_access_to_sanitation: boolean,              // affects desire for furthering sanitation
        is_educated                                     // affects desire for more money to education
    }
    will_support: boolean,
}

"""


class Population:

    def __init__(self):
        self.citizen_list = []
        self.population_size = 0
        # Temporary data to be using for the frontend
        self.citizens = [
            {
                "name": "person0",
                "traits": {
                    "lives_in_rural_area": True,
                    "has_access_to_electricity": False,
                    "has_access_to_water": True,
                    "has_access_to_sanitation": False,
                    "is_educated": True,
                },
                "will_support": False,
            },
            {
                "name": "person1",
                "traits": {
                    "lives_in_rural_area": True,
                    "has_access_to_electricity": False,
                    "has_access_to_water": False,
                    "has_access_to_sanitation": False,
                    "is_educated": True,
                },
                "will_support": False,
            },
            {
                "name": "person2",
                "traits": {
                    "lives_in_rural_area": False,
                    "has_access_to_electricity": False,
                    "has_access_to_water": True,
                    "has_access_to_sanitation": True,
                    "is_educated": True,
                },
                "will_support": False,
            },
        ];

    def create_citizens(self, number_to_create):
        for i in range(number_to_create):
            current_citizen = Citizen(str(self.population_size + 1))
            self.assign_demographic_properties(current_citizen)
            self.citizen_list.append(Citizen(str(self.population_size + 1),
                                             False, False, False, False, False))
            self.population_size += 1

    # TODO Need some function that will return the population as a list of citizens
    def get_population(self):
        return self.citizens

    def assign_demographic_properties(self, citizen):
        # TODO generalize function to take in statistical districutions instead of hardcoding them
        a = random.randint(0, 100)
        b = random.randint(0, 100)
        c = random.randint(0, 100)
        d = random.randint(0, 100)
        e = random.randint(0, 100)

        if a < 37:
            citizen.lives_in_rural_area = True
        else:
            citizen.lives_in_rural_area = False

        if b < 84:
            citizen.has_access_to_electricity = True
        else:
            citizen.has_access_to_electricity = False

        if c < 91:
            citizen.has_access_to_water = True
        else:
            citizen.has_access_to_water = False

        if d < 60:
            citizen.has_access_to_sanitation = True
        else:
            citizen.has_access_to_sanitation = False

        if e < 91:
            citizen.is_educated = True
        else:
            citizen.is_educated = False

        return citizen


# TODO: do a simple Python class with properties. Once we have real data, convert to Django models.
class Citizen:
    def __init__(self, name, lives_in_rural_area=False, has_access_to_electricity=False,
                 has_access_to_water=False,
                 has_access_to_sanitation=False, is_educated=False):
        self.name = name
        self.lives_in_rural_area = lives_in_rural_area
        self.has_access_to_electricity = has_access_to_electricity
        self.has_access_to_water = has_access_to_water
        self.has_access_to_sanitation = has_access_to_sanitation
        self.is_educated = is_educated

    # TODO: make this more efficient aka find a way to not need all these nested ifs 
    # for now, hardcoded to match our traits and list of proposed resources
    def will_support(self, budget_proposal):
        # track just the needs of this citizen
        needs = [key for key in vars(self).keys()
                 if type(vars(self)[key]) is bool
                 and not vars(self)[key]]
        num_of_needs = len(needs)
        num_to_vote = math.ceil(num_of_needs/2.0)
        cutoff = .8 / num_of_needs

        # for mvp, hardcoded checks
        # check first if it is a need, then check if amount is sufficient
        num_of_needs_met = 0
        for resource, proposal in budget_proposal.items():
            if resource == 'infrastructure' and 'lives_in_rural_area' in needs:
                if proposal >= cutoff:
                    num_of_needs_met += 1
            elif resource == 'education' and 'is_educated' in needs:
                if proposal >= cutoff:
                    num_of_needs_met += 1
            elif resource == 'water' and 'has_access_to_water' in needs:
                if proposal >= cutoff:
                    num_of_needs_met += 1
            elif resource == 'sanitation' and 'has_access_to_sanitation' in needs:
                if proposal >= cutoff:
                    num_of_needs_met += 1
            elif resource == 'electricity' and 'has_access_to_electricity' in needs:
                if proposal >= cutoff:
                    num_of_needs_met += 1

        return num_of_needs_met >= num_to_vote

    # # Commented out for now because it doesnt align with our current hardcoded citizen traits
    # # Don't think we actually need this, but I already wrote it and didn't want to delete it yet
    # def __str__(self):
    #     returnString = self.id + "\n"
    #     returnString += "Age: " + self.age + "\n"
    #     returnString += "In the " + self.poverty_level + " income bracket\n"
    #     returnString += "Lives in a(n) " + self.housing_type + " in a(n) " + self.house_location
    #
    #     if self.water_access:
    #         returnString += "Has access to clean/fresh water"
    #     else:
    #         returnString += "Does not have access to clean/fresh water"
    #     returnString += "\n"
    #
    #     if self.electricity_access:
    #         returnString += "Has access to electricity"
    #     else:
    #         returnString += "Does not have access to electricity"
    #     returnString += "\n"
    #
    #     if self.sanitation_access:
    #         returnString += "Has access to sanitation"
    #     else:
    #         returnString += "Does not have access to sanitation"
    #     returnString += "\n"
    #
    #     returnString += "Identifies ethnically as " + self.coethnicity + " and as a " + self.sex
    #
    #     return returnString
    #

# # for testing will_support
# cit1 = Citizen("Jordan")
# cit2 = Citizen("Amy", True, True)
# budget1 = {
#     "infrastructure": 0.2,
#     "electricity": 0.2,
#     "water": 0.2,
#     "sanitation": 0.2,
#     "education": 0.2,
# }
#
# budget2 = {
#     "infrastructure": 0.0,
#     "electricity": 0.0,
#     "water": 0.4,
#     "sanitation": 0.35,
#     "education": 0.25,
# }
# print(cit1.will_support(budget1)) # should be true because needs all 5
# print(cit2.will_support(budget1)) # should be false because too low for all three needs
# print(cit1.will_support(budget2)) # should be true because met at least 3
# print(cit2.will_support(budget2)) # should be true because met at least 2

class StatisticalDistributions:
    def __init__(self):
        self.stats = {
            "housing": {"formal dwelling": .776,
                        "informal dwelling": 13.6,
                        "traditional dwelling": 7.9,
                        "Other": .9},
            "sex": {"male": .482,
                    "female": .518},
            "education": {"none": .086,
                          "some primary": .123,
                          "completed primary": .046,
                          "some secondary": .339,
                          "grade 12": .285,
                          "higher": .121},
            "water_access": {"none": .088,
                             "outside the yard": .179,
                             "inside dwelling/yard": .734},
            "housing_tenure": {"own/paid off": .413,
                               "own/not paid off": .118,
                               "rent": .25,
                               "rent-free": .186},
            "refuse_disposal": {"weekly by local authority": .621,
                                "local authority": .015,
                                "communal dump": .019,
                                "own dump": .282,
                                "no disposal": .054},
            "toilet_access": {"flush w/ sewage system": .57,
                              "flush w/ septic tank": .031,
                              "pit w/ ventilation": .088,
                              "pit w/o ventilation": .193,
                              "chemical toilet": .025,
                              "bucket toilet": .021,
                              "none": .052},
            "electricity_access": {"yes": .842,
                                   "no": .158},
            "house_location": {"rural": .357,
                               "urban": .643}}
