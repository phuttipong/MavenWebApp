package com.pog.eg.config.security;

import org.springframework.security.web.context.AbstractSecurityWebApplicationInitializer;

/**
 * This class is for Spring configuration.
 * it implements WebApplication-Initializer,
 * so it will be discovered by Spring and be used to register Delegating-FilterProxy with the web container.
 * this NEEDED to make Spring Security work.
 *
 * @author phuttipong
 * @author Phuttipong
 * @version %I%
 * @see "Spring in Action, 4th edition"
 * @since 14/3/2558
 */
public class SecurityWebInitializer extends AbstractSecurityWebApplicationInitializer {
}