package com.pog.eg.dao;

import com.pog.eg.domain.Sample;

import javax.persistence.EntityNotFoundException;
import java.util.UUID;

/**
 * [Class description.]
 * <p>
 * [Other notes.]
 *
 * @author Phuttipong
 * @version %I%
 * @since 2/6/2559
 */
public interface SampleStore extends GenericStore<Sample, UUID> {

    Sample getByTitle(String title) throws EntityNotFoundException;
}
