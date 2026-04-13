package com.lms.dto;

import lombok.Data;

@Data
public class StudentAttendanceDT {
	 private Long studentId;
	    private int totalSessions;
	    private int attendedSessions;
	    private double overallAttendancePercentage;
		public StudentAttendanceDT(Long studentId, int totalSessions, int attendedSessions,
				double overallAttendancePercentage) {
			super();
			this.studentId = studentId;
			this.totalSessions = totalSessions;
			this.attendedSessions = attendedSessions;
			this.overallAttendancePercentage = overallAttendancePercentage;
		}
		public StudentAttendanceDT() {
			super();
		}

}
