import {Component, OnInit} from '@angular/core';
import {JsonService} from '../services/json.service';
import {flatMap, map, reduce} from 'rxjs/operators';
import {TableData} from './models/TableData';
import {Dimension, Structure} from "./models/structure";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public tableData: TableData[] = [];
  dimensions: Dimension[];


  constructor(private jsonService: JsonService) {
  }

  ngOnInit(): void {

    this.jsonService.getStructure()
      .pipe(map(it => it.dimensions))
      .subscribe(it => {
          this.dimensions = it;
          console.log(this.dimensions)
      })

    // this.jsonService.getDataset()
    //   .subscribe(it => {
    //     let a = []
    //
    //     Object.entries(it)
    //       .map(([field, value]) => {
    //         let fieldValues = field.split(':')
    //         let year = fieldValues.shift()
    //         let values = [...new Set(fieldValues)] || []
    //         let preparedObject = {
    //           year: year,
    //           codes: values,
    //           actualCode: values.length > 0 ? values[values.length - 1] : null,
    //           actualValue: value
    //         }
    //
    //         a.push(preparedObject)
    //       })
    //     let map1 = this.groupByKey(a, 'year');
    //
    //     console.log(map1)
    //   })

/*    this.jsonService.getStructure()
      .pipe(
        flatMap(it => it.dimensions),
        flatMap(it => it.items),
        reduce((acc, x) => {
          acc.push(x);
          return acc;
        }, []),
        map(it => this.concatChildrenArrays(it as [])),
        map(it => this.filterUnique(it, 'id')),
      )
      .subscribe(modifiedStructure => {


        this.jsonService.getDataset()
          .subscribe(it => {

            let a = []

            Object.entries(it)
              .map(([field, value]) => {
                let fieldValues = field.split(':')
                let year = fieldValues.shift()
                let values = [...new Set(fieldValues)] || []

                let mappedObject = values.map((val, i, arr) => {
            //      let newVar = modifiedStructure.find(elem => elem.id == val)?.name?.lang_ru
                  return {
                    code: val,
                    value: arr.length - 1 === i ? value : null
                  }
                });

                let preparedObject = {
                  year: year,
                  values: mappedObject,
                }

                a.push(preparedObject)
              })


            let map1 = this.groupByKey(a, 'year');
            let from = Array.of(map1);
            console.log(map1)
          })
      })*/
  }

  private concatChildrenArrays(array: any[]): any[] {
    let childrenArray = array.filter(it => it.children).flatMap(it => it?.children);
    if (childrenArray && childrenArray.length > 0) {
      this.concatChildrenArrays(childrenArray);
    }
    return array.concat(childrenArray)
  }


  private filterUnique(array: any[], key: string): any[] {
    return [...new Map(array.map(item => [item[key], item])).values()]
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
