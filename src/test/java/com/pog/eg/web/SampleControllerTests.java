package com.pog.eg.web;


import com.pog.eg.config.TestContext;
import com.pog.eg.domain.Sample;
import com.pog.eg.service.SampleService;
import org.joda.time.DateTime;
import org.joda.time.LocalDateTime;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.List;
import java.util.Locale;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


/**
 * created on 2/12/2558
 * Example of controller testing use SpringFramework.
 * It’s easy to write a plain unit test for a Spring MVC controller using JUnit or TestNG.
 * However, when writing such a unit test, much remains untested:
 * for example, request mappings, data binding, type conversion, validation, and much more.
 * Furthermore, other controller methods such as @InitBinder, @ModelAttribute,
 * and @ExceptionHandler may also be invoked as part of the request processing lifecycle.
 * See <a href="http://docs.spring.io/spring/docs/current/spring-framework-reference/html/integration-testing.html#spring-mvc-test-framework">spring-mvc-test-framework</a>
 *
 * @author Phuttipong
 */
@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration(classes = {TestContext.class})
@ActiveProfiles("test")
public class SampleControllerTests extends BaseControllerTests {

    @Autowired
    SampleService sampleService;

    @Before
    public void setUp() {
        //We have to reset our mock between tests because the mock objects
        //are managed by the Spring container. If we would not reset them,
        //stubbing and verified behavior would "leak" from one test to another.
        Mockito.reset(sampleService);

        this.mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();
    }

    @Test
    public void getTextThenReturnStaticString() throws Exception {

        this.mockMvc.perform(get("/acc/sample/text").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(contentType))
                .andExpect(content().string("\"Simple Hello World!, return string in response body\""));
    }

    @Test
    public void getListThenReturnList() throws Exception {

        List<String> e = Arrays.asList("Buenos Aires", "Córdoba");
        when(sampleService.buildSampleList()).thenReturn(e);

        this.mockMvc.perform(ajax(get("/acc/sample/getList")))
                .andExpect(status().isOk())
                .andExpect(content().contentType(contentType))
                .andExpect(content().json(json(e)));
    }

    @Test
    public void getSampleByIdThenReturnSample() throws Exception {
        Sample e = new Sample("The Shawshank Redemption", "1994", 678790, 9.2, 1);
        when(sampleService.get("2")).thenReturn(e);

        this.mockMvc.perform(ajax(get("/acc/sample/{id}", 2)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(contentType))
                .andExpect(content().json(json(e)));
    }

    @Test
    public void deleteSampleByIdThenReturnSample() throws Exception {
        Sample e = new Sample("The Shawshank Redemption", "1994", 678790, 9.2, 1);
        when(sampleService.delete("5")).thenReturn(e);

        this.mockMvc.perform(ajax(delete("/acc/sample/{id}", 5)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(contentType))
                .andExpect(content().json(json(e)));
    }

    @Test
    public void getLocalDateTimeThenReturnLocalTimeString() throws Exception {

        LocalDateTime atTime = new LocalDateTime();

        when(webUtil.getLocalNow()).thenReturn(atTime);

        this.mockMvc.perform(ajax(get("/acc/sample/localDateTime")))
                .andExpect(status().isOk())
                .andExpect(content().contentType(contentType))
                .andExpect(content().json(json(atTime)));
    }

    @Test
    public void getUtcDateTimeThenReturnDateTimeString() throws Exception {

        DateTime atTime = new DateTime();

        when(webUtil.getUtcNow()).thenReturn(atTime);

        this.mockMvc.perform(ajax(get("/acc/sample/utcDateTime")))
                .andExpect(status().isOk())
                .andExpect(content().contentType(contentType))
                .andExpect(content().json(json(atTime)));
    }

    @Test
    public void getTimeZoneThenReturnCurrentTimezone() throws Exception {

        this.mockMvc.perform(ajax(get("/acc/sample/timezone")))
                .andExpect(status().isOk())
                .andExpect(content().contentType(contentType))
                .andExpect(content().string("\"Asia/Bangkok\""));
    }

    @Test
    public void getMyLocaleThenReturnEnglishLocale() throws Exception {

        this.mockMvc.perform(ajax(get("/acc/sample/myLocale")))
                .andExpect(status().isOk())
                .andExpect(content().contentType(contentType))
                .andExpect(content().string("\"English, Indochina Time\""));
    }

    @Test
    public void getMyLocaleWithZhThenReturnChinese() throws Exception {
        //set HttpHeaders.ACCEPT_LANGUAGE is not work, Spring Test Framework use specific method for this job.
        this.mockMvc.perform(ajax(get("/acc/sample/myLocale")).locale(Locale.CHINESE))
                .andExpect(status().isOk())
                .andExpect(content().contentType(contentType))
                .andExpect(content().string("\"Chinese, Indochina Time\""));
    }

    @Test
    public void getLocaleMessageThenReturnEnglish() throws Exception {
        this.mockMvc.perform(ajax(get("/acc/sample/localeMessage")))
                .andExpect(status().isOk())
                .andExpect(content().contentType(contentType))
                .andExpect(content().string("\"Hello\""));
    }

    @Test
    public void getLocaleMessageWithZhThenReturnChinese() throws Exception {
        this.mockMvc.perform(ajax(get("/acc/sample/localeMessage")).locale(Locale.CHINESE))
                .andExpect(status().isOk())
                .andExpect(content().contentType(contentType))
                .andExpect(content().string("\"你好\""));
    }

    @Test
    public void getSecretDataThenReturnText() throws Exception {
        this.mockMvc.perform(ajax(get("/acc/sample/sc/secretData")))
                .andExpect(status().isOk())
                .andExpect(content().contentType(contentType))
                .andExpect(content().string("\"I'm alien.\""));
    }

    @Test
    public void getErrorThen404() throws Exception {
        this.mockMvc.perform(ajax(get("/acc/sample/error")))
                .andExpect(status().isInternalServerError());
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
