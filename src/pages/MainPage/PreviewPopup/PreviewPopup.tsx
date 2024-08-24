/* eslint-disable react-hooks/exhaustive-deps */

import { FC, MouseEvent, useEffect, useState } from 'react';
import s from './PreviewPopup.module.scss';
import PreviewTextarea from './PreviewTextarea';
import Input from './Input/Input';
import { ITextareas } from '../MainPage';
import { processText } from './ProcessText/ProcessText';

// Интерфейс для пропсов
interface IPreviewPopup {
  setIsPreview: React.Dispatch<React.SetStateAction<boolean>>;
  arrVarNames: string[];
  textareas: ITextareas;
}
export type ObjectVarType = Record<string, string>; // Интерфейс для объекта с переменными

const PreviewPopup: FC<IPreviewPopup> = (props) => {
  const { setIsPreview, arrVarNames, textareas } = props;

  const [previewText, setPreviewText] = useState<string>(''); // Текст в сообщении
  const [objectVar, setObjectVar] = useState<ObjectVarType>({}); // Объект c переменными + текстом в них

  // Закрытие popup при нажатии на кнопку + затемненную область
  const closePreview = (e: MouseEvent<HTMLDivElement> | MouseEvent<HTMLButtonElement>) => {
    e.target === e.currentTarget && setIsPreview(false);
  };

  // Присвоение переменных из массива объекту
  useEffect(() => {
    arrVarNames.forEach((varName: string) => {
      setObjectVar((objectVar) => ({
        ...objectVar,
        [varName]: '',
      }));
    });
  }, []);

  // Изменение текста при изменении значения переменных
  useEffect(() => {
    setPreviewText(processText(textareas, 1, arrVarNames, textareas, objectVar));
  }, [objectVar]);

  return (
    <div onClick={(e: MouseEvent<HTMLDivElement>) => closePreview(e)} className={s.wrapper}>
      <div className={s.popup}>
        <h2>Message Preview</h2>
        <div className={s.textareaWrapper}>
          <PreviewTextarea text={previewText} />
          <div className={s.inputs}>
            {arrVarNames.map((varName: string) => (
              <Input key={varName} title={varName} setObjectVar={setObjectVar} />
            ))}
          </div>
          <button onClick={(e: MouseEvent<HTMLButtonElement>) => closePreview(e)}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default PreviewPopup;
