# EV app project 3WEEK 17
# this app shows a list of Electric Vehicules per city in US
# also show a list of charge stations per City in US
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

# import Flask
from flask import Flask, jsonify

# reflect an existing database into a new model

# Database Setup
engine = create_engine("sqlite:///project3.db")
Base = automap_base()


# reflect the tables
Base.prepare(autoload_with=engine)
Base.prepare(engine, reflect=True)

# Save reference to the tables
ref_merged_data1_tb = Base.classes.merged_data2
# ref_station_tb = Base.classes.station


# Create an app, being sure to pass __name__
app = Flask(__name__)


# Define what to do when a user hits the index route
@app.route("/")
def welcome():
    """All available api routes list."""
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/Car_brands_per_city<br/>"
        f"/api/v1.0/Charge_stations_per_city<br/>"
        # f"/api/v1.0/stations_per_maker<br/>"
        f"/api/v1.0/all_stations_around_US<br/>"
    )


@app.route("/api/v1.0/Car_brands_per_city")
def city_make():
    # Create our session (link) from Python to the DB
    session = Session(engine)
    # Query all cities
    cities_list = session.query(ref_merged_data1_tb.City).all()
    # Query all cities and makers
    results = session.query(ref_merged_data1_tb.City, ref_merged_data1_tb.Make).all()

    session.close()
    
    already_add_city = []
    all_carxcities = []
    row_count = 0
    row_count_city = 0
    # the following for will check every row in the table
    for city_name, markedn in results:
        do_it = 0
        size_list = len(already_add_city)
        got_in = 0
        if size_list > 0:
            # print("esto es size_list >0")
            for already_city_added in already_add_city:
                # print("for already_city_added")
                if already_city_added == city_name:
                    do_it = 1

        if size_list >= 0:
            if do_it == 0:
                already_add_city.append(city_name)

            row_count = 0

            maker_list = []
            count_city = 0
            
            for cities2, maker in results:
                if cities2 == city_name:
                    
                    # create a new dictionary with new city
                    if count_city == 0 and got_in == 0:
                        carxcity_dict = {}
                        carxcity_dict["City"] = cities2  # city_name
                        count_city = 1
                        got_in = 1
                    # the followin if insert a maker in a list
                    # also check if the maker doesn't exist in the list
                    if len(maker_list) > 0:
                        count_made = 0
                        
                        for made in maker_list:
                            if made == maker:
                                count_made = 1
                        if count_made == 0:
                            
                            maker_list.append(maker)
                    else:
                        
                        maker_list.append(maker)

                    # the following if control to read just 50rows
                if row_count == 100:
                    break

                
                row_count += 1
        # the following if control to read just 50rows
        if got_in == 1:
            carxcity_dict["Maker"] = maker_list
            all_carxcities.append(carxcity_dict)
        if row_count_city == 50:
            break
        
        row_count_city += 1

    return jsonify(all_carxcities)



@app.route("/api/v1.0/Charge_stations_per_city")
def stations_city():
    session = Session(engine)

    # Query all dates
    results = session.query(
        ref_merged_data1_tb.City,
        ref_merged_data1_tb.Latitude,
        ref_merged_data1_tb.Longitude,
    ).all()

    session.close()
    
    all_stationxcities = []
    row_count = 0
    already_add_city = []
    all_carxcities = []
    row_count = 0
    row_count_city = 0
    # the following for will check every row in the table
    for city_name, lat, long in results:
        do_it = 0
        size_list = len(already_add_city)

        if size_list > 0:
            # print("esto es size_list >0")
            for already_city_added in already_add_city:
                # print("for already_city_added")
                if already_city_added == city_name:
                    do_it = 1

        if size_list >= 0:
            if do_it == 0:
                already_add_city.append(city_name)
            row_count = 0

            latlong_list = []
            count_city = 0
            # the following for check the city name and create dictionary
            for cities2, lat, long in results:
                if cities2 == city_name:
                    
                    # create a new dictionary with new city
                    if count_city == 0:
                        stationxcities_dict = {}
                        stationxcities_dict["City"] = cities2  # city_name
                        count_city = 1
                    # the followin if insert a maker in a list
                    # also check if the maker doesn't exist in the list
                    if len(latlong_list) > 0:
                        
                        location_charge = "lat:" + str(lat) + "lon:" + str(long)
                        # print(f"if made{made} = mark{maker}")
                        latlong_list.append(location_charge)
                    else:
                        location_charge = "lat:" + str(lat) + "lon:" + str(long)
                        latlong_list.append(location_charge)

                # the following if control to read just 50rows
                if row_count == 100:
                    stationxcities_dict["location"] = latlong_list
                    # stationxcities_dict["longitude"] = long
                    all_stationxcities.append(stationxcities_dict)
                    break
                row_count += 1
        # the following if control to read just 50rows

        if row_count_city == 50:
            break

        row_count_city += 1

    return jsonify(all_stationxcities)


@app.route("/api/v1.0/stations_per_maker")
def stations_marker():
    session = Session(engine)

    # Query all dates
    results = session.query(
        ref_merged_data1_tb.Make,
        ref_merged_data1_tb.Latitude,
        ref_merged_data1_tb.Longitude,
    ).all()

    session.close()

    all_stationxcities = []
    row_count = 0
    already_add_city = []
    all_carxcities = []
    row_count = 0
    row_count_city = 0
    # the following for will check every row in the table
    for makerd, lat, long in results:
        do_it = 0
        size_list = len(already_add_city)
        city_name = makerd
        count_city = 0
        if size_list > 0:
            # print("esto es size_list >0")
            for already_city_added in already_add_city:
                # print("for already_city_added")
                if already_city_added == city_name:
                    do_it = 1

        if size_list >= 0:
            if do_it == 0:
                already_add_city.append(city_name)
            row_count = 0

            latlong_list = []
            # count_city = 0
            # the following for check the city name and create dictionary
            for make2, lat, long in results:
                cities2 = make2
                if cities2 == city_name:
                    # if count_city == 0 mean city doesn't exist so
                    # create a new dictionary with new city
                    if count_city == 0:
                        stationxcities_dict = {}
                        stationxcities_dict["Maker"] = cities2  # city_name
                        count_city = 1
                    # the followin if insert a maker in a list
                    # also check if the maker doesn't exist in the list
                    if len(latlong_list) > 0:
                        
                        location_charge = "lat:" + str(lat) + "lon:" + str(long)
                        # print(f"if made{made} = mark{maker}")
                        latlong_list.append(location_charge)
                    else:
                        location_charge = "lat:" + str(lat) + "lon:" + str(long)
                        latlong_list.append(location_charge)

                # the following if control to read just 50rows
                if row_count == 100:
                    stationxcities_dict["location"] = latlong_list
                    # stationxcities_dict["longitude"] = long
                    all_stationxcities.append(stationxcities_dict)
                    break
                row_count += 1
        # the following if control to read just 50rows

        if row_count_city == 50:
            break
        row_count_city += 1

    
    return jsonify(all_stationxcities)


@app.route("/api/v1.0/all_stations_around_US")
def stations_all():
    session = Session(engine)

    # Query all dates
    results = session.query(
        ref_merged_data1_tb.Make,
        ref_merged_data1_tb.Latitude,
        ref_merged_data1_tb.Longitude,
    ).all()

    session.close()
    
    all_station = []
    row_count = 0
    for make, lat, long in results:
        station_dict = {}
        station_dict["latitude"] = lat
        station_dict["longitude"] = long
        if row_count == 200:
            break
        row_count += 1

        all_station.append(station_dict)
        # list_stations = "this is charge stations_per_maker"
    return jsonify(all_station)


if __name__ == "__main__":
    app.run(debug=True)
