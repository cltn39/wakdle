import { APP_NAME } from "../App";
import statusToString from "./status-to-string";

export default function(status: number[][], linkShare: boolean, emptyShow: boolean) {
  const useLine = status.filter(rows => rows.findIndex(col => col !== 0) !== -1).length;

  return `${APP_NAME} 724 ${useLine}/${status.length} ${linkShare ? "wakdle.vercel.app" : ''}\n\n${statusToString(status, emptyShow)}`;
}
