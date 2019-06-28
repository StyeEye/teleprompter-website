SELECT events.id
FROM
  events
  INNER JOIN presentations ON events.presentation_id = presentations.id
WHERE
  events.id = ${event_id}
  AND presentations.user_id = ${user_id};