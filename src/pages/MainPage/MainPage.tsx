import React, { FC, RefObject, useEffect, useState } from 'react';
import s from './MainPage.module.scss';
import MessageEditor from './MessageEditor/MessageEditor';
import PreviewPopup from './PreviewPopup/PreviewPopup';

// Присвоение массива переменных, от заполнения которых зависит сообщение
const arrVarNames = localStorage.getItem('arrVarNames')
  ? JSON.parse(localStorage.getItem('arrVarNames') as string)
  : ['firstname', 'lastname', 'company', 'position'];

// Интерфейс для пропсов страницы
interface IMainPage {
  setIsStartPage: React.Dispatch<React.SetStateAction<boolean>>;
}

export type ITextareas = Record<number, OneTextarea>; // Тип для объекта textareas

export interface OneTextarea {
  text: string;
  if: null | number;
  then: null | number;
  else: null | number;
  after: null | number;
} // Интерфейс для одной textarea

const MainPage: FC<IMainPage> = (props) => {
  const { setIsStartPage } = props; // Деструктуризируем пропсы

  const [isPreview, SetIsPreview] = useState<boolean>(false); // Показывать ли попап превью
  const [selectedId, setSelectedId] = useState(1); // Id сфокусированной textarea
  const [ref, setRef] = useState<RefObject<HTMLTextAreaElement>>(React.createRef()); //Ссылка на выделенную textarea
  const [textareas, setTextareas] = useState<ITextareas>({
    1: {
      text: '',
      if: null,
      then: null,
      else: null,
      after: null,
    },
  }); // Все textareas с зависимостями

  // При загрузке страницы берется сохраненный шаблон, если такой есть
  useEffect(() => {
    localStorage.getItem('template') &&
      setTextareas(JSON.parse(localStorage.getItem('template') as string));
  }, []);

  // Открывает popup, при нажатии на кнопку
  const openPreview = () => {
    SetIsPreview(true);
  };

  // Сохраняет шаблон в localStorage
  const save = () => {
    localStorage.setItem('template', JSON.stringify(textareas));
  };
  //  функция, которая вставляет слово в текущую текстовую область на позицию курсора.
  const insertWordAtCursor = (word: string) => {
    const textarea = ref?.current;
    if (!textarea) {
      setTextareas({
        ...textareas,
        1: { ...textareas[1], text: word + textareas[1].text },
      });
      return;
    }
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const currentValue = textareas[selectedId].text;
    const newValue = currentValue.substring(0, startPos) + word + currentValue.substring(endPos);
    setTextareas({
      ...textareas,
      [selectedId]: { ...textareas[selectedId], text: newValue },
    });

    // Перемещаем курсор после вставленной переменной
    const newCursorPosition = startPos + word.length;
    setTimeout(() => {
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      textarea.focus();
    }, 0);
  };

  // Добавляет подвиджет [IF-THEN-ELSE] в шаблон (работает по принципу создания новых textarea (с id), добавляются ссылки на id условия)
  // Id создается на позицию выше от самого большого.
  const addCondition = (selectedID: number) => {
    // Находим максимальный ID в объекте textareas
    const maxValueInObject = Number(
      Object.keys(textareas).sort((a: string, b: string) => Number(a) - Number(b))[
        Object.keys(textareas).length - 1
      ],
    );
    // Генерируем новые ID для различных условий
    const newIdIf = maxValueInObject + 1;
    const newIdThen = maxValueInObject + 2;
    const newIdElse = maxValueInObject + 3;
    const newIdAfter = maxValueInObject + 4;

    // Если выбранный ID не существует, устанавливаем его в 1
    if (!textareas[selectedID]) {
      selectedID = 1;
    }

    // Шаблон для пустой текстовой области
    const voidTextarea = {
      text: '',
      after: null,
      else: null,
      if: null,
      then: null,
    };

    // Ссылка на элемент textarea
    const textarea = ref?.current;
    if (!textarea) {
      // Если textarea не существует, обрабатываем соответствующим образом
      if (!textareas[textareas[selectedID]?.after as number]) {
        // Если после выбранного ID нет textarea, создаем новые textarea
        setTextareas({
          ...textareas,
          [selectedID]: {
            text: '',
            after: newIdAfter,
            if: newIdIf,
            then: newIdThen,
            else: newIdElse,
          },
          [newIdIf]: voidTextarea,
          [newIdThen]: voidTextarea,
          [newIdElse]: voidTextarea,
          [newIdAfter]: {
            text: textareas[selectedID].text,
            after: null,
            if: null,
            then: null,
            else: null,
          },
        });
      } else {
        // Рекурсивно вызываем addCondition для следующего textarea
        addCondition(textareas[selectedID].after as number);
      }
      return;
    }

    // Получаем позиции курсора в textarea
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const newTextMain = textareas[selectedID].text.substring(0, startPos);
    const newTextAfter = textareas[selectedID].text.substring(endPos);

    if (
      // Если после выбранного ID нет textarea и выбранный ID - текущий ID
      !textareas[textareas[selectedID].after as number] &&
      selectedID === selectedId
    ) {
      // Обновляем textareas новыми условиями
      setTextareas({
        ...textareas,
        [selectedID]: {
          text: newTextMain,
          after: newIdAfter,
          if: newIdIf,
          then: newIdThen,
          else: newIdElse,
        },
        [newIdIf]: voidTextarea,
        [newIdThen]: voidTextarea,
        [newIdElse]: voidTextarea,
        [newIdAfter]: {
          text: newTextAfter,
          after: null,
          else: null,
          if: null,
          then: null,
        },
      });
    } else if (selectedID === selectedId) {
      // Обновляем textareas существующими условиями и новыми
      setTextareas({
        ...textareas,
        [selectedID]: {
          ...textareas[selectedID],
          text: newTextMain,
        },
        [textareas[selectedID].if as number]: voidTextarea,
        [textareas[selectedID].then as number]: voidTextarea,
        [textareas[selectedID].else as number]: voidTextarea,
        [textareas[selectedID].after as number]: {
          text: newTextAfter,
          after: newIdAfter,
          if: newIdIf,
          else: newIdElse,
          then: newIdThen,
        },
        [newIdIf]: { ...textareas[textareas[selectedID].if as number] },
        [newIdThen]: { ...textareas[textareas[selectedID].then as number] },
        [newIdElse]: { ...textareas[textareas[selectedID].else as number] },
        [newIdAfter]: { ...textareas[textareas[selectedID].after as number] },
      });
      // Рекурсивно вызываем addCondition для следующего textarea
      addCondition(textareas[selectedID].after as number);
    }
    // Фокусируемся на textarea после обновления textareas
    textarea.focus();
  };

  return (
    <div className={s.wrapper}>
      <h1 className={s.title}>Message Template Editor</h1>
      <div className={s.variables}>
        {/* Вывод кнопок для вставки переменных */}
        {arrVarNames.map((arrVarName: string) => (
          <button
            key={arrVarName}
            onClick={() => insertWordAtCursor(`{${arrVarName}}`)}
            className={s.variable}>{`{${arrVarName}}`}</button>
        ))}
      </div>
      {/* Кнопка для добавления подвиджета [IF-THEN-ELSE] */}
      <button onClick={() => addCondition(selectedId)} className={s.if}>
        <span>IF</span> <span>THEN</span> <span>ELSE</span>
      </button>
      <MessageEditor
        textareas={textareas}
        setRef={setRef}
        setSelectedId={setSelectedId}
        setTextareas={setTextareas}
        textareaRef={ref}
      />
      <div className={s.buttons}>
        <button onClick={() => openPreview()} className={s.button}>
          Preview
        </button>
        <button onClick={() => save()} className={s.button}>
          Save
        </button>
        <button onClick={() => setIsStartPage(true)} className={s.button}>
          Close
        </button>
      </div>
      {isPreview && (
        <PreviewPopup textareas={textareas} arrVarNames={arrVarNames} setIsPreview={SetIsPreview} />
      )}
    </div>
  );
};

export default MainPage;
