import pandas as pd
from flask import Flask, jsonify, request

app = Flask(__name__)

# Load data from the CSV file
charging_stations_df = pd.read_csv('charging_stations.csv')

# Convert dataframe to a list of dictionaries for easy access
charging_stations = charging_stations_df.to_dict(orient='records')

# Charging Stations and EV Population
@app.route('/api/charging-stations', methods=['GET'])
def list_charging_stations():
    # Calculate EV population statistics
    total_ev_count = charging_stations_df.shape[0]
    unique_models_count = charging_stations_df['Model'].nunique()

    # Include EV population statistics in the response
    response = {
        'charging_stations': charging_stations,
        'ev_population_statistics': {
            'total_ev_count': total_ev_count,
            'unique_models_count': unique_models_count,
        }
    }
    return jsonify(response)

# Charging Station Details
@app.route('/api/charging-stations/<int:station_id>', methods=['GET'])
def charging_station_details(station_id):
    station = next((station for station in charging_stations if station['station_id'] == station_id), None)
    if station:
        return jsonify(station)
    return "Charging station not found", 404

# List of EV Models
@app.route('/api/ev-models', methods=['GET'])
def list_ev_models():
    ev_models = charging_stations_df['Model'].unique().tolist()
    return jsonify(ev_models)

# Search Charging Stations by Location
@app.route('/api/charging-stations/search', methods=['GET'])
def search_charging_stations():
    # Implement location-based search logic here (latitude and longitude parameters from the request)
    # For simplicity, just return all stations for now
    return jsonify(charging_stations)

if __name__ == '__main__':
    app.run(debug=True)