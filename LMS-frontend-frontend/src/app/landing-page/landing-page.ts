import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { liveclass } from '../core/services/liveclass/liveclass';
import { AuthService } from '../core/services/auth.service';
import { Header } from "../header/header";
import { environment } from '../../environments/environment';
interface Metadata {
  fileName: string;
  mimeType: string;
  width: number;
  height: number;
  fileSizeKB: number;
}


export interface Course {
  courseid: string;
  trainerId: string;
  adminname:string;
  coursedesc:string;
  courseduration:string;
  coursename: string; 
  coursecategory: string;
  courselevel: string;
  certificateavalibility: string;
  noofmodule: string;
  rating: string;
  metadata: Metadata[];
}
@Component({
  selector: 'app-landing-page',
  imports: [CommonModule, RouterLink,Header],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss',
})
export class LandingPage implements AfterViewInit ,OnInit {

  // for adding arab content
  currentLang: 'en' | 'ar' = 'en';

heroContent = {
  en: {
    tag: 'Your Smart Path to Better Learning',
    title1: 'Where Excellent Begins And',
    highlight: 'Opportunities',
    highlight1: 'Are Created.',
    description: `At AlBayan Learning, We deliver learning experiences that reshape thinking, build skills, and 
    give you the confidence to move forward.`,
    button: 'See How We Work →'
  },
  ar: {
    tag: 'طريقك الذكي نحو تعلّم أفضل',
    title1: 'حيث يبدأ التميّز وتُصنع',
    highlight: 'الفرص',
    highlight1: 'للمستقبل.',
    description: `في البيان للتعلّم، نقدم تجارب تعليمية تعيد تشكيل طريقة التفكير،
    وتطوّر المهارات، وتمنحك الثقة للتقدم بثبات نحو الأمام.`,
    button: 'اكتشف كيف نعمل →'
  }
};

switchLanguage(lang: 'en' | 'ar') {
  this.currentLang = lang;
}

whySectionContent = {
en: {
  subtitle: 'Every program is carefully designed to provide practical, in-demand skills with results you can apply immediately in your studies or career.'
},
ar: {
  subtitle: 'تم تصميم كل برنامج بعناية لتزويدك بمهارات عملية ومطلوبة في سوق العمل، مع نتائج يمكنك تطبيقها فورًا في دراستك أو مسيرتك المهنية.'
}
};

whyCardsContent = {
  en: [
    {
      icon: 'assets/experience.png',
      title: 'Personalized Experience',
      desc: 'We tailor every learning journey to the individual.'
    },
    {
      icon: 'assets/instructor.png',
      title: 'Expert Instructors',
      desc: 'Highly qualified professionals who deliver practical experience with clarity and impact.'
    },
    {
      icon: 'assets/flexible.png',
      title: 'Flexible Learning',
      desc: 'Learn on your schedule, anytime, anywhere.'
    },
    {
      icon: 'assets/results.png',
      title: 'Real Results',
      desc: 'Gain practical, job-ready skills you can apply immediately.'
    }
  ],
  ar: [
    {
      icon: 'assets/experience.png',
      title: 'تجربة تعليمية مخصصة',
      desc: 'نصمم كل رحلة تعليمية بما يتناسب مع احتياجات كل متعلم.'
    },
    {
      icon: 'assets/instructor.png',
      title: 'مدربون خبراء',
      desc: 'محترفون مؤهلون يقدمون خبرات عملية بوضوح وتأثير حقيقي.'
    },
    {
      icon: 'assets/flexible.png',
      title: 'تعلم مرن',
      desc: 'تعلّم وفق جدولك الخاص، في أي وقت ومن أي مكان.'
    },
    {
      icon: 'assets/results.png',
      title: 'نتائج حقيقية',
      desc: 'اكتسب مهارات عملية وجاهزة لسوق العمل يمكنك تطبيقها فورًا.'
    }
  ]
};
productsSectionContent = {
  en: {
    description: `At Al Bayan Learning, we create carefully crafted digital solutions that make learning more 
    accessible, engaging, and effective. Our products are designed to support learners, trainers, 
    and institutions at every stage of the learning journey.`
  },
  ar: {
    description: `في البيان للتعلّم، نطوّر حلولاً رقمية مصممة بعناية تجعل عملية التعلّم أكثر سهولة 
    وتفاعلاً وفعالية. تم تصميم منتجاتنا لدعم المتعلمين والمدربين والمؤسسات 
    في كل مرحلة من مراحل رحلتهم التعليمية.`
  }
};
learnTogether = {
  en: {
    description: `Join our public training programs designed for individuals and
    professionals seeking to enhance their skills. Accessible to everyone,
    these courses cover a wide range of topics to help you stay competitive
    and grow in your career.`
  },
  ar: {
    description: `انضم إلى برامجنا التدريبية العامة المصممة للأفراد والمهنيين
    الراغبين في تطوير مهاراتهم. هذه الدورات متاحة للجميع وتغطي مجموعة واسعة
    من الموضوعات لمساعدتك على البقاء منافسًا وتحقيق النمو في مسيرتك المهنية.`
  }
};
legacyLeadership = {
  en: {
    description: `Tailored programs for family-owned businesses focusing on leadership
    governance, succession planning, and strategic growth. Our training is
    customized to address the unique challenges and opportunities of family
    enterprises.`
  },
  ar: {
    description: `برامج مصممة خصيصًا للشركات العائلية، تركز على حوكمة القيادة
    والتخطيط للتعاقب الوظيفي والنمو الاستراتيجي. يتم تخصيص تدريبنا لمعالجة
    التحديات والفرص الفريدة التي تواجه المؤسسات العائلية.`
  }
};
careerJourney = {
  en: {
    description: `Empower your career with our personalized development journey. Built on
    our advanced assessment solution, this program helps you identify
    strengths, set goals, and create a roadmap for success.`
  },
  ar: {
    description: `عزّز مسيرتك المهنية من خلال رحلتنا التطويرية المصممة خصيصًا لك.
    يعتمد هذا البرنامج على نظام تقييم متقدم يساعدك على اكتشاف نقاط قوتك،
    وتحديد أهدافك، ووضع خارطة طريق واضحة نحو النجاح.`
  }
};
growthPath = {
  en: {
    description: `Personalized coaching sessions designed for individuals at any career
    stage. Based on your assessment report, our coaches help you set clear
    goals, build essential skills, and create a practical plan for success.`
  },
  ar: {
    description: `جلسات إرشاد وتوجيه مخصصة للأفراد في مختلف مراحلهم المهنية.
    استنادًا إلى تقرير التقييم الخاص بك، يساعدك مدربونا على تحديد أهداف واضحة،
    وبناء المهارات الأساسية، ووضع خطة عملية لتحقيق النجاح.`
  }
};
coursesHeader = {
  en: {
    title1: 'Learn What Matters, When It Matters —',
    highlight: 'Powered By AI Precision.'
  },
  ar: {
    title1: 'تعلّم ما يهمك، في الوقت الذي تحتاجه —',
    highlight: 'بدعم من دقة الذكاء الاصطناعي.'
  }
};
coursesHeader1 = {
  en: {
    title1: 'Learn What Matters, When It Matters —',
    highlight: 'Powered By AI Precision.',
    subtitle: `Explore a wide selection of expert-crafted training programs that guide your 
    development at every stage, providing practical courses that strengthen your skills 
    and boost your progress.`
  },
  ar: {
    title1: 'تعلّم ما يهمك، في الوقت الذي تحتاجه —',
    highlight: 'بدعم من دقة الذكاء الاصطناعي.',
    subtitle: `استكشف مجموعة واسعة من البرامج التدريبية المصممة على أيدي خبراء، 
    والتي ترافق تطورك في كل مرحلة، وتقدم دورات عملية تعزز مهاراتك 
    وتدفع تقدمك إلى الأمام.`
  }
};
course: Course[] = [];
imageBaseUrl = environment.imagebaseurl;
  constructor(private allcourse:liveclass ,private routers:Router,  private authService:AuthService,){}
  ngOnInit(): void {
    this.getallcourses()
    console.log("hi")

    }
  mobileMenuOpen = false;
  getuserid():string{
    return localStorage.getItem('userId') ||'';
  }
  datas={
  data:'',
}


getallcourses(){
   this.allcourse.publishedcourses().subscribe({
    next: (res) => {
     console.log(res)

     console.log('Courses  >>>', res.data);
      this.course = res.data;
        this.categories = [
        'All',
        ...new Set(
          this.course
            .map((c: any) => c.coursecategory)
            .filter(Boolean)
        )
      ];
    },

    error: (err) => {
      console.error(err);
      // alert('Trainer not found');
    }
  });
}


  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMenu() {
    this.mobileMenuOpen = false;
    window.scrollTo(0, 0);
  }

  showAd = true;

  adText =
    'Big News: CAPM Course is Now Available in Arabic, Learn with Ease & Clarity.';

  timeLeft = '1 Day, 6 Hours, 49 Minutes, 27 Seconds';

  closeAd() {
    this.showAd = false;
  }
  get filteredCourses() {
  if (this.selectedCategory === 'All') {
    return this.course;
  }
  return this.course.filter((c: any) =>
    c.coursecategory === this.selectedCategory
  );
}
  // Content
protected readonly title = signal('landing_page');

  showMenu = false;

  ngAfterViewInit(): void {
    const counters = document.querySelectorAll('.stat-number');
    let started = false;

    const startCounting = () => {
      counters.forEach(counter => {
        const target = Number(counter.getAttribute('data-target'));
        let count = 0;
        const speed = target / 100; 

        const update = () => {
          count += speed;
          if (count < target) {
            counter.textContent = Math.floor(count).toString();
            requestAnimationFrame(update);
          } else {
            counter.textContent = target.toLocaleString();
          }
        };

        update();
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          started = true;
          startCounting();
        }
      },
      { threshold: 0.5 }
    );

    const section = document.querySelector('.stats-section');
    if (section) {
      observer.observe(section);
    }
  }


  categories: string[] = [
];

selectedCategory = "All";

selectCategory(cat: string) {
  this.selectedCategory = cat;
}


// editTrainer(course: Course) {
//   console.log('Edit course:', course);


//   this.routers.navigate(['/course'], {
//     state: { courseid: course.courseid } 
//   }).then(() => {

//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   });
// }

editTrainer(course: Course) {
  this.routers.navigate(['/course', course.courseid]).then(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

  activeBtn: string = 'all';

setActive(btn: string) {
  this.activeBtn = btn;
}

testimonials = [
  {
    img: "assets/Video-I.png",
    message: "AI Bayan Learning made studying so much easier...",
    author: "Aisha M."
  },
  {
    img: "assets/rev-man.jpg",
    message: "AI Bayan Learning made studying so much easier...",
    author: "Dharshan"
  },
  {
    img: "assets/Video-I.png",
    message: "AI Bayan Learning made studying so much easier...",
    author: "Aisha M."
  },
];

testimonials2 = [
  {
    img: "assets/rev-man1.jpg",
    message: "Clear lessons, interactive content, perfect for my busy schedule...",
    author: "Fatima R."
  },
  {
    img: "assets/rev-women.png",
    message: "Clear lessons, interactive content, perfect for my busy schedule...",
    author: "Fatima R."
  },
  {
    img: "assets/Video-I.png",
    message: "Clear lessons, interactive content, perfect for my busy schedule...",
    author: "Fatima R."
  },
];
  //Footer 
  contact = {
    email: "contactus@bakkah.com",
    phone: "+966 (599035013)",
    address: [
      "2527 Al Thumamah Road – Al Munsiyah Dist. Riyadh, Saudi Arabia",
    ]
  };

socials = [
  { icon: "assets/Youtube.png", link: "#" },
  { icon: "assets/LinkedIn.png", link: "#" },
  { icon: "assets1/git.png", link: "#" },
  { icon: "assets1/fb.png", link: "#" },

];


  quickLinks = [
    "Home",
    "About Us",
  ];

  programs = [
    "Professional Path",
    "Project Management",
    "Quality Management",
    "IT Governance & Service Management",
    "Business Analyst",
    "Business Transformation"
  ];

  articles = [
    { title: "متطلبات وشهادة CAPM وكيفية الاستعداد للاختبار", date: "27 Nov 2025" },
    { title: "PMP Course In Newcastle - Certification, Exam, Cost, And Salary", date: "27 Nov 2025" },
    { title: "PMP Course In Essex (County) - Certification, Exam, Cost, And Salary", date: "27 Nov 2025" },
    { title: "PMP Course In Glasgow - Certification, Exam, Cost, And Salary", date: "27 Nov 2025" },
    { title: "PMP Course In Glasgow - Certification, Exam, Cost, And Salary", date: "27 Nov 2025" },
  ];
}
 