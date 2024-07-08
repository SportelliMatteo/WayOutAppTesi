package com.wayout.model.domain.Common;

import static org.apache.commons.lang3.Validate.notNull;

public class IdString {
    private String value;

    public IdString(String value) {
        try{
            notNull(value);
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
