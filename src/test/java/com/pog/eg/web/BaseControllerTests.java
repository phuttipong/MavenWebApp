package com.pog.eg.web;

import com.pog.eg.service.Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.mock.http.MockHttpOutputMessage;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.web.context.WebApplicationContext;

import java.io.IOException;
import java.nio.charset.Charset;

/**
 * [Class description.]
 * <p>
 * [Other notes.]
 *
 * @author Phuttipong
 * @version %I%
 * @since 3/6/2559
 */
abstract class BaseControllerTests {

    protected MockMvc mockMvc;

    @Autowired
    protected WebApplicationContext wac;
    protected MediaType contentType = new MediaType(MediaType.APPLICATION_JSON.getType(),
            MediaType.APPLICATION_JSON.getSubtype(),
            Charset.forName("utf8"));
    @Autowired
    Util webUtil;

    protected String json(Object o) throws IOException {
        MockHttpOutputMessage mockHttpOutputMessage = new MockHttpOutputMessage();
        wac.getBean(MappingJackson2HttpMessageConverter.class).write(
                o, MediaType.APPLICATION_JSON, mockHttpOutputMessage);
        return mockHttpOutputMessage.getBodyAsString();
    }

    protected MockHttpServletRequestBuilder ajax(MockHttpServletRequestBuilder builder) {
        return builder.header("X-Requested-With", "XMLHttpRequest").accept(MediaType.APPLICATION_JSON);
    }

}
