import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import Users from '../../pages/users';
import { GET_USERS } from '../../graphql/queries';

// Mock DashboardLayout y next/router
jest.mock('../../components/DashboardLayout', () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="dashboard-layout">{children}</div>
    ),
}));

jest.mock('next/router', () => ({
    useRouter: jest.fn().mockReturnValue({
        pathname: '/users',
    }),
}));

const mockUsers = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '123-456-7890',
        role: 'USER',
    },
    {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '987-654-3210',
        role: 'ADMIN',
    },
];

const mocks = [
    {
        request: {
            query: GET_USERS,
        },
        result: {
            data: {
                users: mockUsers,
            },
        },
    },
];

describe('Users Page', () => {
    it('Debe renderizar la lista de usuarios', async () => {
        render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <Users />
            </MockedProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        });
    });

    it('Debe abrir el modal de edición al hacer clic en "Editar"', async () => {
        render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <Users />
            </MockedProvider>
        );

        await waitFor(() => {
            const editButton = screen.getAllByText('Editar')[0];
            fireEvent.click(editButton);
            expect(screen.getByText('Editar Usuario')).toBeInTheDocument();
        });
    });

    it('Debe mostrar un mensaje de "No se encontraron Usuarios" si no hay usuarios', async () => {
        render(
            <MockedProvider
                mocks={[
                    {
                        request: {
                            query: GET_USERS,
                        },
                        result: {
                            data: {
                                users: [],
                            },
                        },
                    },
                ]}
                addTypename={false}
            >
                <Users />
            </MockedProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('No se encontraron Usuarios.')).toBeInTheDocument();
        });
    });

    it('Debe mostrar un mensaje de error si la consulta falla', async () => {
        render(
            <MockedProvider
                mocks={[
                    {
                        request: {
                            query: GET_USERS,
                        },
                        error: new Error('Network error'),
                    },
                ]}
                addTypename={false}
            >
                <Users />
            </MockedProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('Oops, algo salio mal: Network error')).toBeInTheDocument();
        });
    });
});