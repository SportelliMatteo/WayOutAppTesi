package com.wayout.dao;

import com.wayout.model.Club;
import com.wayout.model.domain.Common.IdInt;

import java.io.IOException;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class ClubDaoJBC extends  ClubDao{
    private static  ClubDaoJBC instance;

    private String getAllClubs = "select * from club";
    private String getAllClubsByCity = "select id, nomeclub from club where citta=? and id != 0";

    private ClubDaoJBC(){
    }

    public static ClubDaoJBC getInstance(){
        if(instance == null)
            instance = new ClubDaoJBC();

        return instance;
    }

    @Override
    public List<Club> getAll() throws SQLException, IOException {
        Statement stm = DBConnection.getInstance().getConnection().createStatement();
        ResultSet rs = stm.executeQuery(getAllClubs);

        ArrayList<Club> clubs = new ArrayList<>();

        while (rs.next()) {
            Club club = Club.parseFromDB(rs);
            clubs.add(club);
        }

        stm.close();
        rs.close();

        return clubs;
    }

    @Override
    public void save(Club obj) throws SQLException {

    }

    @Override
    public ArrayList<String> getAllClubsByCity(IdInt cityId) throws SQLException, IOException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(getAllClubsByCity);

        stm.setInt(1, cityId.getValue());

        ResultSet rs = stm.executeQuery();
        ArrayList<String> clubs = new ArrayList<>();
        while (rs.next()) {
            clubs.add((rs.getString("nomeclub")) + "," +  rs.getString("id"));
        }

        stm.close();
        rs.close();

        return clubs;
    }
}
