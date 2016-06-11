package com.pog.eg.dao;

import com.pog.eg.config.PersistenceTestContext;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.jdbc.Sql;

import java.util.List;

import static org.junit.Assert.assertEquals;

/**
 * [Class description.]
 * <p>
 * [Other notes.]
 *
 * @author Phuttipong
 * @version %I%
 * @since 3/6/2559
 */
@ContextConfiguration(classes = {PersistenceTestContext.class})
@Sql("classpath:dao/init-sample-store.sql")
public class SampleStoreHbnTests extends StoreTests {

    @Autowired
    private SampleStore sampleStore;

    @Before
    public void setUp() {
    }

    @Test
    public void findAllThenReturnAllRecords() {
        List list = sampleStore.findAll();
        assertEquals(3, list.size());
    }
}
