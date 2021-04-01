<<<<<<< HEAD:material-angular-dashboard/src/app/pages/DetailPage/detail-professor/professorReviews.ts
export interface ProfReview {
=======
export interface Details {
>>>>>>> web_integration:material-angular-dashboard/src/app/pages/DetailPage/Reviews.ts
  rpid: string,
  uuid: string,
  pid: string,
  //score should be float, so need to accept string then convert to Number
  //myNumber: number = Number(myNumberString);
  score: string,
  comment: string,
  num_agree: number,
  num_disagree: number,
  date: Date
}
