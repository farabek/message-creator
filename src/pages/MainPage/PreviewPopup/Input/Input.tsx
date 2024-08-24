import { FC } from 'react';
import s from './Input.module.scss';
import { ObjectVarType } from '../PreviewPopup';

interface IInput {
  title: string;
  setObjectVar: React.Dispatch<React.SetStateAction<ObjectVarType>>;
}

const Input: FC<IInput> = (props) => {
  const { title, setObjectVar } = props;

  const setValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setObjectVar((objectVar) => ({
      ...objectVar,
      [title]: value,
    }));
  };

  return (
    <div className={s.wrapper}>
      <div>{title}</div>
      <input className={s.input} onChange={(e) => setValue(e)} />
    </div>
  );
};

export default Input;
