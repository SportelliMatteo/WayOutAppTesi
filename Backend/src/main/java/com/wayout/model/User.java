package com.wayout.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Bucket;
import com.google.cloud.storage.Storage;
import com.wayout.firebase.Firebase;
import com.wayout.model.domain.Common.*;
import com.wayout.model.domain.User.*;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class User{

    private List<String> profileImages;
    private IdString idString;
    private Email email;
    private Uid uid;
    private Name name;
    private Surname surname;
    private Username username;
    private DateOfBirthday dateOfBirthday;
    private String statoTelefono;
    private String prefissoTelefonico;
    private Telephone telephone;
    private Gender gender;
    private Address address;
    private CityName city;
    private State state;
    private Latitude latitude;
    private Longitude longitude;

    public List<String> getProfileImages() {
        if(this.profileImages != null){
            return profileImages;
        }
        return null;
    }
    public void setProfileImages(List<String> profileImages) {this.profileImages = profileImages;}
    public String getId() {
        if(this.idString != null){
            return idString.toString();
        }
        return "null";
    }
    public void setId(IdString idString) {this.idString = idString;}
    public String getEmail() {
        if(this.email != null){
            return email.toString();
        }
        return "null";
    }
    @JsonIgnore
    public Email getEmailField() {return email;}
    public void setEmail(Email email) {
        this.email = email;
    }
    public String getUid() {
        if(this.uid != null){
            return uid.toString();
        }
        return "null";
    }
    public void setUid(Uid uid) {this.uid = uid;}
    public String getNome() {
        if(this.name != null){
            return name.toString();
        }
        return "null";
    }
    public void setNome(Name name) {this.name = name;}
    public String getCognome() {
        if(this.surname != null){
            return surname.toString();
        }
        return "null";
    }
    public void setCognome(Surname surname) {this.surname = surname;}
    public String getNomeUtente() {
        if(this.username != null){
            return username.toString();
        }
        return "null";
    }
    public void setNomeUtente(Username username) {this.username = username;}
    public String getDataDiNascita() {
        if(this.dateOfBirthday != null){
            return dateOfBirthday.toString();
        }
        return "null";
    }
    public void setDataDiNascita(DateOfBirthday dateOfBirthday) {this.dateOfBirthday = dateOfBirthday;}
    public String getStatoTelefono() {
        if(this.statoTelefono != null){
            return statoTelefono;
        }
        return "null";
    }
    public void setStatoTelefono(String statoTelefono) {this.statoTelefono = statoTelefono;}
    public String getPrefissoTelefonico() {
        if(this.prefissoTelefonico != null){
            return prefissoTelefonico;
        }
        return "null";
    }
    public void setPrefissoTelefonico(String prefissoTelefonico) {this.prefissoTelefonico = prefissoTelefonico;}
    public String getTelefono() {
        if(this.telephone != null){
            return telephone.toString();
        }
        return "null";
    }
    public void setTelefono(Telephone telephone) {this.telephone = telephone;}
    public String getSesso() {
        if(this.gender != null){
            return gender.toString();
        }
        return "null";
    }
    public void setSesso(Gender gender) {this.gender = gender;}
    public String getIndirizzo() {
        if(this.address != null){
            return address.toString();
        }
        return "null";
    }
    public void setIndirizzo(Address address) {this.address = address;}
    public String getCity() {
        if(this.city != null){
            return city.toString();
        }
        return "null";
    }
    public void setCity(CityName city) {this.city = city;}
    public String getState() {
        if(this.state != null){
            return state.toString();
        }
        return "null";
    }
    public void setState(State state) {this.state = state;}
    public String getLatitude() {
        if(this.latitude != null){
            return latitude.toString();
        }
        return "null";
    }
    public void setLatitude(Latitude latitude) {this.latitude = latitude;}
    public String getLongitude() {
        if(this.longitude != null){
            return longitude.toString();
        }
        return "null";
    }
    public void setLongitude(Longitude longitude) {this.longitude = longitude;}

    public User(Uid uid, Name name, Surname surname) {
        this.uid = uid;
        this.name = name;
        this.surname = surname;
    }

    public User(Uid uid) {
        this.uid = uid;
    }

    public User() {
    }

    public static User parseFromDB(ResultSet rs) throws SQLException, IllegalArgumentException, NullPointerException, IOException {
        User user = new User();
        List<String> profileImages2 = Firebase.getInstance().getProfileImagesFromFirebase(rs.getString("uid"));
        user.setProfileImages(profileImages2);
        user.setId(new IdString(rs.getString("id")));
        user.setEmail(new Email(rs.getString("email")));
        user.setUid(new Uid(rs.getString("uid")));
        user.setNome(new Name(rs.getString("nome")));
        user.setCognome(new Surname(rs.getString("cognome")));
        user.setNomeUtente(new Username(rs.getString("nomeutente")));
        user.setDataDiNascita(new DateOfBirthday(rs.getString("datadinascita")));
        user.setStatoTelefono(rs.getString("statotelefono"));
        user.setPrefissoTelefonico(rs.getString("prefissotelefonico"));
        user.setTelefono(new Telephone(rs.getString("telefono")));
        user.setSesso(new Gender(rs.getString("sesso")));
        user.setIndirizzo(new Address(rs.getString("indirizzo")));
        user.setCity(new CityName(rs.getString("citta")));
        user.setState(new State(rs.getString("stato")));
        user.setLatitude(new Latitude(rs.getString("latitudine")));
        user.setLongitude(new Longitude(rs.getString("longitudine")));

        return user;
    }

}
