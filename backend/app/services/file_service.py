import os
import shutil
from pathlib import Path

from fastapi import UploadFile

UPLOAD_FOLDER = Path("uploads")
GENERATED_FOLDER = Path("generated")

UPLOAD_FOLDER.mkdir(exist_ok=True)
GENERATED_FOLDER.mkdir(exist_ok=True)


def save_uploaded_file(project_id: int, file: UploadFile, file_label: str) -> str:
    project_folder = UPLOAD_FOLDER / f"project_{project_id}"
    project_folder.mkdir(parents=True, exist_ok=True)

    safe_name = file.filename.replace(" ", "_") if file.filename else f"{file_label}.txt"
    saved_path = project_folder / safe_name

    with saved_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return str(saved_path)


def read_notes_file(path: str | None) -> str:
    if not path or not os.path.exists(path):
        return ""

    file_path = Path(path)
    if file_path.suffix.lower() != ".txt":
        return f"Notes file uploaded: {file_path.name}. Text extraction is kept simple in this version."

    return file_path.read_text(encoding="utf-8", errors="ignore")

