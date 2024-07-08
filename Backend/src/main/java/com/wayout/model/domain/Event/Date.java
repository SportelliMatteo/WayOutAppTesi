package com.wayout.model.domain.Event;

public class Date {
    private String value;

    public Date(String value) {
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
