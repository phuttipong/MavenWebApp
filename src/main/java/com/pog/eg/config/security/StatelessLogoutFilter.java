package com.pog.eg.config.security;

import org.springframework.http.HttpMethod;
import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * A filter for logout.
 *
 * @author phuttipong
 * @version %I%
 * @since 23/5/2559
 */
class StatelessLogoutFilter extends GenericFilterBean {

    private final StatelessAuthenticationService statelessAuthenticationService;
    private final String logoutPath;

    StatelessLogoutFilter(StatelessAuthenticationService taService, String logoutPath) {

        this.statelessAuthenticationService = taService;
        this.logoutPath = logoutPath;
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException,
            ServletException {

        HttpServletRequest servletRequest = (HttpServletRequest) req;

        // Provide  API to get user profile.
        if (servletRequest.getRequestURI().equals(logoutPath) &&
                HttpMethod.DELETE.matches(servletRequest.getMethod())) {
            statelessAuthenticationService.clearToken(servletRequest, (HttpServletResponse) res);
            return;
        }

        chain.doFilter(req, res); // always continue
    }
}
