import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BudgetListComponent } from './components/budget/budget-list.component';
import { BudgetFormComponent } from './components/budget/budget-form.component';
import { ExpenseListComponent } from './components/expense/expense-list.component';
import { ExpenseFormComponent } from './components/expense/expense-form.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'budgets', component: BudgetListComponent },
  { path: 'budgets/new', component: BudgetFormComponent },
  { path: 'budgets/edit/:id', component: BudgetFormComponent },
  { path: 'expenses', component: ExpenseListComponent },
  { path: 'expenses/new', component: ExpenseFormComponent },
  { path: 'expenses/edit/:id', component: ExpenseFormComponent },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }