package com.wayout.model;

import com.wayout.model.domain.Club.ClubName;
import com.wayout.model.domain.Common.*;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;

public class Club {
    private IdInt idInt;
    private CityName cityName;
    private ClubName clubName;
    private Address address;
    private Latitude latitude;
    private Longitude longitude;

    public IdInt getId() {return idInt;}
    public void setId(IdInt idInt) {this.idInt = idInt;}
    public String getCity() {return cityName.toString();}
    public void setCity(CityName cityName) {this.cityName = cityName;}
    public String getAddress() {return address.toString();}
    public void setAddress(Address address) {this.address = address;}
    public String getLatitude() {return latitude.toString();}
    public void setLatitude(Latitude latitude) {this.latitude = latitude;}
    public String getLongitude() {return longitude.toString();}
    public void setLongitude(Longitude longitude) {this.longitude = longitude;}
    public String getClubName() {return clubName.toString();}
    public void setClubName(ClubName clubName) {this.clubName = clubName;}

    public Club(IdInt idInt, CityName cityName, ClubName clubName, Address address, Latitude latitude, Longitude longitude) {
        this.idInt = idInt;
        this.cityName = cityName;
        this.clubName = clubName;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public Club(ClubName clubName) {

        this.clubName = clubName;

    }

    public Club() {
    }

    public static Club parseFromDB(ResultSet rs) throws SQLException, IllegalArgumentException, NullPointerException, IOException {
        Club club = new Club();
        club.setId(new IdInt(rs.getInt("id")));
        club.setCity(new CityName(rs.getString("citta")));
        club.setAddress(new Address(rs.getString("indirizzo")));
        club.setLatitude(new Latitude(rs.getString("latitudine")));
        club.setLongitude(new Longitude(rs.getString("longitudine")));

        return club;
    }
}
