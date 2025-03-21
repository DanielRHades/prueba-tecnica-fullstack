import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import Transactions from '../../pages/transactions';
import { GET_TRANSACTIONS, GET_USERS } from '../../graphql/queries';
import { CREATE_TRANSACTION } from '../../graphql/mutations';

jest.mock('../../components/DashboardLayout', () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="dashboard-layout">{children}</div>
    ),
}));

jest.mock('next/router', () => ({
    useRouter: jest.fn().mockReturnValue({
        pathname: '/transactions',
    }),
}));

const mockTransactions = [
    {
        id: '1',
        amount: 100,
        concept: 'Income 1',
        type: 'INCOME',
        date: '2023-01-01',
        userId: '1',
    },
    {
        id: '2',
        amount: 50,
        concept: 'Expense 1',
        type: 'EXPENSE',
        date: '2023-01-02',
        userId: '2',
    },
];

const mockUsers = [
    {
        id: '1',
        name: 'John Doe',
    },
    {
        id: '2',
        name: 'Jane Smith',
    },
];

const mocks = [
    {
        request: {
            query: GET_TRANSACTIONS,
        },
        result: {
            data: {
                transactions: mockTransactions,
            },
        },
    },
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
    {
        request: {
            query: CREATE_TRANSACTION,
            variables: {
                amount: 200,
                concept: 'New Income',
                type: 'INCOME',
                date: '2023-01-03',
                userId: '1',
            },
        },
        result: {
            data: {
                createTransaction: {
                    id: '3',
                    amount: 200,
                    concept: 'New Income',
                    type: 'INCOME',
                    date: '2023-01-03',
                    userId: '1',
                },
            },
        },
    },
];


describe('Transactions Page', () => {
    it('Debe renderizar la lista de transacciones', async () => {
        render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <Transactions />
            </MockedProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('Income 1')).toBeInTheDocument();
            expect(screen.getByText('Expense 1')).toBeInTheDocument();
        });
    });

    it('Debe mostrar un mensaje de "No se encontraron transacciones" si no hay transacciones', async () => {
        render(
            <MockedProvider
                mocks={[
                    {
                        request: {
                            query: GET_TRANSACTIONS,
                        },
                        result: {
                            data: {
                                transactions: [],
                            },
                        },
                    },
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
                ]}
                addTypename={false}
            >
                <Transactions />
            </MockedProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('No se encontraron transacciones.')).toBeInTheDocument();
        });
    });

    it('Debe mostrar un mensaje de error si la consulta de transacciones falla', async () => {
        render(
            <MockedProvider
                mocks={[
                    {
                        request: {
                            query: GET_TRANSACTIONS,
                        },
                        error: new Error('Network error'),
                    },
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
                ]}
                addTypename={false}
            >
                <Transactions />
            </MockedProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('Error al cargar transacciones: Network error')).toBeInTheDocument();
        });
    });
});