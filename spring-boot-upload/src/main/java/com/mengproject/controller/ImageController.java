package com.mengproject.controller;

import org.springframework.boot.system.ApplicationHome;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import com.aliyun.oss.common.utils.HttpUtil;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;

@RestController
@RequestMapping
@CrossOrigin
public class ImageController {
    /**
     * @return
     * @throws IOException
     */
    @GetMapping(value = "/image", produces = MediaType.IMAGE_JPEG_VALUE)
    public ResponseEntity<byte[]> getImg() throws IOException {
        ApplicationHome applicationHome = new ApplicationHome(this.getClass());
        String pre = applicationHome.getDir().getParentFile().getParentFile().getAbsolutePath();
        String filePath = pre + "/src/main/resources/static/images/test1.jpeg";
        File file = new File(filePath);
        if (!file.exists()) {
            throw new FileNotFoundException("Image not found");
        }
        byte[] imageBytes = Files.readAllBytes(file.toPath());
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_JPEG);
        headers.setContentLength(imageBytes.length);
        return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
    }
}

