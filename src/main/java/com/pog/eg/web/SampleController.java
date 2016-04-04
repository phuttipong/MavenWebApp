package com.pog.eg.web;

import com.pog.eg.service.SampleService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Sample web class showing usages of Spring framework.
 * This web annotate with @RestController so it will return content instead of passing to view-engine.
 *
 * @author phuttipong
 * @version %I%, %G%
 */
@SuppressWarnings("SpringMVCViewInspection")
@RestController
public class SampleController {

    private static final Logger logger = LoggerFactory.getLogger(SampleController.class);

    @Autowired
    private SampleService simpleService;

    /**
     * Simple as it is.
     * @return String Some Hello World text.
     */
    @RequestMapping(value = "/text", method = RequestMethod.GET)
    public String getText() {
        logger.info("logger work fine.");
        return "Simple Hello World!, return string in response body";
    }

    /**
     * This method use service class capability. Show that we can easily plug service without making coupling between those classes.
     * @return List Sample list of String.
     */
    @RequestMapping(value = "/list", method = RequestMethod.GET)
    public List getList() {
        return simpleService.buildSampleList();
    }
}
