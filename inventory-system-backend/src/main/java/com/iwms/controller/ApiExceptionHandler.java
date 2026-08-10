package com.iwms.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.NoSuchElementException;
import java.util.Map;

@RestControllerAdvice
public class ApiExceptionHandler {
 @ExceptionHandler(NoSuchElementException.class) @ResponseStatus(HttpStatus.NOT_FOUND)
 public Map<String,String> notFound(NoSuchElementException e){return Map.of("error",e.getMessage());}
 @ExceptionHandler({IllegalArgumentException.class,IllegalStateException.class}) @ResponseStatus(HttpStatus.BAD_REQUEST)
 public Map<String,String> badRequest(RuntimeException e){return Map.of("error",e.getMessage());}
}
