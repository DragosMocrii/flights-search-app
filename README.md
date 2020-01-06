To get up and running:

1. Clone this repo on your computer 

2. Install Homestead https://laravel.com/docs/6.x/homestead#installation-and-setup

3. Create your `.env` and configure its options

4. cd into the project folder, and start the homestead VM: `vagrant up`

4a. `php artisan migrate --seed` to run migrations and seed the database with sample flight data

5. To serve the front-end, relative to your project files, `cd ./resources/frontend && npm run dev`

6. Access front-end at the IP defined in `Homestead.yaml`, by default `http://192.168.10.10`

7. In order to process search queries for flights, you need to start the queue worker (watch mode). In your project folder run: `php artisan queue:listen redis`

Note: You may need to run `composer install` from your project folder, and `npm install` from where front-end files are located. 

API endpoints:

Public:

```
GET /auth/?email=your_email&password=your_pass
-
JSON Response good:
{token: 'asd97786fasad...}
-
JSON Response bad:
{errors:['Error 1', 'Error 2']}
```
```
POST /users
-
JSON Payload: {email: 'email@test', password: 'pass'}
-
Response good:
{token: 'asd97786fasad...}
-
Response bad:
{errors:['Error 1', 'Error 2']}
```
Auth protected:
```
GET /airports/?search=search_term
-
Response good:
{ 
    data [{
        id
        name
        iata_code
     }]
}
```
```
GET /airlines/?search=search_term
-
Response good:
{ 
    data [{
        id
        name
        iata_code
     }]
}
```
```
GET /trips
-
Response good:
{ 
    data [{
        id
        name
        depart_at
     }]
}
-
Response bad:
{errors:['Error 1', 'Error 2']}
```
```
GET /trips/:id
-
Response good:
{ 
    data {
        trip_name
        itinerary [{
            trip_id
            depart_at
            route_segments [{
                type
                starts_at
                ends_at
                starts_at_timestamp
                ends_at_timestamp
                duration
                airline_name?
                flight_code?
                location_from?
                location_to?
            }]    
        }]
     }
}
-
Response bad:
{errors:['Error 1', 'Error 2']}
```
```
POST /trips
-
JSON Payload: {trip_itinerary: [id]}
-
Response good:
{ 
    data {
        trip_id
     }
}
-
Response bad:
{errors:['Error 1', 'Error 2']}
```
```
DELETE /trips/:id
-
Response good:
{ 
    data {
        deleted[id]
     }
}
-
Response bad:
{errors:['Error 1', 'Error 2']}
```
```
POST /search
-
JSON Payload:
{
    from
    to
    date
    filters.max_duration
    filters.max_stops
    filters.min_depart_at
    filters.restricted_airline
}
-
Response good:
{ 
    search_hash
}
-
Response bad:
{errors:['Error 1', 'Error 2']}
```
```
GET /search/:search_hash
-
Response good:
{ 
    last_result_id
    search_completed
    data [{
        result_id
        flight_date
        total_duration
        total_duration_human
        total_price
        total_layovers
        route_segments [{
            type
            starts_at
            ends_at
            starts_at_timestamp
            ends_at_timestamp
            duration
            airline_name?
            flight_code?
            location_from?
            location_to?
        }]
    }]
}
-
Response bad:
{errors:['Error 1', 'Error 2']}
```
For protected endpoints, set header:
`Authorization: Bearer a098ads8fdsf8...` 

When you create a search query, your search is added toa job queue and you  receive a search hash_id. You may use this hash_id to poll the `/search/:hash_id` for results, until you receive the `search_completed = 1` result.

Airport, airline & flight route datasets obtained from https://openflights.org/data.html

