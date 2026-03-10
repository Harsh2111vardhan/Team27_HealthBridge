import json
import os
import joblib
import pandas as pd


def load_json(path):

    if not os.path.exists(path):
        raise FileNotFoundError(f"File not found: {path}")

    with open(path, "r") as f:
        return json.load(f)


def load_csv(path):

    if not os.path.exists(path):
        raise FileNotFoundError(f"File not found: {path}")

    return pd.read_csv(path)


def load_model(path):

    if not os.path.exists(path):
        raise FileNotFoundError(f"Model file not found: {path}")

    return joblib.load(path)