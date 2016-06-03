package com.pog.eg.domain;

import javax.persistence.Entity;
import javax.persistence.OneToMany;
import java.util.HashSet;
import java.util.Set;

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
public class Sample extends UUIDEntity {

    private String title;
    private String year;
    private int votes;
    private double rating;
    private int rank;

    //Hibernate suggest that should use this inverse style mapping if it is Parent-Child relationship which the child's FK always has value.
    //This field show bidirectional one-to-many relationship.
    private Set<SampleComment> comments = new HashSet();

    public Sample() {
    }

    public Sample(String title, String year, int votes, double rating, int rank) {
        super();
        this.title = title;
        this.year = year;
        this.votes = votes;
        this.rating = rating;
        this.rank = rank;
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

    //This field show bidirectional one-to-many relationship.
    @OneToMany
    public Set<SampleComment> getComments() {
        return comments;
    }

    //This field show bidirectional one-to-many relationship.
    public void setComments(Set<SampleComment> comments) {
        this.comments = comments;
    }

    //This field show bidirectional one-to-many relationship.
    public boolean addCommentToSample(SampleComment comment) {
        comment.setCommentedSample(this);
        return this.getComments().add(comment);
    }
}
