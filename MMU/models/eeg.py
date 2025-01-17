import random
from pymongo import MongoClient
from bson import ObjectId
import time
# def process(input_data):
#     # Placeholder logic for facial model
#     return {"model": "eeg", "status": "processed", "input": input_data, "output": random.uniform(0.5, 0.95)}

# import numpy as np
# import joblib

# class EEGEmotionDetector:
#     def __init__(self, model_path="eeg_emotion_model.pkl"):
#         self.model = joblib.load(model_path)
#         self.labels = ["happy", "sad", "angry", "neutral", "fear"]

#     def predict(self, eeg_data):
#         # eeg_data is expected as a numpy array of shape (n_channels, time_steps)
#         features = self._extract_features(eeg_data)
#         prediction = self.model.predict([features])[0]
#         return self.labels[prediction]

#     def _extract_features(self, eeg_data):
#         # Simple feature extraction: mean, std across channels
#         return np.concatenate([eeg_data.mean(axis=1), eeg_data.std(axis=1)])


# # Initialize the model globally to avoid repeated loading
# eeg_model = EEGEmotionDetector()

def process(data):
    # label = eeg_model.predict(np.array(input_data))
    label = random.choice(["happy", "sad", "angry", "neutral", "fear"])
    time.sleep(5)
    input_data = data["input_data"]
    jobId = input_data["jobId"]
    print(jobId, input_data, label)

    MONGO_URI = "mongodb+srv://Rafay:n7VvFCnkaiya0wS@neuro.ypxy9.mongodb.net/?retryWrites=true&w=majority&appName=Nuero"
    client = MongoClient(MONGO_URI)

    db = client["test"] 
    task_collection = db["tasks"]  

    filter_criteria = {
        "jobId" : ObjectId(jobId),
        "type": "EMO-EEG"          
    }

    update_operation = {"$set": {"output": label}}

    result = task_collection.update_one(filter_criteria, update_operation)

    if result.matched_count > 0:
        print(f"Successfully updated {result.modified_count} document(s).")
    else:
        print("No matching document found.")

    client.close()

    return label
