package com.holidaytrip.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class FlightResponseDTO {
    
    @JsonProperty("airline_iata")
    private String airlineIata;

    @JsonProperty("flight_number")
    private String flightNumber;

    @JsonProperty("dep_time")
    private String depTime;

    @JsonProperty("arr_time")
    private String arrTime;
}
