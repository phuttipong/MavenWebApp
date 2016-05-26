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

    /**
     * @param token Token string to parse.
     * @return null if not token or it is invalid token.
     */
    ScUserEntity parseUserFromToken(String token) {
        final String[] parts = token.split(SEPARATOR_SPLITTER);

        if (parts.length == 2 && parts[0].length() > 0 && parts[1].length() > 0) {
            try {
                final byte[] userBytes = fromBase64(parts[0]);
                final byte[] hash = fromBase64(parts[1]);

                boolean validHash = Arrays.equals(createHmac(userBytes), hash);
                if (validHash) {
                    return fromJSON(userBytes);
                }
            } catch (IllegalArgumentException e) {
                //log tempering attempt here
            }
        }
        return null;
    }

    /**
     * Create token from user datas.
     */
    String createTokenForUser(ScUserEntity user) {
        byte[] userBytes = toJSON(user);
        byte[] hash = createHmac(userBytes);
        return toBase64(userBytes) +
                SEPARATOR +
                toBase64(hash);
    }

    /**
     * Generate token key from token
     */
    String getTokenKey(String token) {
        int sepIdx = token.indexOf(SEPARATOR);
        String used = token.substring(sepIdx - 5, sepIdx + 5); // believe that some part from first half and second half is most dynamic.
        byte[] hash = createHmac(used.getBytes());
        String hashedStr = toBase64(hash);
        return hashedStr.length() > 15 ? hashedStr.substring(0, 15) : hashedStr;
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