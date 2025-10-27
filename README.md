# Sign Lens (R25-010)

**Empowering Accessibility: A Sinhala Sign Language (SSL) Recognition and Learning System Using Machine Learning**

This repository contains the project "Sign Lens," a multi-functional platform developed for the SLIIT Faculty of Computing. It is designed to bridge communication gaps for the hearing-impaired community in Sri Lanka.

## 🚩 About The Project

In Sri Lanka, there are approximately 390,000 hearing-impaired citizens, most of whom use Sinhala Sign Language (SSL) to communicate. However, existing digital tools primarily support English Sign Language and often lack real-time accuracy, interactivity, and essential features like audio-to-sign conversion or vocal training.

Sign Lens is a multi-functional platform built to address this gap. It integrates learning, real-time detection, speech-to-sign conversion, and vocal training to create a single, holistic solution for education, communication, and rehabilitation.

## ✨ Key Features

The platform is composed of four main modules:

1.  **Interactive SSL Learning**
    * Provides structured, multi-level lessons for Sinhala Sign Language, covering the alphabet, words, and phrase construction.
    * Includes an SSL Dictionary for quick lookups.
    * Features an evaluation system with randomized MCQ assessments (~70 questions total) to test comprehension.

2.  **Dynamic Real-Time Sign Detection**
    * Uses a webcam to capture user gestures in real-time.
    * Extracts key points using MediaPipe Holistic.
    * Provides instant sign language predictions using an LSTM-based machine learning model.

3.  **Audio & Video to SSL Conversion**
    * Converts Sinhala audio or video files into SSL sign demonstrations.
    * The system processes audio, converts it to text, and then uses an ML model to predict and display the corresponding sign gestures.

4.  **Vocal Training System**
    * Specifically designed for cochlear-implanted children (ages 3-5).
    * Listens to the child's speech and provides real-time analysis of voice characteristics (MFCC, pitch, energy).
    * Uses a Random Forest model to evaluate pronunciation and provide feedback to improve speech intelligibility.

## ⚙️ System Architecture

The system operates with a user interacting with a web interface. Inputs (Webcam, Text, Audio) are sent to a central Backend API, which orchestrates four primary services and communicates with a SQL database.

* **Learning System:** Manages lessons, MCQs, and Text-to-Sign interpretation.
* **Audio to Sign Conversion:** Handles audio-to-text and text-to-sign image conversion.
* **Vocal Training System:** Manages voice input, preprocessing, and accuracy assessment.
* **Dynamic Sign Detection:** Processes webcam input through an LSTM model for gesture recognition.

## 🛠️ Technology Stack

| Category | Technology |
| :--- | :--- |
| **Frontend** | React.js, Bootstrap, Custom CSS |
| **Backend** | Spring Boot, Flask |
| **Database** | Xampp, PHP MySQL DB |
| **ML Models** | LSTM, Random Forest, Logistic Regression, CNN, Naive Bayes Classifier |
| **ML/Data Libraries** | MediaPipe, librosa, moviepy |

## 📊 Project Status

**Overall Project Completion: 90%**

* **✅ Completed:**
    * Frontend Development (React.js UI)
    * Backend Development (Flask & Spring Boot)
    * Dataset Collection & Preparation
    * Machine Learning Model Training
    * Containerization and cloud hosting    

### Model Accuracy
* **Audio-to-Sign (LSTM):** ~85%
* **Vocal Training (Random Forest):** ~90%
* **Evaluation System (Logistic Regression):** ~87%

## 🚀 Future Growth

Future plans include localizing the application to provide multi-language support, specifically for **English and Tamil**.

## 🧑‍💻 Meet the Team (R25-10)

* **Kanchana M.M.K (IT21815096)**
    * *Module: Audio & Video to Sign Conversion*
* **Hearth H.M.B.G.J (IT21801136)**
    * *Module: Dynamic Sign Detection*
* **Kushan H.G.P.S. (IT21110016)**
    * *Module: Vocal Training System*
* **Prathviharan K. (IT21389856)**
    * *Module: Evaluation System for Sinhala Sign Language*
