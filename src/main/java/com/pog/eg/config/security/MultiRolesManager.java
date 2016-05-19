package com.pog.eg.config.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.*;

import static com.pog.eg.config.security.MultiRolesManager.permission.viewBankAccounts;

/**
 * This class has easy-to-use methods to work with MultiRoles user schema.
 * such create user, change password, etc.
 *
 * @author phuttipong
 * @version %I%
 * @since 6/4/2559
 */
@Service
public class MultiRolesManager {

    private static final Map<String, HashSet<permission>> roleToPermission = Collections.unmodifiableMap(
            new HashMap<String, HashSet<permission>>() {{
                put("ROLE_ADMIN", new HashSet<>(Arrays.asList(
                        new permission[]{viewBankAccounts}
                )));
            }});
    @Autowired
    private AuthenticationManager authenticationManager;

    /**
     * Give permission list of current user.
     *
     * @return empty collection or collection of permission.
     */
    public Collection<permission> getPermission() {

        Set<permission> permissionSet = new HashSet<>();

        if (SecurityContextHolder.getContext().getAuthentication() == null)
            return permissionSet;

        Collection<? extends GrantedAuthority> authorities = SecurityContextHolder.getContext().getAuthentication().getAuthorities();

        for (GrantedAuthority auth : authorities) {
            HashSet<permission> permissions = roleToPermission.get(auth.getAuthority());

            if (permissions == null)
                continue;

            permissionSet.addAll(permissions);
        }
        return permissionSet;

    }

    /**
     * Check if current user has given permission
     *
     * @param permission the permission to check
     */
    public boolean hasPermission(permission permission) {
        if (SecurityContextHolder.getContext().getAuthentication() == null)
            return false;

        Collection<? extends GrantedAuthority> authorities = SecurityContextHolder.getContext().getAuthentication().getAuthorities();

        for (GrantedAuthority auth : authorities) {
            HashSet<permission> permissions = roleToPermission.get(auth.getAuthority());
            if (permissions == null)
                continue;

            if (permissions.contains(permission))
                return true;
        }

        return false;
    }

    public enum permission {
        viewBankAccounts
    }
}
