# import torch
# import torchaudio
# from transformers import Wav2Vec2ForSequenceClassification, Wav2Vec2Processor
from pymongo import MongoClient
from bson import ObjectId
import random

# class AudioEmotionDetector:
#     def __init__(self, model_path="audio_emotion_model"):
#         self.processor = Wav2Vec2Processor.from_pretrained(model_path)
#         self.model = Wav2Vec2ForSequenceClassification.from_pretrained(model_path)
#         self.labels = ["happy", "sad", "angry", "neutral", "fear"]

#     def predict(self, audio_path):
#         waveform, _ = torchaudio.load(audio_path)
#         inputs = self.processor(waveform, sampling_rate=16000, return_tensors="pt", padding=True)
#         with torch.no_grad():
#             logits = self.model(**inputs).logits
#         predicted_class = logits.argmax(dim=-1).item()
#         return self.labels[predicted_class]


# audio_model = AudioEmotionDetector()

def process(data):

    # label = audio_model.predict(audio_path)
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
        "type": "EMO-VOICE"          
    }

    update_operation = {"$set": {"output": label}}

    result = task_collection.update_one(filter_criteria, update_operation)

    if result.matched_count > 0:
        print(f"Successfully updated {result.modified_count} document(s).")
    else:
        print("No matching document found.")

    client.close()

    return label
