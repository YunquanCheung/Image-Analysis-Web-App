package com.mengproject.controller;

import org.springframework.boot.system.ApplicationHome;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.ArrayList;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@RestController
@CrossOrigin
public class UploadController {
    @PostMapping(value = "/upload", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResponseEntity<byte[]> upload_s(@RequestParam("image") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }

        String pre = getApplicationPath();
        String path = pre + "/src/main/resources/static/images/test1.jpeg";
        file.transferTo(new File(path));

        ArrayList<String> arrayString = executePythonScript(pre);

        writeClassificationResult(arrayString, pre);
        initializeChatFile(pre);

        ArrayList<File> filesList = prepareImageFiles(pre);
        byte[] zipBytes = createZipFile(filesList);

        HttpHeaders headers = prepareHeaders(zipBytes);
        return new ResponseEntity<>(zipBytes, headers, HttpStatus.OK);
    }

    private String getApplicationPath() {
        ApplicationHome applicationHome = new ApplicationHome(this.getClass());
        return applicationHome.getDir().getParentFile().getParentFile().getAbsolutePath();
    }

    private ArrayList<String> executePythonScript(String pre) throws IOException {
        String command = "/opt/anaconda3/bin/python " + pre
                + "/src/main/java/com/mengproject/controller/pythonFile/GradCAM.py";

        Process process = Runtime.getRuntime().exec(command);
        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
        String line;
        ArrayList<String> arrayString = new ArrayList<>();
        while ((line = reader.readLine()) != null) {
            arrayString.add(line);
        }

        return arrayString;
    }

    private void writeClassificationResult(ArrayList<String> arrayString, String pre) throws IOException {
        String classification = arrayString.get(3);
        String txtPath = pre + "/src/main/resources/";
        FileWriter classificationWriter = new FileWriter(txtPath + "clfResult.txt");
        classificationWriter.write(classification);
        classificationWriter.close();
    }

    private void initializeChatFile(String pre) throws IOException {
        String txtPath = pre + "/src/main/resources/";
        FileWriter chatWriter = new FileWriter(txtPath + "chat.txt");
        chatWriter.write("You are an AI research assistant. You use a tone that is technical and scientific.\n");
        chatWriter.close();
    }

    private ArrayList<File> prepareImageFiles(String pre) throws FileNotFoundException {
        ArrayList<File> filesList = new ArrayList<>();
        String filePath1 = pre + "/src/main/resources/static/images/GCAM_imgwithheat.jpg";
        String filePath2 = pre + "/src/main/resources/static/images/GCAM++_imgwithheat.jpg";

        File newFile1 = new File(filePath1);
        File newFile2 = new File(filePath2);

        if (!newFile1.exists() || !newFile2.exists()) {
            throw new FileNotFoundException("Image not found");
        }

        filesList.add(newFile1);
        filesList.add(newFile2);

        return filesList;
    }

    private byte[] createZipFile(ArrayList<File> filesList) throws IOException {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ZipOutputStream zos = new ZipOutputStream(baos);

            for (File imageFile : filesList) {
                FileInputStream fileInputStream = new FileInputStream(imageFile);
                ZipEntry zipEntry = new ZipEntry(imageFile.getName());
                zos.putNextEntry(zipEntry);
                byte[] bytes = new byte[1024];
                int length;
                while ((length = fileInputStream.read(bytes)) >= 0) {
                    zos.write(bytes, 0, length);
                }
                fileInputStream.close();
                zos.closeEntry();
            }
            zos.close();
        return baos.toByteArray();
    }

    private HttpHeaders prepareHeaders(byte[] zipBytes) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentLength(zipBytes.length);
        headers.setContentDispositionFormData("attachment", "images.zip");

        return headers;
    }
}