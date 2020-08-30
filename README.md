First attempt to learn Node.js + Express. The database has been prepared in advance. Interfacing with string queries (not ORM). Handlebars templates are used. No frameworks. Russian UI.

The "Model Agency" web application allows you to manage data on models, agencies, contracts, jobs and receive profit reports.

Features:

1) CRUD operations with basic elements (models, agencies,
contracts, works);

2) search:
a. models by name,
b. name agencies,
c. contract by the name of the model or the name of the agency,
d. job by the name of the model or the title of the job;

3) data filtering by characteristics:
a. model: gender, height, chest, waist, hips,
b. agencies: countries and cities,
c. contracts: availability of guarantee and profit,
d. work: availability of profit;

4) sorting:
a. model by last name, first name, model name, height or date
contract,
b. agency by name, country or city,
c. contracts by contract date,
d. work by date of work;

5) depending on the date of the contract or work, there are
relevant notes:
a. the model's contract with the agency is "valid", "expired" or "absent",
b. overseas contract in "progress", "planned" or "completed",
c. work "today", "planned" or "completed";

6) the "Reports" section contains a profit chart by year, as well as
earnings from the work of models and contracts.
