package com.wayout.model.domain.User;

public class Telephone {

    private String value;

    public Telephone(String value) {
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
