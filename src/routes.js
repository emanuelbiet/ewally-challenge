const { Router } = require('express');

const router = Router();
const usersForTest = require('./__tests__/mock/user_data');

/* istanbul ignore next */
let users = process.env.NODE_ENV === 'test' ? usersForTest : [];

router.post('/person', (req, res) => {
  const { cpf, name } = req.body;

  if(cpf.length !== 11) {
    return res.sendStatus(400);
  } 

  const userAlreadyExists = users.find(user => user.cpf === cpf);
  
  if(userAlreadyExists) {
    return res.sendStatus(400);
  }

  users.push({ cpf, name, relationships: [] });

  return res.sendStatus(200);
});

router.get('/person/:CPF', (req, res) => {
  const { CPF } = req.params;

  const user = users.find(user => user.cpf === CPF);

  if(!user) {
    return res.sendStatus(404);
  };

  return res.json({ cpf: user.cpf, name: user.name });
});

router.delete('/clean', (req, res) => {
  users = [];
  res.sendStatus(200);
});

router.post('/relationship', (req, res) => {
  const { cpf1, cpf2 } = req.body;

  const userCpf1Exists = users.find(user => user.cpf === cpf1);
  const userCpf2Exists = users.find(user => user.cpf === cpf2);

  if(!userCpf1Exists || !userCpf2Exists) {
    return res.sendStatus(404);
  }

  const relationshipAlreadyExists = userCpf1Exists.relationships.find(relationship => relationship === cpf2);

  // Not requested but I thought that was an important validation
  if(relationshipAlreadyExists) {
    return res.status(400).json({ error: "Relationship already exists"});
  }

  users = users.map(user => {
    if(user.cpf === cpf1) {
      return {
        ...user,
        relationships: [...user.relationships, cpf2]
      }
    }

    if(user.cpf === cpf2) {
      return {
        ...user,
        relationships: [...user.relationships, cpf1]
      }
    }

    return user;
  })

  return res.sendStatus(200);
});

router.get('/recommendations/:CPF', (req, res) => {
  const { CPF } = req.params;

  if(CPF.length !== 11) {
    res.sendStatus(400);
  }

  const userExists = users.find(user => user.cpf === CPF);

  if(!userExists) {
    return res.sendStatus(404);
  }

  let friendsOfCurrentUser = [];

  for(let i = 0; i < userExists.relationships.length; i++) {
    const user = users.find(user => user.cpf === userExists.relationships[i]);

    friendsOfCurrentUser.push(...user.relationships);
  }
  
  const onlyFriendsOfFriends = friendsOfCurrentUser.filter(friend => friend !== CPF);
  
  const map = new Map();

  onlyFriendsOfFriends.forEach(friend => {
    map.set(friend, onlyFriendsOfFriends.filter(f => f === friend).length)
  });

  const mapDesc = new Map([...map.entries()].sort((a, b) => {
    return b[1] - a[1]
  }));

  const mapValues = [...mapDesc.keys()]

  return res.json(mapValues);
});

module.exports = router;
