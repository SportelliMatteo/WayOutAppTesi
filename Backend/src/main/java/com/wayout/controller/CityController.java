package com.wayout.controller;

import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.auth.UserRecord;
import com.wayout.dao.CityDaoJDBC;
import com.wayout.dao.UserDaoJDBC;
import com.wayout.firebase.Firebase;
import com.wayout.model.City;
import com.wayout.model.User;
import com.wayout.model.domain.Common.IdInt;
import com.wayout.model.domain.Event.CityDropdown;
import org.json.simple.JSONObject;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins = { "*" })
public class CityController {
    private static CityController instance;

    public static CityController getInstance(){
        if(instance == null)
            instance = new CityController();
        return instance;
    }

    @GetMapping("/get-all-cities-name")
    public JSONObject getAllCitiesName(HttpServletRequest request, HttpServletResponse response) {
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

            ArrayList<String> cities = CityDaoJDBC.getInstance().getAllNameCities();
            List<CityDropdown> citiesDropdown = new ArrayList<CityDropdown>();

            for (String c : cities) {
                String[] cityParts = c.split(",");
                citiesDropdown.add(new CityDropdown(cityParts[0], new IdInt(Integer.parseInt(cityParts[1]))));
            }

            // altrimenti, restituisco 200 e l'oggetto user
            response.setStatus(Protocol.OK);
            resp.put("cities", citiesDropdown);
            return resp;

        } catch (SQLException | IOException | FirebaseAuthException e) {
            e.printStackTrace();
            response.setStatus(Protocol.SERVER_ERROR);
            resp.put("msg", "Errore server interno");

            return resp;
        }

    }
}
