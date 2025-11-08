# run_peak_dispatch_fast.py
import pandas as pd, numpy as np
from math import ceil

# Point to the dataset; prefer the new 1-year file if present
CANDIDATES = [
    r"C:\Users\HP\Downloads\peak-hours\peak_hours_1y.csv",
    r"C:\Users\HP\Downloads\peak-hours\peak_hours.csv"
]
for c in CANDIDATES:
    try:
        open(c).close()
        CSV = c
        break
    except Exception:
        CSV = None
if not CSV:
    raise SystemExit("No dataset found. Expected peak_hours_1y.csv or peak_hours.csv")

LF = 0.85

def predict_baseline(g):
    g = g.sort_values("timestamp")
    base = g.iloc[-1]
    cap = float(base["Bus_Capacity"])
    # Use last 4 comparable hours across recent days for smoother baseline
    recent = g.tail(48)["Passengers_Boarded"].to_numpy(dtype=float)  # last 2 days
    if len(recent) < 4:
        recent = np.pad(recent, (0, 4-len(recent)), constant_values=recent.mean() if len(recent) else 12.0)
    avg = float(np.mean(recent[-4:]))
    # Simple momentum from last 3 deltas
    diffs = np.diff(recent[-6:]) if len(recent) >= 6 else np.array([0.0,0.0,0.0])
    trend = float(diffs[-3:].mean()) if len(diffs) >= 3 else 0.0
    preds = [max(0.0, avg + k*0.25*trend) for k in [1,2,3]]
    buses = [max(1, ceil(p / max(cap*LF, 1.0))) for p in preds]
    cong = base["Traffic_Congestion_Level"]; wthr = base["Weather"]
    occ = float(base.get("Occupancy_Percent", 0)); wait = float(base.get("Avg_Waiting_Time_Mins", 0))
    reason = f"Baseline avg(last 4h)+trend; congestion {cong}, weather {wthr}, last occupancy {occ:.0f}%, wait {wait:.0f}m."
    return preds, buses, reason, cap

df = pd.read_csv(CSV)
df["timestamp"] = pd.to_datetime(df["Date"] + " " + df["Time"], errors="coerce")
df = df.dropna(subset=["timestamp"])
# Focus on last 30 days per series for responsiveness
cutoff = df["timestamp"].max() - pd.Timedelta(days=30)
df = df[df["timestamp"] >= cutoff]

rows = []
base = pd.Timestamp.now().floor("h")
for (sid, rid), g in df.groupby(["Bus_Stop_ID", "Route_ID"], sort=False):
    if g.empty: continue
    preds, buses, reason, cap = predict_baseline(g)
    # Peak-hour override
    h = base.hour
    if 7 <= h <= 9 or 17 <= h <= 20:
        buses = [max(1, int(b)) for b in buses]
        reason += " Peak-hour override ensures dispatch."
    rows.append({
        "Route_ID": rid, "Bus_Stop_ID": sid,
        "T+1_Timestamp": base + pd.Timedelta(hours=1),
        "T+2_Timestamp": base + pd.Timedelta(hours=2),
        "T+3_Timestamp": base + pd.Timedelta(hours=3),
        "Pred_t+1": preds[0], "Buses_t+1": buses[0],
        "Pred_t+2": preds[1], "Buses_t+2": buses[1],
        "Pred_t+3": preds[2], "Buses_t+3": buses[2],
        "Dispatch_Reason": reason, "Bus_Capacity": cap, "Load_Factor": LF
    })

out = pd.DataFrame(rows).sort_values(["Route_ID","Bus_Stop_ID","T+1_Timestamp"])
out.to_csv("dispatch_next_3h_explained.csv", index=False)
print("Wrote dispatch_next_3h_explained.csv with", len(out), "rows.")
