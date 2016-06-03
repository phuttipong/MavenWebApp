package com.pog.eg.domain;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

/**
 * [Class description.]
 * <p>
 * [Other notes.]
 *
 * @author Phuttipong
 * @version %I%
 * @since 3/6/2559
 */
@Entity
public class SampleComment extends UUIDEntity {

    private String comment;

    //Hibernate suggest that should use this inverse style mapping if it is Parent-Child relationship which the child's FK always has value.
    // This field show bidirectional one-to-many relationship.
    private Sample commentedSample;

    @ManyToOne
    public Sample getCommentedSample() {
        return commentedSample;
    }

    public void setCommentedSample(Sample commentedSample) {
        this.commentedSample = commentedSample;
    }
}
