package com.pog.eg.config.security;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import javax.xml.bind.DatatypeConverter;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.Date;

/**
 * This class consists methods that serialize/deserialize an authentication token.
 *
 * @author phuttipong
 * @version %I%
 * @since 7/4/2559
 */
final class TokenHandler {

    private static final String HMAC_ALGO = "HmacSHA256";
    private static final String SEPARATOR = ".";
    private static final String SEPARATOR_SPLITTER = "\\.";

    private final Mac hmac;

    TokenHandler(byte[] secretKey) {
        try {
            hmac = Mac.getInstance(HMAC_ALGO);
            hmac.init(new SecretKeySpec(secretKey, HMAC_ALGO));
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            throw new IllegalStateException("failed to initialize HMAC: " + e.getMessage(), e);
        }
    }

    ScUserEntity parseUserFromToken(String token, String csrfToken) {
        final String[] parts = token.split(SEPARATOR_SPLITTER);

        // check csrf part
        if (csrfToken == null)
            return null;
        else if (!(csrfToken + "=").equals(parts[1]))
            return null;

        if (parts.length == 2 && parts[0].length() > 0 && parts[1].length() > 0) {
            try {
                final byte[] userBytes = fromBase64(parts[0]);
                final byte[] hash = fromBase64(parts[1]);

                boolean validHash = Arrays.equals(createHmac(userBytes), hash);
                if (validHash) {
                    final ScUserEntity user = fromJSON(userBytes);

                    // check expire date
                    if (new Date().getTime() < user.getExpires()) {
                        return user;
                    }
                }
            } catch (IllegalArgumentException e) {
                //log tempering attempt here
            }
        }
        return null;
    }

    String createTokenForUser(ScUserEntity user) {
        byte[] userBytes = toJSON(user);
        byte[] hash = createHmac(userBytes);
        return toBase64(userBytes) +
                SEPARATOR +
                toBase64(hash);
    }

    private ScUserEntity fromJSON(final byte[] userBytes) {
        try {
            return new ObjectMapper().readValue(new ByteArrayInputStream(userBytes), ScUserEntity.class);
        } catch (IOException e) {
            throw new IllegalStateException(e);
        }
    }

    private byte[] toJSON(ScUserEntity user) {
        try {
            return new ObjectMapper().writeValueAsBytes(user);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException(e);
        }
    }

    private String toBase64(byte[] content) {
        return DatatypeConverter.printBase64Binary(content);
    }

    private byte[] fromBase64(String content) {
        return DatatypeConverter.parseBase64Binary(content);
    }

    // synchronized to guard internal hmac object
    private synchronized byte[] createHmac(byte[] content) {
        return hmac.doFinal(content);
    }
}