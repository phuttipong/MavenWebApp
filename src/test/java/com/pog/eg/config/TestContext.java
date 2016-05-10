package com.pog.eg.config;

import com.pog.eg.service.SampleService;
import org.mockito.Mockito;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

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
public class TestContext {

    private static final String MESSAGE_SOURCE_BASE_NAME = "i18n/messages";

//    @Bean
//    public MessageSource messageSource() {
//        ResourceBundleMessageSource messageSource = new ResourceBundleMessageSource();
//
//        messageSource.setBasename(MESSAGE_SOURCE_BASE_NAME);
//        messageSource.setUseCodeAsDefaultMessage(true);
//
//        return messageSource;
//    }

    @Bean
    public SampleService sampleService() {
        return Mockito.mock(SampleService.class);
    }
}
