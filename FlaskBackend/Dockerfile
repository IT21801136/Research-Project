# Use official Python 3.10.0 image
FROM python:3.10.0-slim

# Set working directory inside the container
WORKDIR /app

# Install system-level dependencies (required for opencv, librosa, ffmpeg, etc.)
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libsm6 \
    libxext6 \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libfontconfig1 \
    libxrender1 \
    libgomp1 \
    libsndfile1 \
    git \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip to latest version
RUN pip install --upgrade pip==23.2.1

# Copy requirements first (for efficient caching)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy project code into container
COPY . .

# Create uploads directory if it doesn't exist
RUN mkdir -p uploads

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV FLASK_ENV=production
ENV PORT=3002

# Expose port
EXPOSE 3002

# Run Flask server
CMD ["python", "Backend.py"]