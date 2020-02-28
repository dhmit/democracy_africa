
import pandas as pd


def process_trust_data():
    input_filename = "../data/parsed_data.csv"
    output_filename = "../data/aggregate_trust_data.csv"

    df = pd.read_csv(input_filename)
    district_data = df.groupby(['district', 'isocode']).mean().sort_values(['isocode', 'district'])
    district_data.to_csv(output_filename)


if __name__ == "__main__":
    process_trust_data()

