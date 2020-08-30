First attempt to learn Node.js + Express. The database has been prepared in advance. Interfacing with string queries (not ORM). Handlebars templates are used. No frameworks. Russian UI.

The "Model Agency" web application allows you to manage data on models, agencies, contracts, jobs and receive profit reports.

Features:

1) CRUD operations with basic elements (models, agencies,
contracts, works);

2) search:<br>
a. models by name,<br>
b. name agencies,<br>
c. contract by the name of the model or the name of the agency,<br>
d. job by the name of the model or the title of the job;

3) data filtering by characteristics:<br>
a. model: gender, height, chest, waist, hips,<br>
b. agencies: countries and cities,<br>
c. contracts: availability of guarantee and profit,<br>
d. work: availability of profit;

4) sorting:<br>
a. model by last name, first name, model name, height or date contract,<br>
b. agency by name, country or city,<br>
c. contracts by contract date,<br>
d. work by date of work;

5) depending on the date of the contract or work, there are relevant notes:<br>
a. the model's contract with the agency is "valid", "expired" or "absent",<br>
b. overseas contract in "progress", "planned" or "completed",<br>
c. work "today", "planned" or "completed";

6) the "Reports" section contains a profit chart by year, as well as
earnings from the work of models and contracts.
