package com.wayout.controller;

import com.google.cloud.storage.Blob;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.auth.UserRecord;
import com.wayout.dao.EventDaoJDBC;
import com.wayout.firebase.Firebase;
import com.wayout.model.Event;
import com.wayout.model.domain.Club.ClubName;
import com.wayout.model.domain.Common.*;
import com.wayout.model.domain.Event.*;
import com.wayout.model.domain.Event.Date;
import com.wayout.model.domain.User.*;
import com.wayout.utilities.EmailSenderService;
import org.apache.commons.lang3.StringUtils;
import org.json.simple.JSONObject;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.*;

@RestController
@CrossOrigin(origins = { "*" })
public class EventController {

    private static EventController instance;

    public static EventController getInstance() {
        if (instance == null)
            instance = new EventController();

        return instance;
    }

    @PostMapping("/create-event")
    public JSONObject createEvent(@RequestBody JSONObject obj, HttpServletRequest request, HttpServletResponse response) {
        String token = request.getHeader("Authorization");
        JSONObject resp = new JSONObject();

        try {
            FirebaseToken decodedToken = Firebase.getInstance().getAuth().verifyIdToken(token);
            String uid = decodedToken.getUid();
            UserRecord user = Firebase.getInstance().getAuth().getUser(uid);

            // se non trovo l'utente, rispondo con error 5000
            if (uid == null) {
                response.setStatus(Protocol.INVALID_TOKEN);
                resp.put("msg", "Il token non è valido");

                return resp;
            }

            IdString idString = new IdString(UUID.randomUUID().toString());
            IdString idStringUtente = new IdString((String) obj.get("idutente"));
            Username username = new Username((String) obj.get("username"));
            EventType eventType = new EventType((String) obj.get("tipologiaevento"));
            EventName eventName = new EventName((String) obj.get("nomeevento"));
            IdInt cityClubId = new IdInt((Integer) obj.get("cittaclub"));
            IdInt clubId = new IdInt((Integer) obj.get("club"));
            ClubName clubName = new ClubName((String) obj.get("nomeclub"));
            Address address = new Address((String) obj.get("indirizzo"));
            CityName cityName = new CityName((String) obj.get("citta"));
            Latitude latitude = new Latitude((String) obj.get("latitudine"));
            Longitude longitude = new Longitude((String) obj.get("longitudine"));
            DrinkPreference drinkPreference = new DrinkPreference((String) obj.get("preferenzeDrink"));
            Date date = new Date((String) obj.get("data"));
            Seat manSeats = new Seat((String) obj.get("postiuomo"));
            Price manPrice = new Price((String) obj.get("prezzouomo"));
            Seat womanSeats = new Seat((String) obj.get("postidonna"));
            Price womanPrice = new Price((String) obj.get("prezzodonna"));

            EventType eventType1;
            if(eventType.toString().equals("evento_privato")){
                eventType1 = new EventType("Evento privato");
            }else {
                eventType1 = new EventType("Tavolo");
            }

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            LocalDate data = LocalDate.parse(date.toString(), formatter);
            // Ottengo il nome del giorno della settimana
            String nomeGiorno = data.getDayOfWeek().getDisplayName(TextStyle.FULL, Locale.ITALIAN);
            // Ottengo il numero del giorno e il nome del mese
            int numeroGiorno = data.getDayOfMonth();
            String nomeMese = data.getMonth().getDisplayName(TextStyle.FULL, Locale.ITALIAN);

            String testoDescrizioneTavolo = StringUtils.capitalize(nomeGiorno) + " " + numeroGiorno + " " + StringUtils.capitalize(nomeMese) + " unisciti anche tu al tavolo di " + username + " e conosci nuovi amici con cui fare serata!";
            String testoDescrizioneEventoPrivato = StringUtils.capitalize(nomeGiorno) + " " + numeroGiorno + " " + StringUtils.capitalize(nomeMese) + " unisciti anche tu all'evento privato di " + username + " e conosci nuovi amici con cui fare serata!";
            Description description;
            if(eventType1.toString().equals("Evento privato")){
                description = new Description(testoDescrizioneEventoPrivato);
            }else{
                description = new Description(testoDescrizioneTavolo);
            }

            Avatar avatar = new Avatar((String) obj.get("image"));
            byte[] imgBytes = Base64.getDecoder().decode(avatar.toString());

            String pathPhotoFirebase = "eventi/" + idString + "/" + UUID.randomUUID();

            Blob blob = Firebase.getInstance().getBucket().create(pathPhotoFirebase, imgBytes, "image/jpeg");
            Blob blob2 = Firebase.getInstance().getBucket().get(pathPhotoFirebase);
            String imgBase64 = Base64.getEncoder().encodeToString(blob2.getContent());

            Event event = new Event();
            event.setId(idString);
            event.setIdUtente(idStringUtente);
            event.setEventType(eventType1);
            event.setEventName(eventName);
            if(eventType1.toString().equals("Evento privato")){
                event.setCityClubId(new IdInt(0));
                event.setClubId(new IdInt(0));
            }else {
                event.setCityClubId(cityClubId);
                event.setClubId(clubId);
            }
            event.setAddress(address);
            event.setCityName(cityName);
            event.setLatitude(latitude);
            event.setLongitude(longitude);
            event.setDrinkPreference(drinkPreference);
            event.setDescription(description);
            event.setDate(date);
            event.setManSeat(manSeats);
            event.setManPrice(manPrice);
            event.setWomanSeat(womanSeats);
            event.setWomanPrice(womanPrice);
            event.setApprovato(false);

            EventDaoJDBC.getInstance().save(event);

            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            resp.put("msg", "Evento creato con successo");
            return resp;
        } catch (IllegalArgumentException | NullPointerException e) {
            response.setStatus(Protocol.SERVER_ERROR);
            resp.put("msg", "Errore server");
            return resp;
        } catch (SQLException | FirebaseAuthException e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/get-all-events-by-city")
    public JSONObject getAllEventsByCity(@RequestBody JSONObject obj, HttpServletRequest request, HttpServletResponse response) {
        String token = request.getHeader("Authorization");
        JSONObject resp = new JSONObject();
        try {
            FirebaseToken decodedToken = Firebase.getInstance().getAuth().verifyIdToken(token);
            String uid = decodedToken.getUid();
            UserRecord user = Firebase.getInstance().getAuth().getUser(uid);

            // se non trovo l'utente, rispondo con error 5000
            if (uid == null) {
                response.setStatus(Protocol.INVALID_TOKEN);
                resp.put("msg", "Il token non è valido");

                return resp;
            }

            CityName cityName = new CityName((String) obj.get("nomecitta"));

            List<Event> eventComplete = EventDaoJDBC.getInstance().getAllEventsByCity(cityName);

            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            resp.put("events", eventComplete);
            return resp;
        } catch (IllegalArgumentException | NullPointerException e) {
            response.setStatus(Protocol.SERVER_ERROR);
            resp.put("msg", "Errore server");
            return resp;
        } catch (IOException | SQLException | FirebaseAuthException e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/get-number-of-events-by-user")
    public JSONObject getNumberOfEventsByUser(@RequestBody JSONObject obj, HttpServletRequest request, HttpServletResponse response) {
        String token = request.getHeader("Authorization");
        JSONObject resp = new JSONObject();
        try {
            FirebaseToken decodedToken = Firebase.getInstance().getAuth().verifyIdToken(token);
            String uid = decodedToken.getUid();
            UserRecord user = Firebase.getInstance().getAuth().getUser(uid);

            // se non trovo l'utente, rispondo con error 5000
            if (uid == null) {
                response.setStatus(Protocol.INVALID_TOKEN);
                resp.put("msg", "Il token non è valido");

                return resp;
            }

            IdString idUtente = new IdString((String) obj.get("idUtente"));

            int numeroEventiAttivi = EventDaoJDBC.getInstance().getNumberOfEventsActiveByUser(idUtente);
            int numeroEventiInAttesa = EventDaoJDBC.getInstance().getNumberOfEventsUnActiveByUser(idUtente);

            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            resp.put("numeroEventiAttivi", numeroEventiAttivi);
            resp.put("numeroEventiInAttesa", numeroEventiInAttesa);
            return resp;
        } catch (IllegalArgumentException | NullPointerException e) {
            response.setStatus(Protocol.SERVER_ERROR);
            resp.put("msg", "Errore server");
            return resp;
        } catch (IOException | SQLException | FirebaseAuthException e) {
            throw new RuntimeException(e);
        }


    }

    @GetMapping("/get-active-event-user")
    public JSONObject getActiveEventUser(HttpServletRequest request, HttpServletResponse response) {
        String token = request.getHeader("Authorization");
        JSONObject resp = new JSONObject();
        try {
            FirebaseToken decodedToken = Firebase.getInstance().getAuth().verifyIdToken(token);
            String uid = decodedToken.getUid();
            UserRecord user = Firebase.getInstance().getAuth().getUser(uid);

            // se non trovo l'utente, rispondo con error 5000
            if (uid == null) {
                response.setStatus(Protocol.INVALID_TOKEN);
                resp.put("msg", "Il token non è valido");

                return resp;
            }

            List<Event> activeEvent = EventDaoJDBC.getInstance().getActiveEventByIdUtente(uid);

            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            resp.put("activeEvents", activeEvent);
            return resp;
        } catch (IllegalArgumentException | NullPointerException e) {
            response.setStatus(Protocol.SERVER_ERROR);
            resp.put("msg", "Errore server");
            return resp;
        } catch (IOException | SQLException | FirebaseAuthException e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/get-unactive-event-user")
    public JSONObject getUnactiveEventUser(HttpServletRequest request, HttpServletResponse response) {
        String token = request.getHeader("Authorization");
        JSONObject resp = new JSONObject();
        try {
            FirebaseToken decodedToken = Firebase.getInstance().getAuth().verifyIdToken(token);
            String uid = decodedToken.getUid();
            UserRecord user = Firebase.getInstance().getAuth().getUser(uid);

            // se non trovo l'utente, rispondo con error 5000
            if (uid == null) {
                response.setStatus(Protocol.INVALID_TOKEN);
                resp.put("msg", "Il token non è valido");

                return resp;
            }

            List<Event> unactiveEvent = EventDaoJDBC.getInstance().getUnactiveEventByIdUtente(uid);

            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            resp.put("unactiveEvents", unactiveEvent);
            return resp;
        } catch (IllegalArgumentException | NullPointerException e) {
            response.setStatus(Protocol.SERVER_ERROR);
            resp.put("msg", "Errore server");
            return resp;
        } catch (IOException | SQLException | FirebaseAuthException e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/delete-event-request")
    public JSONObject deleteEventRequest(@RequestBody JSONObject obj, HttpServletRequest request, HttpServletResponse response) {
        String token = request.getHeader("Authorization");
        JSONObject resp = new JSONObject();
        try {
            FirebaseToken decodedToken = Firebase.getInstance().getAuth().verifyIdToken(token);
            String uid = decodedToken.getUid();
            UserRecord user = Firebase.getInstance().getAuth().getUser(uid);

            // se non trovo l'utente, rispondo con error 5000
            if (uid == null) {
                response.setStatus(Protocol.INVALID_TOKEN);
                resp.put("msg", "Il token non è valido");

                return resp;
            }

            IdString idEvento = new IdString((String) obj.get("idEvento"));

            EmailSenderService.sendEmail("hello@wayoutapp.it", "Richiesta eliminazione evento WAYOUT", "L'utente x ha richiesto l'eliminazione dell'evento: " + idEvento);

            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            return resp;
        } catch (IllegalArgumentException | NullPointerException e) {
            response.setStatus(Protocol.SERVER_ERROR);
            resp.put("msg", "Errore server");
            return resp;
        } catch (FirebaseAuthException e) {
            throw new RuntimeException(e);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }


    }

}
