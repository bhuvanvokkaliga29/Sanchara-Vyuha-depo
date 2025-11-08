# quick_train_and_save.py
import pandas as pd, numpy as np, tensorflow as tf
from sklearn.preprocessing import StandardScaler

CSV = r"C:\Users\HP\Downloads\peak-hours\peak_hours_1y.csv"
W,H=48,3

def prep(df):
    df["timestamp"]=pd.to_datetime(df["Date"]+" "+df["Time"])
    df=df.sort_values(["Bus_Stop_ID","Route_ID","timestamp"])
    t=pd.get_dummies(df["Traffic_Congestion_Level"], prefix="Traffic", dtype="int8")
    w=pd.get_dummies(df["Weather"], prefix="Weather", dtype="int8")
    df=pd.concat([df.drop(columns=["Traffic_Congestion_Level","Weather"]), t, w], axis=1)
    df["hour"]=df["timestamp"].dt.hour; df["dow"]=df["timestamp"].dt.dayofweek
    df["hour_sin"]=np.sin(2*np.pi*df["hour"]/24); df["hour_cos"]=np.cos(2*np.pi*df["hour"]/24)
    df["dow_sin"]=np.sin(2*np.pi*df["dow"]/7);   df["dow_cos"]=np.cos(2*np.pi*df["dow"]/7)
    feats=["Passengers_Boarded","Occupancy_Percent","Avg_Waiting_Time_Mins","Special_Events_Nearby",
           "hour_sin","hour_cos","dow_sin","dow_cos"] + \
          [c for c in df.columns if c.startswith("Traffic_")] + \
          [c for c in df.columns if c.startswith("Weather_")]
    return df,feats

def windows(X,y,w,h):
    Xs,ys=[],[]
    for i in range(len(X)-w-h+1):
        Xs.append(X[i:i+w]); ys.append(y[i+w:i+w+h])
    return np.array(Xs,"float32"), np.array(ys,"float32")

df=pd.read_csv(CSV)
df,feats=prep(df)
# train on one busy stop to produce a model artifact quickly
sid,rid = "KBS001","365J"
g=df[(df["Bus_Stop_ID"]==sid)&(df["Route_ID"]==rid)].copy()
g=g[g["timestamp"]>=g["timestamp"].max()-pd.Timedelta(days=90)]
X=g[feats].astype("float32").to_numpy(); y=g["Passengers_Boarded"].astype("float32").to_numpy()
sc=StandardScaler().fit(X[:int(len(X)*0.8)])
Xs=sc.transform(X).astype("float32")
Xw,yw=windows(Xs,y,W,H)
if len(Xw)<10: raise SystemExit("Not enough data for training window")
model=tf.keras.Sequential([
    tf.keras.layers.Input(shape=(W,Xw.shape[-1])),
    tf.keras.layers.GRU(32),
    tf.keras.layers.Dense(H)
])
model.compile(optimizer="adam", loss="mae")
model.fit(Xw,yw,epochs=8,batch_size=32,verbose=0)
model.save("dispatch_seq.keras")
print("Saved dispatch_seq.keras (GRU, 90-day slice)")
