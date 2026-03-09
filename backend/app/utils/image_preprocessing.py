import torch
import torchxrayvision as xrv
import cv2
import numpy as np


model = xrv.models.DenseNet(weights="densenet121-res224-all")


def preprocess_image(image_path):

    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)

    if img is None:
        raise ValueError("Image could not be loaded")

    img = cv2.resize(img, (224, 224))

    img = img.astype(np.float32) / 255.0

    img = np.expand_dims(img, axis=0)
    img = np.expand_dims(img, axis=0)

    img = torch.from_numpy(img)

    return img


def analyze_xray(image_path):

    img = preprocess_image(image_path)

    with torch.no_grad():
        preds = model(img)

    probs = preds.numpy()[0]

    diseases = model.pathologies

    findings = []

    max_prob = 0

    for i, p in enumerate(probs):

        if p > 0.5:
            findings.append(diseases[i])

        if p > max_prob:
            max_prob = p

    return findings, float(max_prob)