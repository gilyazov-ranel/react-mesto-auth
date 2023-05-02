
import '../index.css';
import { useEffect, useState } from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { api } from '../utils/Api';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import DeleteCardPopup from './DeleteCardPopup';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute.js';
import InfoTooltip from './InfoTooltip';
import successUnion from '../image/success_union.svg';
import failUnion from '../image/fail_union.svg';
import * as Auth from '../utils/Auth.js';

function App() {

    const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
    const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
    const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
    const [isDeleteCardPopup, setDeleteCardPopup] = useState(false);
    const [isFormResult, setFormResult] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);

    const [selectedCard, setSelectedCard] = useState({});
    const [currentUser, setCurrentUser] = useState({});
    const [cards, setCards] = useState([]);
    const [card, setCard] = useState({});
    const [userEmael, setUserEmail] = useState('');
    const [popupTitle, setPopupTitle] = useState('');
    const [union, setUnion] = useState('')

    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            api.getCurrentUser().then(items => {
                setCurrentUser(items)
            }).catch((err) => {
                console.log(err);
            });
            api.getCard().then(card => {
                setCards(card);
            }).catch((err) => {
                console.log(err);
            });
        }

    }, [token]);

    useEffect(() => {
        handleTokenCheck();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        document.addEventListener('keydown', onKeydown)
        return () => document.removeEventListener('keydown', onKeydown)
    });

    function onKeydown({ key }) {
        switch (key) {
            case 'Escape':
                closeAllPopups()
                break;
            // no default
        }
    };

    function handleCardClick(card) {
        setSelectedCard(card);
    };

    function handleSelectedCard(card) {
        setCard(card);
    };

    function closeAllPopups() {
        setEditAvatarPopupOpen(false);
        setEditProfilePopupOpen(false);
        setAddPlacePopupOpen(false);
        setDeleteCardPopup(false);
        setFormResult(false);
        setSelectedCard({});
    };

    function handleEditAvatarClick() {
        setEditAvatarPopupOpen(true);
    };

    function handleEditProfileClick() {
        setEditProfilePopupOpen(true);
    };

    function handleAddPlaceClick() {
        setAddPlacePopupOpen(true);
    };

    function handleDeleteCardClick() {
        setDeleteCardPopup(true)
    };

    function handleLogin() {
        setLoggedIn(true)
    };

    function handleCardLike(card) {

        const isLiked = card.likes.some(i => i._id === currentUser._id);

        api.changeLikeCardStatus(card._id, !isLiked)
            .then((newCard) => {
                setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
            })
            .catch((err) => {
                console.log(err);
            })
    };

    function handleCardDelete(card) {
        api.deleteCard(card._id)
            .then(() => {
                setCards(cards.filter(item => card._id !== item._id));
                setDeleteCardPopup(false);
            })
            .catch((err) => {
                console.log(err);
            })
    };

    function handleErrorPopup() {
        setFormResult(true);
        setPopupTitle('Что-то пошло не так! Попробуйте ещё раз.');
        setUnion(failUnion);
    };

    function handleSuccessPopop() {
        setFormResult(true);
        navigate('/sign-in', { replace: true });
        setPopupTitle('Вы успешно зарегистрировались!');
        setUnion(successUnion);
    };


    function handleUpdateUser(items) {
        api.editProfiles(items)
            .then(item => {
                setCurrentUser(item);
                setEditProfilePopupOpen(false);
            })
            .catch((err) => {
                console.log(err);
            })
    };

    function handleUpdateAvatar(items) {
        api.instalAvatar(items)
            .then(item => {
                setCurrentUser(item);
                setEditAvatarPopupOpen(false);
            })
            .catch((err) => {
                console.log(err);
            })
    };

    function handleAddPlaceSubmit(card) {
        api.createCard(card)
            .then(newCard => {
                setCards([newCard, ...cards]);
                setAddPlacePopupOpen(false);

            })
            .catch((err) => {
                console.log(err);
            })
    };

    function handleRegister(form) {
        Auth.register(form).then((form) => {
            if (form) {
                handleSuccessPopop();
            }
        })
            .catch((err) => {
                console.log(err);
                handleErrorPopup();
            })
    };

    function handleLoginUser(form) {
        Auth.authorize(form)
            .then((data) => {
                if (data) {
                    setUserEmail(form.email);
                    handleLogin();
                    navigate('/', { replace: true });
                }
            })
            .catch((err) => {
                console.log(err);
                handleErrorPopup();
            })
    };

    function handleTokenCheck() {
        if (token) {
            Auth.checkToken(token).then((res) => {
                if (res) {
                    setUserEmail(res.data.email);
                    handleLogin();
                    navigate('/', { replace: true });
                }
            })
                .catch(err => console.log(err));
        }
    }

    function handleSignOut() {
        localStorage.removeItem('token');
        navigate('/sign-in');
    }

    function handleTransitionRegister() {
        navigate('/sign-in');
    }

    function handleTransitionLogin() {
        navigate('/sign-up');
    }

    return (
        <CurrentUserContext.Provider value={currentUser} >
            <Routes>

                <Route path='/' element={<ProtectedRoute loggedIn={loggedIn}>
                    <Header
                        pageTitle='Выйти'
                        name={userEmael}
                        onSignOut={handleSignOut} />
                    <Main onEditProfile={handleEditProfileClick}
                        onAddPlace={handleAddPlaceClick}
                        onEditAvatar={handleEditAvatarClick}
                        onSelectedCard={handleCardClick}
                        onOpenDeleteCard={handleDeleteCardClick}
                        cards={cards}
                        onCardLike={handleCardLike}
                        onSelectedCardToDelete={handleSelectedCard} />
                    <Footer />
                </ProtectedRoute>
                } />

                <Route path="*" element={loggedIn ? <Navigate to='/' replace /> : <Navigate to='/sign-in' replace />} />
                <Route path='/sign-up' element={<Register onRegister={handleRegister} onSignOut={handleTransitionRegister} />} />
                <Route path='/sign-in' element={<Login onLogin={handleLoginUser} onSignOut={handleTransitionLogin} />} />

            </Routes>
            <EditProfilePopup isOpen={isEditProfilePopupOpen}
                onClose={closeAllPopups}
                onUpdateUser={handleUpdateUser} />

            <AddPlacePopup
                isOpen={isAddPlacePopupOpen}
                onClose={closeAllPopups}
                onAddPlace={handleAddPlaceSubmit} />

            <DeleteCardPopup
                isOpen={isDeleteCardPopup}
                onClose={closeAllPopups}
                onCardDelete={handleCardDelete}
                card={card} />

            <EditAvatarPopup isOpen={isEditAvatarPopupOpen}
                onClose={closeAllPopups}
                onUpdateAvatar={handleUpdateAvatar}
            />

            <ImagePopup
                card={selectedCard}
                onClose={closeAllPopups} />

            <InfoTooltip
                imageUnion={union}
                title={popupTitle}
                isOpen={isFormResult}
                onClose={closeAllPopups} />

        </CurrentUserContext.Provider>
    );
}

export default App;
