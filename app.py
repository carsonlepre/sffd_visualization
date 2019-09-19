import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


#################################################
# Database Setup
#################################################

engine = create_engine('sqlite:///db/sffd_call_data.db')

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")

@app.route("/day_of_week_total/<day>")
def day_of_week_total(day):

    """Returns number of calls per hour and day of week."""
    sql = "select hour, count(incident_number) calls from call_data where day_of_week = "+str(day)+" group by hour"
    df = pd.read_sql_query(sql,con=engine)

    data = {
        "hour": df.hour.values.tolist(),
        "calls": df.calls.values.tolist(),
    }
    return jsonify(data)

@app.route("/day_of_week_area/<day>")
def day_of_week_area(day):

    """Returns number of calls per area and day of week."""
    sql = "select station_area, count(incident_number) calls from call_data where day_of_week = "+str(day)+" group by station_area"
    df = pd.read_sql_query(sql,con=engine)    
    data = {
        "station_area": df.station_area.values.tolist(),
        "calls": df.calls.values.tolist(),
    }
    return jsonify(data)

@app.route("/day_of_week_area_one/<day>/<area>")
def day_of_week_area_one(day,area):

    """Returns number of calls for one area and day of week."""
    if (area == '27' or area == '30'):
        return '0'
    else:
        sql = "select count(incident_number) calls from call_data where day_of_week = " + str(day) + " and station_area = " + str(area) + " group by day_of_week, station_area"
        df = pd.read_sql_query(sql,con=engine)  
        return str(df.iloc[0,0])

@app.route("/map_calls/<day>/<hour>")
def map_calls(day,hour):

    """Returns number of calls for one area and day of week."""
    if hour == '24':
        sql = "select count(incident_number) calls, station_area from call_data where day_of_week = " + str(day) + " group by station_area"
    else:    
        sql = "select count(incident_number) calls, station_area from call_data where day_of_week = " + str(day) + " and hour = " + str(hour) + " group by station_area"
    df = pd.read_sql_query(sql,con=engine)  

    data = {
        "station_area": df.station_area.values.tolist(),
        "calls": df.calls.values.tolist(),
    }
    return jsonify(data)

@app.route("/map_responses/<day>/<hour>")
def map_responses(day,hour):

    """Returns number of calls for one area and day of week."""
    if hour == '24':
        sql = "select (sum(case when response_time > 10 then 1.0 else 0 end))/count(incident_number) calls, station_area from call_data where day_of_week = " + str(day) + " and final_priority= 3 group by station_area"
    else:    
        sql = "select (sum(case when response_time > 10 then 1.0 else 0 end))/count(incident_number) calls, station_area from call_data where day_of_week = " + str(day) + " and final_priority= 3 and hour = " + str(hour) + " group by station_area"
    df = pd.read_sql_query(sql,con=engine)  

    data = {
        "station_area": df.station_area.values.tolist(),
        "calls": df.calls.values.tolist(),
    }
    return jsonify(data)


@app.route("/total_calls")
def total_calls():

    df = pd.read_sql_query('select * from total_calls order by calls desc',con=engine)

    # Format the data to send as json
    data = {
        "station_area": df.station_area.values.tolist(),
        "calls": df.calls.values.tolist(),
    }
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)
