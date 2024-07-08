package com.wayout.utilities;

import java.security.SecureRandom;

public class SecureRandomClass {

    public static String getSecureRandom(){
        SecureRandom secureRandom = new SecureRandom();

        // Generazione di una stringa di 16 numeri casuali
        StringBuilder sb = new StringBuilder(16);
        for (int i = 0; i < 16; i++) {
            // Genera un numero casuale tra 0 e 9 inclusi e lo converte in carattere
            int randomNumber = secureRandom.nextInt(10);
            sb.append(randomNumber);
        }

        return sb.toString();
    }

}
