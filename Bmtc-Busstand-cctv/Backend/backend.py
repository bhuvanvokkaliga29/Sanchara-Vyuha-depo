from fastapi import FastAPI
import pandas as pd
import os

app = FastAPI()

CSV_FILE = "../backend_database/bmtc_cctv_counts.csv"


@app.get("/api/passenger_counts")
def get_passenger_counts():
    if not os.path.exists(CSV_FILE):
        return {"status": "error", "message": f"CSV file '{CSV_FILE}' not found."}
    try:
        # Read fresh from CSV on every request to get latest data
        df = pd.read_csv(CSV_FILE, header=0)
        # Convert to list of dicts
        data = df.to_dict(orient="records")
        return {"status": "success", "data": data}
    except Exception as e:
        return {"status": "error", "message": str(e)}
