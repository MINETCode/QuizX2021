/* 
	this script is for adding users to the database automatically from the google sheet 
	with all registrations. don't register 200 teams manually.

	you can't run this directly, make sure you prepare all the needed values correctly. 
	you should know what you're doing or the app will crash. fill up the right fields
	according to the user schema.
*/

const { GoogleSpreadsheet } = require('google-spreadsheet')
const User = require('./models/user')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
require('dotenv').config() 

mongoose.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log('MongoDB Connected'))
	.catch((err) => console.log(err))

// spreadsheet key is the long id in the google sheets URL
const usersheet = new GoogleSpreadsheet(process.env.USER_SPREADSHEET)

async function regusers() {
	await usersheet.useServiceAccountAuth(require('./client_secret.json'))
	await usersheet.loadInfo()
	// the first sheet (should use `key` instead of index value ideally)
	const sheet = await usersheet.sheetsByIndex[0]
	const rows = await sheet.getRows()

	var leg = rows.length - 1

	var i
	for (i = 1; i < leg + 1; i++) {
		async function createUser(team, username, p1, p2, p3, password, email) {
			bcrypt.genSalt(10, async (err, salt) => {
				if (err) {
					console.log(err)
				}

				bcrypt.hash(password, salt, (err, hash) => {
					if (err) {
						console.log(err)
					}

					var userData = {
						teamName: team,
						username: username,
						team: {
							p1,
							p2,
							p3,
						},
						password: hash,
						email: email,
					}

					User.create(userData, (error, log) => {
						if (error) {
							return next(error)
						} else {
							console.log('user created.')
						}
					})
				})
			})
		}

		// console.log(rows[i].username + rows[i].password)
		await createUser(
			rows[i].team,
			rows[i].username,
			rows[i].p1name,
			rows[i].p2name,
			rows[i].p3name,
			rows[i].password,
			rows[i].email
		)
	}
}

regusers()
