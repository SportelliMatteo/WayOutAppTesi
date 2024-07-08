package com.wayout.model;

import com.wayout.model.domain.Common.*;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;

public class City {
    private IdInt idInt;
    private CityName cityName;
    private Latitude latitude;
    private Longitude longitude;

    public IdInt getId() {return idInt;}
    public void setId(IdInt idInt) {this.idInt = idInt;}
    public String getCityName() {return cityName.toString();}
    public void setCityName(CityName cityName) {this.cityName = cityName;}
    public String getLatitude() {return latitude.toString();}
    public void setLatitude(Latitude latitude) {this.latitude = latitude;}
    public String getLongitude() {return longitude.toString();}
    public void setLongitude(Longitude longitude) {this.longitude = longitude;}

    public City(IdInt idInt, CityName cityName, Latitude latitude, Longitude longitude) {
        this.idInt = idInt;
        this.cityName = cityName;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public City(CityName cityName) {

        this.cityName = cityName;
    }

    public City() {
    }

    public static City parseFromDB(ResultSet rs) throws SQLException, IllegalArgumentException, NullPointerException, IOException {
        City city = new City();
        city.setId(new IdInt(rs.getInt("id")));
        city.setCityName(new CityName(rs.getString("nome")));
        city.setLatitude(new Latitude(rs.getString("latitudine")));
        city.setLongitude(new Longitude(rs.getString("longitudine")));


        return city;
    }
}
