package com.pog.eg.dao;

import java.io.Serializable;
import java.util.List;

/**
 * @author phuttipong on 14/1/2559
 *         <p>
 *         package: com.tst.toursvc.data
 *         <p>
 *         This program is part of TourSvc project and may not be
 *         distributed without written permission from Trendspotter Technology.
 */
public interface GenericStore<T, ID extends Serializable> {

    /**
     * Find entity by id
     *
     * @param id   entity id
     * @param lock whether use lock or not
     * @return entity
     */
    T get(ID id, boolean lock);

    List<T> getAll();

    List<T> getByExample(T exampleInstance, String... excludeProperty);

    /**
     * Make a transient entity persistent
     *
     * @param entity transient entity
     * @return the id of entity
     */
    T save(T entity);

    /**
     * Making a persistent object transient
     *
     * @param entity persistent entity or detached entity
     */
    void delete(T entity);

    /**
     * Control first-level cache
     */
    void flush();

    /**
     * Control first-level cache
     */
    void clear();
}
