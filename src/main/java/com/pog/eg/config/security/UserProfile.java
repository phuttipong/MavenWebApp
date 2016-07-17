package com.pog.eg.config.security;

import javax.persistence.Entity;
import java.util.Collection;

/**
 * This is DTO class hold user profile datas.
 *
 * @author phuttipong
 * @version %I%
 * @since 6/4/2559
 */
@SuppressWarnings("unused")
@Entity
class UserProfile {
    private final long timestamp;
    private final String fullname;
    private final Collection<MultiRolesUserDetailsService.permission> permissions;

    UserProfile(long timestamp, String fullname, Collection<MultiRolesUserDetailsService.permission> permissions) {
        this.timestamp = timestamp;
        this.fullname = fullname;
        this.permissions = permissions;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public String getFullname() {
        return fullname;
    }

    public Collection<MultiRolesUserDetailsService.permission> getPermissions() {
        return permissions;
    }
}
