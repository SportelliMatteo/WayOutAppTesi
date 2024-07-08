package com.wayout.model.domain.User;

import static org.apache.commons.lang3.Validate.notNull;

public class Avatar {
    private String value;

    public Avatar(String value) {
        try{
            notNull(value);
            this.value = value;
        }catch (Exception e){
            this.value = "";
        }
    }


    @Override
    public String toString() {
        return value;
    }
}
