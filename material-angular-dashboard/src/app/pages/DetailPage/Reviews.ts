export interface IDetail{
  rpid: string;
  username: string;
  pid?: string;
  uid?:string;
  cid?:string;
  did?:string;
  score: number;
  comment: string;
  num_agree: number;
  num_disagree: number;
  date: string;
}

export  interface IMyComment{
  score:number;
  comment:string;
  token:string;
}

