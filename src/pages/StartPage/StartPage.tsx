import { useState } from 'react'
import MainPage from '../MainPage/MainPage'
import s from './StartPage.module.scss'

const StartPage = () => {
	const [isStartPage, setIsStartPage] = useState(true) // Стартовая страница



	return isStartPage ? (
		<div className={s.wrapper}>
			<button onClick={() => setIsStartPage(false)} className={s.button}>Message Editor</button>
		</div>
	) : (
		<MainPage setIsStartPage={setIsStartPage} /> // Основная страница
	)
}

export default StartPage
