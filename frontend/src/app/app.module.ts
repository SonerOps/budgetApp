import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Components
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BudgetListComponent } from './components/budget/budget-list.component';
import { BudgetFormComponent } from './components/budget/budget-form.component';
import { ExpenseListComponent } from './components/expense/expense-list.component';
import { ExpenseFormComponent } from './components/expense/expense-form.component';
import { NavbarComponent } from './components/shared/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    BudgetListComponent,
    BudgetFormComponent,
    ExpenseListComponent,
    ExpenseFormComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }