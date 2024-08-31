package com.wayout.dao;

import com.wayout.model.Event;
import com.wayout.model.User;
import com.wayout.model.domain.Common.*;
import com.wayout.model.domain.User.Uid;
import org.apache.commons.lang3.StringUtils;

import java.io.IOException;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class EventDaoJDBC extends  EventDao {

    private static EventDaoJDBC instance;

    private String getAllEvents = "select * from evento";
    private String saveEventQuery = "insert into evento values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    private String getAllEventsByCityQuery = "SELECT E.*, C.nome AS nome_citta, C.latitudine AS latitudine_citta, C.longitudine AS longitudine_citta, C.id AS id_citta, CC.id AS id_club, CC.citta AS citta_club, CC.nomeclub AS nome_club, CC.indirizzo AS indirizzo_club, CC.latitudine AS latitudine_club, CC.longitudine AS longitudine_club, U.nome AS nome_utente, U.cognome AS cognome_utente, U.uid AS uid_utente FROM evento AS E JOIN citta AS C ON E.citta_club = C.id JOIN club AS CC ON E.club  = CC.id JOIN utente as U on E.id_utente = U.id WHERE C.nome=? AND E.approvato = true OR E.citta=?";
    private String findNumberEventsActiveByUserQuery = "select count(*) as numero_eventi_approvati from evento where id_utente=? and approvato = true";
    private String findNumberEventsUnActiveByUserQuery = "select count(*) as numero_eventi_in_attesa from evento where id_utente =? and approvato = false";
    private String findEventByIdQuery = "SELECT E.id, E.id_utente, E.tipologiaevento, E.nomeevento, E.citta_club, E.club, E.indirizzo, E.data, E.prezzouomo, E.prezzodonna, E.postiuomo, E.postidonna , C.nome AS nome_citta, C.latitudine AS latitudine_citta, C.longitudine AS longitudine_citta, C.id AS id_citta, CC.id AS id_club, CC.citta AS citta_club, CC.nomeclub AS nome_club, CC.indirizzo AS indirizzo_club, CC.latitudine AS latitudine_club, CC.longitudine AS longitudine_club FROM evento AS E JOIN citta AS C ON E.citta_club = C.id JOIN club AS CC ON E.club = CC.id WHERE E.id = ?";
    private String getActiveEventByIdUtente = "SELECT E.*, C.nome AS nome_citta, C.latitudine AS latitudine_citta, C.longitudine AS longitudine_citta, C.id AS id_citta, CC.id AS id_club, CC.citta AS citta_club, CC.nomeclub AS nome_club, CC.indirizzo AS indirizzo_club, CC.latitudine AS latitudine_club, CC.longitudine AS longitudine_club, U.nome AS nome_utente, U.cognome AS cognome_utente, U.uid AS uid_utente FROM evento AS E JOIN citta AS C ON E.citta_club = C.id JOIN club AS CC ON E.club  = CC.id JOIN utente as U on E.id_utente = U.id WHERE U.uid =? and E.approvato = true";
    private String getUnactiveEventByIdUtente = "SELECT E.*, C.nome AS nome_citta, C.latitudine AS latitudine_citta, C.longitudine AS longitudine_citta, C.id AS id_citta, CC.id AS id_club, CC.citta AS citta_club, CC.nomeclub AS nome_club, CC.indirizzo AS indirizzo_club, CC.latitudine AS latitudine_club, CC.longitudine AS longitudine_club, U.nome AS nome_utente, U.cognome AS cognome_utente, U.uid AS uid_utente FROM evento AS E JOIN citta AS C ON E.citta_club = C.id JOIN club AS CC ON E.club  = CC.id JOIN utente as U on E.id_utente = U.id WHERE U.uid =? and E.approvato = false";
    private String getPostiUomo = "select postiuomo from evento where id=?";
    private String getPostiDonna = "select postidonna from evento where id=?";
    private String updatePostiUomo = "update evento set postiuomo=? where id=?";
    private String updatePostiDonna = "update evento set postidonna=? where id=?";
    private EventDaoJDBC(){
    }

    public static EventDaoJDBC getInstance(){
        if(instance == null)
            instance = new EventDaoJDBC();

        return instance;
    }

    @Override
    public List<Event> getAll() throws SQLException, IOException {
        Statement stm = DBConnection.getInstance().getConnection().createStatement();
        ResultSet rs = stm.executeQuery(getAllEvents);

        ArrayList<Event> events = new ArrayList<>();

        while(rs.next()){
            Event event = Event.parseFromDB(rs);
            events.add(event);
        }

        stm.close();
        rs.close();

        return events;
    }

    @Override
    public void save(Event obj) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(saveEventQuery);
        stm.setString(1, obj.getId());
        stm.setString(2, obj.getIdUtente());
        stm.setString(3, StringUtils.capitalize(obj.getEventType()));
        stm.setString(4, StringUtils.capitalize(obj.getEventName()));
        stm.setInt(5, obj.getCityClubId());
        stm.setInt(6, obj.getClubId());
        stm.setString(7, obj.getAddress());
        stm.setString(8, obj.getCityName());
        stm.setString(9, obj.getLatitude());
        stm.setString(10, obj.getLongitude());
        stm.setString(11, StringUtils.capitalize(obj.getDrinkPreference()));
        stm.setString(12, obj.getDescription());
        stm.setString(13, obj.getDate());
        stm.setString(14, obj.getManSeat());
        stm.setString(15, obj.getManPrice());
        stm.setString(16, obj.getWomanSeat());
        stm.setString(17, obj.getWomanPrice());
        stm.setBoolean(18, obj.isApprovato());

        stm.execute();
        stm.close();
    }


    @Override
    public List<Event> getAllEventsByCity(CityName cityName) throws SQLException, IOException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(getAllEventsByCityQuery);
        stm.setString(1, cityName.toString());
        stm.setString(2, cityName.toString());

        ResultSet rs = stm.executeQuery();
        ArrayList<Event> events = new ArrayList<>();
        while (rs.next()) {
            Event event = Event.parseFromDBComplete(rs);
            events.add(event);
        }

        stm.close();
        rs.close();

        return events;
    }

    @Override
    public int getNumberOfEventsActiveByUser(IdString idUtente) throws SQLException, IllegalArgumentException, NullPointerException, IOException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(findNumberEventsActiveByUserQuery);
        stm.setString(1, idUtente.toString());

        ResultSet rs = stm.executeQuery();
        int numeroEventiAttivi = 0;
        if (rs.next()) {
            numeroEventiAttivi =rs.getInt("numero_eventi_approvati");
        }

        rs.close();
        stm.close();

        return numeroEventiAttivi;
    }

    @Override
    public int getNumberOfEventsUnActiveByUser(IdString idUtente) throws SQLException, IllegalArgumentException, NullPointerException, IOException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(findNumberEventsUnActiveByUserQuery);
        stm.setString(1, idUtente.toString());

        ResultSet rs = stm.executeQuery();
        int numeroEventiInAttesa = 0;
        if (rs.next()) {
            numeroEventiInAttesa =rs.getInt("numero_eventi_in_attesa");
        }

        rs.close();
        stm.close();

        return numeroEventiInAttesa;
    }


    @Override
    public Event findEventById(String id) throws SQLException, NullPointerException, IllegalArgumentException, IOException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(findEventByIdQuery);
        stm.setString(1, id);

        ResultSet rs = stm.executeQuery();
        Event evento = null;
        if (rs.next()) {
            evento = Event.parseFromDBForPayment(rs);
        }

        rs.close();
        stm.close();

        return evento;
    }

    @Override
    public List<Event> getActiveEventByIdUtente(String uid) throws SQLException, IOException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(getActiveEventByIdUtente);
        stm.setString(1, uid);

        ResultSet rs = stm.executeQuery();
        ArrayList<Event> events = new ArrayList<>();
        while (rs.next()) {
            Event event = Event.parseFromDBComplete(rs);
            events.add(event);
        }

        stm.close();
        rs.close();

        return events;
    }

    @Override
    public List<Event> getUnactiveEventByIdUtente(String uid) throws SQLException, IOException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(getUnactiveEventByIdUtente);
        stm.setString(1, uid);

        ResultSet rs = stm.executeQuery();
        ArrayList<Event> events = new ArrayList<>();
        while (rs.next()) {
            Event event = Event.parseFromDBComplete(rs);
            events.add(event);
        }

        stm.close();
        rs.close();

        return events;
    }

    @Override
    public int getPostiUomo(String id) throws SQLException, NullPointerException, IllegalArgumentException, IOException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(getPostiUomo);
        stm.setString(1, id);

        ResultSet rs = stm.executeQuery();
        int postiuomo = 0;
        if (rs.next()) {
            postiuomo = rs.getInt("postiuomo");
        }

        rs.close();
        stm.close();

        return postiuomo;
    }
    @Override
    public int getPostiDonna(String id) throws SQLException, NullPointerException, IllegalArgumentException, IOException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(getPostiDonna);
        stm.setString(1, id);

        ResultSet rs = stm.executeQuery();
        int postidonna = 0;
        if (rs.next()) {
            postidonna = rs.getInt("postidonna");
        }

        rs.close();
        stm.close();

        return postidonna;
    }

    @Override
    public void updatePostiUomo(IdString idEvento, int postiUomo) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(updatePostiUomo);
        stm.setInt(1, postiUomo);
        stm.setString(2, String.valueOf(idEvento));

        stm.execute();
        stm.close();
    }
    @Override
    public void updatePostiDonna(IdString idEvento, int postidonna) throws SQLException {
        PreparedStatement stm = DBConnection.getInstance().getConnection().prepareStatement(updatePostiDonna);
        stm.setInt(1, postidonna);
        stm.setString(2, String.valueOf(idEvento));

        stm.execute();
        stm.close();
    }

}
