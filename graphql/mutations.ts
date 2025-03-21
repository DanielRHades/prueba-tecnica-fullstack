import { gql } from "@apollo/client";

{/*Mutación encargada de Actualizar unicamente el Nombre (name) y Rol (role) del Usuario.*/ }
export const UPDATE_USER = gql`
	mutation UpdateUser($id: String!, $name: String, $role: Role) {
		updateUser(id: $id, name: $name, role: $role) {
			id
			name
			role
		}
	}
`;

export const CREATE_TRANSACTION = gql`
	mutation CreateTransaction($amount: Float!, $concept: String!, $type: TransactionType!, $date: DateTime!, $userId: String!) {
		createTransaction(amount: $amount, concept: $concept, type: $type, date: $date, userId: $userId) {
			id
			amount
			concept
			type
			date
			userId
		}
	}
`;
