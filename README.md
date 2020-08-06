# Exercise Tracker REST API

#### A microservice project, part of Free Code Camp's curriculum

### User Stories

[![Run on Repl.it](https://repl.it/badge/github/freeCodeCamp/boilerplate-project-exercisetracker)](https://repl.it/github/freeCodeCamp/boilerplate-project-exercisetracker)

1. Create a new user by posting form data username to /api/exercise/new-user and returned will be an object with username and _id.

2. Get an array of all users by getting api/exercise/users with the same info as when creating a user.

3. Add an exercise to any user by posting form data userId(_id), description, duration, and optionally date to /api/exercise/add. If no date supplied it will use current date. Returned will be the user object with also with the exercise fields added.

4. Retrieve a full exercise log of any user by getting /api/exercise/log with a parameter of userId(_id). Return will be the user object with added array log and count (total exercise count).

5. Can also retrieve part of the log of any user by also passing along optional parameters of from & to or limit. For example:
`GET /api/exercise/log?{userId}[&from][&to][&limit]`
{ } = required, [ ] = optional. from, to = dates (yyyy-mm-dd); limit = number
