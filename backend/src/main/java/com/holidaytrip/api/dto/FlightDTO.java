package com.holidaytrip.api.dto;

public class FlightDTO {
    private String airline;
    private String flightNumber;
    private String departureTime;
    private String arrivalTime;
    private Integer price;
    private boolean hasLayovers;
    private String layoverAirports;
    private int layoverCount;

    public FlightDTO() {
    }

    public String getAirline() {
        return airline;
    }

    public void setAirline(String airline) {
        this.airline = airline;
    }

    public String getFlightNumber() {
        return flightNumber;
    }

    public void setFlightNumber(String flightNumber) {
        this.flightNumber = flightNumber;
    }

    public String getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(String departureTime) {
        this.departureTime = departureTime;
    }

    public String getArrivalTime() {
        return arrivalTime;
    }

    public void setArrivalTime(String arrivalTime) {
        this.arrivalTime = arrivalTime;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public boolean isHasLayovers() {
        return hasLayovers;
    }

    public void setHasLayovers(boolean hasLayovers) {
        this.hasLayovers = hasLayovers;
    }

    public String getLayoverAirports() {
        return layoverAirports;
    }

    public void setLayoverAirports(String layoverAirports) {
        this.layoverAirports = layoverAirports;
    }

    public int getLayoverCount() {
        return layoverCount;
    }

    public void setLayoverCount(int layoverCount) {
        this.layoverCount = layoverCount;
    }
}
