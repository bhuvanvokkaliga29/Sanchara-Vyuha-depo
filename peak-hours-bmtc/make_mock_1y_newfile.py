import pandas as pd, numpy as np
from datetime import datetime, timedelta
from math import ceil
import os, tempfile, shutil

np.random.seed(11)

OUT = r"C:\Users\HP\Downloads\peak-hours\peak_hours_1y.csv"  # new file only [web:11]

STOPS = [
    ("Kempegowda Bus Station (Majestic)","KBS001"),
    ("Maharani College","MHC101"),
    ("K.R. Circle","KRC201"),
    ("Koli Farm Gate","KFG301"),
    ("Gottigere","GOT401"),
    ("Bannerghatta Circle","BGC501"),
    ("AMC College","AMC601"),
]
ROUTE="365J"; BUS_CAP=60; LOAD_FACTOR=0.85

TODAY=pd.Timestamp.now().floor("D")
START=TODAY - pd.Timedelta(days=365)
END=TODAY

WEATHERS=["Clear","Cloudy","Rain"]
SEASON={1:[0.7,0.25,0.05],2:[0.7,0.25,0.05],3:[0.6,0.3,0.1],4:[0.55,0.35,0.1],
        5:[0.5,0.35,0.15],6:[0.45,0.35,0.2],7:[0.45,0.35,0.2],8:[0.45,0.35,0.2],
        9:[0.55,0.35,0.1],10:[0.6,0.3,0.1],11:[0.65,0.3,0.05],12:[0.7,0.25,0.05]}
def pick_weather(ts): return np.random.choice(WEATHERS, p=SEASON.get(ts.month,[0.6,0.3,0.1]))

def congestion_by_hour(h,dow):
    if 7<=h<=9 or 17<=h<=20: return np.random.choice(["High","Medium"], p=[0.7,0.3])
    if dow in [5,6] and 11<=h<=22: return np.random.choice(["Medium","Low"], p=[0.6,0.4])
    return np.random.choice(["Medium","Low"], p=[0.45,0.55])

BASE={"KBS001":36,"MHC101":32,"KRC201":38,"KFG301":28,"GOT401":26,"BGC501":31,"AMC601":29}
def hour_mult(h):
    am=np.exp(-0.5*((h-8)/1.6)**2); pm=np.exp(-0.5*((h-18)/1.9)**2)
    return 0.45 + 1.0*am + 1.05*pm

W_IMP={"Clear":1.0,"Cloudy":0.95,"Rain":0.88}
C_WAIT={"Low":4,"Medium":7,"High":11}
C_FLOW={"Low":1.0,"Medium":0.94,"High":0.88}

rows=[]; cur=START
while cur<END:
    w=pick_weather(cur)
    for h in range(5,23):
        ts=pd.Timestamp(datetime.combine(cur.date(), datetime.min.time()) + timedelta(hours=h))
        dow=ts.dayofweek; c=congestion_by_hour(h,dow)
        for name,sid in STOPS:
            base=BASE[sid]; mult=hour_mult(h)
            trend=0.9 + 0.2*(ts-START).days/365.0
            day_scale=np.clip(np.random.normal(1.0,0.08),0.82,1.18)
            lam=base*mult*W_IMP[w]*day_scale*trend
            demand=max(0.0, np.random.normal(lam, max(2.0,0.10*lam)))
            eff=BUS_CAP*LOAD_FACTOR*C_FLOW[c]
            rec=max(1, ceil(demand/max(eff,1.0)))
            boarded=min(demand, rec*BUS_CAP*LOAD_FACTOR*0.98)
            left=max(0.0, demand-boarded)
            occ=(boarded/(rec*BUS_CAP))*100 if rec>0 else 0.0
            wait=max(2.0, np.random.normal(C_WAIT[c],1.8))
            event=1 if (sid in ["AMC601","GOT401"] and h in [17,18,19] and np.random.rand()<0.12) else 0
            if event:
                demand*=1.12; left*=1.08
                boarded=min(demand, rec*BUS_CAP*LOAD_FACTOR); occ=(boarded/(rec*BUS_CAP))*100
            rows.append({
                "Date": ts.strftime("%Y-%m-%d"), "Time": ts.strftime("%H:00"),
                "Bus_Stop_Name": name, "Bus_Stop_ID": sid, "Route_ID": ROUTE,
                "Passengers_Boarded": int(round(boarded)),
                "Passengers_Left_Behind": int(round(left)),
                "Bus_Capacity": BUS_CAP, "Occupancy_Percent": int(round(np.clip(occ,0,100))),
                "Avg_Waiting_Time_Mins": int(round(np.clip(wait,2,25))),
                "Traffic_Congestion_Level": c, "Weather": w, "Special_Events_Nearby": event,
                "Recommended_Buses": rec
            })
    cur+=timedelta(days=1)

df=pd.DataFrame(rows).sort_values(["Date","Time","Bus_Stop_ID"])

# Atomic write to a new file
folder=os.path.dirname(OUT); os.makedirs(folder, exist_ok=True)
fd,tmp=tempfile.mkstemp(dir=folder, prefix="peak1y_", suffix=".csv"); os.close(fd)
df.to_csv(tmp, index=False)
shutil.move(tmp, OUT)
print("Wrote new file:", OUT, "rows:", len(df), "days:", df['Date'].nunique(), "stops:", df['Bus_Stop_ID'].nunique())
