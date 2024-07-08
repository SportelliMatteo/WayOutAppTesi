package com.wayout.model.domain.Event;

import com.wayout.model.domain.Common.IdInt;

public class CityDropdown {
    private String label;
    private IdInt value;

    public CityDropdown(String label, IdInt value){
        this.label = label;
        this.value = value;
    }

    @Override
    public String toString() {
        return label + " " + value;
    }
    public String getLabel() {
        return label;
    }

    public IdInt getValue() {
        return value;
    }
}
