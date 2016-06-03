package com.pog.eg.config;

import com.pog.eg.service.SampleService;
import com.pog.eg.service.Util;
import org.mockito.Mockito;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import javax.servlet.http.HttpServletRequest;

import static org.mockito.Matchers.*;
import static org.mockito.Mockito.when;

/**
 * [Class description.]
 * <p>
 * [Other notes.]
 *
 * @author phuttipong
 * @version %I%
 * @since 10/5/2559
 */
@Configuration
@Profile("test")
public class TestContext extends WebServletConfig {

    @Bean
    public SampleService sampleService() {
        return Mockito.mock(SampleService.class);
    }

    @Bean
    public Util webUtil() {
        Util mock = Mockito.mock(Util.class);
        when(mock.isAjax(any(HttpServletRequest.class))).thenCallRealMethod();
        return mock;
    }


}
