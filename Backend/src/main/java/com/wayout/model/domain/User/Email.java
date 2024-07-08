package com.wayout.model.domain.User;

import static org.apache.commons.lang3.Validate.*;
public class Email {

    private String value;

    private final String regex = "[a-zA-Z0-9\\.]+@[a-z]+\\.[a-z]+";

    public Email(String value) {
        try{
            notNull(value);
            matchesPattern(value, regex);
            this.value = value;
        }catch (Exception e){
            this.value = null;
        }
    }

    @Override
    public String toString() {
        return value;
    }

}
