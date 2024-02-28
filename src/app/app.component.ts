import { Component, OnInit } from '@angular/core';
import { DataService } from './data.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'metronik-app-test';
  readonly APIUrl = "http://localhost:5038/api/v2/"

  constructor(private dataService: DataService, private http: HttpClient) { }

  notes: any = [];

  refreshNotes() {
    const storedNotes = localStorage.getItem('notes');
    if (storedNotes) {
      this.notes = JSON.parse(storedNotes);
    } else {
      this.http.get<any[]>(this.APIUrl + 'GetNotes').subscribe(data => {
        this.notes = data;
        localStorage.setItem('notes', JSON.stringify(this.notes));
      });
    }
  }

  ngOnInit(): void {
    this.refreshNotes();
  }

  addNotes() {
    var newNoteDescription = (<HTMLInputElement>document.getElementById("newNotes")).value;
    var formData = new FormData();
    formData.append("newNotes", newNoteDescription);

    this.http.post(this.APIUrl + 'AddNotes', formData).subscribe((data: any) => {
      this.notes.push({ description: newNoteDescription });
      localStorage.setItem('notes', JSON.stringify(this.notes));
    });
  }

  deleteNotes(id: any) {
    this.http.delete(this.APIUrl + 'DeleteNotes?id=' + id).subscribe((data) => {
      this.notes = this.notes.filter((note: any) => note.id !== id);
      localStorage.setItem('notes', JSON.stringify(this.notes));
    });
  }
}
