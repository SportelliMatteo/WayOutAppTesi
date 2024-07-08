package com.wayout.dao;

import com.wayout.model.User;
import com.wayout.model.domain.Common.*;
import com.wayout.model.domain.User.*;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

public abstract class UserDao implements Dao<User> {

    public abstract List<User> getAll() throws SQLException, IOException;
    public abstract void save(User obj) throws SQLException;
    public abstract boolean findByUid(String uid) throws SQLException, IllegalArgumentException, NullPointerException;
    public abstract void updateUser(Name name, Surname surname, Username username, DateOfBirthday dateOfBirthday, String statoTelefono, String prefissoTelefono, Telephone telephone, Gender gender, String uid) throws SQLException;
    public abstract void updateUser2(Name name, Surname surname, DateOfBirthday dateOfBirthday, String statoTelefono, String prefissoTelefono, Telephone telephone, Gender gender, Address indirizzo, CityName citta, State stato, Latitude latitudine, Longitude longitudine, String uid) throws SQLException;
    public abstract void updateUserUsername(Username username, String uid) throws SQLException;
    public abstract boolean checkUsernameAlreadyExists(Username username) throws SQLException;
    public abstract void updateUserAddress(Address indirizzo, CityName cityName, State state, Latitude latitude, Longitude longitude, String uid) throws SQLException;
    public abstract User findUserByEmail(Email email) throws SQLException, IllegalArgumentException, NullPointerException, IOException;
    public abstract User findUserByUid(String uid) throws SQLException, NullPointerException, IllegalArgumentException, IOException;

}
