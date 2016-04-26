package com.pog.eg.web;

import com.pog.eg.domain.Movie;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

/**
 * [Class description.]
 * <p>
 * [Other notes.]
 *
 * @author phuttipong
 * @version %I%
 * @since 25/4/2559
 */
@RestController
public class MovieController {

    @RequestMapping(value = "/api/movie/getList", method = RequestMethod.GET)
    public List<Movie> getList() {

        List<Movie> list = new ArrayList<Movie>();

        list.add(new Movie(1, "The Shawshank Redemption", "1994", 678790, 9.2, 1));
        list.add(new Movie(2, "The Godfather", "1972", 511495, 9.2, 2));
        list.add(new Movie(3, "The Godfather: Part II", "1974", 319352, 9.0, 3));

        return list;
    }
}
