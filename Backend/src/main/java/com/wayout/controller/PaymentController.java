package com.wayout.controller;

import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.auth.UserRecord;
import com.google.gson.Gson;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.EphemeralKey;
import com.stripe.model.PaymentIntent;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.EphemeralKeyCreateParams;
import com.stripe.param.PaymentIntentCreateParams;
import com.wayout.dao.EventDaoJDBC;
import com.wayout.dao.UserDaoJDBC;
import com.wayout.firebase.Firebase;
import com.wayout.model.Event;
import com.wayout.model.User;
import com.wayout.model.domain.Common.IdString;
import io.github.cdimascio.dotenv.Dotenv;
import org.json.simple.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = { "*" })
public class PaymentController {

    private static PaymentController instance;

    public static PaymentController getInstance() {
        if (instance == null)
            instance = new PaymentController();

        return instance;
    }

    public PaymentController() {
        Dotenv dotenv =  Dotenv.load();
        Stripe.apiKey = dotenv.get("APYKEYSTRIPE");
    }

    @PostMapping("/payment")
    public ResponseEntity<String> payment(@RequestBody JSONObject obj, HttpServletRequest request) {

        String token = request.getHeader("Authorization");
        Gson gson = new Gson();
        try {
            FirebaseToken decodedToken = Firebase.getInstance().getAuth().verifyIdToken(token);
            String uid = decodedToken.getUid();

            IdString idEvento = new IdString((String) obj.get("evento"));

            User userDb = UserDaoJDBC.getInstance().findUserByUid(uid);
            Event eventDb = EventDaoJDBC.getInstance().findEventById(idEvento.toString());
            long prezzo = 0L;

            String addressOrCity;
            if (eventDb.getEventType().equals("Tavolo")){
                addressOrCity = eventDb.getCity().getCityName();
            }else{
                addressOrCity = eventDb.getAddress();
            }


            if(userDb.getSesso().equals("uomo")){
                prezzo = Long.parseLong(eventDb.getManPrice()) * 100;
            }else{
                prezzo = Long.parseLong(eventDb.getWomanPrice()) * 100;
            }

            if(eventDb.getManSeat().equals("0")){
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            if(eventDb.getWomanSeat().equals("0")){
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            // Se non trovo l'utente, rispondo con errore 5000
            if (uid == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            // Ottieni informazioni utente
            UserRecord user = Firebase.getInstance().getAuth().getUser(uid);

            // Cerca il cliente Stripe dell'utente tramite l'email
            Customer customer = null;
            Map<String, Object> params = new HashMap<>();
            params.put("email", userDb.getEmail());
            Iterable<Customer> customers = Customer.list(params).autoPagingIterable();
            if (customers.iterator().hasNext()) {
                customer = customers.iterator().next(); // Se trova un cliente con quell'email, lo usa
            } else {
                // Se non trova il cliente, lo crea
                CustomerCreateParams customerParams = CustomerCreateParams.builder()
                        .setEmail(userDb.getEmail())
                        .setName(userDb.getNome() + " " + userDb.getCognome())
                        .build();
                customer = Customer.create(customerParams);
            }

            // Crea una chiave effimera Stripe
            EphemeralKeyCreateParams ephemeralKeyParams = EphemeralKeyCreateParams.builder()
                    .setStripeVersion("2023-10-16")
                    .setCustomer(customer.getId())
                    .build();
            EphemeralKey ephemeralKey = EphemeralKey.create(ephemeralKeyParams);

            // Crea un intento di pagamento Stripe
            PaymentIntentCreateParams paymentIntentParams = PaymentIntentCreateParams.builder()
                    .setAmount(prezzo)
                    .setCurrency("eur")
                    .setCustomer(customer.getId())
                    .setReceiptEmail(customer.getEmail())
                    .setDescription(addressOrCity + " - " + eventDb.getDate() + " - " + eventDb.getClub().getClubName() + " - " + userDb.getSesso())
                    .setAutomaticPaymentMethods(
                            PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                    .setEnabled(true)
                                    .build()
                    )
                    .build();
            PaymentIntent paymentIntent = PaymentIntent.create(paymentIntentParams);

            // Prepara i dati di risposta
            Map<String, String> responseData = new HashMap<>();
            responseData.put("paymentIntent", paymentIntent.getClientSecret());
            responseData.put("ephemeralKey", ephemeralKey.getSecret());
            responseData.put("customer", customer.getId());
            responseData.put("publishableKey", "pk_test_51Op8EpLSLLSnNJPAkdyvuDc2hZ1BLExkUAgaJMtImiH8GUYalGFkN0YNJurhkbV3mU8xICGahz4eJ8KZ00wu7BBd00fFkVk8GB");

            // Ritorna la risposta JSON
            return ResponseEntity.ok(gson.toJson(responseData));
        } catch (IllegalArgumentException | NullPointerException | FirebaseAuthException | StripeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (SQLException | IOException e) {
            throw new RuntimeException(e);
        }
    }


}
