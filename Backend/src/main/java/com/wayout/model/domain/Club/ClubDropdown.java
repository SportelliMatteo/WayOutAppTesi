package com.wayout.model.domain.Club;

import com.wayout.model.domain.Common.IdInt;

public class ClubDropdown {
    private String label;
    private IdInt value;

    public ClubDropdown(String label, IdInt value){
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
