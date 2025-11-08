from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

CSV_FILE = '../backend_database/bmtc_cctv_counts.csv'

@app.route('/')
def index():
    return send_from_directory('../frontend', 'index.html')

@app.route('/api/busstop-counts', methods=['GET'])
def get_busstop_counts():
    try:
        df = pd.read_csv(CSV_FILE, header=None)
        latest_row = df.iloc[-1]
        timestamp = latest_row.iloc[0]
        
        busstop_data = []
        busstop_columns = [2, 4, 6, 8, 10, 12, 14, 16, 18]
        
        for i, col_idx in enumerate(busstop_columns, start=1):
            busstop_data.append({
                'name': f'Bus Stop {i}',
                'count': int(latest_row.iloc[col_idx])
            })
        
        total_count = int(latest_row.iloc[-1])
        
        return jsonify({
            'timestamp': timestamp,
            'busstops': busstop_data,
            'total': total_count
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
