package com.wayout.dao;

import com.wayout.model.City;

import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public abstract class CityDao implements Dao<City> {
    public abstract List<City> getAll() throws SQLException, IOException;
    public abstract void save(City obj) throws SQLException;
    public abstract ArrayList<String> getAllNameCities() throws SQLException, IOException;
}
