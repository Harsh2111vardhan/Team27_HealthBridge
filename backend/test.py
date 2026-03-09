import joblib

cols = joblib.load("backend/app/data/symptom_columns.pkl")

print(len(cols))
print(cols[:30])