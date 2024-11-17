package com.shreeva.urbanlaundry;

import android.Manifest;
import android.app.Activity;
import android.content.pm.PackageManager;
import android.os.Environment;
import android.util.Base64;

import androidx.core.app.ActivityCompat;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;


@CapacitorPlugin(name = "FileWriter")
public class FileWriter extends Plugin {
  private static final int REQUEST_EXTERNAL_STORAGE = 1;
  private static String[] PERMISSIONS_STORAGE = {
    Manifest.permission.READ_EXTERNAL_STORAGE,
    Manifest.permission.WRITE_EXTERNAL_STORAGE
  };

  public static void verifyStoragePermissions(Activity activity) {
    // Check if we have write permission
    int permission = ActivityCompat.checkSelfPermission(activity, Manifest.permission.WRITE_EXTERNAL_STORAGE);

    if (permission != PackageManager.PERMISSION_GRANTED) {
      // We don't have permission so prompt the user
      ActivityCompat.requestPermissions(
        activity,
        PERMISSIONS_STORAGE,
        REQUEST_EXTERNAL_STORAGE
      );
    }
  }


  @PluginMethod()
  public void writeFile(PluginCall call){
    var codedString = call.getString("data");
    verifyStoragePermissions((MainActivity)getActivity());
    System.out.println(codedString);
    codedString = codedString.replace("data:application/pdf;base64,","");
    byte[] data = Base64.decode(codedString,Base64.DEFAULT);
    File path = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
    if (!path.exists() && path.isDirectory()) {
      path.mkdirs();
    }
    File file = new File(path, call.getString("name"));
    try (OutputStream stream = new FileOutputStream(file)) {
      stream.write(data);
      call.reject("PDF is generated.");
    } catch (FileNotFoundException e) {
      call.reject("File Not found",e);
      throw new RuntimeException(e);
    } catch (IOException e) {
      call.reject("Read Write Permission missing.",e);
      throw new RuntimeException(e);
    }
  }
}
