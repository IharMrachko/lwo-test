import {Component, OnInit} from '@angular/core';
import {JsonService} from '../services/json.service';
import {map} from 'rxjs/operators';
import {TableData} from './models/TableData';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public tableData: TableData[] = [];


  constructor(private jsonService: JsonService) {
  }

  ngOnInit(): void {
    this.jsonService.getDataset()
      .subscribe(res => {
        this.tableData = res;
        console.log(this.tableData);
      });

  }


}
