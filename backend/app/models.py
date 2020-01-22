"""
Models for the democracy_africa app.
"""
# from django.db import models
# TODO: implement me!

"""
WHAT MATTERS: 
- electricity
- water
- access to sanitation
- co-ethnicity **
- type of housing
- urban/rural***

budget allocation, material quality of life
data set: afrobarometer
"""


# from django.db import models
#
# class Citizen(models.model):
#     name = models.CharField()
#     gender = models.CharField()
#
#     def __str__(self):
#         return f'Citizen: {self.name}'


# TODO: do a simple Python class with properties. Once we have real data, convert to Django models.
class Citizen:
    def __init__(self, id, age, poverty_level, housing_type, house_location, water_access,
                 education_level, electricity_access, toilet_access, refuse_disposal, tenure,
                 coethnicity, sex):
        self.id = id
        self.age = age
        self.education_level = education_level
        self.poverty_level = poverty_level
        self.housing_type = housing_type
        self.house_location = house_location
        self.water_access = water_access
        self.electricity_access = electricity_access
        self.toilet_access = toilet_access
        self.coethnicity = coethnicity
        self.sex = sex
        self.refuse_disposal = refuse_disposal
        self.housing_tenure = tenure

    # Don't think we actually need this, but I already wrote it and didn't want to delete it yet
    # def __str__(self):
    #     returnString = self.id + "\n"
    #     returnString += "Age: " + self.age + "\n"
    #     returnString += "In the " + self.poverty_level + " income bracket\n"
    #     returnString += "Lives in a(n) " + self.housing_type + " in a(n) " + self.house_location + \
    #                     "\n"
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


cit1 = Citizen("Jordan", "apartment", "urban", True, True, True, "Caucasion", "Male")
print(cit1)


class StatisticalDistributions:
    def __init__(self):
        self.housing = {"formal dwelling": .776, "informal dwelling": 13.6,
                        "traditional dwelling": 7.9, "Other": .9}
        self.sex = {"male": .482, "female": .518}
        self.education = {"none": .086, "some primary": .123, "completed primary": .046,
                          "some secondary": .339, "grade 12": .285, "higher": .121}
        self.water_access = {"none": .088, "outside the yard": .179, "inside dwelling/yard": .734}
        self.housing_tenure = {"own/paid off": .413, "own/not paid off": .118, "rent": .25,
                               "rent-free": .186}
        self.refuse_disposal = {"weekly by local authority": .621, "local authority": .015,
                                "communal dump": .019, "own dump": .282, "no disposal": .054}
        self.toilet_access = {"flush w/ sewage system": .57, "flush w/ septic tank": .031,
                              "pit w/ ventilation": .088, "pit w/o ventilation": .193,
                              "chemical toilet": .025, "bucket toilet": .021, "none": .052}
        self.electricity_access = {"yes": .842, "no": .158}
        self.house_location = {"rural": .357, "urban": .643}
