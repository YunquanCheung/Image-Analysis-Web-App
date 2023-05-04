package com.mengproject.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.system.ApplicationHome;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.file.Files;

@RestController
@RequestMapping
@CrossOrigin
public class GPTController {

    // Endpoint to get text description
    @GetMapping(value = "/desc")
    public ResponseEntity<String> getText() throws IOException {
        ApplicationHome applicationHome = new ApplicationHome(this.getClass());
        String pre = applicationHome.getDir().getParentFile().getParentFile().getAbsolutePath();
        String filePath = pre + "/src/main/resources/clfResult.txt";

        List<String> clfResultFile = null;
        String clfResult = "";
        try {
            clfResultFile = Files.readAllLines(Paths.get(filePath));
            clfResult = clfResultFile.get(0);
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }

        if (clfResult.length() != 0) {
            if (clfResult.equals("PS")) {
                clfResult = "PS (polystyrene)";
            } else if (clfResult.equals("PE")) {
                clfResult = "PE (polyethylene)";
            }
        }

        String clfDescription = "The input image has been classified as " + clfResult + ".";
        clfDescription += " One key difference between GradCAM and GradCAM++ is that GradCAM++ is able to capture more details from the original image, making it better at analyzing image importance.";

        return new ResponseEntity<>(clfDescription, HttpStatus.OK);
    }

    // Endpoint to process chat input
    @PostMapping(value = "/chat")
    public ResponseEntity<String> chat(@RequestBody String inputQuestion) throws IOException {
        ApplicationHome applicationHome = new ApplicationHome(this.getClass());
        String pre = applicationHome.getDir().getParentFile().getParentFile().getAbsolutePath();

        // Save input question to txt file
        String txtPath = pre + "/src/main/resources/";
        try {
            FileWriter myWriter = new FileWriter(txtPath + "chat.txt", true);
            myWriter.write(inputQuestion + "\n");
            myWriter.close();
        } catch (IOException e) {
            System.out.println("An error occurred.");
            e.printStackTrace();
        }

        // Call Python script to use ChatGPT
        String command = "/opt/anaconda3/bin/python " + pre
                + "/src/main/java/com/mengproject/controller/pythonFile/chatGPT.py";
        Process process = Runtime.getRuntime().exec(command);
        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
        String line;
        ArrayList<String> arrayString = new ArrayList<>();
        while ((line = reader.readLine()) != null) {
            arrayString.add(line);
        }
        String outputAnswer = "";
        if (arrayString.size() != 0) {
            outputAnswer = arrayString.get(0);
        }

        // Save output answer to txt file
        try {
            FileWriter myWriter = new FileWriter(txtPath + "chat.txt", true);
            myWriter.write(outputAnswer + "\n");
            myWriter.close();
        } catch (IOException e) {
            System.out.println("An error occurred.");
            e.printStackTrace();
        }

        return new ResponseEntity<>(outputAnswer, HttpStatus.OK);
    }
}
