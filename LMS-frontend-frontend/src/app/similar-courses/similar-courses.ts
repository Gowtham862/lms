import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-similar-courses',
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './similar-courses.html',
  styleUrl: './similar-courses.css',
})
export class SimilarCourses {
showDatePicker = false;

currentDate = new Date();
currentMonth = this.currentDate.getMonth();
currentYear = this.currentDate.getFullYear();

months = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

dayNames = ["S", "M", "T", "W", "T", "F", "S"];

calendarDays: (number | null)[] = [];
selectedDate: number | null = null;

ngOnInit() {
  this.generateCalendar();
}

toggleDatePicker() {
  this.showDatePicker = !this.showDatePicker;
}

generateCalendar() {
  const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
  const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

  let daysArray: (number | null)[] = [];

  // empty slots as null
  for (let i = 0; i < firstDay; i++) daysArray.push(null);

  // actual days
  for (let d = 1; d <= daysInMonth; d++) daysArray.push(d);

  this.calendarDays = daysArray;
}

prevMonth() {
  if (this.currentMonth === 0) {
    this.currentMonth = 11;
    this.currentYear--;
  } else {
    this.currentMonth--;
  }
  this.generateCalendar();
}

nextMonth() {
  if (this.currentMonth === 11) {
    this.currentMonth = 0;
    this.currentYear++;
  } else {
    this.currentMonth++;
  }
  this.generateCalendar();
}

selectDate(day: number | null) {
  if (day === null) return;
  this.selectedDate = day;
  this.showDatePicker = false;
}



   course = {
    
    breadcrumb: ["Home", "Learning Programs", "CAPM® – Arabic Course"],

    title: "CAPM® – Arabic Course",

    subtitle:
      "The CAPM®- Arabic Course certification, accredited by PMI, is a foundational project management course ideal for beginners. It covers core project management concepts, tools, and best practices to enhance your career.",

    rating: 4.6,
    totalRatings: 651651,
    hours: 22,
    lectures: 155,
    level: "All levels",

    instructor: {
      name: "Ronal Richards",
      image: "assets1/arab-women1.jpg"
    },

    languages: ["English", "Spanish", "Italian", "German"],

    deliveryMethods: [
      { icon: "📘", title: "Self Study" },
      { icon: "💻", title: "Live Online" }
    ],

    availableDates: [
      { icon: "📅", title: "Select Date" }
    ],

    price: {
      current: 49.5,
      old: 99.5,
      discount: "50% Off"
    },

    courseImage: "assets1/course.jpg",

    shareIcons: [
      "assets1/fb.png",
      "assets1/git.png",
      "assets1/google.png",
      "assets1/x.jpg",
    ]
    
  };

  activeTab = "description";

  tabs = [
    { key: "description", label: "Description" },
    { key: "syllabus", label: "Syllabus" },
    { key: "exam", label: "Exam Details" },
    { key: "faq", label: "FAQ’s" }
  ];

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  // ===== DESCRIPTION DATA =====
  courseDescription = 
    "This interactive e-learning course will introduce you to User Experience (UX) design, the art of creating products and services that are intuitive, enjoyable, and user-friendly. Gain a solid foundation in UX principles and learn to apply them in real-world scenarios through engaging modules and interactive exercises. " ;

  instructor = {
    name: "Ronald Richards",
    role: "UI/UX Designer",
    reviews: "40,445",
    students: "500",
    courses: "15",
    image: "assets1/arab-women1.jpg",
    bio:"With over a decade of industry experience, Ronald brings a wealth of practical knowledge to the classroom. He has played a pivotal role in designing user-centric interfaces for renowned tech companies, ensuring seamless and engaging user experiences"
  };

  // ===== SYLLABUS DATA =====
  syllabus = [
    {
      title: "Overview & Key Features of COBIT 5",
      lessons: 5,
      time: "1 hour",
      open: true,
      points: [
        "Meeting Stakeholder Needs",
        "Covering the Enterprise End to End",
        "Applying a Single Integrated Framework",
        "Enabling a Holistic Approach"
      ]
    },
    {
      title: "COBIT5 Principles",
      lessons: 5,
      time: "1 hour",
      open: false,
      points: ["Meeting Stakeholder Needs",
        "Covering the Enterprise End to End",
        "Applying a Single Integrated Framework",
        "Enabling a Holistic Approach"]
    },
    {
      title: "COBIT5 Principles",
      lessons: 5,
      time: "1 hour",
      open: false,
      points: ["Meeting Stakeholder Needs",
        "Covering the Enterprise End to End",
        "Applying a Single Integrated Framework",
        "Enabling a Holistic Approach"]
    },
    {
      title: "COBIT5 Principles",
      lessons: 5,
      time: "1 hour",
      open: false,
      points: ["Meeting Stakeholder Needs",
        "Covering the Enterprise End to End",
        "Applying a Single Integrated Framework",
        "Enabling a Holistic Approach"]
    },
    {
      title: "COBIT 5 Enablers",
      lessons: 5,
      time: "1 hour",
      open: false,
      points: ["Meeting Stakeholder Needs",
        "Covering the Enterprise End to End",
        "Applying a Single Integrated Framework",
        "Enabling a Holistic Approach"]
    }
  ];

  // ===== EXAM DETAILS =====
  examDetails = {
    prerequisite:
      "There are no mandatory prerequisites; however, work experience in governance, risk, or IT services is recommended.",
    format: [
      "Multiple Choice Examination Questions",
      "50 questions",
      "25 marks required to pass (50%)",
      "40 minutes duration",
      "Closed book"
    ],
    study: [
      "Exam Simulators: 3 Sets",
      "Total Questions: 150 (50 per set)",
      "Time Allowed: 40 minutes",
      "Exam simulation: 50 questions"
    ]
  };

  toggleSyllabus(item: any) {
  item.open = !item.open;
}


  // ===== FAQ DATA =====
  faq = [
  {
    question: "What to expect from this COBIT®5 Foundation Course?",
    description: "Obtaining the Foundation qualification will show that you have sufficient knowledge...",
    answer: [
      "<b>Maintain high-quality information to support business decisions.</b>",
      "<b>Achieve strategic goals and realize business benefits …</b>",
      "<b>Achieve operational excellence …</b>",
    ]
  },
  {
    question: "Who Needs to get the COBIT®5 Foundation Certification?",
    description: "COBIT 5 is aimed at organizations of all sizes…",
    answer: [
      "<b>IT Managers</b>",
      "<b>IT Quality Professionals</b>",
      "<b>IT Auditors</b>",
    ]
  }
];

}
