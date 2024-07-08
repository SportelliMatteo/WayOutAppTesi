package com.wayout.model.domain.Event;

public class Seat {
    private String value;

    public Seat(String value) {
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
