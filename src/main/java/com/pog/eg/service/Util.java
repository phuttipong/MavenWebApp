package com.pog.eg.service;

import org.joda.time.DateTime;
import org.joda.time.LocalDateTime;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;

/**
 * [Class description.]
 * <p>
 * [Other notes.]
 *
 * @author Phuttipong
 * @version %I%
 * @since 3/6/2559
 */
@Service
public class Util {
    /**
     * Note that not all the AJAX requests have this header, for example Struts2 Dojo requests doesn't send it;
     * if you instead are generating AJAX calls with Struts2-jQuery (or with any other new AJAX framework), it is there.
     *
     * @param request Request to check
     * @return boolean If the request is AJAX.
     */
    public boolean isAjax(HttpServletRequest request) {
        return "XMLHttpRequest".equals(request.getHeader("X-Requested-With"));
    }

    public LocalDateTime getLocalNow() {
        return new LocalDateTime();
    }

    public DateTime getUtcNow() {
        return new DateTime();
    }


}
