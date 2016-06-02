package com.pog.eg.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import java.text.MessageFormat;

/**
 * Define API which return error pages for HTTP errors.
 *
 * @author Phuttipong
 * @version %I%
 * @since 2/6/2559
 */
@Controller
@RequestMapping("**/httpError")
public class HTTPErrorHandlerController {

    private final String viewFormat = "error/{0}.html"; //This should match ViewResolver configurations.

    private String errorPage(int code) {
        return MessageFormat.format(viewFormat, code);
    }

    @RequestMapping(value = "/404")
    public String error404() {
        return errorPage(404);
    }

    @RequestMapping(value = "/500")
    public String error500() {
        return errorPage(500);
    }
}
