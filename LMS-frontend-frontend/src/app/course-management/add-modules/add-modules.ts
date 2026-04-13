import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface Module {
  moduleNo: number;
  moduleName: string;
  sessionDuration: string;
  totalsession: string;
}

@Component({
  selector: 'app-add-modules',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-modules.html',
  styleUrl: './add-modules.scss',
})
export class AddModules implements OnInit {

  @Input() moduleCount!: number;
  @Input() courseName!: string;
  @Output() modulesAdded = new EventEmitter<Module[]>();

  modules: Module[] = [];

  showSuccessModal = false;
  showDeleteModal = false;
  currentModule!: Module;

  ngOnInit() {
    this.modules = Array.from({ length: this.moduleCount }, (_, i) => ({
      moduleNo: i + 1,
      moduleName: '',
      sessionDuration: '',
      totalsession: ''
    }));
  }

  /* ================= SUBMIT ================= */

  submitModules(form: any) {
 if (form.invalid) return;
    if (!this.validateModules()) return;

    this.modulesAdded.emit(this.modules);

    console.log('Modules Payload →', this.modules);

    this.showSuccessModal = true;
  }

  /* ================= DELETE ================= */

  openDeleteModal(module: Module) {
    this.currentModule = module;
    this.showDeleteModal = true;
  }

  deleteModule() {
    this.modules = this.modules.filter(m => m !== this.currentModule);
    this.showDeleteModal = false;
  }

  /* ================= VALIDATION ================= */

  validateModules(): boolean {
    let isValid = true;

    this.modules.forEach(m => {
      if (!m.moduleName?.trim()) isValid = false;
      if (!m.sessionDuration) isValid = false;
      if (!m.totalsession) isValid = false;
    });

    if (!isValid) {
      alert('Please fill all module fields');
    }

    return isValid;
  }

  /* ================= MODAL ================= */

  closeSuccessModal() {
    this.showSuccessModal = false;
  }

  goBack() {
    history.back();
  }
}
