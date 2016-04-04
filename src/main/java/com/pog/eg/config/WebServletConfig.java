package com.pog.eg.config;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.joda.JodaModule;
import org.joda.time.DateTimeZone;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import java.util.List;

/**
 * Configuration class of Web layer.
 *
 * Use Joda-Time as standard date time library.
 *   - use can set default timezone by specific vm-option "-Duser.timezone=Europe/Copenhagen"
 * Use Jackson as JSON converter.
 *
 * @author phuttipong
 * @version %I%, %G%
 */
@Configuration
@EnableWebMvc
@ComponentScan({ "com.pog.eg.web"})
@PropertySource("classpath:webServletConfig.properties")
public class WebServletConfig extends WebMvcConfigurerAdapter {

    @Autowired
    Environment webServletConfig;

    /**
     * Config MessageConverters
     *
     * register Jackson converter
     *
     * @param converters MessageConverterList
     */
    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {

        //Thread-safe de-serialized/serialized JSON converter
        //This will web single mapper shared across application
        //remark!! this will remain thread safe if not call setDateFormat() / setSimpleDateFormat()
        //may config with "Asia/Bangkok" timezone so fields that need timezone such as Calendar can convert correctly.
        //Create Jackson converter
        MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
        ObjectMapper mapper = new ObjectMapper();
        //Set default timezone
        mapper.setTimeZone(DateTimeZone.getDefault().toTimeZone());
        //Register converter for Joda time
        JodaModule jodaModule = new JodaModule();
        mapper.registerModule(jodaModule);
        //Ignore FAIL_ON_UNKNOWN_PROPERTIES
        //this will give us more flexible
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        //Tell mapper to serialize Joda time as string by disable default which serialize as timeStamp.
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        converter.setObjectMapper(mapper);
        //End of config Jackson converter

        converters.add(converter);

        super.configureMessageConverters(converters);
    }
}
