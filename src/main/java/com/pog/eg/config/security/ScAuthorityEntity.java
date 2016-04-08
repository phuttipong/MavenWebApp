package com.pog.eg.config.security;

import org.springframework.security.core.GrantedAuthority;

import javax.persistence.Entity;

/**
 * This is customized Spring GrantedAuthority class
 * <p>
 * used together with ScUserEntity to serialize authentication token.
 *
 * @author phuttipong
 * @version %I%
 * @since 7/4/2559
 */
@Entity
class ScAuthorityEntity implements GrantedAuthority {

    private String authority;

    ScAuthorityEntity() {
    }

    @Override
    public String getAuthority() {
        return authority;
    }

    public void setAuthority(String authority) {
        this.authority = authority;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        ScAuthorityEntity that = (ScAuthorityEntity) o;

        return authority != null ? authority.equals(that.authority) : that.authority == null;

    }

    @Override
    public int hashCode() {
        return authority != null ? authority.hashCode() : 0;
    }
}
