import React from 'react';
import PopupWithForm from './PopupWithForm';

function AddPlacePopup({ isOpen, onClose, onAddPlace }) {
    const nameRef = React.useRef();
    const linkRef = React.useRef();

    function handleSubmit(evt) {
        evt.preventDefault();

        onAddPlace({
            name: nameRef.current.value,
            link: linkRef.current.value,
        });
    }

    return (
        <PopupWithForm
            name='photo'
            title='Новое место'
            buttonText='Создать'

            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
        >

            <input
                ref={nameRef}
                id="popup__input_type_title"
                className="popup__input popup__input_type_title" type="text" name="name"
                placeholder="Название"
                minLength="1"
                maxLength="30"
                required
            />
            <span id="popup__input_type_title-error" className="popup__error"></span>

            <input
                ref={linkRef}
                id="popup__input_type_image"
                className="popup__input popup__input_type_image"
                type="url" name="link"
                placeholder="Ссылка на картинку"
                required
            />
            <span id="popup__input_type_image-error" className="popup__error"></span>

        </PopupWithForm>
    )
}

export default AddPlacePopup;