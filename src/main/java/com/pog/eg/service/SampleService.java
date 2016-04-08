package com.pog.eg.service;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * This is a service show that we can put business logic here.
 *
 * @author phuttipong
 * @version %I%, %G%
 */
@Service
public class SampleService {

    public List<String> buildSampleList(){

        List<String> list = new ArrayList<>();

        list.add("item 1");
        list.add("item 2");
        list.add("item 3");

        return list;
    }
}
