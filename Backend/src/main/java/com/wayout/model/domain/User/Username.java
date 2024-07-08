package com.wayout.model.domain.User;

import static org.apache.commons.lang3.Validate.matchesPattern;
import static org.apache.commons.lang3.Validate.notNull;

public class Username {
    private String value;

    private final String regex = "^[a-zA-Z0-9._]{1,30}$";

    public Username(String value) {
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
