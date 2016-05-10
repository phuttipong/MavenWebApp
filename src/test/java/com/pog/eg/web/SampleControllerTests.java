package com.pog.eg.web;


import com.pog.eg.config.TestContext;
import com.pog.eg.config.WebServletConfig;
import com.pog.eg.service.SampleService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.mock.http.MockHttpOutputMessage;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.io.IOException;
import java.nio.charset.Charset;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;


/**
 * created on 2/12/2558
 *
 * @author Phuttipong
 */
@WebAppConfiguration
@ContextConfiguration(classes = {TestContext.class})
@RunWith(SpringJUnit4ClassRunner.class)
public class SampleControllerTests {

    protected WebServletConfig webConfig = new WebServletConfig();
    @Mock
    SampleService policyService;

    @InjectMocks
    SampleController controllerUnderTest;
    private MediaType contentType = new MediaType(MediaType.APPLICATION_JSON.getType(),
            MediaType.APPLICATION_JSON.getSubtype(),
            Charset.forName("utf8"));
    private MockMvc mockMvc;

    protected String json(Object o) throws IOException {
        MockHttpOutputMessage mockHttpOutputMessage = new MockHttpOutputMessage();
        webConfig.jacksonMessageConverter().write(
                o, MediaType.APPLICATION_JSON, mockHttpOutputMessage);
        return mockHttpOutputMessage.getBodyAsString();
    }

    @Before
    public void setUp() {
        // this must be called for the @Mock annotations above to be processed
        // and for the mock service to be injected into the controller under
        // test.
        MockitoAnnotations.initMocks(this);

        this.mockMvc = MockMvcBuilders.standaloneSetup(controllerUnderTest).build();
    }

    @Test
    public void get_ApiTextReturnText() throws Exception {

        this.mockMvc.perform(get("/api/text"))
                .andExpect(content().string("Simple Hello World!, return string in response body"));
    }

//    @Test
//    public void put_notFound() throws Exception {
//
//        this.mockMvc.perform(put("/svc/cookies"))
//                .andExpect(status().isMethodNotAllowed());
//    }
//
//    @Test
//    public void postLogin_noContent_badRequest() throws Exception {
//
//        this.mockMvc.perform(post("/svc/cookies")
//                .contentType(contentType))
//                .andExpect(status().isBadRequest());
//    }
//
//    @Test
//    public void postLogin_invalidContent_errorMessage() throws Exception {
//
//        this.mockMvc.perform(post("/svc/cookies")
//                .content("{\"username\":null,\"password\":null,\"company\":null}")
//                .contentType(contentType))
//                .andExpect(status().isBadRequest())
//                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
//                .andExpect(jsonPath("$.*", hasSize(1)))
//                .andExpect(jsonPath("$.messages", hasSize(3)))
//                .andExpect(jsonPath("$.messages[1]", is("Username should not be blank")))
//                .andExpect(jsonPath("$.messages[2]", is("Password should not be blank")))
//                .andExpect(jsonPath("$.messages[3]", is("Company should not be blank")));
//    }
//
//    @Test
//    public void postLogin_wrongCredential_errorMessage() throws Exception {
//
//        this.mockMvc.perform(post("/svc/cookies")
//                .contentType(contentType))
//                .andExpect(status().isBadRequest())
//                .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
//                .andExpect(jsonPath("$.*", hasSize(1)))
//                .andExpect(jsonPath("$.messages", hasSize(1)))
//                .andExpect(jsonPath("$.messages[1]", is("Username or password provided is incorrect")));
//    }
}
