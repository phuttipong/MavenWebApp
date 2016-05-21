package com.pog.eg.config.security;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import javax.sql.DataSource;
import java.nio.ByteBuffer;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

/**
 * This is a customized UserDetailsService which implement multi-roles data structures.
 * <p>
 * It use tables sc_users, sc_roles, sc_authorities. Please see _sc_tables_gen.sql.
 * the tables have binary(16) PK which map to java.util.UUID type. This make them more difficult to guess user's id.
 *
 * @author phuttipong
 * @version %I%
 * @since 6/4/2559
 */
public class MultiRolesUserDetailsService implements UserDetailsService {

    private final JdbcTemplate jdbcTemplate;

    private final Map<String, HashSet<permission>> roleToPermission = Collections.unmodifiableMap(
            new HashMap<String, HashSet<permission>>() {{
                put("ROLE_ADMIN", new HashSet<>(Arrays.asList(
                        new permission[]{permission.viewBankAccounts}
                )));
            }});

    MultiRolesUserDetailsService(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    public final ScUserEntity loadUserByUsername(String username) throws UsernameNotFoundException {
        final ScUserEntity user;

        String selectByUsername = "SELECT u.id, u.password, u.enabled, u.first_name, u.family_name, u.language, s.name as security_role_name\n" +
                "FROM sc_users as u\n" +
                "LEFT JOIN sc_authorities as a ON u.id = a.user_id\n" +
                "LEFT JOIN sc_roles as s ON a.security_role_id = s.id\n" +
                "WHERE u.username = ?";
        List<UserData> userDatas = jdbcTemplate.query(selectByUsername, new Object[]{username}, new UserDataMapper());

        if (userDatas.isEmpty())
            throw new UsernameNotFoundException("user not found");

        UserData first = userDatas.get(0);

        HashSet<ScAuthorityEntity> authorities = new HashSet<>();
        for (UserData userData : userDatas) {
            if (userData.securityRoleName != null && !userData.securityRoleName.isEmpty()) {
                ScAuthorityEntity e = new ScAuthorityEntity();
                e.setAuthority(userData.securityRoleName);
                authorities.add(e);
            }
        }

        user = new ScUserEntity(username, first.password, first.enabled, true, true, true, authorities, first.id, first.firstName, first.familyName, first.language);
        return user;
    }

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

    public String getFullname() {
        if (SecurityContextHolder.getContext().getAuthentication() == null)
            return "";

        UserAuthentication authentication = (UserAuthentication) SecurityContextHolder.getContext().getAuthentication();
        return authentication.getDetails().getFullname();
    }

    private UUID getUuidFromByteArray(byte[] bytes) {
        ByteBuffer bb = ByteBuffer.wrap(bytes);
        long high = bb.getLong();
        long low = bb.getLong();
        return new UUID(high, low);
    }

    public enum permission {
        viewBankAccounts
    }

    private class UserData {
        UUID id;
        String password;
        boolean enabled;
        String firstName;
        String familyName;
        String language;
        String securityRoleName;
    }

    private class UserDataMapper implements RowMapper<UserData> {
        public UserData mapRow(ResultSet rs, int rowNum) throws SQLException {
            UserData data = new UserData();
            data.id = getUuidFromByteArray(rs.getBytes("id"));
            data.password = rs.getString("password");
            data.enabled = rs.getBoolean("enabled");
            data.firstName = rs.getString("first_name");
            data.familyName = rs.getString("family_name");
            data.language = rs.getString("language");
            data.securityRoleName = rs.getString("security_role_name");
            return data;
        }
    }
}
