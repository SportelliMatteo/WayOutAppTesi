package com.wayout.model.domain.Event;

public class Price {
    private String value;

    public Price(String value) {
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
