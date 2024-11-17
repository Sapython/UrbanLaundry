package com.shreeva.urbanlaundry;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "Whatsapp")

public class WhatsApp extends Plugin {

  @PluginMethod()
  public void openWhatsapp(PluginCall call) throws InterruptedException {
    ((MainActivity)getActivity()).openWhatsapp(call.getString("phone"));
    call.resolve();
  }
}
