package com.wayout.model.domain.User;

public class Surname {
    private String value;

    public Surname(String value) {
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
