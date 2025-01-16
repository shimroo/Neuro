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


# Initialize the model globally to avoid repeated loading
audio_model = AudioEmotionDetector()

def process(audio_path):
    return audio_model.predict(audio_path)
