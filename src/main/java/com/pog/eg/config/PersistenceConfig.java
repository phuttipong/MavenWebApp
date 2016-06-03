package com.pog.eg.config;

import org.hibernate.SessionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.jndi.JndiTemplate;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.orm.hibernate5.HibernateTransactionManager;

import javax.naming.NamingException;
import javax.sql.DataSource;
import java.io.IOException;
import java.util.Properties;

/**
 * [Class description.]
 * <p>
 * [Other notes.]
 *
 * @author Phuttipong
 * @version %I%
 * @since 2/6/2559
 */
@Configuration
@ComponentScan({"com.pog.eg.dao"})
public class PersistenceConfig {

    private static final Logger logger = LoggerFactory
            .getLogger(PersistenceConfig.class);

    @Bean
    public HibernateTransactionManager transactionManager(SessionFactory sessionFactory) throws IOException {
        HibernateTransactionManager txName = new HibernateTransactionManager(sessionFactory);
        return txName;
    }

    @Bean
    LocalSessionFactoryBean sessionFactory(DataSource dataSource) {

        LocalSessionFactoryBean sfb = new LocalSessionFactoryBean();
        sfb.setPackagesToScan("com.pog.eg.domain");
        sfb.setDataSource(dataSource);

        Properties props = new Properties();
        props.setProperty("hibernate.dialect", "org.hibernate.dialect.MySQLDialect");
        sfb.setHibernateProperties(props);

        return sfb;
    }

    @Bean
    DataSource dataSource() {
        DataSource dataSource = null;
        JndiTemplate jndi = new JndiTemplate();
        try {
            dataSource = (DataSource) jndi.lookup("java:comp/env/jdbc/yourname");
        } catch (NamingException e) {
            logger.error("NamingException for java:comp/env/jdbc/yourname", e);
        }
        return dataSource;
    }
}
