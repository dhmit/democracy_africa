
import pandas as pd


def process_trust_data():
    input_filename = "../data/parsed_data.csv"
    output_filename = "../data/aggregate_trust_data.csv"

    df = pd.read_csv(input_filename)
    district_data = df.groupby(['district', 'isocode']).mean().sort_values(['isocode', 'district'])
    district_data.to_csv(output_filename)


def simplify_trust_data():
    input_filename = "../data/aggregate_trust_data.csv"
    output_filename = "../data/simplified_trust_data.csv"
    df = pd.read_csv(input_filename)
    aggregate_trust_data_dict = df.to_dict()
    value = [0 for i in range (len(aggregate_trust_data_dict["district"]))]
    column = [i for i in range (len(aggregate_trust_data_dict["district"]))]
    trust = dict(zip(column,value))
    trust_and_density_dict = {"district": aggregate_trust_data_dict["district"],
                              "isocode": aggregate_trust_data_dict["isocode"]}
    for column in aggregate_trust_data_dict.keys():
        if "trust" in column:
            for c in aggregate_trust_data_dict[column].keys():
                assert(type(aggregate_trust_data_dict[column][c]) is float)
                trust[c] += aggregate_trust_data_dict[column][c]
    trust_and_density_dict["trust"] = trust
    trust_and_density_dict["exports"] = aggregate_trust_data_dict["exports"]
    new_df = pd.DataFrame.from_dict(trust_and_density_dict)
    new_df.to_csv(output_filename)


if __name__ == "__main__":
    process_trust_data()
    simplify_trust_data()

