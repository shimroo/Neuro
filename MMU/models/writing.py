import random
from pymongo import MongoClient
from bson import ObjectId
import time

# def process(input_data):
#     # Placeholder logic for facial model
#     return {"model": "writing", "status": "processed", "input": input_data, "output": random.uniform(0.5, 0.95)}

# import joblib

# class WritingEmotionDetector:
#     def __init__(self, model_path="app/models/writing_emotion_model.pkl"):
#         self.model = joblib.load(model_path)
#         self.labels = ["happy", "sad", "angry", "neutral", "fear"]

#     def predict(self, text_features):
#         # text_features is expected as a list of features extracted from the text
#         prediction = self.model.predict([text_features])[0]
#         return self.labels[prediction]

# writing_model = WritingEmotionDetector()

def process(data):   
    # label = writing_model.predict(input_data)
    label = random.choice(["happy", "sad", "angry", "neutral", "fear"])
    time.sleep(3)
    input_data = data["input_data"]
    jobId = input_data["jobId"]
    print(jobId, input_data, label)

    MONGO_URI = "mongodb+srv://Rafay:n7VvFCnkaiya0wS@neuro.ypxy9.mongodb.net/?retryWrites=true&w=majority&appName=Nuero"
    client = MongoClient(MONGO_URI)

    db = client["test"] 
    task_collection = db["tasks"]  

    filter_criteria = {
        "jobId" : ObjectId(jobId),
        "type": "EMO-WRITING"          
    }

    update_operation = {"$set": {"output": label}}

    result = task_collection.update_one(filter_criteria, update_operation)

    if result.matched_count > 0:
        print(f"Successfully updated {result.modified_count} document(s).")
    else:
        print("No matching document found.")

    client.close()

    return label