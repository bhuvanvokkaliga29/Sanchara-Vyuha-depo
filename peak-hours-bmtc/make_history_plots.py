import os
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# Absolute dataset paths
CANDIDATES = [
    r"C:\Users\HP\Downloads\peak-hours\peak_hours_1y.csv",
    r"C:\Users\HP\Downloads\peak-hours\peak_hours.csv",
]
CSV = next((c for c in CANDIDATES if os.path.exists(c)), None)
if not CSV:
    raise SystemExit("No dataset found (peak_hours_1y.csv or peak_hours.csv).")

OUT_DIR = r"C:\Users\HP\Downloads\peak-hours\plots"
os.makedirs(OUT_DIR, exist_ok=True)

df = pd.read_csv(CSV)
df["timestamp"] = pd.to_datetime(df["Date"] + " " + df["Time"], errors="coerce")
df = df.dropna(subset=["timestamp"]).sort_values(["Bus_Stop_ID","Route_ID","timestamp"])

# Use full year but render clearly
# Optional: restrict to last N days by changing 365 to N
cutoff = df["timestamp"].max() - pd.Timedelta(days=365)
df = df[df["timestamp"] >= cutoff]

def downsample_hourly(g, every=2):
    # keep every Nth point to reduce overplotting
    g = g.copy()
    g["ix"] = range(len(g))
    g = g[g["ix"] % every == 0]
    return g.drop(columns=["ix"])

for (sid, rid), g in df.groupby(["Bus_Stop_ID","Route_ID"], sort=False):
    if g.empty: 
        continue

    # Rolling means on original hour data (7d and 28d windows)
    g_hour = g.set_index("timestamp").sort_index()
    r7 = g_hour["Passengers_Boarded"].rolling("7D", min_periods=24).mean()
    r28 = g_hour["Passengers_Boarded"].rolling("28D", min_periods=24*4).mean()
    occ7 = g_hour["Occupancy_Percent"].rolling("7D", min_periods=24).mean()

    # Downsample for plotting base lines
    gd = downsample_hourly(g, every=2)

    fig, ax1 = plt.subplots(figsize=(9.6, 3.6), dpi=100)
    ax1.plot(gd["timestamp"], gd["Passengers_Boarded"], color="#1f77b4", linewidth=1.1, alpha=0.8, label="Passengers")
    ax1.plot(r7.index, r7.values, color="#2ca02c", linewidth=1.3, alpha=0.9, label="Pax 7d MA")
    ax1.plot(r28.index, r28.values, color="#2ca02c", linewidth=1.0, alpha=0.5, linestyle="--", label="Pax 28d MA")
    ax1.set_ylabel("Passengers")
    ax1.set_xlabel("Time")
    ax1.grid(alpha=0.25)

    # Peak-hour shading (07–09, 17–20) faint background stripes
    days = pd.date_range(gd["timestamp"].min().floor("D"), gd["timestamp"].max().ceil("D"), freq="D")
    for d in days:
        for (s,e) in [(7,9),(17,20)]:
            ax1.axvspan(d + pd.Timedelta(hours=s), d + pd.Timedelta(hours=e),
                        color="#f0f4ff", alpha=0.15, lw=0)

    # Secondary axis for occupancy with smoothing
    ax2 = ax1.twinx()
    ax2.plot(gd["timestamp"], gd["Occupancy_Percent"], color="#ff7f0e", alpha=0.4, linewidth=0.9, label="Occ%")
    ax2.plot(occ7.index, occ7.values, color="#ff7f0e", alpha=0.9, linewidth=1.2, linestyle="-.", label="Occ% 7d MA")
    ax2.set_ylabel("Occupancy %")
    ax2.set_ylim(0, 100)

    # Legend
    l1, lab1 = ax1.get_legend_handles_labels()
    l2, lab2 = ax2.get_legend_handles_labels()
    ax1.legend(l1 + l2, lab1 + lab2, loc="upper left", fontsize=8, frameon=False)

    # Title and ticks
    ax1.set_title(f"{sid} - {rid} (last 365d)")
    fig.autofmt_xdate(rotation=0)

    fname = os.path.join(OUT_DIR, f"history_{sid}_{rid}.png")
    fig.tight_layout()
    fig.savefig(fname)
    plt.close(fig)

print("Wrote plots to", OUT_DIR)
