import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { CommonModule } from '@angular/common';

export interface MenuItem {
  label: string;
  route: string;
  iconDefault: string;
  iconActive: string;
    roles: string[];
    islogout?:boolean;
} 

@Component({
  selector: 'app-layout',
  standalone:true,
  imports: [RouterModule,CommonModule,RouterLink],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout implements OnInit {
username: string = '';
  
 user = {
    name: 'Abishek',
    greeting: 'Good Morning',
    notifications: 2,
    avatar: '/user.jpg'
  };

   menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      iconDefault: '/b-dash.png',
      iconActive: '/a-dash.png',
        roles: ['LEARNER']

    },
    {
      label: 'My Courses',
      route: '/courses',
      iconDefault: '/b-course.png',
      iconActive: '/a-course.png',
        roles: ['LEARNER']
    },
    {
      label: 'My Library',
      route: '/library',
      iconDefault: '/b-lib.png',
      iconActive: '/a-lib.png',
        roles: ['LEARNER']
    },
    // {
    //   label: 'My Quiz',
    //   route: '/quiz',
    //   iconDefault: '/b-quiz.png',
    //   iconActive: '/a-quiz.png',
    //     roles: ['LEARNER']
    // },
  //  {
  //     label: 'My Attendance',
  //     route: '/attendance',
  //     iconDefault: '/b-atten.png',
  //     iconActive: '/a-atten.png',
  //       roles: ['LEARNER']
  //   },
    {
      label: 'My Certificate',
      route: '/certificate',
      iconDefault: '/b-cert.png',
      iconActive: '/a-cert.png',
        roles: ['LEARNER']
    },
    // {
    //   label: 'Settings',
    //   route: '/settings',
    //   iconDefault: '/b-settings.png',
    //   iconActive: '/a-settings.png',
    //     roles: ['LEARNER']
    // },
    {
      label: 'Dashboard',
      route: '/dashboard-t',
      iconDefault: '/b-dash.png',
      iconActive: '/a-dash.png',
        roles: ['INSTRUCTOR']
    },
    {
      label: 'Course Completion',
      route: '/course-completion',
      iconDefault: '/b-course.png',
      iconActive: '/a-course.png',
        roles: ['INSTRUCTOR']
    },
    {
      label: 'Document Upload',
      route: '/document-upload',
      iconDefault: '/b-lib.png',
      iconActive: '/a-lib.png',
       roles: ['INSTRUCTOR']
    },
    // {
    //   label: 'Quiz Management',
    //   route: '/quiz-management',
    //   iconDefault: '/b-quiz.png',
    //   iconActive: '/a-quiz.png',
    //    roles: ['INSTRUCTOR']
    // },
    {
      label: 'Students Management',
      route: '/student-management',
      iconDefault: '/b-stu.png',
      iconActive: '/a-stu.png',
       roles: ['INSTRUCTOR']
    },

    //  {
    //   label: 'My Attendance',
    //   route: '/my-attendance',
    //   iconDefault: '/b-atten.png',
    //   iconActive: '/a-atten.png',
    //    roles: ['INSTRUCTOR']
    // },
     {
      label: 'Dashboard',
      route: '/dashboard-a',
      iconDefault: '/b-dash.png',
      iconActive: '/a-dash.png',
       roles: ['LMS_ADMIN','SUPERADMIN']
    },
         {
      label: 'Course management',
      route: '/Course-management',
      iconDefault: '/b-course.png',
      iconActive: '/a-course.png',
        roles: ['LMS_ADMIN','SUPERADMIN']
    },
        {
      label: 'Batch Management',
      route: '/batch-management',
      iconDefault: '/b-batch.png',
      iconActive: '/a-batch.png',
       roles: ['LMS_ADMIN','SUPERADMIN']
    },

     {
      label: 'Trainer management',
      route: '/trainer-management',
      iconDefault: '/b-trainer.png',
      iconActive: '/a-trainer.png',
        roles: ['LMS_ADMIN','SUPERADMIN']
    },
    {
      label: 'Trainee management',
      route: '/trainee-management',
      iconDefault: '/b-trainee.png',
      iconActive: '/a-trainee.png',
        roles: ['LMS_ADMIN','SUPERADMIN']
    },
    {
      label: 'Module Completion',
      route: '/module-completion',
      iconDefault: '/b-mod.png',
      iconActive: '/a-mod.png',
        roles: ['LMS_ADMIN','SUPERADMIN']
    },
    // {
    //   label: 'Session Attendance',
    //   route: '/session-attendance',
    //   iconDefault: '/b-trainee.png',
    //   iconActive: '/a-trainee.png',
    //     roles: ['ADMIN']
    // },
    {
      label: 'Certificate Issuance',
      route: '/certificate-issunace',
      iconDefault: '/b-cert.png',
      iconActive: '/a-cert.png',
        roles: ['LMS_ADMIN','SUPERADMIN']
    },

    {
      label: 'Sales And Marketing',
      route: '/salesAndMarketing',
      iconDefault: '/b-cert.png',
      iconActive: '/a-cert.png',
        roles: ['SALES_ADMIN']
    },

    
     {
      label: 'Admin Management',
      route: '/super-admin',
      iconDefault: '/adminImageb.png',
      iconActive: '/adminImage.png',
        roles: ['SUPERADMIN']
    },
     {
      label: 'Finance Management',
      route: '/finance-dashboard',
      iconDefault: '/b-cert.png',
      iconActive: '/a-cert.png',
        roles: ['FINANCE_ADMIN']
    },


    
    //  {
    //   label: 'Quiz Performance',
    //   route: '/quiz-performance-dashboard',
    //   iconDefault: '/b-quiz.png',
    //   iconActive: '/a-quiz.png',
    //     roles: ['ADMIN']
    // },
    // {
    //   label: 'Enrollment Reports',
    //   route: '/enrollment-reports',
    //   iconDefault: '/b-enroll.png',
    //   iconActive: '/a-enroll.png',
    //     roles: ['ADMIN']
    // },
      {
      label: 'Logout',
      route: '/landing-page',
      iconDefault: '/b-log.png',
      iconActive: '/a-log.png',
        roles: ['LMS_ADMIN','LEARNER','INSTRUCTOR','SUPERADMIN','SALES_ADMIN'],
        islogout:true
    },
  ];

  //   get filteredNavigation() {
  //   const role = this.getUserRole();
  //   console.log(role)
  //   if (role === 'INSTRUCTOR') {
  //     console.log("INSTRUCTOR")
  //     return this. menuItems.filter(item => item.label !== 'Dashboard'&&
  //       item.label!=='My Courses'&&item.label!='My Attendance'
  //       &&item.label!=='My Library'&&item.label!=='My Quiz'
  //       &&item.label!=='My Certificate'&&item.label!=='Settings'
  //     );
        
  //   }

  //   else if (role==='LEARNER') {
  //     console.log("learner working")
  //     return this. menuItems.filter(item => item.label !== 'Dashboard-T'&&
  //       item.label!=='Course Completion'
  //       &&item.label!=='Quiz Management'&&item.label!=='Document Upload'
  //       &&item.label!=='Students Management'&&item.label!=='Settings'
  //       &&item.label!=='Batch Management'
  //     );
  //   }
  //   return this. menuItems;
  // }

  get filteredNavigation(): MenuItem[] {
  const role = this.getUserRole();
  return this.menuItems.filter(item =>
    item.roles.includes(role)
  );
}

  constructor(
    private authService:AuthService,
    private API: HttpClient,
    private router:Router
  ) {}
  ngOnInit(): void {
        const token = localStorage.getItem('authToken');
        console.log("token"+token)
        const username=localStorage.getItem('currentUser');
        console.log(username)
  }
 
   getUserRole(): string {
    return this.authService.getrole() || 'USER';
  }
    getUserName():string {
    return localStorage.getItem('currentUser') || 'User';
  }
   getUserEmail(): string {
    return localStorage.getItem('useremail') || '';
  }

  
 

  logout() {
    this.authService.logout();
    this.router.navigate(['/landing-page']);
  }
  onMenuClick(item: MenuItem) {
  if (item.islogout) {
    this.logout();
  }
}

}
