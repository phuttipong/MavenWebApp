package com.pog.eg.config.security;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.Entity;
import java.util.Set;
import java.util.UUID;

/**
 * This is customized Spring UserDetail class.
 *
 * @author phuttipong
 * @version %I%
 * @since 6/4/2559
 */
@SuppressWarnings({"SameParameterValue", "unused"})
@Entity
class ScUserEntity implements UserDetails {

    // standard fields
    private UUID id;
    private String username;
    private String password;
    private boolean enabled;
    private boolean accountNonExpired;
    private boolean credentialsNonExpired;
    private boolean accountNonLocked;
    private Set<ScAuthorityEntity> authorities;

    // needed of stateless-protection
    private long expires;

    // you may change below fields to suite your needed.
    private String firstName;
    private String familyName;
    private String language;


    public ScUserEntity() {
    }

    public ScUserEntity(String username, String password, boolean enabled, boolean accountNonExpired, boolean credentialsNonExpired,
                        boolean accountNonLocked, Set<ScAuthorityEntity> authorities, UUID id, String firstName,
                        String familyName, String language) {

        this.id = id;
        this.username = username;
        this.password = password;
        this.enabled = enabled;
        this.accountNonExpired = accountNonExpired;
        this.credentialsNonExpired = credentialsNonExpired;
        this.accountNonLocked = accountNonLocked;
        this.authorities = authorities;
        this.firstName = firstName;
        this.familyName = familyName;
        this.language = language;
    }

    @JsonIgnore
    public UUID getId() {
        return id;
    }

    @JsonIgnore
    public String getFirstName() {
        return firstName;
    }

    @JsonIgnore
    public String getFamilyName() {
        return familyName;
    }

    @JsonIgnore
    public String getLanguage() {
        return language;
    }

    @JsonIgnore
    public String getFullname() {
        String fullname = "";
        if (firstName != null)
            fullname = fullname + firstName.trim();

        if (familyName != null)
            fullname = fullname + " " + familyName.trim();

        return fullname;
    }

    public long getExpires() {
        return expires;
    }

    public void setExpires(long expires) {
        this.expires = expires;
    }

    @Override
    public Set<ScAuthorityEntity> getAuthorities() {
        return authorities;
    }

    @Override
    @JsonIgnore
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    @JsonIgnore
    public boolean isEnabled() {
        return enabled;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonExpired() {
        return accountNonExpired;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonLocked() {
        return accountNonLocked;
    }

    @Override
    @JsonIgnore
    public boolean isCredentialsNonExpired() {
        return credentialsNonExpired;
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + ": " + getUsername();
    }
}
