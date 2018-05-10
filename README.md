# Settled Tech Test

The proposed product is a messaging and booking system between buyers and sellers.

## Stack

### Back-end

#### Serverless

An ideal architecture may be Serverless. Vendor-agnostic, this would abstract away any arbitrary client-server boilerplate. It is also generally cheaper to run server code 'per use' than to have permanent infrastructure. One design may be to separate the entities into services, which would isolate concerns across requests.

- Messaging, e.g. `/messages`
- User Operations, e.g. `/user`
- Bookings, e.g. `/bookings`

For the purposes of this prototype, however, a single instance will handle the example requests.

#### Node.js

To handle hundreds of simultaneous requests in real-time, Node.js is an excellent choice. Being single-threaded, a connection between a client and server uses very few resources; the single thread enjoys the advantage of a lack of context switching and storage overhead between multiple processes. Since JS will almost certainly be used on the front-end, writing in a single language will simplify development. A potential disadvantage is that Node is still a young platform compared with PHP or Ruby, and occasionally there are breaking core API changes. However, there are long term branches (such as 8.x) which are stable.

The asynchronous approach to programming makes, for example, _sockets_ an ideal choice for real-time messaging between pairs of buyers and sellers.

#### Koa

Koa is a simple middleware-centric REST framework for Node.js. It uses the same modules as Express, and works with promises out of the box. The syntax is minimalist, with a `context` object and `next()` function passed to routes. The stacked middleware approach allows the straightforward addition of authentication, for example. A disadvantage of Koa could be familiarity, as it uses an alternative syntax from Express and discourages callback functions.

#### PostgreSQL

Using a relational database over Mongo allows the schema to be kept in the database rather than in the application as part of a driver (e.g. Mongoose). Creating joins is arguably simpler in SQL than with the aggregation pipeline of Mongo. Relational databases using SQL are well-supported by AWS, for example, whereas Mongo is not.

Indexing makes retrieving rows, even in complex queries, very fast (in the order of tens of milliseconds). The cache settings and page size can be tuned to further improve performance. However, adding an index to a table (roughly) doubles the storage size of the table, so space requirements can quickly increase.

Postgres benchmarks as [faster for reading and writing JSON data](https://www.enterprisedb.com/node/3441). Messages will most likely be in JSON format. While Postgres is fast, it is not as fast as Redis, however, Redis provides only a key/value storage with no schema, which could make it a better choice for caching messages later on.

### Front-end

#### create-react-app (Webpack + React)

CRA comes with Webpack and React and is straightforward to use and well-maintained (by Facebook), making it easy to focus on the code rather than boilerplate. Webpack is an excellent, optimised bundling tool, and React is a lightweight view-only component framework. CRA also includes Babel for transpilation, so ES6+ JS may be written safely across modern browsers.

Alternative bundling tools exist, such as Grunt or Gulp, but these have been superseded in popularity over the last few years by Webpack. It is a sensible choice to stick with a bundler that is well-used, as it is more likely existing and future developers will understand how it works.

Alternative front-end frameworks also exist, such as Angular 4 and Vue, but React is now most-used and is supported directly by Facebook. A potential disadvantage of using React, however, is JSX syntax. As it is HTML-like, but _not_ HTML, there is a learning curve involved. Additionally, in the future this application will require a state system, like Redux, which would come with its own learning curve. Vue, for example, has a state system built in (inspired by MobX), which lends greater consistency across projects.

## Data structure / Schemas

### Domain & Schema

In the relational database, the following table structure is proposed. User IDs will always reference `user_id`.

- `user`

| user_id | user_type |
| ------- | --------- |
| `uuid` | `enum (buyer, seller)` |

- `message`

| message_id | message_text | received_time | sender_id | receiver_id |
| ---------- | ------- | ------------- | --------- | ----------- |
| `uuid` | `text` | `datetime` | `uuid` | `uuid`

- `viewing_request`

| seller_id | buyer_id | booked_time | accepted |
| --------- | -------- | ----------- | -------- |
| `uuid` | `uuid` | `datetime` | `boolean`

### REST

JSON (application/json) will be used as a payload format for data over REST. For example, on messages additional properties will carry metadata, such as on `/messages/` for a particular seller:

```JSON
[
    {
        "buyer_id": "3a756c31-05c4-45a9-8b98-eb097221c786",
        "last_message_received": "2018-05-09T17:08:32+00:00",
        "new_message_count" 1,
        "message_preview": "Hey there, I was wondering about..."
    }
]
```

## Prototype Scope

To keep things simple, this prototype focuses on messaging and the front-end experience is from the point of view of a buyer. These assumptions have been made:

- Messages are text-based
- Message instances will be shared. In practice, a message thread usually has two copies of the same message - one for the sender, and one for the recipient.
- Messages can only be read and sent, not edited or deleted.

## Further work

In order to stay around the recommended time limit, several shortcuts have been taken to exemplify a response format, and are not the correct methods to be used in production. On a high-level, moving beyond the prototype would involve the following:

- A UI experience for both buyers and sellers.
- Seamless real-time messaging via websockets.
- A viewing booking system that is aware of time slots and prevents clashes.
- Messages could be rich text, with attachments, and also be editable, deletable and duplicated for both parties.

To achieve these, the following technologies and strategies could be applied further to the prototype:

* An JWT-based authentication system, like Auth0 or Okta, which would ensure identity security (and is easily integrable with Koa). Authorization, via _roles_ would ensure buyers can only message sellers, for example.
* Serverless architecture. By abstracting out the concerns - e.g. message operations, booking requests etc, we can avoid having any bottleneck API services.
* Postgres, instead of a static JSON file.
* SASS or SCSS instead of CSS for a cleaner, more reusable style codebase.
* React-Router for multiple 'pages' on the PWA, such as /messages, /bookings/new, etc.
* Validation for API requests, such as preventing duplicate message sends or missing properties.
* Tests, in the form of snapshot and end-to-end tests for the front-end, and unit and integration tests for the API.
* Lock down CORS to the specific API for further security.
* Environment variables and parameterisation in prep for deployment.
* State system for the front-end, e.g. Redux, where all state is held centrally. There should be no callbacks.
* Continuous integration, such as CircleCI.

## Setup

Docker Compose can be used to replicate a development environment. Assuming Docker is installed, on the command line you can run:

- `docker-compose up`

The app will be available at `http://localhost:3000`, and the API at `http://localhost:10010`.
