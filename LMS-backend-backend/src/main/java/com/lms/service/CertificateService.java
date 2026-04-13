package com.lms.service;

import java.awt.Font;
import java.io.File;
import java.io.FileOutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDDocumentInformation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.properties.TextAlignment;
import com.lms.config.ResponseStructure;
import com.lms.dao.CertificateDao;


import com.lms.dto.CertificateDto;
import com.lms.dto.CourseDto;

import com.lms.entity.Certificate;
import com.lms.exceptions.CourseIdnotFoundException;
import com.lms.exceptions.FieldcannotbeEmpty;
import com.lms.exceptions.UserAlreadyExistsException;
import com.lms.repository.CertificateRepository;
import com.lms.repository.PurchasedCourseRepository;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class CertificateService {
	
	
	@Value("${task.file.path:uploads/}")
	private String taskFilePath;
	@Autowired
	CertificateDao certificatedao;
	
	@Autowired
	CertificateRepository repo;
	
	@Autowired
	PurchasedCourseRepository purchaserepo;
	
	@Autowired
	CertificateRepository certirepo;
	
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

				 if (mime.equals("application/pdf")) {
					map.putAll(extractPdfMetadata(savedFile));
				} 
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
	
	public ResponseEntity<ResponseStructure<?>> savecourse(Certificate course, MultipartFile[] files) {

//        log.info("Entered savecourse()");
	File folder = new File("uploads");
	String[] fil = folder.list();

	if (files != null && files.length > 0) {
		log.info("Files present in uploads folder:");
		for (String f : fil) {
			System.out.println(f);
		}
	} else {
		log.info("No files found in uploads folder");
	}
	if (folder.exists() && folder.isDirectory()) {
		log.info("Folder exists");
	} else {
		log.info("Folder does NOT exist");
	}

	if (course == null) {
		throw new FieldcannotbeEmpty("Course field cannot be empty");
	}
	ResponseEntity<?> metaResponse = uploadAndGetMetadata(files);

	if (metaResponse.getStatusCode().is2xxSuccessful()) {
		List<Map<String, Object>> metadataList = (List<Map<String, Object>>) metaResponse.getBody();

		course.setMetadata(metadataList);
	}

	course = certificatedao.newcertificate(course);
	

	ResponseStructure<CourseDto> structure = new ResponseStructure<>();
	structure.setMessage("certificate  created successfully");
	structure.setStatus(HttpStatus.CREATED.value());
//	structure.setData(coursedto);

	return new ResponseEntity<>(structure, HttpStatus.CREATED);
}
	
	public ResponseEntity<ResponseStructure<List<Certificate>>> findallceriticate(long id) {
		List<Certificate> courses = (List<Certificate>) repo.findByCertificateId(id);
		List<CertificateDto> coursedto = new ArrayList<>();
		if (courses != null && !courses.isEmpty()) {
			for (Certificate c : courses) {
				
				CertificateDto coudto=new CertificateDto();
				 coudto.setMetadata(c.getMetadata());
//				 coudto.setUserid(c.getUserId());
				 
				  coursedto.add(coudto);
				
			}
			
			ResponseStructure<List<Certificate>> structure = new ResponseStructure<>();
			structure.setData(coursedto);
			structure.setMessage("certificate founded");
			structure.setStatus(HttpStatus.OK.value());
			return new ResponseEntity<ResponseStructure<List<Certificate>>>(structure, HttpStatus.OK);
		} else {
			throw new CourseIdnotFoundException("certificate not found");
		}

	}
	
	   
	
	
    public Certificate generateAndStoreCertificate(
    	String	username,String coursename,long userid ,long courseid) throws Exception {

        //  Generate unique certificateId
    	
    	Optional<Certificate> exists = certirepo.findByUseridAndCourseid(userid, courseid);
    	if(exists.isPresent())
    	{
    		throw new UserAlreadyExistsException("certificate already generated");
    	}
        long certificateId = System.currentTimeMillis();
         if(userid > 0 && courseid > 0)
         {
             purchaserepo.markCourseCompleted(userid, courseid);
         }

  
        String fileName = userid + "_" + certificateId + ".pdf";
        String filePath = UPLOAD_DIR + fileName;

        //  Generate PDF
        
        generateCertificatePdf(username, coursename, filePath, certificateId);

        //  Save metadata in DB
        Certificate cert = new Certificate();
        cert.setCertificateid(certificateId);
        cert.setFilepath(filePath);
        cert.setUserid(userid);
        cert.setCoursename(coursename);
        cert.setUsername(username);
        cert.setCourseid(courseid);
        cert.setCertificateStatus("issued");
        return repo.save(cert);
    }

    

	String UPLOAD_DIR = "uploads/";
    // ..................PDF GENERATOR...................................
    private void generateCertificatePdf(String username, String courseName,
                                        String filePath, long certificateId) throws Exception {

        File dir = new File(UPLOAD_DIR);
        if (!dir.exists()) dir.mkdirs();

        PdfWriter writer = new PdfWriter(filePath);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf, PageSize.A4);
        PdfFont titleFont = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
        PdfFont textFont  = PdfFontFactory.createFont(StandardFonts.HELVETICA);
        Paragraph title = new Paragraph("Certificate of Completion")
                .setFont(titleFont)
                .setFontSize(26)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(30);
        Paragraph body = new Paragraph()
                .add("This is to certify that\n\n")
                .add(username + "\n\n")
                .add("has successfully completed the course\n\n")
                .add(courseName + "\n\n")
                .add("Certificate ID: " + certificateId)
                .setFont(textFont)
                .setFontSize(14)
                .setTextAlignment(TextAlignment.CENTER);

        document.add(title);
        document.add(body);

        document.close();
    }


    public Certificate rejectCertificat(
    	    String username, String coursename, long userid, long courseid) throws Exception {
 
    	   
    	    Optional<Certificate> exists = certirepo.findByUseridAndCourseid(userid, courseid);
    	    if (exists.isPresent()) {
    	        throw new UserAlreadyExistsException("certificate already generated");
    	    }
 
    	    long certificateId = System.currentTimeMillis();
 
    	    if (userid > 0 && courseid > 0) {
    	        purchaserepo.markCourseCompleted(userid, courseid);
    	    }
 
    	    
    	    Certificate cert = new Certificate();
    	    cert.setCertificateid(certificateId);
    	    cert.setUserid(userid);
    	    cert.setCoursename(coursename);
    	    cert.setUsername(username);
    	    cert.setCourseid(courseid);
    	    cert.setStatus(true);
    	    cert.setCertificateStatus("rejected");
 
    	    return certirepo.save(cert);
    	}

    
 



}