import React from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';

import Header from './Header';
import Main from './Main';
import ImagePopup from './ImagePopup';
import EditAvatarPopup from './EditAvatarPopup';
import EditProfilePopup from './EditProfilePopup';
import AddPlacePopup from './AddPlacePopup';
import InfoTooltip from './InfoTooltip';

import Login from './Login';
import Register from './Register';

import api from '../utils/api';
import * as auth from '../utils/auth';

import { CurrentUserContext } from '../contexts/CurrentUserContext';
import ProtectedRoute from './ProtectedRoute';

import successImage from '../images/success.svg';
import failImage from '../images/fail.svg';

function App() {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);

    const [currentUser, setCurrentUser] = React.useState({});
    const [email, setEmail] = React.useState('');

    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);

    const [isInfoPopupOpen, setIsInfoPopupOpen] = React.useState(false);
    const [infoPopupStatus, setInfoPopupStatus] = React.useState({ path: '', text: '' })

    const [selectedCard, setSelectedCard] = React.useState({ name: '', link: '' });
    const [cards, setCards] = React.useState([]);

    const history = useHistory();


    React.useEffect(() => {
        api.getUserData()
            .then((data) => {
                setCurrentUser(data);
            })
            .catch((err) => console.log(err));
    }, [])

    React.useEffect(() => {
        api.getInitialCards()
            .then((cards) => {
                setCards(cards);
            })
            .catch((err) => {
                console.log(err);
            })

    }, [])

    React.useEffect(() => {
        const jwt = localStorage.getItem('jwt');
        if (jwt) {
            auth.getContent(jwt).then((res) => {
                if(res) {
                setIsLoggedIn(true);
                setEmail(res.email);
                history.push('/');
            }
                })
                .catch(err => console.log(err))
        }
    }, [isLoggedIn, history])


    // <---------- Registration & Auth ---------->

    function registration(email, password) {
        auth.register(email, password)
            .then((response) => {
                if (response.ok) {
                    changeInfoPopup({
                        path: successImage,
                        text: 'Вы успешно зарегистрировались!',
                    })
                    handleInfoPopupOpen();
                    setTimeout(history.push, 3000, "/sign-in");
                    setTimeout(closeAllPopups, 4000)

                    return response.json();
                }
            })
            .catch((err) => {
                changeInfoPopup({
                    path: failImage,
                    text: 'Что-то пошло не так! Попробуйте ещё раз.',
                })
                handleInfoPopupOpen();
                setTimeout(closeAllPopups, 4000);
                console.log(err);
            })
    }

    function authorization(email, password) {
        auth.authorize(email, password)
            .then((data) => {
                auth.getContent(data).then((res)=> {
                    setEmail(res.data.email)
                }).catch(err => console.log(err))
                    setIsLoggedIn(true);
                    history.push('/');
                }
            )
    }

    function signOut() {
        localStorage.removeItem('jwt');
        history.push('/sign-in');
    }

    // <---------- Open & Close ---------->

    function changeInfoPopup({ path, text }) {
        setInfoPopupStatus({
            path: path,
            text: text,
        })
    }

    function handleInfoPopupOpen() {
        setIsInfoPopupOpen(true);
    }

    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true);
    }

    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true);
    }

    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true);
    }

    function closeAllPopups() {
        setIsEditAvatarPopupOpen(false);
        setIsEditProfilePopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setIsInfoPopupOpen(false);

        setSelectedCard({ name: '', link: '' });
    }


    // <---------- Update User & Avatar ---------->

    function handleUpdateUser({ name, about }) {
        api.editProfile(name, about)
            .then((data) => {
                setCurrentUser(data);
                setIsEditProfilePopupOpen(false);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function handleUpdateAvatar({ avatar }) {
        api.changeAvatar(avatar)
            .then((data) => {
                setCurrentUser(data);
                setIsEditAvatarPopupOpen(false);
            })
            .catch((err) => console.log(err));
    }


    // <---------- PhotoCards Actions ---------->

    function handleAddPlaceSubmit(card) {
        api.addCard(card.name, card.link)
            .then((newCard) => {
                setCards([newCard, ...cards]);
                setIsAddPlacePopupOpen(false);
            })
            .catch((err) => console.log(err));
    }

    function handleCardLike(card) {
        const isLiked = card.likes.some(i => i._id === currentUser._id);
        const changeLike = isLiked ? api.deleteLike(card._id) : api.setLike(card._id)

        changeLike.then((newCard) => {
            setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        })
            .catch((err) => console.log(err));
    }

    function handleCardDelete(card) {
        api.deleteCard(card._id)
            .then(() => {
                const newCard = cards.filter((c) => c._id !== card._id);
                setCards(newCard);
            })
            .catch((err) => console.log(err));
    }

    function handleCardClick(selectedCard) {
        setSelectedCard({ name: selectedCard.name, link: selectedCard.link });
    }


    return (
        <CurrentUserContext.Provider value={currentUser}>
            <div className="root">
                <Header
                    email={email}

                    signOut={signOut}
                />

                <Switch>

                    <ProtectedRoute
                        exact path="/"
                        isLoggedIn={isLoggedIn}
                        component={Main}

                        onEditAvatar={handleEditAvatarClick}
                        onEditProfile={handleEditProfileClick}
                        onAddPlace={handleAddPlaceClick}

                        onCardClick={handleCardClick}
                        onCardLike={handleCardLike}
                        onCardDelete={handleCardDelete}

                        cards={cards}
                    />

                    <Route path="/sign-in">
                        <Login authorization={authorization} />
                    </Route>

                    <Route path="/sign-up">
                        <Register registration={registration} />
                    </Route>

                    <Route path="/">
                        {
                            isLoggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />
                        }
                    </Route>
                </Switch>

                <EditAvatarPopup
                    isOpen={isEditAvatarPopupOpen}
                    onClose={closeAllPopups}

                    onUpdateAvatar={handleUpdateAvatar}
                />

                <EditProfilePopup
                    isOpen={isEditProfilePopupOpen}
                    onClose={closeAllPopups}

                    onUpdateUser={handleUpdateUser}
                />

                <AddPlacePopup
                    isOpen={isAddPlacePopupOpen}
                    onClose={closeAllPopups}

                    onAddPlace={handleAddPlaceSubmit}
                />

                <ImagePopup
                    card={selectedCard}
                    onClose={closeAllPopups}
                />

                <InfoTooltip
                    isOpen={isInfoPopupOpen}
                    onClose={closeAllPopups}

                    infoPopupStatus={infoPopupStatus}
                />

            </div>
        </CurrentUserContext.Provider>
    );
}

export default App;
