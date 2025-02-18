package com.meshnetworks;

import android.content.Context;
import android.net.wifi.p2p.WifiP2pManager;
import android.net.wifi.p2p.WifiP2pManager.ConnectionInfoListener;
import android.net.wifi.p2p.WifiP2pInfo;
import android.util.Log;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import org.json.JSONArray;
import org.json.JSONObject;

public class WiFiDirectModule extends ReactContextBaseJavaModule {

    private static final String TAG = "WiFiDirectModule";
    private WifiP2pManager manager;
    private WifiP2pManager.Channel channel;
    private Context context;

    public WiFiDirectModule(ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
        manager = (WifiP2pManager) context.getSystemService(Context.WIFI_P2P_SERVICE);
        if (manager != null) {
            channel = manager.initialize(context, reactContext.getMainLooper(), null);
        }
    }

    @Override
    public String getName() {
        return "WiFiDirectModule";
    }

    @ReactMethod
    public void discoverPeers(Callback successCallback, Callback errorCallback) {
        if (manager != null) {
            manager.discoverPeers(channel, new WifiP2pManager.ActionListener() {
                @Override
                public void onSuccess() {
                    successCallback.invoke("Peer discovery started");
                }
                @Override
                public void onFailure(int reason) {
                    errorCallback.invoke("Failed to start discovery, reason: " + reason);
                }
            });
        } else {
            errorCallback.invoke("WiFiP2pManager not available");
        }
    }

    @ReactMethod
    public void getActiveConnections(Callback callback) {
        if (manager != null) {
            manager.requestConnectionInfo(channel, new ConnectionInfoListener() {
                @Override
                public void onConnectionInfoAvailable(WifiP2pInfo info) {
                    try {
                        JSONArray connections = new JSONArray();
                        if (info.groupFormed && info.isGroupOwner) {
                            JSONObject peer = new JSONObject();
                            peer.put("id", "peer1");
                            peer.put("name", "AndroidPeer1");
                            peer.put("signalStrength", "strong");
                            peer.put("priority", 3);
                            connections.put(peer);
                        }
                        callback.invoke(null, connections.toString());
                    } catch (Exception e) {
                        Log.e(TAG, "Error parsing connection info: " + e.getMessage());
                        callback.invoke(e.getMessage(), null);
                    }
                }
            });
        } else {
            callback.invoke("WiFiP2pManager not available", null);
        }
    }
}
