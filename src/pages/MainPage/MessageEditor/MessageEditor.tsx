import { FC, RefObject } from 'react';
import s from './MessageEditor.module.scss';
import Textarea from './Textarea/Textarea';
import { ITextareas } from '../MainPage';

// Интефрейс для пропсов
interface IMessageEditor {
  textareas: ITextareas; // Объект, содержащий информацию о текстовых областях
  setSelectedId: (id: number) => void; // Функция для установки выбранного идентификатора
  setRef: (ref: RefObject<HTMLTextAreaElement>) => void; // Функция для установки ссылки на текстовую область
  setTextareas: React.Dispatch<React.SetStateAction<ITextareas>>; // Функция для установки состояния текстовых областей
  textareaRef: RefObject<HTMLTextAreaElement>;
}

// Удаление textareas, которые были убраны в процессе удаления условия
const MessageEditor: FC<IMessageEditor> = (props) => {
  const { textareas, setRef, setSelectedId, setTextareas, textareaRef } = props;

  const deleteNestedConditions = (obj: ITextareas, key: number, startKey: number = 0) => {
    const item = obj[key];
    // Получаем элемент по ключу из объекта textareas
    // Удаляем вложенные элементы для полей if, then, else, after
    if (item.if !== null) {
      deleteNestedConditions(obj, item.if);
    }
    if (item.then !== null) {
      deleteNestedConditions(obj, item.then);
    }
    if (item.else !== null) {
      deleteNestedConditions(obj, item.else);
    }
    if (key === startKey && obj[key].after !== null) {
      delete obj[obj[key].after as number];
    }

    // Удаляем текущий элемент

    if (key !== startKey) {
      delete obj[key];
    }
    setTextareas({ ...obj });
  };

  // Удаление условия
  const deleteCondition = (obj: ITextareas, key: number) => {
    // Ссылка на элемент textarea
    const textarea = textareaRef.current;
    // Сохранение позиции курсора
    const cursorPosition = textarea ? textarea.selectionStart : 0;

    // Создаем новый текст, объединяя текст текущего и следующего элемента
    const newText = textareas[key].text + textareas[textareas[key].after as number]?.text;
    // Получаем значения полей if, after, else, then следующего элемента
    const valueIf = textareas[textareas[key]?.after as number]?.if;
    const valueAfter = textareas[textareas[key]?.after as number]?.after;
    const valueElse = textareas[textareas[key]?.after as number]?.else;
    const valueThen = textareas[textareas[key]?.after as number]?.then;
    // Вызываем функцию для удаления вложенных условий
    deleteNestedConditions(obj, key, key);
    // Обновляем состояние textareas, удаляя текущее условие и объединяя тексты
    setTextareas({
      ...textareas,

      [key]: {
        text: newText,
        if: valueIf,
        after: valueAfter,
        else: valueElse,
        then: valueThen,
      },
    });

    // Восстановление фокуса и позиции курсора после обновления состояния
    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(cursorPosition, cursorPosition);
      }
    }, 0);
  };

  // Нахождение id условия
  const findCondition = (key: number) => {
    // Возвращаем id условия, соответствующего переданному ключу
    return Number(
      Object.keys(textareas).find((area: string) => textareas[Number(area)].if === key),
    );
  };

  // Создаем функцию processObject для рекурсивного создания компонентов условий
  function processObject(
    obj: ITextareas,
    key: number,
    margin: number,
    conditionText: 'IF' | 'ELSE' | 'THEN' | '',
  ) {
    // Получаем элемент по ключу из объекта textareas
    const item = obj[key];
    // Возвращаем JSX-элемент, представляющий условие и его вложенные элементы

    return (
      <div className={s.block}>
        {/* Проверяем, есть ли текст условия */}
        {conditionText ? (
          <>
            {/* Если есть, отображаем текст условия */}
            <div className={s.conditionText}>{conditionText}</div>
            {/* Если условие "IF", отображаем кнопку удаления */}
            {conditionText === 'IF' ? (
              <button
                onClick={() => deleteCondition(textareas, findCondition(key))}
                className={s.deleteBtn}>
                Delete
              </button>
            ) : null}
          </>
        ) : null}
        {/* Создаем блок текстовой области с заданным отступом */}
        <div key={key} className={s.textareaBlock} style={{ marginLeft: margin }}>
          {/* Создаем компонент Textarea */}
          <Textarea
            setSelectedId={setSelectedId}
            setRef={setRef}
            id={key}
            textareas={textareas}
            setTextareas={setTextareas}
          />
          {/* Рекурсивно обрабатываем вложенные элементы "IF" */}
          {item.if && obj[item.if] && processObject(obj, item.if, 15, 'IF')}
          {/* Рекурсивно обрабатываем вложенные элементы "THEN" */}
          {item.then && obj[item.then] && processObject(obj, item.then, 15, 'THEN')}
          {item.else && obj[item.else] && processObject(obj, item.else, 15, 'ELSE')}
          {item.after && obj[item.after] && processObject(obj, item.after, 0, '')}
        </div>
      </div>
    );
  }
  // Возвращаем обернутый в блок элемент, созданный с помощью функции processObject
  return <div className={s.wrapper}>{processObject(textareas, 1, 0, '')}</div>;
};

export default MessageEditor;
