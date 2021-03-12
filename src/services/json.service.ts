import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {TableData} from '../app/models/TableData';

@Injectable({
  providedIn: 'root',
})
export class JsonService {
  constructor(private http: HttpClient) {
  }

  public getStructure(): Observable<any> {
    return this.http.get('http://localhost:3000/structure')
      .pipe(
        map(it => it['dimensions'])
      );
  }

  public getDataset(): Observable<TableData[]> {
    return this.http.get<TableData[]>('http://localhost:3000/dataset')
      .pipe(
        map(it => JsonService.convertResponse(it)),
        map(it => JsonService.prepareTableData(it, 'date')),
      );
  }

  private groupBy(arr, key) {
    //currentValue например: {date: "2013", value: "T60", total: "0.9"}
    //key поле date
    return arr.reduce((element, currentValue) => {
      (element[currentValue[key]] = (element[currentValue[key]] || [])).push(currentValue); // меняем ключ на date
      return element;
    }, {});
  };


  private static convertResponse(response: any): any[] {
    return Object.entries(response).map(([key, value]) => {
      let keys = key.split(':');
      return {date: keys[0], value: keys[1] + keys[2], total: value};
    });
  }

  private static prepareTableData(list, key) {
   let groupedValue = JsonService.groupByKey(list, key);
    return Array.from(groupedValue).map(([key, value]) => new TableData(key, value as any[]));
  }

  private static  groupByKey(array, key){
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
