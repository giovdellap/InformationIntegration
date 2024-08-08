# Source schema

## InfluxDB
UserSession (timestamp, UserID, name, presence_penalty, frequency_penalty, top_p, temperature, Sat, Gen, tokens, wli)
ServiceRequest(timestamp, tokens, messages, input_t, input_d, time)

## Cassandra
SessionRelevation(logID, ts, name, version, Satisfaction, Generations)
SessionSpecification(logID, UserID, tokens, wli, presence penalty, frequency_penalty, top_p, temperature)
ExternalRequest(timestamp, tokens, messages, time, input_tokens)
RequestAttachment(ts, d)

# Global Schema
Session(timestamp, UserID, ModelName, ModelVersion, presence_penalty, frequency_penalty, top_p, temperature, Satisfaction, Generations, Tokens, wli)
Request(timestamp, input_tokens, total_tokens, input_dimension, Messages, LoadingTime)


# ESEMPIO SLIDE 3.3 ALLA FINE
# DA VEDERE QUERY ANSWERING 2 - GAV SLIDE 63

# Specs

## Context of Application
Intra-organizational

## Classification of the IIS

### Scope
Domain-Based IIS 

### Result
Result as Logical Theory
There is no Global Schema, there is an Ontology
Ontology => Mapping non GAV
Non dovrebbero servire Global Schema Constraints

### Mapping
Sound Semantics of Mapping (3.3 slide 19/38)
GAV (Global-As-View)

### Representation
Virtualization
Forse servono Wrappers e mediator (slide 3.1 45)

## Technological Approach
Multiple Stores - Federated data Management (copiare immagine slide 3.1 67)



# Abstract

# Source Schema

## Cassandra

## Influx

# Global Schema

# Mapping