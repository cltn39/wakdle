export default function (list: any[], index: number) {
  return list.filter((_, idx) => idx !== index);
}