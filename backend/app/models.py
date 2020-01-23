"""
Models for the democracy_africa app.
"""
# from django.db import models
# TODO: implement me!

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
        has_had_some_education                          //Affects desire for more money to education
    }
    will_support: boolean,
}

"""


class Population:
    pass


# TODO: do a simple Python class with properties. Once we have real data, convert to Django models.
class Citizen:
    def __init__(self, name, lives_in_rural_area, has_access_to_electricity, has_access_to_water,
                 has_access_to_sanitation, has_had_some_education):
        self.name = name
        self.lives_in_rural_area = lives_in_rural_area
        self.has_access_to_electricity = has_access_to_electricity
        self.has_access_to_water = has_access_to_water
        self.has_access_to_sanitation = has_access_to_sanitation
        self.is_educated = has_had_some_education

    def will_support(self, budget_amounts):
        # TODO implement whether someone will support the budget or not based on our discussion
        pass

    # Don't think we actually need this, but I already wrote it and didn't want to delete it yet
    def __str__(self):
        returnString = self.id + "\n"
        returnString += "Age: " + self.age + "\n"
        returnString += "In the " + self.poverty_level + " income bracket\n"
        returnString += "Lives in a(n) " + self.housing_type + " in a(n) " + self.house_location + \
                        "\n"

        if self.water_access:
            returnString += "Has access to clean/fresh water"
        else:
            returnString += "Does not have access to clean/fresh water"
        returnString += "\n"

        if self.electricity_access:
            returnString += "Has access to electricity"
        else:
            returnString += "Does not have access to electricity"
        returnString += "\n"

        if self.sanitation_access:
            returnString += "Has access to sanitation"
        else:
            returnString += "Does not have access to sanitation"
        returnString += "\n"

        returnString += "Identifies ethnically as " + self.coethnicity + " and as a " + self.sex

        return returnString


#
# cit1 = Citizen("Jordan", "apartment", "urban", True, True, True, "Caucasion", "Male")
# print(cit1)

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
