package com.wayout.model.domain.Common;

public class Address {
    private String value;

    public Address(String value) {
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
