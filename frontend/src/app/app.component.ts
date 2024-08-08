import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatButtonModule,
    RouterLink,
    FormsModule, ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    CommonModule,
    MatCardModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{

  title = 'frontend';

  subrowEmitter = new BehaviorSubject<boolean>(false)
  subrowObservable: Observable<boolean>
  subrowGenEmitter = new BehaviorSubject<boolean>(true)
  subrowGenObservable: Observable<boolean>


  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
    this.subrowObservable = this.subrowEmitter.asObservable()
    this.subrowGenObservable = this.subrowGenEmitter.asObservable()
  }

  clickButtonRow(gen: boolean) {
    this.subrowEmitter.next(true)
    this.subrowGenEmitter.next(gen)
  }

  closeSubRow() {
    this.subrowEmitter.next(false)
  }

  onClickPath(path: string) {
    this.closeSubRow()
    this.router.navigate([path]);
  }
}
