package com.pog.eg.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

/**
 * In RESTful web service sometime we need to
 *
 * @author phuttipong
 * @version %I%, %G%
 */

@Controller
@RequestMapping("/pages")
public class PageController {

    private static final String SERVER_ERROR_VIEW = "500";
    private static final String USER_ERROR_VIEW = "404";

    @RequestMapping(value = "/{name}", method = RequestMethod.GET)
    public ModelAndView getForCode(@PathVariable String name, ModelAndView model) {

        if (name.equals(SERVER_ERROR_VIEW))
            model.setViewName(SERVER_ERROR_VIEW + ".html");
        else
            model.setViewName(USER_ERROR_VIEW + ".html");
        return model;
    }
}
