import React, { useState } from 'react'
import UserFormModal from '../users/UserFormModal'

interface Props {
    show: boolean
    onHide: () => void
    title: string
    children: React.ReactNode
}

const Modals: React.FC<Props> = ({ show, onHide, title, children }) => {

    const [showUserFormModal, setShowUserFormModal] = useState(false)
    const handleUserFormSubmit = () => { }

    return (
        <UserFormModal show={showUserFormModal} handleSubmit={handleUserFormSubmit}></UserFormModal>
    )
}

export default Modals
