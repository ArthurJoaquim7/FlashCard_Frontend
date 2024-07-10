import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-flash-card',
  templateUrl: './flash-card.component.html',
  styleUrls: ['./flash-card.component.scss']
})
export class FlashCardComponent {
  FlashCardArray: any[] = [];
  currentCardIndex: number = 0;
  isResultLoaded = false;
  isUpdateFormActive = false;

  front: string = "";
  back: string = "";

  currentFlashCardID = "";

  constructor(private http: HttpClient) {
    this.getAllFlashCard();
  }

  ngOnInit(): void { }

  //LISTAR
  getAllFlashCard() {
    this.http.get("https://localhost:7143/api/FlashCard/GetFlashCard")
      .subscribe((resultData: any) => {
        this.isResultLoaded = true;
        console.log(resultData);
        this.FlashCardArray = resultData;
        if (this.FlashCardArray.length > 0) {
          this.currentCardIndex = 0;
        }
      });
  }

  get currentFlashCard() {
    return this.FlashCardArray[this.currentCardIndex];
  }

  // Card Anterior
  prevCard() {
    if (this.currentCardIndex > 0) {
      this.currentCardIndex--;
    }
  }

  // Card Posterior
  nextCard() {
    if (this.currentCardIndex < this.FlashCardArray.length - 1) {
      this.currentCardIndex++;
    }
  }

  register() {
    let bodyData = {
      "front": this.front,
      "back": this.back
    };

    //CRIAR
    this.http.post("https://localhost:7143/api/FlashCard/AddFlashCard", bodyData).subscribe((resultData: any) => {
      console.log(resultData);
      this.getAllFlashCard();
      this.front = '';
      this.back = '';
    });
  }

  setUpdate(data: any) {
    this.front = data.front;
    this.back = data.back;
    this.currentFlashCardID = data.id;
  }

  UpdateRecords() {
    let bodyData = {
      id: this.currentFlashCardID,
      front: this.front,
      back: this.back
    };
    //ATUALIZAR
    this.http.patch("https://localhost:7143/api/FlashCard/UpdateFlashCard/" + this.currentFlashCardID, bodyData)
      .subscribe((resultData: any) => {
        console.log(resultData);
        this.getAllFlashCard();
        this.front = '';
        this.back = '';
      });
  }

  save() {
    if (this.currentFlashCardID == '') {
      this.register();
    } else {
      this.UpdateRecords();
    }
  }
  //DELETAR
  setDelete(data: any) {
    console.log("Deleting FlashCard with ID: " + data.id);
    this.http.delete("https://localhost:7143/api/FlashCard/DeleteFlashCard/" + data.id).subscribe((resultData: any) => {
      console.log(resultData);
      if (resultData === true) {
        this.getAllFlashCard();
      } else {
        alert("Não foi possível deletar");
      }
    });
  }
}
