import pandas as pd

df = pd.read_csv("app/data/symptom2disease.csv")

print(df.columns)
print(df.head())