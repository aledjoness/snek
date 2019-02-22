package com.thehutgroup.controllers;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class NotFoundController implements ErrorController {

  @RequestMapping(value = "/error")
  public String error() {
    return "404";
  }


  @Override
  public String getErrorPath() {
    return "/error";
  }
}
