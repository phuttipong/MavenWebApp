package com.pog.eg.domain;

import javax.persistence.Entity;

/**
 * [Class description.]
 * <p>
 * [Other notes.]
 *
 * @author phuttipong
 * @version %I%
 * @since 25/4/2559
 */
@Entity
public class Sample {
    private final int id;
    private String title;
    private String year;
    private int votes;
    private double rating;
    private int rank;

    public Sample(int id, String title, String year, int votes, double rating, int rank) {
        this.id = id;
        this.title = title;
        this.year = year;
        this.votes = votes;
        this.rating = rating;
        this.rank = rank;
    }

    public int getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public int getVotes() {
        return votes;
    }

    public void setVotes(int votes) {
        this.votes = votes;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public int getRank() {
        return rank;
    }

    public void setRank(int rank) {
        this.rank = rank;
    }
}
