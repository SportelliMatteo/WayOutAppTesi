package com.wayout.dao;

import com.wayout.model.Club;
import com.wayout.model.domain.Common.IdInt;

import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public abstract class ClubDao implements  Dao<Club> {
    public abstract List<Club> getAll() throws SQLException, IOException;
    public abstract void save(Club obj) throws SQLException;
    public abstract ArrayList<String> getAllClubsByCity(IdInt cityId) throws SQLException, IOException;
}
