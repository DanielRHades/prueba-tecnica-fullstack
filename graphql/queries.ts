import { gql } from "@apollo/client";

export const GET_TRANSACTIONS = gql`
	query Transactions {
		transactions {
			id
			amount
			concept
			type
			date
            userId
	}
}
`;

export const GET_USERS = gql`
	query Users {
		users {
			id
			name
			email
			phone
		}
	}
`;
