export const typeDefs = `#graphql 
  scalar DateTime

  type Transaction {
    id: String!
    amount: Float!
    concept: String!
    type: TransactionType!
    date: DateTime!
    user: User!
    userId: String!
  }
  
  enum TransactionType {
    INCOME
    EXPENSE
  }

  type User {
    id: String!
    name: String!
    email: String!
    phone: String
    role: Role!
    transactions: [Transaction!]
  }

  enum Role {
    ADMIN
    USER
  }

  type Query {
    transactions: [Transaction!]!
    users: [User!]!
  }

  type Mutation {
    updateUser(id: String!, name: String, role: Role): User
    createTransaction(amount: Float!, concept: String!, type: TransactionType!, date: DateTime!, userId: String!): Transaction!
  }
`;