package com.wayout.model.domain.Event;

public class EventType {
    private String value;

    public EventType(String value) {
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
