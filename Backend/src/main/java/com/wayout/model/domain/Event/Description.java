package com.wayout.model.domain.Event;

public class Description {
    private String value;

    public Description(String value) {
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
