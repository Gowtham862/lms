import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Header } from "../header/header";

@Component({
  selector: 'app-about-us',
  imports: [CommonModule, Header],
  templateUrl: './about-us.html',
  styleUrl: './about-us.css',
})
export class AboutUs {

row1 = [
  'CRM And Customer Engagement',
  'Data Processing And Analysis',
  'Business Automation',
  'Cloud Integration'
];

row2 = [
  'AI Powered Insights',
  'Workflow Optimization',
  'Predictive Analytics',
  'Secure Data Handling'
];

row3 = [
  'CRM And Customer Engagement',
  'Data Processing And Analysis',
  'Business Automation',
  'Cloud Integration'
];
// Footer
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
    "About Us"
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
