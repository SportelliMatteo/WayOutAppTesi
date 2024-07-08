package com.wayout.model;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Bucket;
import com.google.cloud.storage.Storage;
import com.wayout.firebase.Firebase;
import com.wayout.model.domain.Club.ClubName;
import com.wayout.model.domain.Common.*;
import com.wayout.model.domain.Event.*;
import com.wayout.model.domain.User.Name;
import com.wayout.model.domain.User.Surname;
import com.wayout.model.domain.User.Uid;
import org.checkerframework.checker.units.qual.A;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class Event {

    private IdString idString;
    private String cover;
    private IdString idStringUtente;
    private EventType eventType;
    private EventName eventName;
    private IdInt cityClubId;
    private IdInt clubId;
    private Address address;
    private CityName cityName;
    private Longitude longitude;
    private Latitude latitude;
    private DrinkPreference drinkPreference;
    private Description description;
    private Date date;
    private Seat manSeat;
    private Seat womanSeat;
    private Price manPrice;
    private Price womanPrice;

    //Secondo parsFromDB
    private City city;
    private Club club;
    private User user;
    private List<String> profileImages;
    private List<String> eventsImages;
    private boolean approvato;

    public String getId() {return idString.toString();}
    public void setId(IdString idString) {this.idString = idString;}
    public String getCover() {return cover;}
    public void setCover(String cover) {this.cover = cover;}
    public String getIdUtente() {return idStringUtente.toString();}
    public void setIdUtente(IdString idStringUtented) {this.idStringUtente = idStringUtented;}
    public String getEventType() {return eventType.toString();}
    public void setEventType(EventType eventType) {this.eventType = eventType;}
    public String getEventName() {return eventName.toString();}
    public void setEventName(EventName eventName) {this.eventName = eventName;}
    public int getCityClubId() {return cityClubId.getValue();}
    public void setCityClubId(IdInt cityClubId) {this.cityClubId = cityClubId;}
    public int getClubId() {return clubId.getValue();}
    public void setClubId(IdInt clubId) {this.clubId = clubId;}
    public String getAddress() {return address.toString();}
    public void setAddress(Address address) {this.address = address;}
    public String getCityName() {return cityName.toString();}
    public void setCityName(CityName cityName) {this.cityName = cityName;}
    public String getLongitude() {return longitude.toString();}
    public void setLongitude(Longitude longitude) {this.longitude = longitude;}
    public String getLatitude() {return latitude.toString();}
    public void setLatitude(Latitude latitude) {this.latitude = latitude;}
    public String getDrinkPreference() {return drinkPreference.toString();}
    public void setDrinkPreference(DrinkPreference drinkPreference) {this.drinkPreference = drinkPreference;}
    public String getDescription() {return description.toString();}
    public void setDescription(Description description) {this.description = description;}
    public String getDate() {return date.toString();}
    public void setDate(Date date) {this.date = date;}
    public String getManSeat() {return manSeat.toString();}
    public void setManSeat(Seat manSeat) {this.manSeat = manSeat;}
    public String getWomanSeat() {return womanSeat.toString();}
    public void setWomanSeat(Seat womanSeat) {this.womanSeat = womanSeat;}
    public String getManPrice() {return manPrice.toString();}
    public void setManPrice(Price manPrice) {this.manPrice = manPrice;}
    public String getWomanPrice() {return womanPrice.toString();}
    public void setWomanPrice(Price womanPrice) {this.womanPrice = womanPrice;}
    public boolean isApprovato() {return approvato;}
    public void setApprovato(boolean approvato) {this.approvato = approvato;}

    //Secondo parseFromDB
    public Club getClub() {return club;}
    public void setClub(Club club) {this.club = club;}
    public City getCity() {return city;}
    public void setCity(City city) {this.city = city;}
    public User getUser() {return user;}
    public void setUser(User user) {this.user = user;}
    public List<String> getProfileImages() {return profileImages;}
    public void setProfileImages(List<String> profileImages) {this.profileImages = profileImages;}
    public List<String> getEventsImages() {return eventsImages;}
    public void setEventsImages(List<String> eventsImages) {this.eventsImages = eventsImages;}

    public static Event parseFromDB(ResultSet rs) throws SQLException, IllegalArgumentException, NullPointerException {
        Event event = new Event();
        event.setId(new IdString(rs.getString("id")));
        event.setIdUtente(new IdString(rs.getString("id_utente")));
        event.setEventType(new EventType(rs.getString("tipologiaevento")));
        event.setEventName(new EventName(rs.getString("nomeevento")));
        event.setCityClubId(new IdInt(rs.getInt("citta_club")));
        event.setClubId(new IdInt(rs.getInt("club")));
        event.setAddress(new Address(rs.getString("indirizzo")));
        event.setCityName(new CityName(rs.getString("citta")));
        event.setLatitude(new Latitude(rs.getString("latitudine")));
        event.setLongitude(new Longitude(rs.getString("longitudine")));
        event.setDrinkPreference(new DrinkPreference(rs.getString("preferenzedrink")));
        event.setDescription(new Description(rs.getString("descrizione")));
        event.setDate(new Date(rs.getString("data")));
        event.setManSeat(new Seat(rs.getString("postiuomo")));
        event.setWomanSeat(new Seat(rs.getString("postidonna")));
        event.setManPrice(new Price(rs.getString("prezzouomo")));
        event.setWomanPrice(new Price(rs.getString("prezzodonna")));
        event.setApprovato(rs.getBoolean("approvato"));

        return event;
    }

    public static Event parseFromDBComplete(ResultSet rs) throws SQLException, IllegalArgumentException, NullPointerException, IOException {
        Event event = new Event();
        Club club = new Club(new IdInt(rs.getInt("id_club")), new CityName(rs.getString("citta_club")), new ClubName(rs.getString("nome_club")), new Address(rs.getString("indirizzo_club")), new Latitude(rs.getString("latitudine_club")), new Longitude(rs.getString("longitudine_club")));
        City city = new City(new IdInt(rs.getInt("id_citta")), new CityName(rs.getString("nome_citta")), new Latitude(rs.getString("latitudine_citta")), new Longitude(rs.getString("longitudine_citta")));
        User user = new User(new Uid(rs.getString("uid_utente")), new Name(rs.getString("nome_utente")), new Surname(rs.getString("cognome_utente")));
        List<String> profileImages = Firebase.getInstance().getProfileImagesFromFirebase(user.getUid());
        List<String> eventImages = Firebase.getInstance().getEventsImagesFromFirebase(String.valueOf(new IdString(rs.getString("id"))));
        event.setProfileImages(profileImages);
        event.setEventsImages(eventImages);
        event.setId(new IdString(rs.getString("id")));
        event.setIdUtente(new IdString(rs.getString("id_utente")));
        event.setEventType(new EventType(rs.getString("tipologiaevento")));
        event.setEventName(new EventName(rs.getString("nomeevento")));
        event.setCityClubId(new IdInt(rs.getInt("citta_club")));
        event.setClubId(new IdInt(rs.getInt("club")));
        event.setAddress(new Address(rs.getString("indirizzo")));
        event.setCityName(new CityName(rs.getString("citta")));
        event.setLatitude(new Latitude(rs.getString("latitudine")));
        event.setLongitude(new Longitude(rs.getString("longitudine")));
        event.setDrinkPreference(new DrinkPreference(rs.getString("preferenzedrink")));
        event.setDescription(new Description(rs.getString("descrizione")));
        event.setDate(new Date(rs.getString("data")));
        event.setManSeat(new Seat(rs.getString("postiuomo")));
        event.setWomanSeat(new Seat(rs.getString("postidonna")));
        event.setManPrice(new Price(rs.getString("prezzouomo")));
        event.setWomanPrice(new Price(rs.getString("prezzodonna")));
        event.setCity(city);
        event.setClub(club);
        event.setUser(user);

        return event;
    }

    public static Event parseFromDBForPayment(ResultSet rs) throws SQLException, IllegalArgumentException, NullPointerException {
        Event event = new Event();
        City city = new City(new IdInt(rs.getInt("id_citta")), new CityName(rs.getString("nome_citta")), new Latitude(rs.getString("latitudine_citta")), new Longitude(rs.getString("longitudine_citta")));
        Club club = new Club(new IdInt(rs.getInt("id_club")), new CityName(rs.getString("citta_club")), new ClubName(rs.getString("nome_club")), new Address(rs.getString("indirizzo_club")), new Latitude(rs.getString("latitudine_club")), new Longitude(rs.getString("longitudine_club")));
        event.setId(new IdString(rs.getString("id")));
        event.setIdUtente(new IdString(rs.getString("id_utente")));
        event.setEventType(new EventType(rs.getString("tipologiaevento")));
        event.setEventName(new EventName(rs.getString("nomeevento")));
        event.setCityClubId(new IdInt(rs.getInt("citta_club")));
        event.setClubId(new IdInt(rs.getInt("club")));
        event.setAddress(new Address(rs.getString("indirizzo")));
        event.setDate(new Date(rs.getString("data")));
        event.setManPrice(new Price(rs.getString("prezzouomo")));
        event.setWomanPrice(new Price(rs.getString("prezzodonna")));
        event.setCity(city);
        event.setClub(club);

        return event;
    }

}
