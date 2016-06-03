package com.pog.eg.dao;

import com.pog.eg.domain.Sample;
import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

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
@Repository
public class SampleStoreHbn extends HibernateStore<Sample, UUID> implements SampleStore {

    @Autowired
    public SampleStoreHbn(SessionFactory sessionFactory) {
        super(sessionFactory);
    }

    @Override
    public Sample getByTitle(String title) throws EntityNotFoundException {
        Query query = getSession().createQuery("select u from Sample u where title = :title");
        query.setParameter("title", title);

        Object results = query.uniqueResult();
        if (results == null) {
            throw new EntityNotFoundException(title + " not found");
        } else {
            return (Sample) query.uniqueResult();
        }
    }
}
