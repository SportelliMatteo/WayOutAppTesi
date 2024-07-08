package com.wayout.model.domain.Common;

public class Location {
    private String value;

    public Location(String value) {
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
