package com.pog.eg.web;

import javax.servlet.http.HttpServletRequest;

/**
 * This class consists helper methods.
 *
 * @author phuttipong
 * @version %I%
 * @since 5/4/2559
 */
class Util {

    /**
     * Note that not all the AJAX requests have this header, for example Struts2 Dojo requests doesn't send it;
     * if you instead are generating AJAX calls with Struts2-jQuery (or with any other new AJAX framework), it is there.
     *
     * @param request Request to check
     * @return boolean If the request is AJAX.
     */
    static boolean isAjax(HttpServletRequest request) {
        return "XMLHttpRequest".equals(request.getHeader("X-Requested-With"));
    }
}
