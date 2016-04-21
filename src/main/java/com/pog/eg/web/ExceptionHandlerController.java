package com.pog.eg.web;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.NoHandlerFoundException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Class contains exception handler methods for @Controller/@RestController classes.
 *
 * @author phuttipong
 * @version %I%
 * @since 21/4/2559
 */
@ControllerAdvice
public class ExceptionHandlerController {

    /**
     * handle NoHandlerFoundException
     * <p>
     * please note that you need config dispatcher servlet so that it throw NoHandlerFoundException,
     * otherwise handleError404 will not work.
     * eg.
     * <init-param>
     * <param-name>throwExceptionIfNoHandlerFound</param-name>
     * <param-value>true</param-value>
     * </init-param>
     */
    @ExceptionHandler(NoHandlerFoundException.class)
    public ModelAndView handleError404(HttpServletRequest request, HttpServletResponse response, Exception e) {
        if (Util.isAjax(request)) {
            try {
                response.sendError(HttpServletResponse.SC_NOT_FOUND);
            } catch (IOException e1) {
                e1.printStackTrace();
            }
            return null;
        }
        ModelAndView mav = new ModelAndView("error/404.html");
        mav.addObject("exception", e);
        return mav;
    }

    /**
     * handle Exception
     */
    @ExceptionHandler(Exception.class)
    public ModelAndView handleError(HttpServletRequest request, HttpServletResponse response, Exception e) {
        if (Util.isAjax(request)) {
            try {
                response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            } catch (IOException e1) {
                e1.printStackTrace();
            }
            return null;
        }
        ModelAndView mav = new ModelAndView("error/500.html");
        mav.addObject("exception", e);
        return mav;
    }
}
