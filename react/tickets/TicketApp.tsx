import React from 'react'
import { TicketTable } from './components/TicketTable';
import { PrimeReactProvider } from 'primereact/api';

export const TicketApp = () => {
    return (
        <PrimeReactProvider>
            <TicketTable />
        </PrimeReactProvider>
    )
}
