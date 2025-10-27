#!/usr/bin/env python
# coding: utf-8

# In[1]:


from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin


# In[2]:


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


# # Dynamic Sign Detection Model - IT21801136

# In[3]:


import os
import numpy as np
from matplotlib import pyplot as plt
import mediapipe as mp
import cv2


# In[4]:


import tempfile


# In[5]:


from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from tensorflow.keras.callbacks import TensorBoard
import json


# In[6]:


from collections import Counter


# In[7]:


mp_holistic = mp.solutions.holistic # Holistic model
mp_drawing = mp.solutions.drawing_utils # Drawing utilities


# In[8]:


def mediapipe_detection(image, model):
    
    if image is None or image.size == 0:
        return image, None
    
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB) # COLOR CONVERSION BGR 2 RGB
    image.flags.writeable = False                  # Image is no longer writeable
    results = model.process(image)                 # Make prediction
    image.flags.writeable = True                   # Image is now writeable 
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR) # COLOR COVERSION RGB 2 BGR
    return image, results


# In[9]:


def draw_styled_landmarks(image, results):
    # Draw face connections
#     mp_drawing.draw_landmarks(image, results.face_landmarks, mp_holistic.FACEMESH_TESSELATION, 
#                              mp_drawing.DrawingSpec(color=(80,110,10), thickness=1, circle_radius=1), 
#                              mp_drawing.DrawingSpec(color=(80,256,121), thickness=1, circle_radius=1)
#                              ) 
    # Draw pose connections
    mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_holistic.POSE_CONNECTIONS,
                             mp_drawing.DrawingSpec(color=(80,22,10), thickness=2, circle_radius=4), 
                             mp_drawing.DrawingSpec(color=(80,44,121), thickness=2, circle_radius=2)
                             ) 
    # Draw left hand connections
    mp_drawing.draw_landmarks(image, results.left_hand_landmarks, mp_holistic.HAND_CONNECTIONS, 
                             mp_drawing.DrawingSpec(color=(121,22,76), thickness=2, circle_radius=4), 
                             mp_drawing.DrawingSpec(color=(121,44,250), thickness=2, circle_radius=2)
                             ) 
    # Draw right hand connections  
    mp_drawing.draw_landmarks(image, results.right_hand_landmarks, mp_holistic.HAND_CONNECTIONS, 
                             mp_drawing.DrawingSpec(color=(245,117,66), thickness=2, circle_radius=4), 
                             mp_drawing.DrawingSpec(color=(245,66,230), thickness=2, circle_radius=2)
                             ) 


# In[10]:


def extract_keypoints(results):
    pose = np.array([[res.x, res.y, res.z, res.visibility] for res in results.pose_landmarks.landmark]).flatten() if results.pose_landmarks else np.zeros(33*4)
#     face = np.array([[res.x, res.y, res.z] for res in results.face_landmarks.landmark]).flatten() if results.face_landmarks else np.zeros(468*3)
    lh = np.array([[res.x, res.y, res.z] for res in results.left_hand_landmarks.landmark]).flatten() if results.left_hand_landmarks else np.zeros(21*3)
    rh = np.array([[res.x, res.y, res.z] for res in results.right_hand_landmarks.landmark]).flatten() if results.right_hand_landmarks else np.zeros(21*3)
    return np.concatenate([pose, lh, rh])


# In[11]:


actions = np.array(['bagayak','kalamanakaru','aapasu','a','welawa','bonawa','u'])
# actions = np.array(['tell','hello','mine','thankyou'])


# In[12]:


log_dir = os.path.join('Logs')
tb_callback = TensorBoard(log_dir=log_dir)


# In[13]:


model = Sequential()
model.add(LSTM(64, return_sequences=True, activation='relu', input_shape=(30, 258)))
model.add(LSTM(128, return_sequences=True, activation='relu'))
model.add(LSTM(64, return_sequences=False, activation='relu'))
model.add(Dense(64, activation='relu'))
model.add(Dense(32, activation='relu'))
model.add(Dense(actions.shape[0], activation='softmax'))


# In[14]:


model.load_weights('action.h5')


# In[15]:


colors = [(245,117,16), (117,245,16), (16,117,245),(245,117,16)]
def prob_viz(res, actions, input_frame, colors):
    output_frame = input_frame.copy()
    for num, prob in enumerate(res):
        cv2.rectangle(output_frame, (0,60+num*40), (int(prob*100), 90+num*40), colors[num], -1)
        cv2.putText(output_frame, actions[num], (0, 85+num*40), cv2.FONT_HERSHEY_SIMPLEX, 1, (255,255,255), 2, cv2.LINE_AA)
        
    return output_frame


# In[16]:


@app.route('/api/data', methods=['POST'])
def post_data():
    
    resArr = [];
    
    if 'fileData' not in request.files:
        return jsonify({'error': 'No file data found.'}), 400

    videoFile = request.files['fileData']
#     label = request.get()

    # Save the video file to a temporary directory
    temp_dir = tempfile.mkdtemp()
    temp_file_path = os.path.join(temp_dir, 'temp_video.mp4')
    videoFile.save(temp_file_path)

    
    sequence = []
    sentence = []
    threshold = 0.8

    cap = cv2.VideoCapture(temp_file_path)
    last_frame = None

    with mp_holistic.Holistic(min_detection_confidence=0.5, min_tracking_confidence=0.5) as holistic:
        while cap.isOpened():
            # Read feed
            ret, frame = cap.read()

            if frame is None:
                break

            # Make detections
            image, results = mediapipe_detection(frame, holistic)

            # 2. Prediction logic
            keypoints = extract_keypoints(results)
            sequence.append(keypoints)
            sequence = sequence[-30:]

            if len(sequence) == 30:
                res = model.predict(np.expand_dims(sequence, axis=0))[0]
                print(actions[np.argmax(res)])
                resArr.append(actions[np.argmax(res)])

            # Break gracefully
            if cv2.waitKey(10) & 0xFF == ord('q'):
                break

        cap.release()
        cv2.destroyAllWindows()
        
    # Remove the temporary directory and the video file
    os.remove(temp_file_path)
    os.rmdir(temp_dir)
    

    counter = Counter(resArr)

    return jsonify({'message': 'Video playback completed.','sign':max(counter, key=counter.get)}), 200
        


# # Vocal Training Model - IT21110016
 
# In[17]:
 
 
import os
import librosa
import numpy as np
from tensorflow.keras.preprocessing.sequence import pad_sequences
import joblib
import nltk
import hashlib
 
# In[18]:
 
 
# Load the trained model from the file
rf_classifier = joblib.load("vocal_training_model10.joblib")
 
 
# In[19]:
 
 
# Define constants for audio processing
SAMPLE_RATE = 44100
NUM_MFCC = 13
MAX_LEN = 500  # Maximum length of audio features
 
# Function to preprocess the audio clip
def preprocess_audio(audio_path):
    # Load the audio file
    audio, _ = librosa.load(audio_path, sr=SAMPLE_RATE, mono=True)
 
    # Normalize the audio to have maximum amplitude of 1
    normalized_audio = audio / np.max(np.abs(audio))
 
    return normalized_audio
 
# Function to extract MFCC features from audio data
def extract_mfcc(audio_data):
    mfcc_features = librosa.feature.mfcc(y=audio_data, sr=SAMPLE_RATE, n_mfcc=NUM_MFCC)
 
    return mfcc_features.T
 
 
# In[20]:
 
 
@app.route('/api/checkVoice', methods=['POST'])
def check_voice():
    try:
        print("Received request to /api/checkVoice")
 
        # Check if file is in request
        if 'fileData' not in request.files:
            print("No fileData in request.files")
            return jsonify({'error': 'No audio file uploaded'}), 400
 
        audio_file = request.files['fileData']
        audio_bytes = audio_file.read()
        audio_file.seek(0)  # reset for later use
 
        audio_hash = hashlib.md5(audio_bytes).hexdigest()
        print(f"Audio file MD5 hash: {audio_hash}")
 
        label = request.form.get('label')
        print(f"Received label from form: '{label}'")
        print(f"Received audio file: filename={audio_file.filename}, content_type={audio_file.content_type}")
 
        # Preprocess audio
        preprocessed_audio = preprocess_audio(audio_file)
        print(f"Preprocessed audio shape: {preprocessed_audio.shape if hasattr(preprocessed_audio, 'shape') else 'N/A'}")
 
        # Extract MFCC
        mfcc_features = extract_mfcc(preprocessed_audio)
        print(f"Extracted MFCC features shape: {mfcc_features.shape if hasattr(mfcc_features, 'shape') else 'N/A'}")
 
        # Pad features
        features_padded = pad_sequences([mfcc_features], maxlen=MAX_LEN, padding='post', truncating='post', dtype='float32')
        print(f"Padded MFCC features shape: {features_padded.shape}")
 
        # Flatten features for classifier
        features_flattened = features_padded.reshape(1, -1)
        print(f"Flattened features shape for prediction: {features_flattened.shape}")
 
        # Predict
        predicted_label = rf_classifier.predict(features_flattened)
        print(f"Predicted label: '{predicted_label[0]}'")
 
        # Compare label and prediction
        isValid = (label == predicted_label[0])
        print(f"isValid: {isValid}")
 
        # Respond with JSON
        data = {'isValid': isValid, 'predictedLabel': predicted_label[0]}
        return jsonify(data)
 
    except Exception as e:
        print(f"Exception in /api/checkVoice: {e}")
        return jsonify({'error': str(e)}), 500


# #  Audio/Video To Sign Model - IT21815096

# In[21]:


# Prefer importing TensorFlow Keras loader under an alias to avoid conflicts with standalone Keras 3
from tensorflow.keras.models import load_model as tf_load_model, model_from_json
import h5py
import os
import pandas as pd
import numpy as np
import librosa
from sklearn.model_selection import train_test_split
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Masking, InputLayer as TFInputLayer
from tensorflow.keras.utils import to_categorical
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
import nltk
from moviepy.editor import *


# In[22]:


# Audio-to-sign model loader

def _try_import_standalone_keras():
    try:
        import keras
        return keras
    except Exception:
        return None


def _candidate_paths_for_audio_to_sign():
    here = os.path.dirname(__file__)
    project_root = os.path.abspath(os.path.join(here, '..'))
    model_env = os.environ.get('AUDIO_TO_SIGN_MODEL_PATH')
    paths = []
    if model_env:
        paths.append(model_env)
    # Local to FlaskBackend
    paths.extend([
        os.path.join(here, 'audio_to_sign_model.keras'),
        os.path.join(here, 'audio_to_sign_model.h5'),
    ])
    # From ModelTraining/Kavindu
    kavindu_dir = os.path.join(project_root, 'ModelTraining', 'Kavindu')
    paths.extend([
        os.path.join(kavindu_dir, 'audio_to_sign_model.keras'),
        os.path.join(kavindu_dir, 'audio_to_sign_model.h5'),
        os.path.join(kavindu_dir, 'audio_to_sign_best.h5'),
    ])
    # Only keep existing files
    return [p for p in paths if os.path.exists(p)]


def load_audio_to_sign_model():
    keras_pkg = _try_import_standalone_keras()
    last_err = None
    # Define a compatibility InputLayer that maps 'batch_shape' -> 'batch_input_shape'
    try:
        from tensorflow.keras.layers import InputLayer as TFInputLayer

        class CompatibleInputLayer(TFInputLayer):
            @classmethod
            def from_config(cls, config):
                cfg = dict(config) if isinstance(config, dict) else config
                if isinstance(cfg, dict) and 'batch_shape' in cfg and 'batch_input_shape' not in cfg:
                    cfg['batch_input_shape'] = cfg.pop('batch_shape')
                return super().from_config(cfg)
    except Exception:
        CompatibleInputLayer = None  # Fallback if import fails
    for path in _candidate_paths_for_audio_to_sign():
        try:
            if path.lower().endswith('.keras'):
                if keras_pkg is not None:
                    print(f"Attempting to load audio-to-sign model with standalone Keras: {path}")
                    return keras_pkg.saving.load_model(path)
                else:
                    print(f"Standalone Keras not available; trying tf.keras for: {path}")
                    return tf_load_model(path, compile=False)
            else:  # .h5
                print(f"Attempting to load audio-to-sign model with tf.keras: {path}")
                return tf_load_model(path, compile=False)
        except TypeError as te:
            # Common case when config uses unsupported kwargs
            last_err = te
            msg = str(te)
            print(f"tf.keras TypeError while loading {path}: {msg}")
            if 'Unrecognized keyword arguments' in msg or 'InputLayer' in msg:
                # Retry with custom_objects shim if possible
                if CompatibleInputLayer is not None:
                    try:
                        print(f"Retrying with tf.keras custom_objects CompatibleInputLayer for: {path}")
                        return tf_load_model(path, compile=False, custom_objects={'InputLayer': CompatibleInputLayer})
                    except Exception as e2:
                        last_err = e2
                        print(f"tf.keras with CompatibleInputLayer failed for {path}: {e2}")
                # Try sanitizing H5 config and manually rebuilding
                if path.lower().endswith('.h5'):
                    try:
                        print(f"Attempting sanitized H5 load for: {path}")
                        return _load_h5_with_sanitization(path)
                    except Exception as e3:
                        last_err = e3
                        print(f"Sanitized H5 load failed for {path}: {e3}")
                # As a final attempt, try standalone Keras if available
                if keras_pkg is not None:
                    try:
                        print(f"Retrying with standalone Keras for: {path}")
                        # Prefer models API if saving module has no load_model
                        if hasattr(keras_pkg, 'saving') and hasattr(keras_pkg.saving, 'load_model'):
                            return keras_pkg.saving.load_model(path)
                        else:
                            from keras.models import load_model as keras_load_model
                            return keras_load_model(path, compile=False)
                    except Exception as e3:
                        last_err = e3
                        print(f"Standalone Keras also failed for {path}: {e3}")
                        continue
                continue
            else:
                continue
        except Exception as e:
            last_err = e
            print(f"Failed to load model {path}: {e}")
            continue
    raise RuntimeError(
        "Failed to load audio-to-sign model. Set AUDIO_TO_SIGN_MODEL_PATH to a valid .keras or .h5 file, "
        "or place the model next to Backend.py. Last error: " + (str(last_err) if last_err else 'Unknown')
    )


def _load_h5_with_sanitization(h5_path: str):
    """Load a Keras H5 model by sanitizing its config for tf.keras 2.x.
    """
    with h5py.File(h5_path, 'r') as f:
        model_config = f.attrs.get('model_config')
        if model_config is None:
            raise ValueError('H5 does not contain model_config; cannot sanitize')
        if isinstance(model_config, bytes):
            model_config = model_config.decode('utf-8')
        config = json.loads(model_config)

    def _sanitize(obj):
        if isinstance(obj, dict):
            # Fix InputLayer argument
            if obj.get('class_name') == 'InputLayer' and isinstance(obj.get('config'), dict):
                cfg = obj['config']
                if 'batch_shape' in cfg and 'batch_input_shape' not in cfg:
                    cfg['batch_input_shape'] = cfg.pop('batch_shape')
            # Replace dtype policy objects with plain strings
            if 'dtype' in obj and isinstance(obj['dtype'], dict):
                dtype_obj = obj['dtype']
                if dtype_obj.get('class_name') in ('DTypePolicy', 'dtype_policy'):
                    name = dtype_obj.get('config', {}).get('name', 'float32')
                    obj['dtype'] = name
            # Walk deeper
            for k, v in list(obj.items()):
                obj[k] = _sanitize(v)
            return obj
        elif isinstance(obj, list):
            return [_sanitize(x) for x in obj]
        else:
            return obj

    sanitized = _sanitize(config)
    sanitized_json = json.dumps(sanitized)
    # Rebuild model and load weights
    try:
        model = model_from_json(sanitized_json)
    except TypeError:
        # In case InputLayer still needs mapping
        model = model_from_json(sanitized_json, custom_objects={'InputLayer': TFInputLayer})
    # Load weights from the same H5 file
    model.load_weights(h5_path)
    return model


# Load model once at startup
audio_to_sign_model = load_audio_to_sign_model()


# In[23]:


"""
Audio-to-Sign inference preprocessing
"""

# ---- Load normalization stats and training config if present ----
_A2S_STATS_CANDIDATES = []
_env_norm = os.environ.get('AUDIO_SIGN_NORM_STATS_PATH')
if _env_norm:
    _A2S_STATS_CANDIDATES.append(_env_norm)
_here = os.path.dirname(__file__)
_proj_root = os.path.abspath(os.path.join(_here, '..'))
_A2S_STATS_CANDIDATES.extend([
    os.path.join(_here, 'audio_to_sign_norm_stats.json'),
    os.path.join(_proj_root, 'ModelTraining', 'Kavindu', 'audio_to_sign_norm_stats.json'),
])

# Defaults match the training notebook
A2S_SR = 16000
A2S_N_MFCC = 40
A2S_N_FFT = 1024
A2S_HOP_LENGTH = 512
A2S_ADD_DELTAS = True
A2S_MAX_LEN = 128
A2S_MU = None
A2S_SIGMA = None

for _stats_path in _A2S_STATS_CANDIDATES:
    if os.path.exists(_stats_path):
        try:
            with open(_stats_path, 'r', encoding='utf-8') as f:
                _stats = json.load(f)
            # Update params if present
            A2S_SR = int(_stats.get('SR', A2S_SR))
            A2S_N_MFCC = int(_stats.get('N_MFCC', A2S_N_MFCC))
            A2S_N_FFT = int(_stats.get('N_FFT', A2S_N_FFT))
            A2S_HOP_LENGTH = int(_stats.get('HOP_LENGTH', A2S_HOP_LENGTH))
            A2S_ADD_DELTAS = bool(_stats.get('ADD_DELTAS', A2S_ADD_DELTAS))
            A2S_MAX_LEN = int(_stats.get('MAX_LEN', A2S_MAX_LEN))
            # mu/sigma
            if 'mu' in _stats and 'sigma' in _stats:
                A2S_MU = np.asarray(_stats['mu'], dtype=np.float32)
                A2S_SIGMA = np.asarray(_stats['sigma'], dtype=np.float32)
            print(f"Loaded audio-to-sign normalization stats from: {_stats_path}")
            break
        except Exception as e:
            print(f"Failed to load normalization stats from {_stats_path}: {e}")


def _standardize_apply_feats(X: np.ndarray, mu: np.ndarray, sigma: np.ndarray) -> np.ndarray:
    """Standardize features per-dimension while preserving exact-zero padded rows."""
    if mu is None or sigma is None:
        return X
    pad_mask = np.all(X == 0.0, axis=-1, keepdims=True)  # (T,1)
    Xn = (X - mu) / (sigma + 1e-8)
    Xn = np.where(pad_mask, 0.0, Xn)
    return Xn


def _extract_basic_mfcc(audio_path: str, n_mfcc: int, target_timesteps: int, sr: int) -> np.ndarray:
    """Legacy/basic MFCC extraction (no deltas, no normalization)."""
    y, _ = librosa.load(audio_path, sr=sr, mono=True)
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_mfcc)
    # pad/truncate time dimension
    T = mfcc.shape[1]
    if T < target_timesteps:
        mfcc = np.pad(mfcc, ((0, 0), (0, target_timesteps - T)), mode='constant')
    else:
        mfcc = mfcc[:, :target_timesteps]
    return mfcc.T.astype('float32')


def extract_mfcc_features(audio_path, n_mfcc=None, target_timesteps=None):
    # 1) Training-like extraction
    y, _ = librosa.load(audio_path, sr=A2S_SR, mono=True)
    base_mfcc = librosa.feature.mfcc(
        y=y, sr=A2S_SR, n_mfcc=A2S_N_MFCC, n_fft=A2S_N_FFT, hop_length=A2S_HOP_LENGTH
    )  # (A2S_N_MFCC, T)
    if A2S_ADD_DELTAS:
        d1 = librosa.feature.delta(base_mfcc)
        d2 = librosa.feature.delta(base_mfcc, order=2)
        feat = np.vstack([base_mfcc, d1, d2])  # (3*A2S_N_MFCC, T)
    else:
        feat = base_mfcc
    feat = feat.T  # (T, F)

    # 2) pad/truncate to A2S_MAX_LEN
    if feat.shape[0] < A2S_MAX_LEN:
        feat = np.pad(feat, ((0, A2S_MAX_LEN - feat.shape[0]), (0, 0)), mode='constant', constant_values=0.0)
    else:
        feat = feat[:A2S_MAX_LEN, :]

    # 3) Standardize with training
    if A2S_MU is not None and A2S_SIGMA is not None:
        feat = _standardize_apply_feats(feat, A2S_MU, A2S_SIGMA)

    # 4) If caller/model expects specific T/F, adjust time and optionally fallback
    if target_timesteps is not None and target_timesteps != feat.shape[0]:
        # adjust only time dimension
        if feat.shape[0] < target_timesteps:
            feat = np.pad(feat, ((0, target_timesteps - feat.shape[0]), (0, 0)), mode='constant', constant_values=0.0)
        else:
            feat = feat[:target_timesteps, :]

    if n_mfcc is not None and feat.shape[1] != n_mfcc:
        # Feature dim mismatch; fallback to basic MFCC path to match model's expected features
        try:
            return _extract_basic_mfcc(audio_path, n_mfcc=n_mfcc, target_timesteps=(target_timesteps or A2S_MAX_LEN), sr=A2S_SR)
        except Exception as _e:
            print(f"Basic MFCC fallback failed: {_e}")
            # As a last resort, pad/truncate feature dimension to requested size
        F = feat.shape[1]
        if F < n_mfcc:
            feat = np.pad(feat, ((0, 0), (0, n_mfcc - F)), mode='constant', constant_values=0.0)
        else:
            feat = feat[:, :n_mfcc]

    return feat.astype('float32')


# In[24]:


max_len = 100
data = []
labels = []


# In[25]:


LABEL_ENCODER_CANDIDATES = []

_env_path = os.environ.get('AUDIO_SIGN_LABELS_PATH')
if _env_path:
    LABEL_ENCODER_CANDIDATES.append(_env_path)

LABEL_ENCODER_CANDIDATES.extend([
    os.path.join(os.path.dirname(__file__), 'audio_to_sign_labels.joblib'),
    os.path.join(os.path.dirname(__file__), '..', 'ModelTraining', 'Kavindu', 'audio_to_sign_labels.joblib'),
])

label_encoder = None
for candidate in LABEL_ENCODER_CANDIDATES:
    if os.path.exists(candidate):
        try:
            label_encoder = joblib.load(candidate)
            print(f"Loaded audio-to-sign label encoder from: {candidate}")
            break
        except Exception as e:
            print(f"Failed to load label encoder from {candidate}: {e}")

if label_encoder is None:
    try:
        csv_path = os.path.join(os.path.dirname(__file__), 'AUDIO_DATA.csv')
        audio_data = pd.read_csv(csv_path)
        valid_labels = audio_data['Label'].str.lower().unique()
        labels = np.array(valid_labels)
        label_encoder = LabelEncoder()
        label_encoder.fit(labels)
        print("WARNING: Falling back to AUDIO_DATA.csv for labels. Provide audio_to_sign_labels.joblib to ensure correct mapping.")
    except Exception as e:
        raise RuntimeError(
            "audio_to_sign_labels.joblib not found and failed to load AUDIO_DATA.csv; cannot initialize label mapping."
        ) from e


# In[26]:


# In[27]:


# Inference - Use the trained model to predict signs from new audio data
def predict_sentence(audio_path, model):
   # Infer expected (timesteps, features) from the model
   input_shape = getattr(model, 'input_shape', None)
   if input_shape and len(input_shape) == 3:
       target_timesteps = int(input_shape[1])
       target_features = int(input_shape[2])
   else:
       target_timesteps = 128
       target_features = 120

   mfcc = extract_mfcc_features(
       audio_path,
       n_mfcc=target_features,
       target_timesteps=target_timesteps
   )
   # Model expects (batch, timesteps, features)
   mfcc = mfcc.reshape(1, mfcc.shape[0], mfcc.shape[1])
   predicted_prob = model.predict(mfcc, verbose=0)[0]
   predicted_class = int(np.argmax(predicted_prob))
   predicted_sentence = label_encoder.inverse_transform([predicted_class])[0]
   confidence = float(predicted_prob[predicted_class])
   return predicted_sentence, confidence


# In[28]:


@app.route('/audioToSign', methods=['POST'])
def audio_to_sign():
    # Validate input
    if 'fileData' not in request.files:
        return "No audio uploaded", 400

    audio_file = request.files['fileData']
    if not audio_file or audio_file.filename == '':
        return "No selected audio file", 400

    # Save to a temporary file to ensure librosa can read it reliably
    temp_dir = tempfile.mkdtemp()
    temp_audio_path = os.path.join(temp_dir, 'upload.wav')
    audio_file.save(temp_audio_path)

    try:
        predicted_sentence, confidence = predict_sentence(temp_audio_path, audio_to_sign_model)
        print(f"Predicted sentence: {predicted_sentence} (conf {confidence:.3f})")
        return jsonify({'message': 'Audio inference completed.', 'sign': predicted_sentence, 'confidence': confidence}), 200
    finally:
        # Cleanup temporary file and directory
        try:
            if os.path.exists(temp_audio_path):
                os.remove(temp_audio_path)
            if os.path.isdir(temp_dir):
                os.rmdir(temp_dir)
        except Exception:
            # Best-effort cleanup; ignore failures
            pass


# In[29]:


@app.route('/videoToSign', methods=['POST'])
def video_to_sign():
    if 'fileData' not in request.files:
        return "No video uploaded", 400
    
    video_file = request.files['fileData']
    
    if video_file.filename == '':
        return "No selected file", 400

    # Use a temporary directory for processing and ensure cleanup
    temp_dir = tempfile.mkdtemp()
    video_path = os.path.join(temp_dir, 'upload.mp4')
    audio_path = os.path.join(temp_dir, 'audio.wav')

    # Save uploaded video to temp path
    video_file.save(video_path)

    try:
        # Extract audio to a temp wav file at training sample rate and PCM codec
        video_clip = VideoFileClip(video_path)
        audio_clip = video_clip.audio
        # Ensure consistent sample rate and PCM 16-bit for librosa compatibility
        audio_clip.write_audiofile(audio_path, fps=A2S_SR, codec='pcm_s16le', verbose=False, logger=None)
        audio_clip.close()
        video_clip.close()

        # Predict from extracted audio
        predicted_sentence, confidence = predict_sentence(audio_path, audio_to_sign_model)
        print(f"Predicted sentence: {predicted_sentence} (conf {confidence:.3f})")
        return jsonify({'message': 'Video inference completed.', 'sign': predicted_sentence, 'confidence': confidence}), 200
    finally:
        # Best-effort cleanup
        for p in (audio_path, video_path):
            try:
                if os.path.exists(p):
                    os.remove(p)
            except Exception:
                pass
        try:
            os.rmdir(temp_dir)
        except Exception:
            pass


# # Text to Sign and Sign to Text Models - IT21389856

# In[30]:


import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB


# --- Text To Sign ---

# In[31]:


# Load the trained model and vectorizer from disk
loaded_classifier = joblib.load("predict_url.joblib")
loaded_vectorizer = joblib.load("vectorizer.joblib")

# Load data from the CSV file
data = pd.read_csv('NEW_URL_DATASET.csv')

# Extract valid class names from the CSV file
valid_class_names = data['Label'].str.lower().unique()

# Load Sinhala labels mapping
sinhala_mapping = {}
try:
    sinhala_data = pd.read_csv('sinhala_labels.csv')
    sinhala_mapping = dict(zip(sinhala_data['Label'].str.lower(), sinhala_data['SinhalaText']))
    print(f"Loaded {len(sinhala_mapping)} Sinhala label mappings")
except Exception as e:
    print(f"Warning: Could not load Sinhala labels mapping: {e}") 


# In[32]:


# Function to predict the URL for a given class name
def predict_url(class_name, return_sinhala=False):
    class_name_lower = class_name.lower()
    if class_name_lower in valid_class_names:
        predicted_url_new = loaded_classifier.predict(loaded_vectorizer.transform([class_name_lower]))
        if return_sinhala:
            sinhala_text = sinhala_mapping.get(class_name_lower, class_name)
            return predicted_url_new[0], sinhala_text
        return predicted_url_new[0]
    else:
        if return_sinhala:
            return False, None
        return False


# --- Sign To Text ---

# In[33]:


from tensorflow.keras.models import load_model
import tempfile
import os
import numpy as np
import cv2


# In[34]:


# class_names = os.listdir("SignData/") #This should replace with a CSV file
class_names = pd.read_csv('SIGN_TO_TEXT_LABELS.csv')['Label'].str.lower().unique() 


# In[35]:


# Load the model
sign_to_text_loaded_model = load_model('SignToText.h5')


# In[36]:


def predict_class(request):
    
    image_size = (128, 128)
    resArr = [];
    label = request.form.get('label')
    
    if 'fileData' not in request.files:
        return jsonify({'error': 'No file data found.'}), 400

    sign = request.files['fileData']
    
    # Save the video file to a temporary directory
    temp_dir = tempfile.mkdtemp()
    temp_file_path = os.path.join(temp_dir, 'temp.jpg')
    sign.save(temp_file_path)
    
    img = cv2.imread(temp_file_path)
    img = cv2.resize(img, image_size)
    img = np.expand_dims(img, axis=0)
    prediction = sign_to_text_loaded_model.predict(img)
    predicted_class_idx = np.argmax(prediction)
    predicted_class = class_names[predicted_class_idx]

    
    
    isCorrect = False
    
    
    if label == predicted_class:
        isCorrect = True
    

    data = {'sign': predicted_class, 'isCorrect': isCorrect}

    
    return data


# In[37]:


@app.route('/api/get-url', methods=['POST'])
def getURL():
    data = request.json  # Get the JSON data from the request
    class_name_to_predict = data.get('label', 'World')  # Get the 'name' field from the JSON data
    print(class_name_to_predict)
    
    # Get both URL and Sinhala text
    url_result, sinhala_text = predict_url(class_name_to_predict, return_sinhala=True)
    isSuccess = False
    
    if url_result is not False:
        isSuccess = True
        # Convert /edit to /preview for Google Drive URLs to make them viewable
        if url_result and '/edit' in url_result:
            url_result = url_result.replace('/edit', '/preview')
    else:
        isSuccess = False
        url_result = ""
        sinhala_text = None
    
    result = {
        'url': url_result, 
        'success': isSuccess,
        'sinhalaText': sinhala_text,
        'originalLabel': class_name_to_predict
    }
    
    # Ensure CORS headers are set
    response_obj = jsonify(result)
    response_obj.headers.add('Access-Control-Allow-Origin', '*')
    return response_obj


# In[38]:


@app.route('/api/getTextBySign', methods=['POST'])
def getTextBySign():
    data = predict_class(request)
    return jsonify(data)


# In[ ]:


if __name__ == '__main__':
    app.run(host="0.0.0.0",port=int("3002"), debug=True) 