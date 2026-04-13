package com.lms.entity;

import lombok.Data;

@Data
public class FileMetadata {
	
	 private String fileName;
	    private String filePath;     // 🔥 REQUIRED
	    private String mimeType;
	    private long fileSizeKB;
	    private String createdISO;
	    private int pages;

}
