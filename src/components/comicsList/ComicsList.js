import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage'
import './comicsList.scss';


const setContent = (process, Component, newItemLoading) => {
    switch (process) {
        case 'waiting':
            return <Spinner />;
            break;
        case 'loading':
            return newItemLoading ? <Component /> : <Spinner />
            break;
        case 'confirmed':
            return <Component />
            break;
        case 'error':
            return <ErrorMessage />
            break
        default:
            throw new Error('Unexpecting data')

    }

}

const ComicsList = () => {

    const [comicsList, setComicsList] = useState([])
    const [newItemLoading, setNewItemLoading] = useState(false)
    const [offset, setOffset] = useState(0)
    const [comicsEnded, setcomicsEnded] = useState(false)

    const { getAllComics, process, setProcess } = useMarvelService()

    useEffect(() => {
        onRequest(offset, true)
    }, [])


    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true)
        getAllComics(offset)
            .then(onComicsLoaded)
            .then(() => setProcess('confirmed'))
    }

    const onComicsLoaded = (newComics) => {
        let ended = false;
        if (newComics < 8) {
            ended = true
        }

        setComicsList(comicsList => [...comicsList, ...newComics])
        setNewItemLoading(newItemLoading => false)
        setOffset(offset => offset + 8)
        setcomicsEnded(comicsEnded => ended)

    }

    function renderComics(arr) {
        const items = arr.map((item, id) => {
            let imgStyle = { objectFit: 'cover' }
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = { objectFit: 'contain' }
            }

            return (
                <li className="comics__item" key={id}>
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt="ultimate war" className="comics__item-img" />
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li >
            )

        })
        return (
            <ul className="comics__grid" >
                {items}
            </ul>
        )
    }


    return (
        <div className="comics__list" >
            {setContent(process, () => renderComics(comicsList), newItemLoading)}
            <button className="button button__main button__long"
                disabled={newItemLoading}
                style={{ 'display': comicsEnded ? 'none' : 'block' }}
                onClick={() => { onRequest(offset) }}
            >
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;