# import torch
# import torchaudio
# from transformers import Wav2Vec2ForSequenceClassification, Wav2Vec2Processor
from pymongo import MongoClient
from bson import ObjectId

# def process(input_data):
#     # Placeholder logic for facial model
#     return {"model": "audio", "status": "processed", "input": input_data, "output": random.uniform(0.5, 0.95)}

import torch
import torchaudio
from transformers import Wav2Vec2ForSequenceClassification, Wav2Vec2Processor

class AudioEmotionDetector:
    def __init__(self, model_path="audio_emotion_model"):
        self.processor = Wav2Vec2Processor.from_pretrained(model_path)
        self.model = Wav2Vec2ForSequenceClassification.from_pretrained(model_path)
        self.labels = ["happy", "sad", "angry", "neutral", "fear"]

    def predict(self, audio_path):
        waveform, _ = torchaudio.load(audio_path)
        inputs = self.processor(waveform, sampling_rate=16000, return_tensors="pt", padding=True)
        with torch.no_grad():
            logits = self.model(**inputs).logits
        predicted_class = logits.argmax(dim=-1).item()
        return self.labels[predicted_class]


audio_model = AudioEmotionDetector()

def process(audio_path):

    label = audio_model.predict(audio_path)

    MONGO_URI = "mongodb+srv://jasirhkhan:V3exi6IsPoiU9pED@cluster0.gb3yy.mongodb.net/LOL?retryWrites=true&w=majority&appName=Cluster0"
    client = MongoClient(MONGO_URI)

    db = client["LOL"]  
    task_collection = db["jobs"]  

    filter_criteria = {
        "_id": ObjectId("678986a36e5b6b098fe4c2b7"),  
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
