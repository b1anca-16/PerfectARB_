import { LitElement, css, html, unsafeCSS} from "lit";
import { map } from 'lit/directives/map.js';
import { customElement, query, state, property } from "lit/decorators.js";
import { TailwindElement } from "../shared/tailwind.element";
import style from './calendar.component.scss?inline'; 

@customElement("calendar-element")
export class CalendarElement extends TailwindElement(style) {
  @state() date = new Date();
  @state() month = this.date.getMonth();
  @state() year = this.date.getFullYear();
  @state() dateStr = this.date.toLocaleString('de-de', { year: 'numeric', month: 'long' });
  @state() weekDays = ["Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag","Sonntag"];
  @property() message: String;

  constructor() {
    super();
  }
  firstUpdated(): void {
  }

  //erstellt Array mit der Länge der Anzahl Tage des jeweiligen Monats und dem passenden Datums-Objekt als Inhalt
  //und leeren Elementen davor, damit der erste Tag unter dem passenden Wochentag steht 
  getDaysInMonth() {
    const firstDay = new Date(this.year, this.month, 1);
    //Tag auf 0 -> gibt den letzten Tag des Vormonats(ist wegen +1 der aktuelle Monat) zurück
    const daysInMonth = new Date(this.year, this.month + 1, 0).getDate();
    //erstellt Array mit Länge der leeren Felder vor dem ersten Tag (bei Sonntag (0) ist 6; bei den anderen wird von ihrer Zahl 1 abgezogen)
    const emptyCells = Array.from({
      length: firstDay.getDay() !== 0 ? firstDay.getDay() - 1 : 6},
      (_, index) => null);
    //erstellt Array mit Länge daysInMonth und als Elemente ein Datums-Objekt mit dem jeweiligen Datum
    const daysArray = Array.from({ length: daysInMonth }, (_, index) => {
      const currentDate = new Date(firstDay);
      currentDate.setDate(firstDay.getDate() + index);
      return currentDate;
    });
    return [...emptyCells, ...daysArray];
  }

  clickDate(index: number, currentDate: Date) {
    const clickedDate = new CustomEvent('clickedDate', {
      detail: {
        date: currentDate
      }
    })
    this.dispatchEvent(clickedDate);
  }

  addTask(currentDate: Date, index: number) {
    const addTask = new CustomEvent('addTask', {
      detail: {
        date: currentDate
      }
    })
    this.dispatchEvent(addTask);
  }

  render() {
    return html`
      <h1>Kalender</h1>
      <p>${this.message}</p>
      <div class="flex justify-center">
        <div class="w-full flex">
          <div class="w-1/2 flex justify-end items-center">
            <button class=heute @click=${this.backToday} >Heute</button>
            <button class="arrow" @click=${this.lastMonth}><</button>
            <button class="arrow" @click=${this.nextMonth}>></button>
          </div>
          <div class="w-1/2 flex justify-start items-center">
            <h2 class="mx-8 text-lg mb-5">${this.dateStr}</h2>
          </div>
        </div>
      </div>
      <div class="h-full flex justify-center mt-8">
        <div class="kalender">
            ${this.weekDays.map((item) => html`<div class="weekdays">${item}</div>`)}
            ${this.getDaysInMonth().map((currentDate, index) => html`
              <div @click=${() => {
                if (currentDate instanceof Date) {
                  this.clickDate(index, currentDate);
                }
               }} class="feld">
               <button @click=${() => {this.addTask(currentDate, index)}} class="addButton btn">+</button>
               <div class=${currentDate instanceof Date ? (this.isCurrentDate(currentDate) ? 'today' : 'normal-day') : 'invalid-date'}>
               ${currentDate?.getDate()}
             </div>
              </div>`)}
        </div>
      </div>
    `;
  }

  nextMonth(event: Event) {
    this.month++;
    //Date-Objekt für ersten Tag von nächstem Monat erstellt
    //dieser wird anschließend in monthStr als Wort gespeichert
    const nextMonthDate = new Date(this.year, this.month, 1);
    this.dateStr = nextMonthDate.toLocaleString('de-de', { year: 'numeric', month: 'long' });
  }

  lastMonth(event: Event) {
    this.month--;
    const nextMonthDate = new Date(this.year, this.month, 1);
    this.dateStr = nextMonthDate.toLocaleString('de-de', { year: 'numeric', month: 'long' });
  }

  backToday() {
    this.date = new Date();
    this.month = this.date.getMonth();
    this.year = this.date.getFullYear();
    this.dateStr = this.date.toLocaleString('de-de', { year: 'numeric', month: 'long' });
  }

  isCurrentDate(currentDate: Date) {
    const today = new Date();
    //überprüfung von Monat, Jahr und Tag, da bei einer Überprüfung der Date-Objekte die Sekunden nicht übereinstimmen würden
    return currentDate.getFullYear() === today.getFullYear() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getDate() === today.getDate();
  }

}
