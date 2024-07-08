package com.wayout.model.domain.Event;

public class EventName {
    private String value;

    public EventName(String value) {
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
