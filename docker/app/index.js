require('dotenv').config();
const express = require('express');

// Databases
require('./db/sequelize');

const app = express();

const { user: UserModel } = require('./db/sequelize');

app.route('/').get(async (req, res) => {
	try {
		const users = await UserModel.findAll({ logging: console.log });
		res.send(users);
	} catch (e) {
		console.log(`Error here`);
		throw e;
	}
});

const port = process.env.NODEJS_LOCAL_PORT || 3001;
app.listen(port, () => {
	console.log(`Worker: process ${process.pid} is up on port ${port}`);
	console.log(`Done`);
});
