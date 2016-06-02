package com.pog.eg.web;

import com.pog.eg.domain.Sample;
import com.pog.eg.service.SampleService;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.joda.time.LocalDateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Locale;
import java.util.TimeZone;

/**
 * Sample web class showing usages of Spring framework.
 * This web annotate with @RestController so it will return content instead of passing to view-engine.
 *
 * <p>
 * relate to URI pattern-comparison
 * See <a href="https://github.com/spring-projects/spring-framework/commit/e4182da4ebb1197b84f979fea9e89a76343f242e>commit e4182d</a>
 *
 * @author phuttipong
 * @version %I%, %G%
 */
@SuppressWarnings({"SpringMVCViewInspection", "SameReturnValue"})
@RestController
@RequestMapping("**/sample")
public class SampleController {

    private static final Logger logger = LoggerFactory.getLogger(SampleController.class);

    @Autowired
    private SampleService simpleService;

    @Autowired
    private MessageSource clientString;

    /**
     * Match GET \*\*\/sample\/getList
     * This method use service class capability. Show that we can easily plug service without making coupling between those classes.
     */
    @RequestMapping(value = "/getList", method = RequestMethod.GET)
    public List getList() {
        return simpleService.buildSampleList();
    }

    /**
     * Match GET \*\*\/sample\/1 or \*\*\/sample\/str
     */
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public Sample show(@PathVariable("id") int id) {
        // business logic to retrieve an entity
        return new Sample(id, "The Shawshank Redemption", "1994", 678790, 9.2, 1);
    }

    /**
     * Match DELETE \*\*\/sample\/1 or \*\*\/sample\/str
     */
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public Sample delete(@PathVariable("id") int id) {
        // business logic to delete an entity and
        // return the appropriate view goes here
        return new Sample(id, "The Shawshank Redemption", "1994", 678790, 9.2, 1);
    }

    /**
     * Simple as it is.
     *
     * @return String Some Hello World text.
     */
    @RequestMapping(value = "/text", method = RequestMethod.GET)
    public String getText() {
        logger.info("logger work fine.");
        return "Simple Hello World!, return string in response body";
    }

    /**
     * This method show that we integrate Joda-Time correctly.
     * this should equal local datetime of web server.
     *
     * @return LocalDateTime Local time of servlet.
     */
    @RequestMapping(value = "/localDateTime", method = RequestMethod.GET)
    public LocalDateTime getLocalDateTime() {
        return new LocalDateTime();
    }

    /**
     * This method show that we integrate Joda-Time correctly.
     * this should equal datetime(UTC) of web server.
     *
     * @return LocalDateTime UTC time of servlet.
     */
    @RequestMapping(value = "/utcDateTime", method = RequestMethod.GET)
    public DateTime getDateTime() {
        return new DateTime();
    }

    /**
     * The default time zone is derived from the system property user.timezone.
     * If that is null or is not a valid identifier,
     * then the value of the JDK TimeZone default is converted.
     * If that fails, UTC is used.
     *
     * @return DateTimeZone Timezone
     */
    @RequestMapping(value = "/timezone", method = RequestMethod.GET)
    public DateTimeZone getTimezone() {
        return DateTimeZone.getDefault();
    }

    /**
     * The default time zone is derived from the system property user.timezone.
     * If that is null or is not a valid identifier,
     * then the value of the JDK TimeZone default is converted.
     * If that fails, UTC is used.
     *
     * @return DateTimeZone Timezone
     */
    @RequestMapping(value = "/myLocale", method = RequestMethod.GET)
    public String getMyLocale(Locale locale, TimeZone timeZone) {
        return locale.getDisplayName() + " " + timeZone.getDisplayName();
    }

    /**
     * Return localized greeting message.
     *
     * @param locale Session locale.
     * @return String localized greeting message.
     */
    @RequestMapping(value = "/greetingMessage", method = RequestMethod.GET)
    public String getHelloMessage(Locale locale) {
        return clientString.getMessage("app.greeting", null, locale);
    }

    /**
     * Secured url
     *
     * @return secret string
     */
    @RequestMapping(value = "/sc/secretData", method = RequestMethod.GET)
    public String getSecretData() {
        return "I'm alien.";
    }


    /**
     * This method always return exception. for demonstrate how GlobalControllerExceptionHandler work.
     */
    @RequestMapping(value = "/error", method = RequestMethod.GET)
    public void throwError() {
        throw new IllegalStateException("some error");
    }

}
