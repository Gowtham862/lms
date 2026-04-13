package com.lms.utils;

import java.awt.image.BufferedImage;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.imageio.ImageIO;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDDocumentInformation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.drew.imaging.ImageMetadataReader;
import com.drew.metadata.Directory;
import com.drew.metadata.Metadata;

@Component
public class MediaUtils {
	
	
	@Value("${task.file.path:uploads/}")
	private String taskFilePath;
	
	
	public ResponseEntity<?> uploadAndGetMetadata(MultipartFile[] files) {

	
		List<Map<String, Object>> metadataList = new ArrayList<>();

		try {
			for (MultipartFile file : files) {

				String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
				Path filePath = Paths.get(taskFilePath + fileName);

				Files.createDirectories(filePath.getParent());
				Files.write(filePath, file.getBytes());

				String mime = file.getContentType();
				Map<String, Object> map = new HashMap<>();

				map.put("fileName", fileName);
				map.put("fileSizeKB", file.getSize() / 1024);
				map.put("mimeType", mime);

				File savedFile = filePath.toFile();

				if (mime.startsWith("image")) {
					map.putAll(extractImageMetadata(savedFile));
				}

				metadataList.add(map);
			}

			return ResponseEntity.ok(metadataList);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(500).body("Error extracting metadata");
		}
	}

	// image metadata
	private Map<String, Object> extractImageMetadata(File file) throws Exception {

		Map<String, Object> map = new HashMap<>();

		Metadata metadata = ImageMetadataReader.readMetadata(file);

		for (Directory dir : metadata.getDirectories()) {
			for (com.drew.metadata.Tag tag : dir.getTags()) {
				map.put(tag.getTagName(), tag.getDescription());
			}
		}

		BufferedImage img = ImageIO.read(file);
		if (img != null) {
			map.put("width", img.getWidth());
			map.put("height", img.getHeight());
		}

		return map;
	}
	
	
	public ResponseEntity<?> uploadAndGetMetadataonlypdf(MultipartFile[] files) {

		
		List<Map<String, Object>> metadataList = new ArrayList<>();

		try {
			for (MultipartFile file : files) {

				String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
				Path filePath = Paths.get(taskFilePath + fileName);

				Files.createDirectories(filePath.getParent());
				Files.write(filePath, file.getBytes());

				String mime = file.getContentType();
				Map<String, Object> map = new HashMap<>();

				map.put("fileName", fileName);
				map.put("fileSizeKB", file.getSize() / 1024);
				map.put("mimeType", mime);

				File savedFile = filePath.toFile();

				if (mime.equals("application/pdf")) {
					map.putAll(extractPdfMetadata(savedFile));}

				metadataList.add(map);
			}

			return ResponseEntity.ok(metadataList);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(500).body("Error extracting metadata");
		}
	}

	private Map<String, Object> extractPdfMetadata(File file) throws Exception {

		Map<String, Object> map = new HashMap<>();

		PDDocument document = PDDocument.load(file);
		PDDocumentInformation info = document.getDocumentInformation();

		map.put("author", info.getAuthor());
		map.put("title", info.getTitle());
		map.put("pages", document.getNumberOfPages());

		if (info.getCreationDate() != null) {
			map.put("createdISO", info.getCreationDate().getTime().toInstant().toString());
		}

		document.close();
		return map;
	}
	
   
}
