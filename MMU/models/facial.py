# import cv2
# import torch
# from torchvision import transforms
# from torchvision.models import resnet18
from pymongo import MongoClient
from bson import ObjectId
import random

# class FacialEmotionDetector:
#     def __init__(self, model_path="facial_emotion_model.pth"):
#         self.model = resnet18(pretrained=False, num_classes=5)
#         self.model.load_state_dict(torch.load(model_path))
#         self.model.eval()
#         self.labels = ["happy", "sad", "angry", "neutral", "fear"]
#         self.transform = transforms.Compose([
#             transforms.ToPILImage(),
#             transforms.Resize((224, 224)),
#             transforms.ToTensor()
#         ])

#     def predict(self, image_path):
#         image = cv2.imread(image_path)
#         image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
#         input_tensor = self.transform(image).unsqueeze(0)
#         with torch.no_grad():
#             logits = self.model(input_tensor)
#         predicted_class = logits.argmax(dim=-1).item()
#         return self.labels[predicted_class]
    
# facial_model = FacialEmotionDetector()

def process(data):

    # label = facial_model.predict(input_data)
    label = random.choice(["happy", "sad", "angry", "neutral", "fear"])
    input_data = data["input_data"]
    jobId = input_data["jobId"]
    print(jobId, input_data, label)

    MONGO_URI = "mongodb+srv://Rafay:n7VvFCnkaiya0wS@neuro.ypxy9.mongodb.net/?retryWrites=true&w=majority&appName=Nuero"
    client = MongoClient(MONGO_URI)

    db = client["test"] 
    task_collection = db["tasks"]  

    filter_criteria = {
        "jobId" : ObjectId(jobId),
        "type": "EMO-FACIAL"          
    }

    update_operation = {"$set": {"output": label}}

    result = task_collection.update_one(filter_criteria, update_operation)

    if result.matched_count > 0:
        print(f"Successfully updated {result.modified_count} document(s).")
    else:
        print("No matching document found.")

    client.close()

    return label
