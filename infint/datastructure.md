# Global Schema

## User Session
- timestamp
- User ID
- Model name
- Model version
- Model parameters (Each relevation has one or more of these parameters depending on the model)
  - presence_penalty
  - temperature
  - frequency_penalty
  - top_p
- Satisfaction (user rating)
- Generations (time the user generates the answer before accepting one)
- Request tokens
- WorkLoad Index (workload of the servers)

## External Service Request

- timestamp
- input tokens (tokens of the request)
- total tokens
- stream messages (number of messages in the service output)
- input dimension (not in all requests)
- loading time (round-trip time to receive a complete response)


# InfluxDB Schema

## User Session
- timestamp
- User ID
- name
- Model parameters 
  - presence_penalty
  - temperature
  - frequency_penalty
  - top_p
- Sat
- Gen
- tokens
- wli

## External Service Request

- timestamp
- tokens
- messages
- input
- time

# Cassandra Schema

## User Session

### Relevation
- Log ID
- ts
- User ID
- Satisfaction
- Generations
- tokens
- wli

### Specs
- Log ID
- ts
- Model_name
- Model_version
- presence_penalty
- temperature
- frequency_penalty
- top_p

## External Service Request

- timestamp
- tokens
- messages
- time