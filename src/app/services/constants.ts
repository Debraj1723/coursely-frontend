import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Constants {

apiUrl: string = "https://htd7gm1pi5.execute-api.ap-south-1.amazonaws.com/api/";

  constructor() {}

  getConstant(key: string) {
    const self: any = this;
    return JSON.parse(JSON.stringify(self[key]));
  }
}
