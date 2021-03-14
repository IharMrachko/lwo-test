import {Component, OnInit} from '@angular/core';
import {JsonService} from '../services/json.service';
import {flatMap, map, reduce} from 'rxjs/operators';
import {TableData} from './models/TableData';
import {Dimension, Structure} from './models/structure';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public tableData: TableData[] = [];
  public dimensions: Dimension[];
  public abr = [];
  public dataSet = [];

  constructor(private jsonService: JsonService) {
  }

  ngOnInit(): void {

    this.jsonService.getStructure()
      .pipe(map(it => it.dimensions))
      .subscribe(it => {
        this.dimensions = it;
      });

    this.jsonService.getDataset().subscribe(res => {
      this.dataSet = Object.entries(res).map(([key, val]) => {
        return {
          date: key, value: Object.entries(val).map(([k, v]) => {
            return {name: k, total: v};
          })
        };
      });
      this.abr = this.filterUnique(this.concatChildrenArrays(this.dimensions.flatMap(it => it.items)), 'id')
        .map(val => {
          return {abr: val.id, name: val.name.lang_ru};
        });

      console.log(this.abr);
    });
  }
  private filterUnique(array: any[], key: string): any[] {
    return [...new Map(array.map(item => [item[key], item])).values()]
  }

  private concatChildrenArrays(array: any[]): any[] {
    let childrenArray = array.filter(it => it.children).flatMap(it => it?.children);
    if (childrenArray && childrenArray.length > 0) {
      this.concatChildrenArrays(childrenArray);
    }
    return array.concat(childrenArray)
  }

  private groupByKey(array, key) {
    const map = new Map();
    array.forEach((item) => {
      const value = item[key];
      const collection = map.get(value);
      if (!collection) {
        map.set(value, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }
}

