import { AdminCourse } from './dashboard-a/admin-course/admin-course';
import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { Layout } from './layout/layout';
import { Dash } from './dash/dash';
// import { Quiz } from './quiz/quiz';
// import { QuizPage } from './quiz/quiz-page/quiz-page';
import { Certificate } from './certificate/certificate';
import { Attendance } from './attendance/attendance';
import { Library } from './library/library';
import { Courses } from './courses/courses';
import { CourseCompletion } from './course-completion/course-completion';
import { DocumentUpload } from './document-upload/document-upload';
import { StudentManagement } from './student-management/student-management';
import { QuizManagement } from './quiz-management/quiz-management/quiz-management';
import { CreateQuiz } from './quiz-management/quiz-management/create-quiz/create-quiz';
import { DashboardT } from './dashboard-t/dashboard-t/dashboard-t';
import { CoursePage } from './course-page/course-page';
import { NewPassword } from './login/forgot-password/new-password/new-password';
import { ForgotPassword } from './login/forgot-password/forgot-password';
import { BatchManagement } from './batch-management/batch-management/batch-management';
import { CreateBatch } from './batch-management/batch-management/create-batch/create-batch';
import { ActivateBatch } from './batch-management/batch-management/activate-batch/activate-batch';
import { Edit } from './batch-management/batch-management/edit/edit';
import { authGuard } from './core/services/auth.gurad';
import { CourseManagement } from './course-management/course-management';
import { TrainerManagement } from './trainer-management/trainer-management';
import { AddTrainer } from './trainer-management/add-trainer/add-trainer';
import { EditTrainer } from './trainer-management/edit-trainer/edit-trainer';
import { TrainerPage } from './dashboard-a/trainer-page/trainer-page';
import { DashboardA } from './dashboard-a/dashboard-a';
import { TraineeManagement } from './trainee-management/trainee-management';
import { QuizPerformanceDashboard } from './quiz-performance-dashboard/quiz-performance-dashboard';
import { EnrollmentReports } from './enrollment-reports/enrollment-reports';
import { Batchwise } from './enrollment-reports/batchwise/batchwise';
import { Studentwise } from './enrollment-reports/studentwise/studentwise';
import { MyAttendance } from './my-attendance/my-attendance';
import { LandingPage } from './landing-page/landing-page';
import { AboutUs } from './about-us/about-us';
import { EditCourse } from './course-management/edit-course/edit-course';
import { SimilarCourses } from './similar-courses/similar-courses';
import { Payment } from './payment/payment';
import { Header } from './header/header';
import { CertificateIssunace } from './certificate-issunace/certificate-issunace/certificate-issunace';
import { ModuleCompletion } from './module-completion/module-completion/module-completion';
import { SessionAttendance } from './session-attendance/session-attendance/session-attendance';
import { SuperAdminComponent } from './super-admin/super-admin/super-admin';
import { AddAdmin } from './super-admin/super-admin/add-admin/add-admin';
import { EditAdmin } from './super-admin/super-admin/edit-admin/edit-admin';
import { FinanceDashboard } from './finance-dashboard/finance-dashboard';
import { SalesAndMarketing } from './sales-and-marketing/sales-and-marketing';
import { ActionBtn } from './sales-and-marketing/action-btn/action-btn';

export const routes: Routes = [
  { path: '', redirectTo: 'landing-page', pathMatch: 'full' },
  { path: 'landing-page', component: LandingPage },
  { path: 'about-us', component: AboutUs },
  { path: 'course/:id', component: CoursePage },
  // { path: 'course', component: CoursePage },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'header', component: Header },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'new-password', component: NewPassword },
  { path: 'payment/:courseId/:batchId', component: Payment },

  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: Dash },
      { path: 'courses', component: Courses },
      // { path: 'quiz', component: Quiz },
      // { path: 'quiz/start', component: QuizPage },
      { path: 'certificate', component: Certificate },
      { path: 'attendance', component: Attendance },
      { path: 'library', component: Library },
      // trainer module
      { path: 'course-completion', component: CourseCompletion },
      { path: 'document-upload', component: DocumentUpload },
      { path: 'Course-management', component: CourseManagement },
      { path: 'trainer-management', component: TrainerManagement },
      { path: 'add-trainer', component: AddTrainer },
      {path:'edit-trainer',component:EditTrainer},
      // { path: 'edit-trainer/:trainerid', component: EditTrainer },
      { path: 'student-management', component: StudentManagement },
      { path: 'quiz-management', component: QuizManagement },
      { path: 'create-quiz', component: CreateQuiz },
      { path: 'dashboard-t', component: DashboardT },
      { path: 'similar-courses', component: SimilarCourses },
      { path: 'my-attendance', component: MyAttendance },
      { path: '', redirectTo: 'layout', pathMatch: 'full' },
      { path: 'batch-management', component: BatchManagement },
      { path: 'create-batch', component: CreateBatch },
      { path: 'activate-batch', component: ActivateBatch },
      { path: 'edit', component: Edit },
      // admin module
      { path: 'dashboard-a', component: DashboardA },
      { path: 'trainer-page', component: TrainerPage },
      { path: 'admin-course', component: AdminCourse },
      { path: 'trainee-management', component: TraineeManagement },
      { path: 'quiz-performance-dashboard', component: QuizPerformanceDashboard },
      { path: 'enrollment-reports', component: EnrollmentReports },
      { path: 'batchwise', component: Batchwise },
      { path: 'studentwise', component: Studentwise },
      { path: 'certificate-issunace', component: CertificateIssunace },
      { path: 'module-completion', component: ModuleCompletion },
      { path: 'session-attendance', component: SessionAttendance },
      // { path: 'edit-course/:courseid', component: EditCourse },
      { path: 'edit-course', component: EditCourse },
      { path: 'super-admin', component: SuperAdminComponent },
      { path: 'add-admin', component: AddAdmin },
 { path: 'edit-admin', component: EditAdmin },
      // { path: 'edit-admin/:adminid', component: EditAdmin },

      // super admin
      { path: 'finance-dashboard', component: FinanceDashboard },
      { path: 'salesAndMarketing', component: SalesAndMarketing },
      { path: 'action-btn', component: ActionBtn },
    ],
  },
];
