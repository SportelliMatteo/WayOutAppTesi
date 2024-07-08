package com.wayout.model.domain.Common;

import com.fasterxml.jackson.annotation.JsonValue;

import static org.apache.commons.lang3.Validate.notNull;

public class IdInt {
    private int intValue;

    public IdInt(int value) {
        this.intValue = value;
    }

    @Override
    public String toString() {
        return Integer.toString(intValue);
    }

    @JsonValue
    public int getValue() {
        return intValue;
    }

}
