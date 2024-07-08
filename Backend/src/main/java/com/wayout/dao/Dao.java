package com.wayout.dao;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

public interface Dao <T>{

    List<T> getAll() throws SQLException, IOException;
    void save(T obj) throws SQLException;

}
