import { FC, useLayoutEffect, useRef } from 'react';

// Интерфейс для пропсов
interface IPreviewTextarea {
  text: string;
}

const PreviewTextarea: FC<IPreviewTextarea> = (props) => {
  const { text } = props;

  const textareaRef = useRef<HTMLTextAreaElement>(null); // Ссылка на textarea

  // Изменение высоты textarea
  useLayoutEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 2 + 'px';
    }
  }, [text]);

  return <textarea readOnly ref={textareaRef} value={text}></textarea>;
};

export default PreviewTextarea;
