package com.wayout.model.domain.Event;

public class DrinkPreference {
    private String value;

    public DrinkPreference(String value) {
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
