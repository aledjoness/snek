package com.thehutgroup.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class IndexController {

  @RequestMapping("/")
  public String index() {
    return "index";
  }

  @RequestMapping("/singleplayer")
  public String singleplayer() { return "singleplayer"; }

  @RequestMapping("/multiplayer")
  public String multiplayer() { return "multiplayer"; }

}
