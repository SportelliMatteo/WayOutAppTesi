package com.wayout.model.domain.Common;

public class Longitude {
    private String value;

    public Longitude(String value) {
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
