import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { liveclass } from '../core/services/liveclass/liveclass';
import { CourseService } from '../course-management/course-service';
import { AuthService } from '../core/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Header } from '../header/header';
import { TrainerService } from '../trainer-management/trainer-service';
import { environment } from '../../environments/environment';

export interface course {
  // id:number
  coursename: string;
  coursedesc: string;
  rating: string;
  totalratings: string;

  hours: string;

  lectures: string;

  levels: string;

  recommendedCourseIds?: string[];

  price?: number;

  discount?: number;

  metadata?: Metadata[];
  breadcrumb?: string[];
}

export interface batches {
  batchid: string;

  batchno: string;

  startdate: string;
}

interface Metadata {
  fileName: string;

  mimeType: string;

  width: number;

  height: number;

  fileSizeKB: number;
}

@Component({
  selector: 'app-course-page',

  imports: [CommonModule, FormsModule, RouterLink, Header],

  templateUrl: './course-page.html',

  styleUrl: './course-page.scss',
})
export class CoursePage implements OnInit {
  getBreadcrumbLink(crumb: string): string {
    switch (crumb) {
      case 'Home':
        return '/landing-page';

      case 'Learning Programs':
        return '/landing-page';

      default:
        return '/course';
    }
  }

  syllabus: any[] = [];

  batches: batches[] = [];

  selectedBatch: batches | null = null;

  showBatchPopup = false;

  toggleBatchPopup() {
    this.showBatchPopup = !this.showBatchPopup;
  }

  selectBatch(batch: batches) {
    this.selectedBatch = batch;

    console.log('Selected batch:', batch);

    this.showBatchPopup = false;
  }

  enroll() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/payment']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  goToPayment() {
    if (!this.selectedBatch) {
      alert('Batch not Selected');

      return;
    }

    console.log('Navigating with:', {
      courseId: this.courseId,

      batchId: this.selectedBatch.batchid,
    });

    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/payment', this.courseId, this.selectedBatch.batchid]);
    } else {
      this.router.navigate(['/login']);
    }
  }

  // course api

  courseId!: string;

  trainers: any[] = [];

  courses: any;

  loading = true;

  constructor(
    private courseService: CourseService,

    private route: ActivatedRoute,

    private allcourse: liveclass,

    private authService: AuthService,

    private API: HttpClient,

    private router: Router,

    private trainerService: TrainerService,
  ) {}

  getUserRole(): string {
    return this.authService.getrole() || 'USER';
  }

  getUserEmail(): string {
    return localStorage.getItem('useremail') || '';
  }

  recommendedCourses: any[] = [];

  loadingRecommended = true;

  ngOnInit() {
    this.loadCourses();

    this.route.paramMap.subscribe((params) => {
      this.courseId = params.get('id')!;
      console.log('Course ID:', this.courseId);
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

      this.getCourseDetails();

      this.loadRecommendedCourses();

      this.loadTrainers();

      // Batches

      if (this.courseId) {
        this.allcourse.findBatchbyCourseid(this.courseId).subscribe({
          next: (res: any) => {
            this.batches = res.data.filter((batch: any) => batch.status === 'InActive');
          },

          error: (err) => console.error(err),
        });
      }
    });
  }

  getCourseDetails() {
    this.courseService
      .getCourseById(this.courseId)

      .subscribe({
        next: (res: any) => {
          const data = Array.isArray(res.data) ? res.data[0] : res.data || res;

          this.course = data;

          const oldPrice = Number(data.price) || 0;

          const discountAmount = Number(data.discount) || 0;

          const currentPrice = Math.max(oldPrice - discountAmount, 0);

          this.coursed.price = {
            current: currentPrice,

            old: oldPrice,

            discount: discountAmount ? '₹' + discountAmount + ' OFF' : '',
          };

          console.log(' Final Price ', this.coursed.price);

          if (data.modules && Array.isArray(data.modules)) {
            this.syllabus = data.modules.map((m: any) => ({
              title: m.moduleName,

              lessons: Number(m.totalsession),

              time: m.sessionDuration || '—',

              open: false,

              points:
                m.sessions?.map(
                  (s: any) => `Session ${s.sessionNo} (${s.starttime} - ${s.endtime})`,
                ) || [],
            }));
          }
        },

        error: (err) => {
          console.error('Course Details Error:', err);
        },
      });
  }

  loadCourses() {
    this.courseService.GetAllCourses().subscribe({
      next: (res: any) => {
        const list = res.data || res;

        this.courses = list.map((c: any) => {
          const oldPrice = c.price;

          const discount = c.discount || 0;

          const discountAmount = (oldPrice * discount) / 100;

          const currentPrice = oldPrice - discountAmount;

          return {
            ...c,

            price: {
              current: currentPrice,

              old: oldPrice,

              discount: discount + '% OFF',
            },
          };
        });

        console.log('Mapped Courses:', this.courses);
      },
    });
  }

  loadTrainers() {
    if (!this.courseId) {
      console.error('CourseId missing');
      return;
    }
    console.log('CourseId for trainer:', this.courseId);
    this.allcourse.getTrainersByCourseId(this.courseId).subscribe({
      next: (res: any) => {
        console.log(' Batch Response →', res);
        const trainerId = res?.primarytrainerid || res?.trainerid || res?.primaryTrainerId;

        if (!trainerId) {
          console.warn(' No trainer id found in batch response');

          return;
        }
        console.log(' TrainerId Found:', trainerId);
        this.trainerService
          .getTrainerById(trainerId)

          .subscribe({
            next: (trainerRes: any) => {
              console.log('Resolved Trainer Object →', trainerRes);
              const t = trainerRes?.data ?? trainerRes;
              this.trainers = [
                {
                  id: t?.trainerid,

                  name: t?.trainername,

                  yearofexperience: t?.yearofexperience,

                  abouttrainer: t?.abouttrainer,

                  qualification: t?.qualification,

                  email: t?.personalemailid,

                  image: t?.metadata?.length
                    ? environment.imagebaseurl + t.metadata[0]?.fileName
                    : 'assets1/arab-women1.jpg',
                },
              ];

              console.log('Final Trainers Array →', this.trainers);
            },
          });
      },
    });
  }

  getRecommendedImage(course: any): string {
    if (course?.metadata?.length) {
      const imageMeta = course.metadata.find(
        (m: any) => m.mimeType && m.mimeType.startsWith('image'),
      );

      if (imageMeta?.fileName) {
        return environment.imagebaseurl + imageMeta.fileName;
      }
    }

    return 'assets/course.jpg';
  }

  getCourseImage(): string {
    if (this.course?.metadata?.length) {
      const imageMeta = this.course.metadata.find(
        (m: any) => m.mimeType && m.mimeType.startsWith('image'),
      );

      if (imageMeta?.fileName) {
        return environment.imagebaseurl + imageMeta.fileName;
      }
    }

    return 'assets1/course.jpg';
  }

  loadRecommendedCourses() {
    console.log('Starting API call for recommended courses with ID:', this.courseId);

    if (!this.courseId) {
      console.warn('Invalid CourseId →', this.courseId);

      return;
    }

    this.allcourse
      .getRecommendedCourses(this.courseId)

      .subscribe({
        next: (res: any) => {
          console.log('API called successfully!');

          console.log('Raw response:', res);

          if (res && (res.data || res.length || Object.keys(res).length)) {
            this.recommendedCourses = res.data || res;

            console.log('Mapped recommendedCourses:', this.recommendedCourses);
          } else {
            console.warn('No data returned from API!');
          }

          this.loadingRecommended = false;
        },

        error: (err: any) => {
          console.error(' API call failed:', err);

          this.loadingRecommended = false;
        },
      });
  }

  openCourse(course: any) {
    this.router.navigate(['/course', course.courseid]);
  }
  coursed = {
    deliveryMethods: [{ icon: '💻', title: 'Live Online' }],
    availableBatches: [{ icon: '📅', title: 'Select Batch' }],
    price: {
      current: 49.5,

      old: 99.5,

      discount: '50% Off',
    },

    courseImage: 'assets1/course.jpg',

    shareIcons: ['assets1/fb.png', 'assets1/git.png', 'assets1/google.png', 'assets1/x.jpg'],
  };

  //  course = {

  //     coursename:'',

  //     coursedesc:'',

  //     modules: [] as any[],

  //     rating:'',

  //     totalratings:'',

  //     hours:'',

  //     lectures:'',

  //     levels:'',

  //     breadcrumb: ["Home", "Learning Programs", "CAPM® – Arabic Course"],

  //   // instructor: {

  //   //   name: "Ronal Richards",

  //   //   image: "assets1/arab-women1.jpg"

  //   // },

  //   // languages: ["English", "Spanish", "Italian", "German"],

  // };

  course: course = {
    coursename: '',

    coursedesc: '',

    // modules: [] as any[],

    rating: '',

    totalratings: '',

    hours: '',

    lectures: '',

    levels: '',

    metadata: [],

    breadcrumb: ['Home', 'Learning Programs', 'CAPM® – Arabic Course'],
  };

  activeTab = 'description';

  tabs = [
    { key: 'description', label: 'Description' },

    { key: 'syllabus', label: 'Syllabus' },

    // { key: "exam", label: "Exam Details" },

    // { key: "faq", label: "FAQ’s" }
  ];

  setActiveTab(tab: string) {
    this.activeTab = tab;

    if (tab === 'description' && this.trainers.length === 0) {
      console.log('Loading trainers because Description tab clicked');

      this.loadTrainers();
    }
  }

  // ===== DESCRIPTION DATA =====

  // courseDescription =

  //   "This interactive e-learning course will introduce you to User Experience (UX) design, the art of creating products and services that are intuitive, enjoyable, and user-friendly. Gain a solid foundation in UX principles and learn to apply them in real-world scenarios through engaging modules and interactive exercises. " ;

  instructor = {
    name: 'Ronald Richards',

    role: 'UI/UX Designer',

    reviews: '40,445',

    students: '500',

    courses: '15',

    image: 'assets1/arab-women1.jpg',

    bio: 'With over a decade of industry experience, Ronald brings a wealth of practical knowledge to the classroom. He has played a pivotal role in designing user-centric interfaces for renowned tech companies, ensuring seamless and engaging user experiences',
  };

  // ===== SYLLABUS DATA =====

  // ===== EXAM DETAILS =====

  examDetails = {
    prerequisite:
      'There are no mandatory prerequisites; however, work experience in governance, risk, or IT services is recommended.',

    format: [
      'Multiple Choice Examination Questions',

      '50 questions',

      '25 marks required to pass (50%)',

      '40 minutes duration',

      'Closed book',
    ],

    study: [
      'Exam Simulators: 3 Sets',

      'Total Questions: 150 (50 per set)',

      'Time Allowed: 40 minutes',

      'Exam simulation: 50 questions',
    ],
  };

  toggleSyllabus(item: any) {
    item.open = !item.open;
  }

  // ===== FAQ DATA =====

  faq = [
    {
      question: 'What to expect from this COBIT®5 Foundation Course?',

      description:
        'Obtaining the Foundation qualification will show that you have sufficient knowledge...',

      answer: [
        '<b>Maintain high-quality information to support business decisions.</b>',

        '<b>Achieve strategic goals and realize business benefits …</b>',

        '<b>Achieve operational excellence …</b>',
      ],
    },

    {
      question: 'Who Needs to get the COBIT®5 Foundation Certification?',

      description: 'COBIT 5 is aimed at organizations of all sizes…',

      answer: ['<b>IT Managers</b>', '<b>IT Quality Professionals</b>', '<b>IT Auditors</b>'],
    },
  ];

  allcourses = [
    {
      image: 'assets1/courses1.png',

      title: 'CAPM® Certification Training',

      author: 'Ronald Richards',

      rating: 5,

      ratingText: '(1200 Ratings)',

      description:
        'The CAPM® certification, accredited by PMI, is a foundational project management course ideal for beginners. It covers core project management concepts, tools, and best practices to enhance your learning.',

      footer: '22 Total Hours. 155 Lectures. Beginner',
    },

    {
      image: 'assets1/courses1.png',

      title: 'CAPM® Certification Training',

      author: 'Ronald Richards',

      rating: 5,

      ratingText: '(1200 Ratings)',

      description:
        'The CAPM® certification, accredited by PMI, is a foundational project management course ideal for beginners. It covers core project management concepts, tools, and best practices to enhance your learning.',

      footer: '22 Total Hours. 155 Lectures. Beginner',
    },

    {
      image: 'assets1/courses1.png',

      title: 'CAPM® Certification Training',

      author: 'Ronald Richards',

      rating: 5,

      ratingText: '(1200 Ratings)',

      description:
        'The CAPM® certification, accredited by PMI, is a foundational project management course ideal for beginners. It covers core project management concepts, tools, and best practices to enhance your learning.',

      footer: '22 Total Hours. 155 Lectures. Beginner',
    },

    {
      image: 'assets1/courses1.png',

      title: 'CAPM® Certification Training',

      author: 'Ronald Richards',

      rating: 5,

      ratingText: '(1200 Ratings)',

      description:
        'The CAPM® certification, accredited by PMI, is a foundational project management course ideal for beginners. It covers core project management concepts, tools, and best practices to enhance your learning.',

      footer: '22 Total Hours. 155 Lectures. Beginner',
    },
  ];

  activeIndex: number | null = null;

  faqs = [
    {
      question: 'Can I register for the exam directly through Al Bayan?',

      answer: 'Yes, you can purchase the exam voucher, but registration is handled...',
    },

    {
      question: 'Are there any prerequisites to apply for this course?',

      answer: 'There are no mandatory prerequisites...',
    },

    {
      question: 'Is this course endorsed by an accreditation body?',

      answer: 'Yes, this course is accredited by...',
    },

    {
      question: 'Can I register for the exam directly through Al Bayan?',

      answer: 'Yes, you can purchase the exam voucher, but registration is handled...',
    },

    {
      question: 'Can I register for the exam directly through Al Bayan?',

      answer: 'Yes, you can purchase the exam voucher, but registration is handled...',
    },

    {
      question: 'Can I register for the exam directly through Al Bayan?',

      answer: 'Yes, you can purchase the exam voucher, but registration is handled...',
    },
  ];

  toggle(i: number) {
    this.activeIndex = this.activeIndex === i ? null : i;
  }

  // Footer

  contact = {
    email: 'contactus@bakkah.com',

    phone: '+966 (599035013)',

    address: ['2527 Al Thumamah Road – Al Munsiyah Dist. Riyadh, Saudi Arabia'],
  };

  socials = [
    { icon: 'assets/Youtube.png', link: '#' },

    { icon: 'assets/LinkedIn.png', link: '#' },

    { icon: 'assets1/git.png', link: '#' },

    { icon: 'assets1/fb.png', link: '#' },
  ];

  quickLinks = ['Home', 'About Us'];

  programs = [
    'Professional Path',

    'Project Management',

    'Quality Management',

    'IT Governance & Service Management',

    'Business Analyst',

    'Business Transformation',
  ];

  articles = [
    { title: 'متطلبات وشهادة CAPM وكيفية الاستعداد للاختبار', date: '27 Nov 2025' },

    {
      title: 'PMP Course In Newcastle - Certification, Exam, Cost, And Salary',
      date: '27 Nov 2025',
    },

    {
      title: 'PMP Course In Essex (County) - Certification, Exam, Cost, And Salary',
      date: '27 Nov 2025',
    },

    { title: 'PMP Course In Glasgow - Certification, Exam, Cost, And Salary', date: '27 Nov 2025' },

    { title: 'PMP Course In Glasgow - Certification, Exam, Cost, And Salary', date: '27 Nov 2025' },
  ];

  getuserphone(): string {
    return localStorage.getItem('phonekey') || '';
  }

  alreadyInterested = false;

  interestSubmitted = false;

  interestError = '';

  // changed part

  // interested() {

  //   if (!this.selectedBatch) {

  //     alert("Please select a batch");

  //     return;

  //   }

  //   if (!this.authService.isAuthenticated()) {

  //     this.router.navigate(['/login']);

  //     return;

  //   }

  // const payload = {

  //   courseid: Number(this.courseId),

  //   userid: Number(this.authService.getUserId()),

  //   batchid: Number(this.selectedBatch.batchid),

  //   username: (localStorage.getItem('useremail') || '').split('@')[0],

  //   useremail: localStorage.getItem('useremail'),

  //   coursename: this.course.coursename || "Unknown Course",

  //   batchstartdate: this.selectedBatch.startdate || "",

  //   batchno: Number(this.selectedBatch.batchno) || 0,

  //   usercontact: this.getuserphone(),

  //   currentstatus: "deed",

  //   nextstatus: ""

  // };

  //  console.log("Interested Payload:", JSON.stringify(payload, null, 2));

  //   this.allcourse.saveInterestedStudent(payload).subscribe({

  //     next: (res:any) => {

  //       alert("Interest submitted successfully");

  //     },

  //     error: (err:any) => {

  //       console.error("Error saving interest:", err);

  //       alert("Failed to submit interest");

  //     }

  //   });

  // }

  interested() {
    if (!this.selectedBatch) {
      this.interestError = 'Please select a batch';

      return;
    }

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);

      return;
    }

    const payload = {
      courseid: Number(this.courseId),

      userid: Number(this.authService.getUserId()),

      batchid: Number(this.selectedBatch.batchid),

      username: (localStorage.getItem('useremail') || '').split('@')[0],

      useremail: localStorage.getItem('useremail'),

      coursename: this.course.coursename || 'Unknown Course',

      batchstartdate: this.selectedBatch.startdate || '',

      batchno: Number(this.selectedBatch.batchno) || 0,

      usercontact: this.getuserphone(),

      currentstatus: 'deed',

      nextstatus: '',
    };

    console.log('Interested Payload:', JSON.stringify(payload, null, 2));

    this.allcourse.saveInterestedStudent(payload).subscribe({
      next: (res: any) => {
        // Instead of alert, set a flag to show UI

        this.interestSubmitted = true;

        this.alreadyInterested = true;

        this.interestError = '';
      },

      error: (err: any) => {
        console.error('Error saving interest:', err);

        if (err.status === 409) {
          this.alreadyInterested = true;

          this.interestSubmitted = false;

          this.interestError = 'You have already registered for this batch.';
        } else {
          this.interestError = 'Failed to submit interest. Please try again.';
        }
      },
    });
  }
}
