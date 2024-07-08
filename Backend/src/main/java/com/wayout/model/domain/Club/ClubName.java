package com.wayout.model.domain.Club;

public class ClubName {
    private String value;

    public ClubName(String value) {
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
