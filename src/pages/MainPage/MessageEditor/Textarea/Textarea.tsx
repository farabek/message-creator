/* eslint-disable react-hooks/exhaustive-deps */

import { ChangeEvent, FC, useEffect, useRef } from 'react';
import { ITextareas } from '../../MainPage';

// Интерфейс для пропсов
interface ITextarea {
  id: number;
  textareas: ITextareas;
  setTextareas: (textareas: ITextareas) => void;
  setRef: (ref: any) => void;
  setSelectedId: (id: number) => void;
}

const Textarea: FC<ITextarea> = (props) => {
  const { id, textareas, setTextareas, setRef, setSelectedId } = props;

  const textareaRef = useRef<HTMLTextAreaElement>(null); // Ссылка на textarea

  // Автоматическое изменение высоты textarea при написании текста
  const autoResize = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 2 + 'px';
  };

  // Двухстороннее связывание
  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    autoResize(e);
    setTextareas({
      ...textareas,
      [id]: { ...textareas[id], text: e.target.value },
    });
  };

  // Необходимо, чтобы изменялась высота textarea при загрузке страницы, если условие берется из localStorage
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 2 + 'px';
    }
  }, [textareas[id].text]);

  return (
    <>
      <textarea
        onFocus={() => {
          setRef(textareaRef);
          setSelectedId(id);
        }}
        ref={textareaRef}
        value={textareas[id].text}
        onChange={(e) => onChange(e)}
        rows={1}></textarea>
    </>
  );
};

export default Textarea;
