package com.wayout.model.domain.User;

import static org.apache.commons.lang3.Validate.notNull;

public class Uid {
    private String value;

    public Uid(String value) {
        notNull(value);
        assert !value.isEmpty();
        this.value = value;
    }

    @Override
    public String toString() {
        return value;
    }
}
