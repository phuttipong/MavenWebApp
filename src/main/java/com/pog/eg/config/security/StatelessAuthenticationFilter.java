package com.pog.eg.config.security;

import org.springframework.http.HttpMethod;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * A filter used to hook stateless protection logic.
 * this also provide API to get user profile.
 *
 * user profile JSON such as following
 * {timestamp: 1506405154, fullname: "Phuttipong Aimsupanimitr", permissions: ["viewBankAccounts",...]}
 *
 * @author phuttipong
 * @version %I%
 * @since 7/4/2559
 */
@SuppressWarnings("unused")
class StatelessAuthenticationFilter extends GenericFilterBean {

    private final StatelessAuthenticationService statelessAuthenticationService;
    private final String getProfilePath;

    StatelessAuthenticationFilter(StatelessAuthenticationService taService, String getProfilePath) {

        this.statelessAuthenticationService = taService;
        this.getProfilePath = getProfilePath;
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException,
            ServletException {

        HttpServletRequest servletRequest = (HttpServletRequest) req;

        //Use customize authentication object.
        UserAuthentication authentication = statelessAuthenticationService.getUserAuthentication(servletRequest);

        // Add the custom token as HTTP header to the response
        statelessAuthenticationService.setToken((HttpServletResponse) res, authentication);

        // Add the authentication to the Security context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Provide  API to get user profile.
        if (authentication != null &&
                servletRequest.getRequestURI().equals(getProfilePath) &&
                HttpMethod.GET.matches(servletRequest.getMethod())) {
            statelessAuthenticationService.writePermissionToBody((HttpServletResponse) res);
            return;
        }

        chain.doFilter(req, res); // always continue
    }
}
