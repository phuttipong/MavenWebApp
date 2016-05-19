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
 * <p>
 * Client must store second part of latest AUTH-TOKEN in cookie using key CSRF_TOKEN after receive response
 * and also set header name AUTH_HEADER_NAME with it.
 * eg. server return response with header
 * X-AUTH-TOKEN: eyJ1c2Vybm.51dH87ioykFFufy9hn2ro=
 * then client must set cookie and add header as follow
 *
 * Cookie:CSRF-TOKEN=eyJ1c2Vybm.51dH87ioykFFufy9hn2ro=;
 * X-AUTH-TOKEN: eyJ1c2Vybm.51dH87ioykFFufy9hn2ro=
 *
 * @author phuttipong
 * @version %I%
 * @since 7/4/2559
 */
class StatelessAuthenticationService {

    private static final String CSRF_TOKEN = "CSRF-TOKEN";
    private static final String AUTH_HEADER_NAME = "X-AUTH-TOKEN";
    private static final long TEN_MINUTES = 1000 * 60 * 10;

    private final TokenHandler tokenHandler;

    @SuppressWarnings("SameParameterValue")
    StatelessAuthenticationService(String secret) {
        tokenHandler = new TokenHandler(DatatypeConverter.parseBase64Binary(secret));
    }

    void addAuthentication(HttpServletResponse response, UserAuthentication authentication) {
        final ScUserEntity user = authentication.getDetails();
        user.setExpires(System.currentTimeMillis() + TEN_MINUTES);
        response.addHeader(AUTH_HEADER_NAME, tokenHandler.createTokenForUser(user));
    }

    Authentication getAuthentication(HttpServletRequest request, HttpServletResponse response) {
        final String token = request.getHeader(AUTH_HEADER_NAME);

        // get csrf token
        final Cookie[] cookies = request.getCookies();
        String csrfCookieValue = null;
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals(CSRF_TOKEN)) {
                    csrfCookieValue = cookie.getValue();
                }
            }
        }

        if (token != null) {
            final ScUserEntity user = tokenHandler.parseUserFromToken(token, csrfCookieValue);
            if (user != null) {
                user.setExpires(System.currentTimeMillis() + TEN_MINUTES);
                response.setHeader(AUTH_HEADER_NAME, tokenHandler.createTokenForUser(user));
                return new UserAuthentication(user);
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
