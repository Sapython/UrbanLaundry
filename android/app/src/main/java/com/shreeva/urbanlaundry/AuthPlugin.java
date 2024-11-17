package com.shreeva.urbanlaundry;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.gms.common.api.ApiException;

@CapacitorPlugin(name = "AuthPlugin")
public class AuthPlugin extends Plugin {
  private static PluginCall mainCall;
  @PluginMethod()
  public void startAuth(PluginCall call) throws InterruptedException {
    mainCall = call;
    ((MainActivity)getActivity()).signInWithGoogle();
    call.setKeepAlive(true);
  }

  public static void returnGoogleCredential(JSObject authData){
    mainCall.resolve(authData);
  }

  public static void returnGoogleError(ApiException exception){
    String message = exception.getMessage();
    mainCall.errorCallback(message);
  }
}
