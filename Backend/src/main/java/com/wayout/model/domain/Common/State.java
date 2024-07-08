package com.wayout.model.domain.Common;

public class State {
    private String value;

    public State(String value) {
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
