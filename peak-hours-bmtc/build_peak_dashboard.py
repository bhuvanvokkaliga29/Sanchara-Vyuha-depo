import pandas as pd, os, base64
from datetime import datetime

DISPATCH = r"C:\Users\HP\Downloads\peak-hours\dispatch_next_3h_explained.csv"
PLOTS_DIR = r"C:\Users\HP\Downloads\peak-hours\plots"
OUT_HTML = r"C:\Users\HP\Downloads\peak-hours\dashboard_peak.html"

def img_b64(path):
    try:
        with open(path, "rb") as f:
            return "data:image/png;base64," + base64.b64encode(f.read()).decode("ascii")
    except Exception:
        return ""

df = pd.read_csv(DISPATCH, parse_dates=["T+1_Timestamp","T+2_Timestamp","T+3_Timestamp"])
df = df.sort_values(["Route_ID","Bus_Stop_ID","T+1_Timestamp"])

cards=[]
for _, r in df.iterrows():
    guess1 = os.path.join(PLOTS_DIR, f"history_{r['Bus_Stop_ID']}_{r['Route_ID']}.png")
    img = img_b64(guess1) if os.path.exists(guess1) else ""
    img_html = f"<img class='plot' src='{img}'/>" if img else "<div class='plot-missing'>No plot</div>"
    cards.append(f"""
    <div class="card">
      <div class="hdr"><span class="tag">Route</span> {r['Route_ID']} &nbsp; <span class="tag">Stop</span> {r['Bus_Stop_ID']}</div>
      <div class="grid">
        <div>
          <h4>Next 3 hours</h4>
          <table class="mini">
            <tr><th>Timestamp</th><th>Pred</th><th>Buses</th></tr>
            <tr><td>{r['T+1_Timestamp']}</td><td>{r['Pred_t+1']:.1f}</td><td>{int(r['Buses_t+1'])}</td></tr>
            <tr><td>{r['T+2_Timestamp']}</td><td>{r['Pred_t+2']:.1f}</td><td>{int(r['Buses_t+2'])}</td></tr>
            <tr><td>{r['T+3_Timestamp']}</td><td>{r['Pred_t+3']:.1f}</td><td>{int(r['Buses_t+3'])}</td></tr>
          </table>
          <p class="reason">{r['Dispatch_Reason']}</p>
          <p class="meta">Capacity {int(r['Bus_Capacity'])}, Load factor {r['Load_Factor']:.2f}</p>
        </div>
        <div>{img_html}</div>
      </div>
    </div>
    """)

html=f"""<!doctype html>
<html><head><meta charset="utf-8"/>
<meta http-equiv="refresh" content="300">
<title>Peak Dispatch Dashboard</title>
<style>
 body{{font-family:Segoe UI,Roboto,Arial,sans-serif;margin:24px;background:#fafafa;color:#222}}
 .sub{{color:#666;margin-bottom:18px}}
 .card{{background:#fff;border:1px solid #eee;border-radius:10px;margin:16px 0;padding:16px;box-shadow:0 1px 3px rgba(0,0,0,.05)}}
 .hdr{{font-weight:600;margin-bottom:8px}}
 .tag{{display:inline-block;background:#eef;color:#224;border-radius:6px;padding:2px 6px;margin-right:6px}}
 .grid{{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:center}}
 .mini{{border-collapse:collapse;width:100%}}
 .mini th,.mini td{{border-bottom:1px solid #eee;padding:6px 8px;text-align:left}}
 .mini th{{background:#f7f7fb}}
 .reason{{background:#f9f9f9;border-left:4px solid #6aa84f;padding:8px;border-radius:6px}}
 .meta{{color:#666;font-size:12px}}
 .plot{{width:100%;border:1px solid #eee;border-radius:8px}}
 .plot-missing{{background:#f3f3f3;height:220px;display:flex;align-items:center;justify-content:center;color:#888;border-radius:8px}}
 @media (max-width:900px){{.grid{{grid-template-columns:1fr}}}}
</style></head>
<body>
  <h1>Peak Dispatch Dashboard</h1>
  <div class="sub">Generated at {datetime.now().strftime("%Y-%m-%d %H:%M")}</div>
  {''.join(cards) if cards else "<p>No rows. Run the dispatch script first.</p>"}
</body></html>"""

with open(OUT_HTML,"w",encoding="utf-8") as f:
    f.write(html)
print("Wrote", OUT_HTML)
