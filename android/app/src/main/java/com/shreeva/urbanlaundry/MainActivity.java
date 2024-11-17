package com.shreeva.urbanlaundry;

import static android.content.ContentValues.TAG;

import static com.shreeva.urbanlaundry.FileWriter.verifyStoragePermissions;

import android.Manifest;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.Nullable;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.JSObject;
import com.google.android.gms.auth.api.identity.BeginSignInRequest;
import com.google.android.gms.auth.api.identity.SignInClient;
import com.google.android.gms.auth.api.identity.SignInCredential;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.Task;
import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.AuthCredential;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.GoogleAuthProvider;


public class MainActivity extends BridgeActivity {
  private static final int REQ_GOOGLE_SSO = 2;  // Can be any integer unique to the Activity.
  private final int REQUEST_LOCATION_PERMISSION = 1;
  private boolean showOneTapUI = true;
  private SignInClient oneTapClient;
  private BeginSignInRequest signInRequest;

  private FirebaseAuth mFirebaseAuth;
  private boolean isGPS = false;
  private GoogleSignInClient mSignInClient;
  @Override
  public void onCreate(Bundle savedInstanceState) {
    registerPlugin(AuthPlugin.class);
    registerPlugin(WhatsApp.class);
    registerPlugin(FileWriter.class);
    String serverClientId = getString(R.string.server_client_id);
    mFirebaseAuth = FirebaseAuth.getInstance();
    verifyStoragePermissions(this);
    GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
      .requestIdToken(serverClientId)
      .requestServerAuthCode(serverClientId)
      .requestEmail()
      .requestProfile()
      .build();
    mSignInClient = GoogleSignIn.getClient(this, gso);
    new GpsUtils(this).turnGPSOn(new GpsUtils.onGpsListener() {
      @Override
      public void gpsStatus(boolean isGPSEnable) {
        // turn on GPS
        isGPS = isGPSEnable;
      }
    });
    super.onCreate(savedInstanceState);
  }

  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    if (requestCode == REQ_GOOGLE_SSO) {
      Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(data);
      Toast.makeText(this,"Got content",Toast.LENGTH_LONG).show();
      try {
        GoogleSignInAccount account = task.getResult(ApiException.class);
        firebaseAuthWithGoogle(account);
        Toast.makeText(this,"Passed",Toast.LENGTH_LONG).show();
      } catch (ApiException e) {
        Log.w(TAG, "Google sign in failed", e);
        AuthPlugin.returnGoogleError(e);
        Toast.makeText(this,"Failed",Toast.LENGTH_LONG).show();
      }
    }
  }
  public void signInWithGoogle(){
    Intent signInIntent = mSignInClient.getSignInIntent();
    startActivityForResult(signInIntent,REQ_GOOGLE_SSO);
  }
  private void firebaseAuthWithGoogle(GoogleSignInAccount acct) {
    JSObject responseData = new JSObject();
    responseData.put("idToken",acct.getIdToken());
    responseData.put("accessToken",acct.getServerAuthCode());
    AuthPlugin.returnGoogleCredential(responseData);
  }

  public void openWhatsapp(String number){
    String url = "https://api.whatsapp.com/send?phone="+number;
    Intent i = new Intent(Intent.ACTION_VIEW);
    i.setData(Uri.parse(url));
    startActivity(i);
  }

}
