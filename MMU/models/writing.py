from sklearn.externals import joblib

class WritingEmotionDetector:
    def __init__(self, model_path="writing_emotion_model.pkl"):
        self.model = joblib.load(model_path)
        self.labels = ["happy", "sad", "angry", "neutral", "fear"]

    def predict(self, text_features):
        # text_features is expected as a list of features extracted from the text
        prediction = self.model.predict([text_features])[0]
        return self.labels[prediction]

writing_model = WritingEmotionDetector()

def process(input_data):
    return writing_model.predict(input_data)