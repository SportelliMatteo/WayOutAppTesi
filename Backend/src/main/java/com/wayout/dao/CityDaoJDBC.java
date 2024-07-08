package com.wayout.dao;

import com.wayout.model.City;

import java.io.IOException;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class CityDaoJDBC extends CityDao{
    private static CityDaoJDBC instance;
    private String getAllCities = "select * from citta";
    private String getAllNameCities = "select id, nome from citta where id != 0";

    private CityDaoJDBC(){
    }

    public static CityDaoJDBC getInstance(){
        if(instance == null)
            instance = new CityDaoJDBC();
        return instance;
    }
    @Override
    public List<City> getAll() throws SQLException, IOException {
        Statement stm = DBConnection.getInstance().getConnection().createStatement();
        ResultSet rs = stm.executeQuery(getAllCities);

        ArrayList<City> cities = new ArrayList<>();

        while (rs.next()) {
            City city = City.parseFromDB(rs);
            cities.add(city);
        }

        stm.close();
        rs.close();

        return cities;
    }

    @Override
    public void save(City obj) throws SQLException {

    }

    @Override
    public ArrayList<String> getAllNameCities() throws SQLException, IOException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(getAllNameCities);

        ResultSet rs = stm.executeQuery();
        ArrayList<String> cities = new ArrayList<>();
        while (rs.next()) {
            cities.add((rs.getString("nome")) + "," +  rs.getString("id"));
        }

        stm.close();
        rs.close();

        return cities;
    }
}
