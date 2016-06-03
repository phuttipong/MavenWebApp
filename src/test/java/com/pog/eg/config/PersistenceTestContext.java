package com.pog.eg.config;

import org.hibernate.SessionFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabase;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseBuilder;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseType;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.orm.hibernate5.HibernateTransactionManager;

import java.io.IOException;
import java.util.Properties;

/**
 * [Class description.]
 * <p>
 * [Other notes.]
 *
 * @author Phuttipong
 * @version %I%
 * @since 3/6/2559
 */
@Configuration
@ComponentScan({"com.pog.eg.dao"})
@Profile("test")
public class PersistenceTestContext {

    @Bean
    public HibernateTransactionManager transactionManager(SessionFactory sessionFactory) throws IOException {
        HibernateTransactionManager txName = new HibernateTransactionManager(sessionFactory);
        return txName;
    }

    @Bean
    LocalSessionFactoryBean sessionFactory(EmbeddedDatabase dataSource) {

        LocalSessionFactoryBean sfb = new LocalSessionFactoryBean();
        sfb.setPackagesToScan("com.pog.eg.domain");
        sfb.setDataSource(dataSource);

        Properties props = new Properties();
        props.setProperty("hibernate.dialect", "org.hibernate.dialect.H2Dialect");
        props.setProperty("show_sql", "true");
        props.setProperty("format_sql", "true");

        props.setProperty("hibernate.hbm2ddl.auto", "create");
        sfb.setHibernateProperties(props);

        return sfb;
    }

    @Bean(destroyMethod = "shutdown")
    EmbeddedDatabase dataSource() {
        return new EmbeddedDatabaseBuilder().setType(EmbeddedDatabaseType.H2).build();
    }
}
