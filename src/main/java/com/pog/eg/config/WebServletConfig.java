package com.pog.eg.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 * Configuration class of Web layer.
 *
 * @author phuttipong
 * @version %I%, %G%
 */
@Configuration
@EnableWebMvc
@ComponentScan({ "com.pog.eg.web"})
public class WebServletConfig extends WebMvcConfigurerAdapter {
}
