package com.pog.eg.config.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.access.AccessDeniedHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;

/**
 * Customize class which when inject to Spring Security configuration
 * will make Spring return "HTTP Error 404 Not Found" instead of "HTTP Error 401 Unauthorized"
 *
 * @author phuttipong
 * @version %I%
 * @since 6/4/2559
 */
@SuppressWarnings({"SameParameterValue", "unused"})
class RestAccessDeniedHandler implements AccessDeniedHandler {

    private static final Logger logger = LoggerFactory.getLogger(RestAccessDeniedHandler.class);

    private final String errorPage;

    /**
     * @param errorPageUrl (Optional) url to redirect ot when HTTP Error.
     */
    @SuppressWarnings("SameParameterValue")
    RestAccessDeniedHandler(String errorPageUrl) {
        this.errorPage = errorPageUrl;
    }

    public String getErrorPage() {
        return errorPage;
    }

    public void handle(HttpServletRequest request, HttpServletResponse response,
                       AccessDeniedException accessDeniedException)
            throws IOException, ServletException {

        if (logger.isDebugEnabled()) {
            try {
                Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
                logger.debug(String.format("Access deny. Rejecting access " +
                                "\nURL=%s\nServletPath=%s\nPrincipal=%s\nException=%s",
                        request.getRequestURL(),
                        request.getServletPath(),
                        principal.toString(),
                        accessDeniedException.getMessage()));
            } catch (RuntimeException ex) {
                logger.debug(String.format("Error Trying to log pre-authenticated\nMessage=%s\nStack=%s", ex.getMessage(), Arrays.toString(ex.getStackTrace())));
            }
        }

        if (Util.isAjax(request)) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        if (errorPage != null)
            response.sendRedirect(request.getContextPath() + errorPage);
        else
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
    }

}
