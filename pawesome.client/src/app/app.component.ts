import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core'
import { ElementRef } from '@angular/core';

interface Dog {
  breed: string;
  type: string[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  public dogs: Dog[] = []; //primary array of dog breeds
  public selectedBreed: string[] = []; //secondary array for breeds with sub types
  public imagesource = ""; 
  public subBreedHeader = "";

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getDogs();
  }

  getDogs() {
    this.http
      .get<any>('https://dog.ceo/api/breeds/list/all', {
        
      })
      .subscribe(data => {
        this.loadDogsObject(data);
      },
        err => alert(err.message) //In a real environment I would log this error in the appropriate place
      );
  }

  loadDogsObject(data: any) {
    //read JSON message and put values into dogs array
    /*
    I don't have a lot of experience parsing JSON messages,
    I tried using JSON.parse() for this but was getting an error in
    OperatorSubscriber.js
    I didn't want to spend too much time investigating that so I switched to the below method
    */
    for (const breed in data.message) {
      if (data.message.hasOwnProperty(breed)) {
        this.dogs.push({ breed, type: data.message[breed] });
      }
    }
  }

  loadImage(value: string) {
    this.selectedBreed = [];
    this.subBreedHeader = "";
    for (const x in this.dogs) {
      if (this.dogs[x].breed == value && this.dogs[x].type.length > 0) {
        this.selectedBreed = this.dogs[x].type; //this is used to display the sub types of breeds that have them
        this.subBreedHeader = "Types of " + value; 
        break;
      }
    }

    //retrieve image for selected breed
    this.http
      .get<any>('https://dog.ceo/api/breed/' + value + '/images/random', {

      })
      .subscribe(data => {
        this.imagesource = data.message;
      },
        err => alert(err.message)
      );
  }


  title = 'pawesome.client';
}

