package com.pog.eg.dao;

import org.hibernate.Criteria;
import org.hibernate.LockOptions;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Example;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;
import java.lang.reflect.ParameterizedType;
import java.util.List;

/**
 * @author phuttipong on 14/1/2559
 *         <p>
 *         package: com.tst.toursvc.data
 *         <p>
 *         This program is part of TourSvc project and may not be
 *         distributed without written permission from Trendspotter Technology.
 */
public abstract class HibernateStore<T, ID extends Serializable> implements GenericStore<T, ID> {


    private final SessionFactory sessionFactory;

    private Class<T> persistentClass;
    private Session session;

    @SuppressWarnings("unchecked")
    public HibernateStore(SessionFactory sessionFactory) {
        this.persistentClass = (Class<T>)
                ((ParameterizedType) getClass().getGenericSuperclass())
                        .getActualTypeArguments()[0];
        this.sessionFactory = sessionFactory;
    }

    protected Session getSession() {
        if (session == null)
            session = sessionFactory.getCurrentSession();
        return session;
    }

    public void setSession(Session s) {
        this.session = s;
    }

    public Class<T> getPersistentClass() {
        return persistentClass;
    }

    /**
     * Find entity by id
     *
     * @param id   entity id
     * @param lock whether to perform bypass all caches, do a version check (if applicable),
     *             and obtain a database-level pessimistic upgrade lock, if that is supported.
     *             Equivalent to LockModeType.READ in Java Persistence. This mode transparently
     *             falls back to LockMode.READ if the database SQL dialect doesn’t support
     *             a SELECT ... FOR UPDATE option.
     * @return object proxy entity that may throw ObjectNotFoundException later
     * as soon as you try to access the returned placeholder and force its initialization
     */
    @SuppressWarnings("unchecked")
    @Transactional(readOnly = true)
    public T get(ID id, boolean lock) {
        T entity;
        if (lock)
            entity = (T) getSession()
                    .load(getPersistentClass(), id, LockOptions.UPGRADE);
        else
            entity = (T) getSession()
                    .load(getPersistentClass(), id);
        return entity;
    }

    @Transactional(readOnly = true)
    public List<T> getAll() {
        return findByCriteria();
    }

    @Transactional(readOnly = true)
    public List<T> getByExample(T exampleInstance,
                                String... excludeProperty) {
        Criteria crit = getSession().createCriteria(getPersistentClass());
        Example example = Example.create(exampleInstance);
        for (String exclude : excludeProperty) {
            example.excludeProperty(exclude);
        }
        crit.add(example);
        return crit.list();
    }

    public T save(T entity) {
        getSession().saveOrUpdate(entity);
        return entity;
    }

    public void delete(T entity) {
        getSession().delete(entity);
    }

    public void flush() {
        getSession().flush();
    }

    public void clear() {
        getSession().clear();
    }

    /**
     * Use this inside subclasses as a convenience method.
     */
    @SuppressWarnings("unchecked")
    protected List<T> findByCriteria(Criterion... criterion) {
        Criteria crit = getSession().createCriteria(getPersistentClass());
        for (Criterion c : criterion) {
            crit.add(c);
        }
        return crit.list();
    }
}