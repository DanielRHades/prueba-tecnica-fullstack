import { gql } from "@apollo/client";

export const CREATE_TRANSACTION = gql`
	mutation createTransaction($amount: Float!, $concept: String!, $type: TypeTransaction!, $date: DateTime!) {
		createTransaction(amount: $amount, concept: $concept, type: $type, date: $date) {
			id
			amount
			concept
			type
			date
            userId
		}
	}
`;

export const UPDATE_USER = gql`
	mutation updateUser($id: Int!, $name: String, $role: Role) {
		updateUser(id: $id, name: $name, role: $role) {
			id
			name
			role
		}
	}
`;
