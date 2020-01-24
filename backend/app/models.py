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


class Citizen:
    def __init__(self, name, sex="Unknown", ethnicity="Unknown", age="Unknown",
                 lives_in_rural_area=False,
                 has_access_to_electricity=False,
                 has_access_to_water=False,
                 has_access_to_sanitation=False,
                 is_educated=False,
                 poverty_level="Unknown",
                 housing_type="Unknown",
                 ):
        self.name = name
        self.sex = sex
        self.ethnicity = ethnicity
        self.age = age
        self.poverty_level = poverty_level
        self.housing_type = housing_type
        self.traits = {"lives_in_rural_area": lives_in_rural_area,
                       "has_access_to_electricity": has_access_to_electricity,
                       "has_access_to_sanitation": has_access_to_sanitation,
                       "has_access_to_water": has_access_to_water,
                       "is_educated": is_educated,
                       }

    def __str__(self):
        return_string = self.name + "\n"
        return_string += "Age: " + self.age + "\n"
        return_string += "In the " + self.poverty_level + " income bracket\n"
        return_string += "Lives in a(n) " + self.housing_type + "\n"

        if self.traits["has_access_to_water"]:
            return_string += "Has access to clean/fresh water"
        else:
            return_string += "Does not have access to clean/fresh water"
        return_string += "\n"

        if self.traits["has_access_to_electricity"]:
            return_string += "Has access to electricity"
        else:
            return_string += "Does not have access to electricity"
        return_string += "\n"

        if self.traits["has_access_to_sanitation"]:
            return_string += "Has access to sanitation"
        else:
            return_string += "Does not have access to sanitation"
        return_string += "\n"

        if self.traits["is_educated"]:
            return_string += "Has had some education"
        else:
            return_string += "Has not had any education"
        return_string += "\n"

        return_string += "Identifies ethnically as " + self.ethnicity + " and as a " + self.sex

        return return_string


class Population:

    def __init__(self, citizen_list=None):
        if citizen_list is None:
            self.citizen_list = []
        else:
            self.citizen_list = citizen_list
        self.population_size = 0

    def create_citizens(self, number_to_create):
        # citizens are randomly generated and added to citizen list
        for i in range(number_to_create):
            current_citizen = Citizen(str(self.population_size + 1))
            self.assign_demographic_properties(current_citizen)
            self.citizen_list.append(current_citizen)
            self.population_size += 1

    def get_population(self):
        return self.citizen_list

    def assign_demographic_properties(self, citizen):
        # TODO generalize function to take in statistical distributions instead of hardcoding them
        # citizen is randomly assigned demographic properties based on hardcoded distributions
        rural_area = random.randint(0, 100)
        electricity_access = random.randint(0, 100)
        water_access = random.randint(0, 100)
        sanitation_access = random.randint(0, 100)
        educated = random.randint(0, 100)

        if rural_area < 37:
            citizen.traits["lives_in_rural_area"] = True

        if electricity_access < 84:
            citizen.traits["has_access_to_electricity"] = True

        if water_access < 91:
            citizen.traits["has_access_to_water"] = True

        if sanitation_access < 60:
            citizen.traits["has_access_to_sanitation"] = True

        if educated < 91:
            citizen.traits["is_educated"] = True

        return citizen

    def will_support(self, budget_proposal):
        # TODO: make this more efficient aka find a way to not need all these nested ifs
        # for now, hardcoded to match our traits and list of proposed resources
        count = 0
        for citizen in self.citizen_list:

            # track just the needs of this citizen
            needs = [trait for trait in citizen["traits"].keys()
                     if not citizen["traits"][trait]]
            num_of_needs = len(needs)

            if num_of_needs == 0:
                continue
            else:
                num_to_vote = math.ceil(num_of_needs / 2.0)
                cutoff = .8 / num_of_needs

            # for mvp, hardcoded checks
            # check first if it is a need, then check if amount is sufficient
            num_of_needs_met = 0
            for resource, proposal in budget_proposal.items():
                proposal = float(proposal)
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

            if num_of_needs_met >= num_to_vote:
                count += 1

        return count


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

new_pop = Population()
new_pop.create_citizens(20)
for c in new_pop.citizen_list:
    print(str(c))