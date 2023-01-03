import './comicsList.scss';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useMarvelServices from '../../services/MarvelServices';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

const setContent = (process, Component, newItemLoading) => {
    switch (process) {
        case "waiting":
            return <Spinner />;
            break;
        case "loading":
            return newItemLoading ? <Component /> : <Spinner />;
            break;
        case "confirmed":
            return <Component />
            break;
        case "error":
            <ErrorMessage />
            break;
        default:
            throw new Error("Unexpected process state");
    }
}

const ComicsList = () => {
    const [comicsList, setComicsList] = useState([]);
    const [newComicsLoading, setNewComicsLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [comicsEnded, setComicsEnded] = useState(false);

    const { loading, error, getAllComics, process, setProcess } = useMarvelServices();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewComicsLoading(false) : setNewComicsLoading(true);

        getAllComics(offset)
            .then(onComicsListLoaded)
            .then(() => setProcess("confirmed"))
    }

    const onComicsListLoaded = (newCharList) => {
        const ended = false;
        if (newCharList.length < 8) {
            ended = true
        }

        setComicsList([...comicsList, ...newCharList]);
        setNewComicsLoading(newComicsLoading => false);
        setOffset(offset => offset + 9);
        setComicsEnded(comicsEnded => ended);
        console.log(newCharList);
    }



    function renderComics(arr) {
        const items = arr.map((item, i) => {
            let imgStyle = { 'objectFit': 'cover' };
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = { 'objectFit': 'unset' };
            }

            return (
                <li className="comics__item"
                    tabIndex={0}
                    key={i}>
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img" />
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            )
        })

        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }


    return (
        <div className="comics__list">
            {setContent(process, () => renderComics(comicsList), newComicsLoading)}
            <button className="button button__main button__long"
                disabled={newComicsLoading}
                style={{ 'display': comicsEnded ? 'none' : 'block' }}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;