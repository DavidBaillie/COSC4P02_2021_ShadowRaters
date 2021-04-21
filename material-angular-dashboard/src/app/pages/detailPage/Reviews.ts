export interface IDetail {
  rpid?: string;
  rcid?: string;
  rdid?: string;
  ruid?: string;
  pid?: string;
  uid?: string;
  cid?: string;
  did?: string;
  username: string;
  score: number;
  comment: string;
  num_agree: number;
  num_disagree: number;
  flag?: number;
  date: string;
}

export interface IMyComment {
  score: number;
  comment: string;
  token: string;
}

