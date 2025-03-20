import { gql } from "@apollo/client";

export const UPDATE_USER = gql`
	mutation UpdateUser($id: Int!, $name: String, $role: Role) {
		updateUser(id: $id, name: $name, role: $role) {
			id
			name
			role
		}
	}
`;

export const CREATE_TRANSACTION = gql`
	mutation CreateTransaction($amount: Float!, $concept: String!, $type: TransactionType!, $date: DateTime!, $userId: Int!) {
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
