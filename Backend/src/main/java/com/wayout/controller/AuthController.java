package com.wayout.controller;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.UUID;

import javax.mail.MessagingException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.cloud.storage.*;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.auth.UserRecord;
import com.wayout.controller.transfers.Credentials;
import com.wayout.dao.UserDaoJDBC;
import com.wayout.firebase.Firebase;
import com.wayout.model.User;
import com.wayout.model.domain.Common.*;
import com.wayout.model.domain.User.*;
import com.wayout.utilities.EmailSenderService;
import org.json.simple.JSONObject;

import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = { "*" })
public class AuthController {

    private static AuthController instance;

    public static AuthController getInstance() {
        if (instance == null)
            instance = new AuthController();

        return instance;
    }

    private interface UpdateUserFunction {
        String call(UserRecord user, String uid) throws SQLException, IllegalStateException;
    }

    @SuppressWarnings("unchecked")
    @PostMapping("/registration")
    public JSONObject doRegistration(@RequestBody Credentials credentials, HttpServletResponse response) {
        JSONObject resp = new JSONObject();
        try {
            User utente = new User();

            utente.setEmail(new Email(credentials.email));
            utente.setUid(new Uid(credentials.uid));

            UserDaoJDBC.getInstance().save(utente);

            EmailSenderService.sendEmail(credentials.email, "Benvenuto!", EmailSenderService.REGISTRATION_MESSAGES);

            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            resp.put("msg", "Account creato con successo");
            return resp;
        } catch (SQLException e) {
            if (e.getMessage().contains("violates unique constraint")) {
                response.setStatus(Protocol.CONFLICT);
                resp.put("msg", "Utente già registrato");
            } else {
                response.setStatus(Protocol.SERVER_ERROR);
                resp.put("msg", "Errore server interno");
            }

            return resp;
        } catch (IllegalArgumentException | NullPointerException e) {
            e.printStackTrace();
            response.setStatus(Protocol.INVALID_CREDENTIALS);
            resp.put("msg", "Le credenziali fornite non sono valide");

            return resp;
        } catch (MessagingException | UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }

    private boolean checkUserPrivate(Email email) throws SQLException, IOException {
        User utenteInDb = UserDaoJDBC.getInstance().findUserByEmail(email);
        if(utenteInDb.getNome() == null|| utenteInDb.getCognome() == null){
            return false;
        }
        return true;
    }


    @PostMapping("/save-google-user")
    public JSONObject saveGoogleUser(@RequestBody JSONObject obj, HttpServletResponse response) {
        JSONObject resp = new JSONObject();

        try {
            Email email = new Email((String) obj.get("email"));
            Uid uid = new Uid((String) obj.get("uid"));

            boolean checkUid = UserDaoJDBC.getInstance().findByUid(uid.toString());

            if (!checkUid) {
                User utente = new User();
                utente.setEmail(new Email(email.toString()));
                utente.setUid(new Uid(uid.toString()));

                EmailSenderService.sendEmail(email.toString(), "Benvenuto!", EmailSenderService.REGISTRATION_MESSAGES);
                UserDaoJDBC.getInstance().save(utente);

            }

            User utenteInDb = UserDaoJDBC.getInstance().findUserByEmail(email);
            if(utenteInDb == null){
                response.setStatus(Protocol.FORBIDDEN);
                resp.put("user", null);
                return resp;
            }
            if(utenteInDb.getNome() == null|| utenteInDb.getCognome() == null) {
                response.setStatus(Protocol.CONFLICT);
                resp.put("user", null);
            }else{
                resp.put("user", utenteInDb);
                response.setStatus(Protocol.OK);
            }

            return resp;

        } catch (IllegalArgumentException | NullPointerException e) {
            e.printStackTrace();
            response.setStatus(Protocol.INVALID_CREDENTIALS);
            return resp;
        } catch (SQLException | IOException e) {
            throw new RuntimeException(e);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/check-forgot-password-email")
    public JSONObject checkForgotPasswordEmail(@RequestBody JSONObject obj, HttpServletResponse response) {
        JSONObject resp = new JSONObject();

        try {
            String email = (String) obj.get("email");

            UserRecord userRecord = Firebase.getInstance().getAuth().getUserByEmail(email);

            response.setStatus(Protocol.OK);

            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            return resp;
        } catch (IllegalArgumentException | NullPointerException e) {
            e.printStackTrace();
            response.setStatus(Protocol.SERVER_ERROR);
            return resp;
        } catch(FirebaseAuthException e){
             response.setStatus(Protocol.INVALID_CREDENTIALS);
            return resp;
        }
    }

    @SuppressWarnings("unchecked")
    private JSONObject updateUserTemplate(HttpServletRequest request, HttpServletResponse response, UpdateUserFunction fun) {
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

            String ok = fun.call(user, uid);
            User utenteInDb = UserDaoJDBC.getInstance().findUserByUid(uid);
            response.setStatus(Protocol.OK);
            resp.put("user", utenteInDb);
            return resp;

        } catch (IllegalStateException e2) {
            response.setStatus(Protocol.WRONG_CREDENTIALS);
            return resp;
        } catch (IOException | FirebaseAuthException | SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @SuppressWarnings("unchecked")
    @PostMapping("/updateUser")
    public JSONObject updateUser(@RequestBody JSONObject obj, HttpServletRequest request, HttpServletResponse response) {
        JSONObject resp = new JSONObject();
        try {
            Name name = new Name((String) obj.get("nome"));
            Surname surname = new Surname((String) obj.get("cognome"));
            Username username = new Username((String) obj.get("nomeutente"));
            DateOfBirthday dateOfBirthday = new DateOfBirthday((String) obj.get("dataDiNascita"));
            String statoTelefono = ((String) obj.get("statotelefono"));
            String prefissoTelefono = ((String) obj.get("prefissotelefono"));
            Telephone telephone = new Telephone((String) obj.get("telefono"));
            Gender gender = new Gender((String) obj.get("sesso"));

            //Calcolo età
            LocalDate dataOggi =LocalDate.now();
            DateTimeFormatter formato = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            LocalDate dataNascita = LocalDate.parse((String) obj.get("dataDiNascita"), formato);
            Period periodo = Period.between(dataNascita, dataOggi);
            int eta = periodo.getYears();

            Avatar avatar = new Avatar((String) obj.get("image"));
            String uidFirebase = (String) obj.get("uid");
            byte[] imgBytes = Base64.getDecoder().decode(avatar.toString());

            String pathPhotoFirebase = uidFirebase + "/profilo/" + UUID.randomUUID();

            Blob blob = Firebase.getInstance().getBucket().create(pathPhotoFirebase, imgBytes, "image/jpeg");
            Blob blob2 = Firebase.getInstance().getBucket().get(pathPhotoFirebase);
            String imgBase64 = Base64.getEncoder().encodeToString(blob2.getContent());

            boolean checkUsernameAlreadyExists = UserDaoJDBC.getInstance().checkUsernameAlreadyExists(username);

            if (checkUsernameAlreadyExists) {
                response.setStatus(Protocol.CONFLICT);
                resp.put("msg", "Lo username è già in uso");
                return resp;
            } else if(eta < 18){
                response.setStatus(Protocol.FORBIDDEN);
                resp.put("msg", "L'utente non è maggiorenne");
                return resp;
            } else{
                UpdateUserFunction fun = (user, uid) -> {
                    UserDaoJDBC.getInstance().updateUser(name, surname, username, dateOfBirthday, statoTelefono, prefissoTelefono, telephone, gender, uid);
                    return "Utente aggiornato con successo";
                };
                return updateUserTemplate(request, response, fun);
            }

        } catch (IllegalArgumentException | NullPointerException e) {
            response.setStatus(Protocol.SERVER_ERROR);
            resp.put("msg", "The provided user is not valid");
            return resp;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

    }

    @PostMapping("/update-user-in-edit-profile")
    public JSONObject updateUserInEditProfile(@RequestBody JSONObject obj, HttpServletRequest request, HttpServletResponse response) {
        JSONObject resp = new JSONObject();
        try {
            Name name = new Name((String) obj.get("nome"));
            Surname surname = new Surname((String) obj.get("cognome"));
            DateOfBirthday dateOfBirthday = new DateOfBirthday((String) obj.get("dataDiNascita"));
            String statoTelefono = ((String) obj.get("statotelefono"));
            String prefissoTelefono = ((String) obj.get("prefissotelefono"));
            Telephone telephone = new Telephone((String) obj.get("telefono"));
            Gender gender = new Gender((String) obj.get("sesso"));
            Address indirizzo = new Address((String) obj.get("indirizzo"));
            CityName citta = new CityName((String) obj.get("citta"));
            State stato = new State((String) obj.get("stato"));
            Latitude latitude = new Latitude((String) obj.get("latitude"));
            Longitude longitude = new Longitude((String) obj.get("longitude"));

            //Calcolo età
            LocalDate dataOggi =LocalDate.now();
            DateTimeFormatter formato = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            LocalDate dataNascita = LocalDate.parse((String) obj.get("dataDiNascita"), formato);
            Period periodo = Period.between(dataNascita, dataOggi);
            int eta = periodo.getYears();

            Avatar avatar = new Avatar((String) obj.get("image"));
            String uidFirebase = (String) obj.get("uid");

            if(!avatar.toString().isEmpty()){
                byte[] imgBytes = Base64.getDecoder().decode(avatar.toString());

                String pathPhotoFirebase = uidFirebase + "/profilo/" + UUID.randomUUID();

                Blob blob = Firebase.getInstance().getBucket().create(pathPhotoFirebase, imgBytes, "image/jpeg");
                Blob blob2 = Firebase.getInstance().getBucket().get(pathPhotoFirebase);
                String imgBase64 = Base64.getEncoder().encodeToString(blob2.getContent());
            }

            if(eta < 18){
                response.setStatus(Protocol.FORBIDDEN);
                resp.put("msg", "L'utente non è maggiorenne");
                return resp;
            } else{
                UpdateUserFunction fun = (user, uid) -> {
                    UserDaoJDBC.getInstance().updateUser2(name, surname, dateOfBirthday, statoTelefono, prefissoTelefono, telephone, gender, indirizzo, citta, stato, latitude, longitude, uid);
                    return "Utente aggiornato con successo";
                };
                return updateUserTemplate(request, response, fun);
            }
        } catch (IllegalArgumentException | NullPointerException e) {
            response.setStatus(Protocol.SERVER_ERROR);
            resp.put("msg", "The provided user is not valid");
            return resp;
        }

    }

    @PostMapping("/update-user-username")
    public JSONObject updateUserUsername(@RequestBody JSONObject obj, HttpServletRequest request, HttpServletResponse response) {
        JSONObject resp = new JSONObject();
        try {
            Username username = new Username((String) obj.get("nomeutente"));

            boolean checkUsernameAlreadyExists = UserDaoJDBC.getInstance().checkUsernameAlreadyExists(username);

            if (checkUsernameAlreadyExists) {
                response.setStatus(Protocol.CONFLICT);
                resp.put("msg", "Lo username è già in uso");
                return resp;
            } else{
                UpdateUserFunction fun = (user, uid) -> {
                    UserDaoJDBC.getInstance().updateUserUsername(username, uid);
                    return "Utente aggiornato con successo";
                };
                return updateUserTemplate(request, response, fun);
            }

        } catch (IllegalArgumentException | NullPointerException e) {
            response.setStatus(Protocol.SERVER_ERROR);
            resp.put("msg", "The provided user is not valid");
            return resp;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

    }

    @PostMapping("/update-user-address")
    public JSONObject updateUserAddress(@RequestBody JSONObject obj, HttpServletRequest request, HttpServletResponse response) {
        JSONObject resp = new JSONObject();
        try {
            Address indirizzo = new Address((String) obj.get("indirizzo"));
            CityName citta = new CityName((String) obj.get("citta"));
            State stato = new State((String) obj.get("stato"));
            Latitude latitudine = new Latitude((String) obj.get("latitudine"));
            Longitude longitudine = new Longitude((String) obj.get("longitudine"));

            UpdateUserFunction fun = (user, uid) -> {
                UserDaoJDBC.getInstance().updateUserAddress(indirizzo, citta, stato, latitudine, longitudine, uid);
                return "Indirizzo utente aggiornato correttamente";
            };
            return updateUserTemplate(request, response, fun);

        } catch (IllegalArgumentException | NullPointerException e) {
            response.setStatus(Protocol.SERVER_ERROR);
            resp.put("msg", "The provided user is not valid");
            return resp;
        }
    }

    @SuppressWarnings("unchecked")
    @PostMapping("/check-user")
    public JSONObject checkUser(@RequestBody JSONObject obj, HttpServletRequest request, HttpServletResponse response) {
        JSONObject resp = new JSONObject();
        String token = request.getHeader("Authorization");
        try {

            Email email = new Email((String) obj.get("email"));

            User utenteInDb = UserDaoJDBC.getInstance().findUserByEmail(email);
            if(utenteInDb== null){
                response.setStatus(Protocol.FORBIDDEN);
                resp.put("user", null);
                return resp;
            }
            if(utenteInDb.getNome() == null|| utenteInDb.getCognome() == null) {
                response.setStatus(Protocol.CONFLICT);
                resp.put("user", null);
            }else{
                resp.put("user", utenteInDb);
                response.setStatus(Protocol.OK);
            }

            return resp;

        } catch (SQLException e) {
            response.setStatus(Protocol.SERVER_ERROR);
            resp.put("msg", "Errore server");
            return resp;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

    }

    @SuppressWarnings("unchecked")
    @GetMapping("/user-logged")
    public JSONObject checkLogin(HttpServletRequest request, HttpServletResponse response) {
        String token = request.getHeader("Authorization");
        JSONObject resp = new JSONObject();

            try {

                FirebaseToken decodedToken = Firebase.getInstance().getAuth().verifyIdToken(token);
                String uid = decodedToken.getUid();
                UserRecord userFirebase = Firebase.getInstance().getAuth().getUser(uid);

                // se non trovo l'utente, rispondo con error 5000
                if (uid == null) {
                    response.setStatus(Protocol.INVALID_TOKEN);
                    resp.put("msg", "Il token non è valido");

                    return resp;
                }

                User user = UserDaoJDBC.getInstance().findUserByUid(uid);

                // altrimenti, restituisco 200 e l'oggetto user
                response.setStatus(Protocol.OK);
                resp.put("user", user);
                return resp;

            } catch (SQLException | IOException e) {
                e.printStackTrace();
                response.setStatus(Protocol.SERVER_ERROR);
                resp.put("msg", "Errore server interno");

                return resp;
            } catch (FirebaseAuthException e) {
                throw new RuntimeException(e);
            }

    }


}
