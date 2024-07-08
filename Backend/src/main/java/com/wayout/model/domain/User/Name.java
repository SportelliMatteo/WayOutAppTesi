package com.wayout.model.domain.User;
import static org.apache.commons.lang3.Validate.notNull;

public class Name {
    private String value;

    public Name(String value) {
        try{
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
