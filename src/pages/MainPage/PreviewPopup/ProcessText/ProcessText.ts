import { ITextareas } from './../../MainPage';
import { ObjectVarType } from '../PreviewPopup';

// Объявление функции processText с параметрами и возвращаемым значением типа string
export const processText = (
  data: ITextareas,
  startKey: number,
  arrVarNames: string[],
  textareas: ITextareas,
  objectVar: ObjectVarType,
): string => {
  // Инициализация переменных result и currentKey
  let result = '';
  let currentKey = startKey;
  // Начало цикла while, выполняется до тех пор, пока currentKey не равен null и data[currentKey] существует
  while (currentKey !== null && data[currentKey]) {
    // Деструктуризация объекта data[currentKey] для извлечения значений text, ifKey, thenKey, elseKey и afterKey
    let { text, if: ifKey, then: thenKey, else: elseKey, after: afterKey } = data[currentKey];

    // Замена переменных в тексте, используя значения из objectVar
    text = text.replace(/{(\w+)}/g, (_, name) => {
      return objectVar.hasOwnProperty(name) ? objectVar[name] : `{${name}}`;
    });

    // Добавление обработанного текста к результату
    result += text;

    // Рекурсивная обработка условий if-then-else
    if (ifKey !== null && data[ifKey]) {
      const ifText = processText(data, ifKey, arrVarNames, textareas, objectVar);
      result += ifText
        ? processText(data, Number(thenKey), arrVarNames, textareas, objectVar)
        : processText(data, Number(elseKey), arrVarNames, textareas, objectVar);
    }
    // Обновление значения currentKey для перехода к следующему элементу данных
    currentKey = Number(afterKey);
  }
  // Возвращение собранного текста
  return result;
};
