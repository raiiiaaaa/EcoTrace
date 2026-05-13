package com.ecotrace.ray;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import androidx.activity.result.ActivityResult;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.OutputStream;

@CapacitorPlugin(name = "FileSaver")
public class FileSaverPlugin extends Plugin {

    @PluginMethod
    public void saveFile(PluginCall call) {
        String data = call.getString("data", "");
        String filename = call.getString("filename", "backup.json");

        Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("application/json");
        intent.putExtra(Intent.EXTRA_TITLE, filename);

        startActivityForResult(call, intent, "saveResult");
    }

    @ActivityCallback
    private void saveResult(PluginCall call, ActivityResult result) {
        if (result.getResultCode() == Activity.RESULT_OK) {
            Intent dataIntent = result.getData();
            if (dataIntent != null) {
                Uri uri = dataIntent.getData();
                if (uri != null) {
                    String data = call.getString("data", "");
                    try {
                        OutputStream outputStream = getContext().getContentResolver().openOutputStream(uri);
                        if (outputStream != null) {
                            outputStream.write(data.getBytes());
                            outputStream.close();
                            call.resolve();
                            return;
                        }
                    } catch (Exception e) {
                        call.reject("Gagal menyimpan file: " + e.getMessage());
                        return;
                    }
                }
            }
        }
        call.reject("Dibatalkan");
    }
}
