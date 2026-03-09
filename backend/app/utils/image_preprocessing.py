import torch
import torchvision.transforms as transforms
from PIL import Image
import torchxrayvision as xrv


# Load model once
model = xrv.models.DenseNet(weights="densenet121-res224-all")
model.eval()

labels = model.pathologies


def analyze_xray(image_path):

    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor()
    ])

    # convert to GRAYSCALE (1 channel)
    image = Image.open(image_path).convert("L")

    image = transform(image)

    # add batch dimension
    image = image.unsqueeze(0)

    with torch.no_grad():
        preds = model(image)[0]

    threshold = 0.5
    findings = []

    for label, prob in zip(labels, preds):
        if prob.item() > threshold:
            findings.append(label)

    overall_signal = float(torch.max(preds).item())

    return {
        "image_findings": findings,
        "overall_signal": overall_signal
    }