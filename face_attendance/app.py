"""
AI Face Recognition Attendance System
Backend: Python Flask + OpenCV + face_recognition
Author: Hackathon Project
"""

from flask import Flask, render_template, request, jsonify, send_file
import face_recognition
import cv2
import numpy as np
import os
import csv
import base64
from datetime import datetime, date
from PIL import Image
import io

# ─────────────────────────────────────────────
# App Setup
# ─────────────────────────────────────────────
app = Flask(__name__)

IMAGES_FOLDER = "images"
ATTENDANCE_FILE = "attendance.csv"

os.makedirs(IMAGES_FOLDER, exist_ok=True)


# ─────────────────────────────────────────────
# Helper: Decode base64 image → numpy RGB array
# Uses PIL to safely handle any image format
# ─────────────────────────────────────────────
def decode_base64_image(image_data):
    """Decode a base64 image string into a numpy RGB array.

    The function strips any data URI prefix, decodes the bytes, and uses
    PIL to open the image. PIL handles many formats (JPEG, PNG, BMP, etc.)
    but will raise an error if the data is corrupted or of an unsupported
    type. We catch and re-raise a more user-friendly message.
    """
    if "," in image_data:
        image_data = image_data.split(",")[1]
    try:
        img_bytes = base64.b64decode(image_data)
    except Exception as e:
        # base64 decoding error
        raise ValueError("Invalid base64 image data")

    try:
        pil_image = Image.open(io.BytesIO(img_bytes))
    except Exception:
        # PIL failed, likely unsupported or corrupt image
        raise ValueError("Unsupported or corrupted image type")

    pil_image = pil_image.convert("RGB")
    rgb_array = np.array(pil_image, dtype=np.uint8)
    return rgb_array


# ─────────────────────────────────────────────
# Helper: Load all known faces from images folder
# ─────────────────────────────────────────────
def load_known_faces():
    known_encodings = []
    known_names = []
    for filename in os.listdir(IMAGES_FOLDER):
        if filename.lower().endswith((".jpg", ".jpeg", ".png")):
            filepath = os.path.join(IMAGES_FOLDER, filename)
            try:
                image = face_recognition.load_image_file(filepath)
                encodings = face_recognition.face_encodings(image)
                if encodings:
                    known_encodings.append(encodings[0])
                    name = os.path.splitext(filename)[0].replace("_", " ")
                    known_names.append(name)
            except Exception as e:
                print(f"Skipping {filename}: {e}")
    return known_encodings, known_names


# ─────────────────────────────────────────────
# Helper: Ensure attendance CSV has header
# ─────────────────────────────────────────────
def init_attendance_csv():
    if not os.path.exists(ATTENDANCE_FILE) or os.path.getsize(ATTENDANCE_FILE) == 0:
        with open(ATTENDANCE_FILE, "w", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(["Name", "Date", "Time", "Status"])

init_attendance_csv()


# ─────────────────────────────────────────────
# Helper: Check if student already marked today
# ─────────────────────────────────────────────
def already_marked_today(name):
    today = str(date.today())
    if not os.path.exists(ATTENDANCE_FILE):
        return False
    with open(ATTENDANCE_FILE, "r") as f:
        reader = csv.reader(f)
        for row in reader:
            if len(row) >= 2 and row[0] == name and row[1] == today:
                return True
    return False


# ─────────────────────────────────────────────
# Helper: Mark attendance in CSV
# ─────────────────────────────────────────────
def mark_attendance(name):
    now = datetime.now()
    with open(ATTENDANCE_FILE, "a", newline="") as f:
        writer = csv.writer(f)
        writer.writerow([name, str(now.date()), now.strftime("%H:%M:%S"), "Present"])


# ─────────────────────────────────────────────
# ROUTES
# ─────────────────────────────────────────────
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/register")
def register():
    return render_template("register.html")

@app.route("/attendance")
def attendance():
    return render_template("attendance.html")

@app.route("/report")
def report():
    return render_template("report.html")


# ─────────────────────────────────────────────
# API: Register a new student
# ─────────────────────────────────────────────
@app.route("/api/register", methods=["POST"])
def api_register():
    data = request.get_json()
    name = data.get("name", "").strip()
    image_data = data.get("image", "")

    if not name:
        return jsonify({"success": False, "message": "Name is required."})
    if not image_data:
        return jsonify({"success": False, "message": "Image is required."})

    try:
        # Decode using PIL - handles RGBA, PNG, JPEG safely
        rgb_img = decode_base64_image(image_data)

        # Detect face
        encodings = face_recognition.face_encodings(rgb_img)
        if not encodings:
            return jsonify({"success": False, "message": "No face detected. Ensure good lighting and face the camera directly."})

        # Save image
        filename = name.replace(" ", "_") + ".jpg"
        filepath = os.path.join(IMAGES_FOLDER, filename)
        pil_img = Image.fromarray(rgb_img)
        pil_img.save(filepath, "JPEG")

        return jsonify({"success": True, "message": f"Student '{name}' registered successfully!"})

    except ValueError as ve:
        # Our helper throws ValueError for unsupported or invalid image data
        return jsonify({"success": False, "message": str(ve)})
    except Exception as e:
        # unexpected errors
        return jsonify({"success": False, "message": f"Error: {str(e)}"})


# ─────────────────────────────────────────────
# API: Recognize face and mark attendance
# ─────────────────────────────────────────────
@app.route("/api/recognize", methods=["POST"])
def api_recognize():
    data = request.get_json()
    image_data = data.get("image", "")

    if not image_data:
        return jsonify({"success": False, "message": "No image provided."})

    try:
        # Decode using PIL
        rgb_img = decode_base64_image(image_data)

        # Load known faces
        known_encodings, known_names = load_known_faces()
        if not known_encodings:
            return jsonify({"success": False, "message": "No students registered yet."})

        # Detect faces
        face_locations = face_recognition.face_locations(rgb_img)
        face_encodings = face_recognition.face_encodings(rgb_img, face_locations)

        results = []
        for face_encoding in face_encodings:
            matches = face_recognition.compare_faces(known_encodings, face_encoding, tolerance=0.5)
            face_distances = face_recognition.face_distance(known_encodings, face_encoding)

            name = "Unknown"
            status = "Not Recognized"

            if True in matches:
                best_match_index = np.argmin(face_distances)
                if matches[best_match_index]:
                    name = known_names[best_match_index]
                    if already_marked_today(name):
                        status = "Already Marked"
                    else:
                        mark_attendance(name)
                        status = "Marked Present"

            results.append({"name": name, "status": status})

        if not results:
            return jsonify({"success": True, "results": [], "message": "No faces detected."})

        return jsonify({"success": True, "results": results})

    except ValueError as ve:
        return jsonify({"success": False, "message": str(ve)})
    except Exception as e:
        return jsonify({"success": False, "message": f"Error: {str(e)}"})


# ─────────────────────────────────────────────
# API: Get attendance report
# ─────────────────────────────────────────────
@app.route("/api/report", methods=["GET"])
def api_report():
    filter_date = request.args.get("date", "")
    records = []
    if os.path.exists(ATTENDANCE_FILE):
        with open(ATTENDANCE_FILE, "r") as f:
            reader = csv.DictReader(f)
            for row in reader:
                if filter_date and row.get("Date") != filter_date:
                    continue
                records.append(row)
    return jsonify({"success": True, "records": records})


# ─────────────────────────────────────────────
# API: Get registered students
# ─────────────────────────────────────────────
@app.route("/api/students", methods=["GET"])
def api_students():
    students = []
    for filename in os.listdir(IMAGES_FOLDER):
        if filename.lower().endswith((".jpg", ".jpeg", ".png")):
            name = os.path.splitext(filename)[0].replace("_", " ")
            students.append(name)
    return jsonify({"success": True, "students": students})


# ─────────────────────────────────────────────
# API: Download CSV
# ─────────────────────────────────────────────
@app.route("/api/download", methods=["GET"])
def api_download():
    if os.path.exists(ATTENDANCE_FILE):
        return send_file(ATTENDANCE_FILE, as_attachment=True, download_name="attendance.csv")
    return jsonify({"success": False, "message": "No attendance file found."})


# ─────────────────────────────────────────────
# Run
# ─────────────────────────────────────────────
if __name__ == "__main__":
    print("=" * 50)
    print("  AI Face Attendance System Starting...")
    print("  Open: http://127.0.0.1:5000")
    print("=" * 50)
    app.run(debug=True, host="0.0.0.0", port=5000)