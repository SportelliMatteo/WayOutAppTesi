package com.wayout.model.domain.Common;

public class CityName {
    private String value;

    public CityName(String value) {
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
