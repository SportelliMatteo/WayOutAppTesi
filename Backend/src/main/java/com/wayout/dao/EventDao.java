package com.wayout.dao;

import com.wayout.model.Event;
import com.wayout.model.User;
import com.wayout.model.domain.Common.CityName;
import com.wayout.model.domain.Common.IdString;
import com.wayout.model.domain.User.Uid;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

public abstract class EventDao implements Dao<Event> {
    public abstract List<Event> getAll() throws SQLException, IOException;
    public abstract void save(Event obj) throws SQLException;
    public abstract List<Event> getAllEventsByCity(CityName cityName) throws SQLException, IOException;
    public abstract int getNumberOfEventsActiveByUser(IdString idUtente) throws SQLException, IllegalArgumentException, NullPointerException, IOException;
    public abstract int getNumberOfEventsUnActiveByUser(IdString idUtente) throws SQLException, IllegalArgumentException, NullPointerException, IOException;
    public abstract Event findEventById(String id) throws SQLException, NullPointerException, IllegalArgumentException, IOException;
    public abstract List<Event> getActiveEventByIdUtente(String uid) throws SQLException, IOException;
    public abstract List<Event> getUnactiveEventByIdUtente(String uid) throws SQLException, IOException;

}
