import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {TableData} from '../app/models/TableData';
import {Structure} from "../app/models/structure";

@Injectable({
  providedIn: 'root',
})
export class JsonService {
  constructor(private http: HttpClient) {
  }

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

  private static groupByKey(array, key) {
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

  public getStructure(): Observable<Structure> {
    return this.http.get<Structure>('http://localhost:3000/structure');
  }

  public getDataset(): Observable<any> {
    return this.http.get<any>('http://localhost:3000/dataset')
      .pipe(map(it => this.prepareData(it)));
  }

  private prepareData(dataset: any) {
    let preparedData = new Map();

    Object.entries(dataset).map(([field, value]) => {
      let fieldValues = field.split(':')
      let year = fieldValues.shift()
      let code = ([...new Set(fieldValues)] || []).join('')
      let innerMap = preparedData.get(year);
      if (!innerMap) {
        preparedData.set(year, new Map().set(code, value));
      } else {
        innerMap.set(code, value)
      }
    })

    // preparedData Map(year, Map(code, value)). конвертируем в объект (можно оставить и мапой)
    return Array.from(preparedData).reduce((main, [key, value]) => ({...main, [key]: Object.fromEntries(value)}), {})
  }

  private groupBy(arr, key) {
    //currentValue например: {date: "2013", value: "T60", total: "0.9"}
    //key поле date
    return arr.reduce((element, currentValue) => {
      (element[currentValue[key]] = (element[currentValue[key]] || [])).push(currentValue); // меняем ключ на date
      return element;
    }, {});
  };
}
