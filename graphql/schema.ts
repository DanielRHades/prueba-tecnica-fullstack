export const typeDefs = `#graphql 
  scalar DateTime

  type Transaction {
    id: Int!
    amount: Float!
    concept: String!
    type: TypeTransaction!
    date: DateTime!
    user: User!
    userId: Int!
  }
  
  enum TypeTransaction {
    INGRESO
    EGRESO
  }

  type User {
    id: Int!
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
    updateUser(id: Int!, name: String, role: Role): User
    createTransaction(amount: Float!, concept: String!, type: TypeTransaction!, date: DateTime!): Transaction!
  }
`;