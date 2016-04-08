package com.pog.eg.config.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.stereotype.Service;

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

    @Autowired
    private AuthenticationManager authenticationManager;


}
