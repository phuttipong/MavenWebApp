package com.pog.eg.config.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.AuthenticationEntryPoint;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;

/**
 * Customize entry-point which when inject to Spring Security configuration
 * will make Spring return "HTTP Error 404 Not Found" instead of "HTTP Error 401 Unauthorized"
 *
 * @author phuttipong
 * @version %I%
 * @since 6/4/2559
 */
@SuppressWarnings("unused")
class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private static final Logger logger = LoggerFactory.getLogger(RestAuthenticationEntryPoint.class);

    private final String notMappedUrl;

    /**
     * @param notMappedUrl (Optional) url which not map to any controller. used to create NotFoundException in web context.
     */
    @SuppressWarnings("SameParameterValue")
    RestAuthenticationEntryPoint(String notMappedUrl) {
        this.notMappedUrl = notMappedUrl;
    }

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {

        if (logger.isDebugEnabled()) {
            try {
                Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
                logger.debug(String.format("Pre-authenticated entry point called. Rejecting access " +
                                "\nURL=%s\nServletPath=%s\nPrincipal=%s\nException=%s",
                        request.getRequestURL(),
                        request.getServletPath(),
                        principal.toString(),
                        authException.getMessage()));
            } catch (RuntimeException ex) {
                logger.debug(String.format("Error Trying to log pre-authenticated\nMessage=%s\nStack=%s", ex.getMessage(), Arrays.toString(ex.getStackTrace())));
            }
        }

        if (Util.isAjax(request)) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        if (notMappedUrl != null)
            response.sendRedirect(notMappedUrl);
        else
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
    }
}
