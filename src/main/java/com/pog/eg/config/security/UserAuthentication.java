package com.pog.eg.config.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

/**
 * The wrapper class which wrap a customized user detail so that it act as Authentication for Spring Security.
 *
 * @author phuttipong
 * @version %I%
 * @since 7/4/2559
 */
class UserAuthentication implements Authentication {

    private static final String PASSWORD = "[PROTECTED]";
    private final ScUserEntity user;
    private boolean authenticated = true;

    UserAuthentication(ScUserEntity user) {
        this.user = user;
    }

    @Override
    public String getName() {
        return user.getUsername();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return user.getAuthorities();
    }

    @Override
    public Object getCredentials() {
        return PASSWORD;
    }

    @Override
    public ScUserEntity getDetails() {
        return user;
    }

    @Override
    public Object getPrincipal() {
        return user.getUsername();
    }

    @Override
    public boolean isAuthenticated() {
        return authenticated;
    }

    @Override
    public void setAuthenticated(boolean authenticated) {
        this.authenticated = authenticated;
    }
}
