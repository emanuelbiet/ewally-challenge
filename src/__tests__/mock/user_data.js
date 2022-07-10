let users = [
  {
    "cpf": "1234567890A",
    "name": "A",
    "relationships": ["1234567890B", "1234567890C"]
  },
  {
    "cpf": "1234567890B",
    "name": "B",
    "relationships": ["1234567890A", "1111111111D"]
  },
  {
    "cpf": "1234567890C",
    "name": "C",
    "relationships": ["1234567890A", "1111111111D", "2222222222E"]
  },
  {
    "cpf": "1111111111D",
    "name": "D",
    "relationships": ["1234567890B", "1234567890C"]
  },
  {
    "cpf": "2222222222E",
    "name": "E",
    "relationships": ["1234567890C"]
  },
];

module.exports = users;
