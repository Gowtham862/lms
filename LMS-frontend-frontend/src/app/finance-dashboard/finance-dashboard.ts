import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-finance-dashboard',
  imports: [CommonModule,FormsModule],
  templateUrl: './finance-dashboard.html',
  styleUrl: './finance-dashboard.css',
})
export class FinanceDashboard {

    cards = [
    {
      title: 'Total Revenue Generated',
      value: '0',
      currency: 'AED',
      icon: 'fa-graduation-cap',
      change: null,
      changeType: null
    },
    {
      title: 'Total Revenue This Month',
      value: '0',
      currency: 'AED',
      icon: 'fa-graduation-cap',
      change: '+12%',
      changeType: 'up'
    },
    {
      title: 'Monthly Recurring Revenue (MRR)',
      value: '0',
      currency: 'AED',
      icon: 'fa-graduation-cap',
      change: '-1%',
      changeType: 'down'
    },
    {
      title: 'Pending Payments',
      value: '0',
      currency: '',
      icon: 'fa-graduation-cap',
      change: null,
      changeType: null
    }
  ];

   payments = [
    // {
    //   transactionId: '112233444444',
    //   traineeName: 'Abishek M',
    //   email: 'abishek123@gmail.com',
    //   contact: '+91 98999 87666',
    //   batch: 'Batch 2',
    //   date: '11-01-2026',
    //   method: 'UPI',
    //   amount: '8,000 AED',
    //   status: 'Paid'
    // },
    // {
    //   transactionId: '112233444444',
    //   traineeName: 'Abishek M',
    //   email: 'abishek123@gmail.com',
    //   contact: '+91 98999 87666',
    //   batch: 'Batch 2',
    //   date: '11-01-2026',
    //   method: 'Card',
    //   amount: '8,000 AED',
    //   status: 'Failed'
    // },
    // {
    //   transactionId: '112233444444',
    //   traineeName: 'Abishek M',
    //   email: 'abishek123@gmail.com',
    //   contact: '+91 98999 87666',
    //   batch: 'Batch 2',
    //   date: '11-01-2026',
    //   method: 'Net Banking',
    //   amount: '8,000 AED',
    //   status: 'Refunded'
    // },
    //   {
    //   transactionId: '112233444444',
    //   traineeName: 'Abishek M',
    //   email: 'abishek123@gmail.com',
    //   contact: '+91 98999 87666',
    //   batch: 'Batch 2',
    //   date: '11-01-2026',
    //   method: 'Net Banking',
    //   amount: '8,000 AED',
    //   status: 'Refunded'
    // },
    //   {
    //   transactionId: '112233444444',
    //   traineeName: 'Abishek M',
    //   email: 'abishek123@gmail.com',
    //   contact: '+91 98999 87666',
    //   batch: 'Batch 2',
    //   date: '11-01-2026',
    //   method: 'Net Banking',
    //   amount: '8,000 AED',
    //   status: 'Refunded'
    // },
    //   {
    //   transactionId: '112233444444',
    //   traineeName: 'Abishek M',
    //   email: 'abishek123@gmail.com',
    //   contact: '+91 98999 87666',
    //   batch: 'Batch 2',
    //   date: '11-01-2026',
    //   method: 'Net Banking',
    //   amount: '8,000 AED',
    //   status: 'Refunded'
    // },
    //   {
    //   transactionId: '112233444444',
    //   traineeName: 'Abishek M',
    //   email: 'abishek123@gmail.com',
    //   contact: '+91 98999 87666',
    //   batch: 'Batch 2',
    //   date: '11-01-2026',
    //   method: 'Net Banking',
    //   amount: '8,000 AED',
    //   status: 'Refunded'
    // }
  ];

}
