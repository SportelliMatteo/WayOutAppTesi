package com.wayout.model.domain.Common;

public class Latitude {
    private String value;

    public Latitude(String value) {
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
