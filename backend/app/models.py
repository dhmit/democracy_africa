"""
Models for the democracy_africa app.
"""
# from django.db import models
# TODO: implement me!
import random
import math


class Citizen:
    """
    Class that models a Person in the population. Attributes are randomly generated using
    data from the distribution at the bottom (hard coded the values rather than accessing them
    for now).
    """

    # pylint: disable=too-many-arguments
    def __init__(self, name,
                 lives_in_rural_area=False,
                 has_access_to_electricity=False,
                 has_access_to_sanitation=False,
                 has_access_to_water=False,
                 is_educated=False,
                 ):
        self.name = name
        self.traits = {"lives_in_rural_area": lives_in_rural_area,
                       "has_access_to_electricity": has_access_to_electricity,
                       "has_access_to_sanitation": has_access_to_sanitation,
                       "has_access_to_water": has_access_to_water,
                       "is_educated": is_educated,
                       }

    def __str__(self):
        """
        Just to print out information on the Citizen for debugging, no actual use
        :return: String representation of the Citizen
        """
        return_string = self.name + "\n"

        if self.traits["lives_in_rural_area"]:
            return_string += "Lives in a(n) rural area\n"
        else:
            return_string += "Lives in a(n) urban area\n"

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

        return return_string


class Population:
    """
    Model for an entire population. Creates the citizens and stores them in a list.
    """

    def __init__(self, citizen_list=None):
        if citizen_list is None:
            self.citizen_list = []
        else:
            self.citizen_list = citizen_list
        self.population_size = 0

    def create_citizens(self, number_to_create):
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
        """
        Determines whether a citizen will support the proposed budget. Right now it is hardcoded
        with the following logic: a person's needs are all of the attributes that are currently
        false. A need is met by the budget if the proportion for that need is greater than
        .75/# of needs. The person will support the budget if their # of needs/2, rounded up,
        are met
        :param budget_proposal: Budget determined by the user in the frontend, uses proportions
        that are <= 1
        :return: The number of citizens that support the budget
        """
        # TODO: make this more efficient aka find a way to not need all these nested ifs
        # TODO: Considerin gadding this to the frontend (minimize the # of requests) and will
        #  allow for auto updating the user rather than them pressing a button
        count = 0
        for citizen in self.citizen_list:
            if isinstance(citizen, Citizen):
                needs = [trait for trait in citizen.traits.keys()
                         if not citizen.traits[trait]]
            else:
                needs = [trait for trait in citizen["traits"].keys()
                         if not citizen["traits"][trait]]

            num_of_needs = len(needs)

            if num_of_needs == 0:
                continue

            num_to_vote = math.ceil(num_of_needs / 2.0)
            cutoff = .75 / num_of_needs

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
