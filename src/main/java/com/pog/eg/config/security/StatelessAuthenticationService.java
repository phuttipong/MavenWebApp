package com.pog.eg.config.security;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.bind.DatatypeConverter;
import java.io.IOException;

/**
 * This class hold main logic of stateless protection.
 *
 * @author phuttipong
 * @version %I%
 * @since 7/4/2559
 */
class StatelessAuthenticationService {
    private static final String AUTH_HEADER_PREFIX = "X";
    private static final long TOKEN_LIFETIME = 1000 * 60 * 15;

    private final TokenHandler tokenHandler;
    private final MultiRolesUserDetailsService userDetailsService;

    @SuppressWarnings("SameParameterValue")
    StatelessAuthenticationService(String secret, MultiRolesUserDetailsService userDetailsService) {
        tokenHandler = new TokenHandler(DatatypeConverter.parseBase64Binary(secret));
        this.userDetailsService = userDetailsService;
    }

    void setToken(HttpServletResponse response, UserAuthentication authentication) {
        if (authentication == null)
            return;

        final ScUserEntity user = authentication.getDetails();
        //if Expire is not set, then it is login.
        if (user.getExpires() == 0) {
            user.setExpires(System.currentTimeMillis() + TOKEN_LIFETIME);
        }
        String token = tokenHandler.createTokenForUser(user);
        Cookie cookie = new Cookie(AUTH_HEADER_PREFIX + tokenHandler.getTokenKey(token), token);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(-1);
        // TODO: 21/5/2559  set secure flag if use https
        //cookie.setSecure(true);
        response.addCookie(cookie);
    }

    void clearToken(HttpServletRequest servletRequest, HttpServletResponse response) {
        Cookie token = findTokenCookie(servletRequest);
        if (token == null)
            return;

        Cookie cookie = new Cookie(token.getName(), "");
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }

    void writePermissionToBody(HttpServletResponse response) throws IOException {
        UserProfile userPermission = new UserProfile(System.currentTimeMillis(), userDetailsService.getFullname(), userDetailsService.getPermission());
        response.getWriter().print(new ObjectMapper().writeValueAsString(userPermission));
    }

    UserAuthentication getUserAuthentication(Authentication authentication) {
        return new UserAuthentication((ScUserEntity) authentication.getPrincipal());
    }

    private Cookie findTokenCookie(HttpServletRequest request) {
        final Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                // no need to check  && cookie.isHttpOnly() because
                // browser not allow to override our httpOnly cookie.
                if (cookie.getName().startsWith(AUTH_HEADER_PREFIX)) {
                    String token = cookie.getValue();
                    if (cookie.getName().endsWith(tokenHandler.getTokenKey(token)))
                        return cookie;
                    else
                        return null;

                }
            }
        }
        return null;
    }

    UserAuthentication getUserAuthentication(HttpServletRequest request) {
        Cookie token = findTokenCookie(request);

        if (token != null) {
            final ScUserEntity user = tokenHandler.parseUserFromToken(token.getValue());
            if (user != null) {
                if (user.getExpires() > System.currentTimeMillis()) {
                    return new UserAuthentication(user);
                } else {
                    final ScUserEntity authenticatedUser = userDetailsService.loadUserByUsername(user.getUsername());
                    return new UserAuthentication(authenticatedUser);
                }

            }
        }
        return null;
    }

    UsernamePasswordAuthenticationToken getLoginToken(HttpServletRequest request) throws IOException {
        try {
            final Credential user;
            final UsernamePasswordAuthenticationToken loginToken;

            user = new ObjectMapper().readValue(request.getInputStream(), Credential.class);
            loginToken = new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword());

            return loginToken;
        } catch (JsonMappingException e) {
            return null;
        } catch (JsonParseException e) {
            return null;
        }
    }
}
