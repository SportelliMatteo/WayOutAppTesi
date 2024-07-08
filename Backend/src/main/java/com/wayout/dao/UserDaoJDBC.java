package com.wayout.dao;

import com.wayout.model.User;
import com.wayout.model.domain.Common.*;
import com.wayout.model.domain.User.*;
import org.apache.commons.lang3.StringUtils;

import java.io.IOException;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


public class UserDaoJDBC extends UserDao{

    private static UserDaoJDBC instance;

    private String getAllUsers = "select * from utente";
    private String saveUserQuery = "insert into utente values(?,?,?)";
    private String findByEmailQuery = "select * from utente where email=? and email != ''";
    private String findByUidQuery = "select * from utente where uid=? and uid != ''";
    private String updateUserQuery = "update utente set nome=?, cognome=?, nomeutente=?, datadinascita=?, statotelefono=?, prefissotelefonico=?, telefono=?, sesso=? where uid=?";
    private String updateUserQuery2 = "update utente set nome=?, cognome=?, datadinascita=?, statotelefono=?, prefissotelefonico=?, telefono=?, sesso=?, indirizzo=?, citta=?, stato=?, latitudine=?, longitudine=? where uid=?";
    private String updateUserUsernameQuery = "update utente set nomeutente=? where uid=?";
    private String updateUserAddressQuery = "update utente set indirizzo=?, citta=?, stato=?, latitudine=?, longitudine=? where uid=?";
    private String checkUsernameQuery = "select * from utente where nomeutente=?";

    private UserDaoJDBC() {
    }

    public static UserDaoJDBC getInstance() {
        if (instance == null)
            instance = new UserDaoJDBC();

        return instance;
    }
    @Override
    public List<User> getAll() throws SQLException, IOException {
        Statement stm = DBConnection.getInstance().getConnection().createStatement();
        ResultSet rs = stm.executeQuery(getAllUsers);

        ArrayList<User> users = new ArrayList<>();

        while (rs.next()) {
            User utente = User.parseFromDB(rs);
            users.add(utente);
        }

        stm.close();
        rs.close();

        return users;
    }
    @Override
    public void save(User obj) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(saveUserQuery);
        IdString idString = new IdString(UUID.randomUUID().toString());
        stm.setString(1, idString.toString());
        stm.setString(2, obj.getEmail());
        stm.setString(3, obj.getUid());

        stm.execute();

        stm.close();
    }

    @Override
    public boolean findByUid(String uid) throws SQLException, IllegalArgumentException, NullPointerException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(findByUidQuery);
        stm.setString(1, uid);

        ResultSet rs = stm.executeQuery();
        boolean res = false;
        if (rs.next()) {
            String uidInDb = rs.getString("uid");
            if(uid.equals(uidInDb)){
                res = true;
            }
        }

        rs.close();
        stm.close();

        return res;
    }

    @Override
    public void updateUser(Name name, Surname surname, Username username, DateOfBirthday dateOfBirthday, String statoTelefono, String prefissoTelefono, Telephone telephone, Gender gender, String uid) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(updateUserQuery);
        stm.setString(1, StringUtils.capitalize(name.toString()));
        stm.setString(2, StringUtils.capitalize(surname.toString()));
        stm.setString(3, username.toString().toLowerCase());
        stm.setString(4, dateOfBirthday.toString());
        stm.setString(5, statoTelefono);
        stm.setString(6, prefissoTelefono);
        stm.setString(7, telephone.toString());
        stm.setString(8, gender.toString().toLowerCase());
        stm.setString(9, uid);

        stm.execute();
        stm.close();
    }

    @Override
    public void updateUser2(Name name, Surname surname, DateOfBirthday dateOfBirthday, String statoTelefono, String prefissoTelefono, Telephone telephone, Gender gender, Address indirizzo, CityName citta, State stato, Latitude latitudine, Longitude longitudine, String uid) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(updateUserQuery2);
        stm.setString(1, StringUtils.capitalize(name.toString()));
        stm.setString(2, StringUtils.capitalize(surname.toString()));
        stm.setString(3, dateOfBirthday.toString());
        stm.setString(4, statoTelefono);
        stm.setString(5, prefissoTelefono);
        stm.setString(6, telephone.toString());
        stm.setString(7, gender.toString().toLowerCase());
        stm.setString(8, indirizzo.toString());
        stm.setString(9, citta.toString());
        stm.setString(10, stato.toString());
        stm.setString(11, latitudine.toString());
        stm.setString(12, longitudine.toString());
        stm.setString(13, uid);

        stm.execute();
        stm.close();
    }

    @Override
    public void updateUserUsername(Username username, String uid) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(updateUserUsernameQuery);
        stm.setString(1, username.toString().toLowerCase());
        stm.setString(2, uid);

        stm.execute();
        stm.close();
    }

    @Override
    public boolean checkUsernameAlreadyExists(Username username) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(checkUsernameQuery);
        stm.setString(1, username.toString());

        ResultSet rs = stm.executeQuery();
        boolean res = false;
        if (rs.next()) {
            res = true;
        }

        rs.close();
        stm.close();

        return res;
    }

    @Override
    public void updateUserAddress(Address indirizzo, CityName cityName, State state, Latitude latitude, Longitude longitude, String uid) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(updateUserAddressQuery);
        stm.setString(1, indirizzo.toString());
        stm.setString(2, cityName.toString());
        stm.setString(3, state.toString());
        stm.setString(4, latitude.toString());
        stm.setString(5, longitude.toString());
        stm.setString(6, uid);

        stm.execute();
        stm.close();
    }

    @Override
    public User findUserByEmail(Email email) throws SQLException, IllegalArgumentException, NullPointerException, IOException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(findByEmailQuery);
        stm.setString(1, email.toString());

        ResultSet rs = stm.executeQuery();
        User utente = null;
        if (rs.next()) {
            utente = User.parseFromDB(rs);
        }

        rs.close();
        stm.close();

        return utente;
    }

    @Override
    public User findUserByUid(String uid) throws SQLException, NullPointerException, IllegalArgumentException, IOException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(findByUidQuery);
        stm.setString(1, uid);

        ResultSet rs = stm.executeQuery();
        User utente = null;
        if (rs.next()) {
            utente = User.parseFromDB(rs);
        }

        rs.close();
        stm.close();

        return utente;
    }



}
