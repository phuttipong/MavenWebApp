package com.pog.eg.config.security;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * A filter used to hook stateless protection logic.
 *
 * @author phuttipong
 * @version %I%
 * @since 7/4/2559
 */
class StatelessAuthenticationFilter extends GenericFilterBean {

    private final StatelessAuthenticationService statelessAuthenticationService;

    StatelessAuthenticationFilter(StatelessAuthenticationService taService) {
        this.statelessAuthenticationService = taService;
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException,
            ServletException {
        SecurityContextHolder.getContext().setAuthentication(
                statelessAuthenticationService.getAuthentication((HttpServletRequest) req, (HttpServletResponse) res));
        chain.doFilter(req, res); // always continue
    }
}
