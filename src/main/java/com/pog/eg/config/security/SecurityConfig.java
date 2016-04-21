package com.pog.eg.config.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Spring Security Configuration class.
 * <p>
 * Use BCryptPasswordEncoder, should be standard so password can not be stolen and use by someone else.
 *
 * @author phuttipong
 * @version %I%, %G%
 */
@Configuration
@EnableWebSecurity
@Order(1)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private static final String PAGE_NOT_FOUND_URL = "/reservedForSpringSecurity";
    private static final String LOGIN_URL = "/api/login";
    private static final String DB_DRIVER_NAME = "com.mysql.jdbc.Driver";
    private static final String DB_URL = "jdbc:mysql://localhost:3306/web_app";
    private static final String DB_USERNAME = "app";
    private static final String DB_PWD = "se@ret";
    private static final String TOKEN_SECRET = "9SyECk96oDsTmXfogIieDI0cD/8FpnojlYSUJT5U9I/FGVmBz5oskmjOR8cbXTvoPjX+Pq/T/b1PqpHX0lYm0oCBjXWICA==";

    private MultiRolesUserDetailsService userDetailsService;
    private StatelessAuthenticationService statelessAuthenticationService;

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        userDetailsService = new MultiRolesUserDetailsService(securityDataSource());
        statelessAuthenticationService = new StatelessAuthenticationService(TOKEN_SECRET);

        auth
                .userDetailsService(userDetailsService)
                .passwordEncoder(new BCryptPasswordEncoder(11));
    }

    protected void configure(HttpSecurity http) throws Exception {

        configStatelessProtection(http);

        http
                .authorizeRequests()

                //allow anonymous resource requests
                .antMatchers("/").permitAll()
                .antMatchers("/favicon.ico").permitAll()
                .antMatchers("/resources/**").permitAll()

                //allow only anonymous POSTs to login
                .antMatchers(HttpMethod.POST, LOGIN_URL).permitAll()

                //defined Admin only API area
                .antMatchers("/sc/**").hasRole("ADMIN");
    }

    /**
     * Needed because I can't find other way to expose AuthenticationManager.
     *
     * @return the authentication manager
     * @throws Exception
     */
    @Bean
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManager();
    }

    @Override
    protected MultiRolesUserDetailsService userDetailsService() {
        return userDetailsService;
    }

    /**
     * Datasource
     *
     * @return Datasource
     */
    private DriverManagerDataSource securityDataSource() {
        DriverManagerDataSource ds = new DriverManagerDataSource();
        ds.setDriverClassName(DB_DRIVER_NAME);
        ds.setUrl(DB_URL);
        ds.setUsername(DB_USERNAME);
        ds.setPassword(DB_PWD);
        return ds;
    }

    /**
     * Use stateless way to protect our RESTful services.
     * see http://blog.jdriven.com/2014/10/stateless-spring-security-part-1-stateless-csrf-protection/
     *
     * @param http configurable object.
     * @throws Exception
     */
    private void configStatelessProtection(HttpSecurity http) throws Exception {
        http
                // Spring 4 enable csrf by default.
                // disable and we use our CSRF protection.
                .formLogin().disable()
                .httpBasic().disable()
                .csrf().disable()

                // custom JSON based authentication by POST of {"username":"<name>","password":"<password>"} which sets the token header upon authentication
                .addFilterBefore(new StatelessLoginFilter(HttpMethod.POST, LOGIN_URL, statelessAuthenticationService, userDetailsService, authenticationManager()), UsernamePasswordAuthenticationFilter.class)

                // custom AuthenticationToken based authentication based on the header previously given to the client
                .addFilterBefore(new StatelessAuthenticationFilter(statelessAuthenticationService), UsernamePasswordAuthenticationFilter.class)

                //When receive unauthorized request or unrecognized request, then return 404.html for non-AJAX, 404 response for AJAX.
                .exceptionHandling()
                .authenticationEntryPoint(new RestAuthenticationEntryPoint(PAGE_NOT_FOUND_URL))
                .accessDeniedHandler(new RestAccessDeniedHandler(PAGE_NOT_FOUND_URL));
    }
}