package com.pog.eg.dao;

import com.pog.eg.domain.Sample;
import org.springframework.data.repository.Repository;

import java.util.List;
import java.util.Optional;
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
public interface SampleStore extends Repository<Sample, UUID> {

    void delete(Sample deleted);

    List<Sample> findAll();

    Optional<Sample> findOne(UUID id);

    void flush();

    Sample save(Sample persisted);

    Sample findByTitle(String title);
}
