package com.pog.eg.service;

import com.pog.eg.domain.Sample;

import java.util.List;

/**
 * [Class description.]
 * <p>
 * [Other notes.]
 *
 * @author Phuttipong
 * @version %I%
 * @since 3/6/2559
 */
public interface SampleService {

    List<String> buildSampleList();

    Sample get(String id);

    Sample delete(String id);
}
