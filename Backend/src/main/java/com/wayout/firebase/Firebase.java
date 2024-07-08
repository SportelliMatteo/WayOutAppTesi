package com.wayout.firebase;

import com.google.auth.oauth2.GoogleCredentials;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Bucket;
import com.google.cloud.storage.Storage;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.cloud.StorageClient;
import io.github.cdimascio.dotenv.Dotenv;


import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class Firebase {
    private static Firebase instance;
    private FirebaseApp defaultApp;
    private Bucket bucket;
    private String bucketName;
    private StorageClient storageClient;
    private static String baseurlfirebase;


    private Firebase() {
        Dotenv dotenv =  Dotenv.load();
        bucketName = dotenv.get("BUCKETNAME");
        baseurlfirebase = dotenv.get("BASEURLFIREBASE");
    }

    public static synchronized Firebase getInstance() {
        if (instance == null) {
            instance = new Firebase();
            try {
                instance.init();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return instance;
    }

    private void init() throws IOException {
        FileInputStream serviceAccount = new FileInputStream("./ServiceAccountKey.json");

        FirebaseOptions options = new FirebaseOptions.Builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .setStorageBucket(bucketName)
                .build();

        defaultApp = FirebaseApp.initializeApp(options);

        storageClient = StorageClient.getInstance(defaultApp);

        bucket = storageClient.bucket();
    }

    public FirebaseAuth getAuth() {
        return FirebaseAuth.getInstance(defaultApp);
    }

    public Bucket getBucket() {
        return bucket;
    }

    public String getBucketName() {
        return bucketName;
    }

    public StorageClient getStorageClient() {
        return storageClient;
    }

    // Metodo per ottenere il link diretto all'immagine nel formato desiderato
    private static String getDirectImageUrl(String blobName) {
        // Costruisci il link diretto all'immagine nel formato desiderato
        String baseUrl = baseurlfirebase;
        String encodedBlobName = java.net.URLEncoder.encode(blobName, java.nio.charset.StandardCharsets.UTF_8);
        String imageUrl = baseUrl + encodedBlobName + "?alt=media";
        return imageUrl;
    }

    public List<String> getProfileImagesFromFirebase(String uid) throws IOException {
        List<String> imageLinks = new ArrayList<>();

        // Ottieni l'istanza di Bucket dalla classe Firebase
        Bucket bucket = Firebase.getInstance().getStorageClient().bucket();

        // Costruisci il percorso alla cartella "profilo" per l'utente specificato
        String folderPath = uid + "/profilo/";

        // Ottieni tutti i blob nella cartella specificata
        Iterable<Blob> blobs = bucket.list(Storage.BlobListOption.prefix(folderPath)).iterateAll();

        // Scansiona tutti i blob e ottieni i link diretti alle immagini
        for (Blob blob : blobs) {
            String imageUrl = getDirectImageUrl(blob.getName());
            imageLinks.add(imageUrl);
        }
        return imageLinks;
    }

    public List<String> getEventsImagesFromFirebase(String idString) throws IOException {
        List<String> imageLinks = new ArrayList<>();

        // Ottieni l'istanza di Bucket dalla classe Firebase
        Bucket bucket = Firebase.getInstance().getStorageClient().bucket();

        // Costruisci il percorso alla cartella "profilo" per l'utente specificato
        String folderPath = "eventi/" + idString + "/";

        // Ottieni tutti i blob nella cartella specificata
        Iterable<Blob> blobs = bucket.list(Storage.BlobListOption.prefix(folderPath)).iterateAll();

        // Scansiona tutti i blob e ottieni i link diretti alle immagini
        for (Blob blob : blobs) {
            String imageUrl = getDirectImageUrl(blob.getName());
            imageLinks.add(imageUrl);
        }
        return imageLinks;
    }


}
