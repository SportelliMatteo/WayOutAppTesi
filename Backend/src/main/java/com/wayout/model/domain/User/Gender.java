package com.wayout.model.domain.User;

public class Gender {
    private String value;

    public Gender(String value) {
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
