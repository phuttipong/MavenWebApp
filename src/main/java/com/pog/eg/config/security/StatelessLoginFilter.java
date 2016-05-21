package com.pog.eg.config.security;

import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
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
class StatelessLoginFilter extends AbstractAuthenticationProcessingFilter {

    private final StatelessAuthenticationService statelessAuthenticationService;

    @SuppressWarnings("SameParameterValue")
    StatelessLoginFilter(HttpMethod urlMethod, String urlMapping, StatelessAuthenticationService statelessAuthenticationService,
                         AuthenticationManager authManager) {
        super(new AntPathRequestMatcher(urlMapping, urlMethod.toString()));
        this.statelessAuthenticationService = statelessAuthenticationService;
        setAuthenticationManager(authManager);
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException, IOException, ServletException {

        final UsernamePasswordAuthenticationToken loginToken = statelessAuthenticationService.getLoginToken(request);
        if (loginToken != null)
            return getAuthenticationManager().authenticate(loginToken);
        else
            return null;
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                            FilterChain chain, Authentication authentication) throws IOException, ServletException {

        //Use customize authentication object.
        UserAuthentication customAuthentication = statelessAuthenticationService.getUserAuthentication(authentication);

        // Add the custom token as HTTP header to the response
        statelessAuthenticationService.setToken(response, customAuthentication);

        // Add the authentication to the Security context
        SecurityContextHolder.getContext().setAuthentication(customAuthentication);

        statelessAuthenticationService.writePermissionToBody(response);
    }
}