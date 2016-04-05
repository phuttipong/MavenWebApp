package com.pog.eg.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration class of Service layer.
 *
 * @author phuttipong
 * @version %I%, %G%
 */
@Configuration
@ComponentScan({"com.pog.eg.service"})
//@EnableTransactionManagement // if use @Transactional
public class ServiceConfig {
}
