package com.wayout.controller;

import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.auth.UserRecord;
import com.wayout.dao.ClubDaoJBC;
import com.wayout.firebase.Firebase;
import com.wayout.model.domain.Club.ClubDropdown;
import com.wayout.model.domain.Common.IdInt;
import com.wayout.model.domain.Common.IdString;
import org.json.simple.JSONObject;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins = { "*" })
public class ClubController {
    private static ClubController instance;

    public static ClubController getInstance(){
        if(instance == null)
            instance = new ClubController();

        return instance;
    }

    @PostMapping("/get-all-clubs-by-city")
    public JSONObject getAllClubsByCity(@RequestBody JSONObject obj, HttpServletRequest request, HttpServletResponse response) {
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

            String id = String.valueOf(obj.get("clubid"));
            IdInt idint = new IdInt(Integer.parseInt(id));

            ArrayList<String> clubs = ClubDaoJBC.getInstance().getAllClubsByCity(idint);
            List<ClubDropdown> clubsDropdown = new ArrayList<ClubDropdown>();

            for(String c : clubs){
                String[] clubParts = c.split(",");
                int clubValue = Integer.parseInt(clubParts[1]);
                clubsDropdown.add(new ClubDropdown(clubParts[0], new IdInt(clubValue)));
            }

            // altrimenti, restituisco 200 e l'oggetto user
            response.setStatus(Protocol.OK);
            resp.put("clubs", clubsDropdown);
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
