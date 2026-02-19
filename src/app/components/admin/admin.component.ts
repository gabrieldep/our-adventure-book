import { Component, inject, signal, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const TODO_LIST_URL = '/assets/data/todo-list.json';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  private readonly http = inject(HttpClient);

  readonly items = signal<string[]>([]);

  ngOnInit(): void {
    this.http.get<{ items: string[] }>(TODO_LIST_URL).subscribe({
      next: (data) => this.items.set(data?.items ?? []),
      error: () => this.items.set([]),
    });
  }
}
