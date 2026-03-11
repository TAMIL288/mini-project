# 🎓 AI Face Recognition Attendance System

A college hackathon project built with **Python Flask + OpenCV + face_recognition**.

---

## 📁 Project Structure

```
face_attendance/
├── static/
│     ├── style.css         ← All styles
│     └── script.js         ← Shared JS utilities
├── templates/
│     ├── index.html        ← Home page
│     ├── register.html     ← Student registration
│     ├── attendance.html   ← Live attendance marking
│     └── report.html       ← Attendance report + download
├── images/                 ← Student face photos stored here
├── attendance.csv          ← Attendance log
├── app.py                  ← Flask backend
├── requirements.txt        ← Python dependencies
└── README.md
```

---

## ⚙️ Step-by-Step Setup (Windows)

### 1. Install Python 3.9+
Download from https://python.org and ensure you check **"Add to PATH"** during installation.

### 2. Install CMake and dlib dependencies
```
pip install cmake
pip install dlib
```
> If dlib fails, download a prebuilt wheel from:
> https://github.com/z-mahmud22/Dlib_Windows_Python3.x
> Then run: `pip install dlib-<version>.whl`

### 3. Install all required packages
```
cd face_attendance
pip install -r requirements.txt
```

### 4. Run the app
```
python app.py
```

### 5. Open in browser
```
http://127.0.0.1:5000
```

---

## 🚀 How to Use

1. **Register Students**  
   Go to `/register` → Start camera → Capture photo → Enter name → Click Register

2. **Mark Attendance**  
   Go to `/attendance` → Start camera → AI auto-detects & marks attendance every 3 seconds

3. **View & Download Report**  
   Go to `/report` → Filter by date → Download as CSV or Excel

---

## 🔌 API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/register` | Register a new student |
| POST | `/api/recognize` | Recognize face & mark attendance |
| GET  | `/api/report` | Get attendance records (optional `?date=YYYY-MM-DD`) |
| GET  | `/api/students` | List all registered students |
| GET  | `/api/download` | Download attendance.csv |

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Python Flask
- **Face Recognition**: face_recognition (dlib-based)
- **Image Processing**: OpenCV
- **Data Storage**: CSV files
- **Excel Export**: SheetJS (CDN)

---

## 💡 Tips

- Use **good lighting** for better recognition accuracy
- Register students with **clear, front-facing** photos
- Tolerance is set to **0.5** (lower = stricter matching)
- Each student is marked **once per day** automatically

---

Built with ❤️ for College Hackathon
