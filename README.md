# InformationIntegration
Project for the course of Information Integration A.A. 23/24
Student: Giovanni Della Pelle

## To run

1) Be sure to have docker installed and running
2) locate inside this folder and command "docker compose up"

Frontend: localhost://4200
Cassandra Web tool: localhost://8083
Influx Web tool: 8086
Influx credentials:
    - username: giovdellap
    - password: password

## Scenario: 
Our company provides AI tools for finance brokers. Its business scheme is based on a subscription model. Users of the company services can use the company website to analyze market trends using 4 different tools.

Each usage of a tool consists of a session, initialized by a request. This request includes user-specified parameters on the AI model underneath the tool. The user can generate a different response multiple tmes and has to rate the quality of the last response on a 1-5 scale. 

The AI models elaborate in-house stored data to provide a response to the user. 
When some of the required input data are missing, a request to an external AI service is sent. In this case, the user request must wait until the missing data is received from the external service. 

The company has received numerous complaints from customers about service quality. Major complaints regard output quality and loading time of the services. 
The company logs user sessions and requests to external services, and company engineers have provided guidelines on which parameters to inspect to identify the cause of the problems.

Last month, our company switched from CassandraDB to InfluxDB to store those logs, due to an increment in performances in querying a large quantity of logs to elaborate graphs for analysis. Also, after the update the system stores additional fields regarding each log item.

Our goal is provide a reconciled view of both databases, in order to have a complete overview of the problems' causes. There already exists a working frontend to visualize the queries' results.