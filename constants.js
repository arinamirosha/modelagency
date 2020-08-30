exports.MENU = `<li><a href='/models'>МОДЕЛИ</a></li>
<li><a href='/agencies'>АГЕНТСТВА</a></li>
<li><a href='/contracts'>КОНТРАКТЫ</a></li>
<li><a href='/jobs'>РАБОТЫ</a></li>
<li><a href='/income'>ОТЧЕТЫ</a></li>`;
exports.AGENCY = "SUCCESS&nbsp;&nbsp;&nbsp;model&nbsp;&nbsp;management";
// exports.CONNECTION = "postgres://postgres:user@localhost:5432/modelagency";
exports.CONNECTION = "postgres://user@modelagency:us!1998er@modelagency.postgres.database.azure.com:5432/postgres?ssl=1";

exports.USER_LOGIN= "user";
exports.USER_PASSWORD= "psw";

exports.ZERO = "0";
exports.UPD = "update";
exports.WOMEN = "women";
exports.MEN = "men";
exports.ALL = "all";
exports.ACTIVE = "active";
exports.C_END = "contractend";
exports.NO_C = "nocontract";
exports.COMING = "coming";
exports.J_END = "jobend";
exports.LGN_HASH = "lgn_hash";
exports.PSW_HASH = "psw_hash";
exports.WRONG = "Неверный логин или пароль";
exports.NO_CASH = "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0";

exports.SORT_SNAME = "sortsurname";
exports.SORT_NAME = "sortname";
exports.SORT_M_NAME = "sortmodelname";
exports.SORT_SHORT = "sortshort";
exports.SORT_TALL = "sorttall";
exports.SORT_CONTRACT = "sortcontract";
exports.SORT_COUNTRY = "sortcountry";
exports.SORT_CITY = "sortcity";
exports.SORT_START = "sortstart";
exports.SORT_END = "sortend";

exports.MODELS = "models";
exports.AGENCIES = "agencies";
exports.CONTRACTS = "contracts";
exports.JOBS = "jobs";

exports.HBS_LOGIN = "login.hbs";
exports.HBS_AGENCIES = "agencies.hbs";
exports.HBS_CONTRACTS = "contracts.hbs";
exports.HBS_FORM_AGENCY = "formagency.hbs";
exports.HBS_FORM_CONTRACT = "formcontract.hbs";
exports.HBS_FORM_JOB = "formjob.hbs";
exports.HBS_FORM_MODEL = "formmodel.hbs";
exports.HBS_INCOME = "income.hbs";
exports.HBS_JOBS = "jobs.hbs";
exports.HBS_MAIN = "main.hbs";
exports.HBS_MODELS = "models.hbs";
exports.HBS_SUCCESS = "success.hbs";

exports.CANNOT_DEL = "<h1>Невозможно удалить: существуют контракты/работы с моделью/агентством! </h1>";
exports.DEL = "DELETE FROM ";
exports.WHERE_ID = " WHERE id=";

exports.UPD_M_SET = "UPDATE models SET ";
exports.UPD_A_SET = "UPDATE agencies SET ";
exports.UPD_C_SET = "UPDATE contracts SET ";
exports.UPD_J_SET = "UPDATE jobs SET ";

exports.SELECT_JOBS_INCOME = "SELECT DATE_PART('YEAR',date) y, sum(income) FROM jobs GROUP BY y ORDER BY y";
exports.SELECT_CONTRACTS_INCOME = "SELECT DATE_PART('YEAR',c_end) y, sum(income) FROM contracts GROUP BY y ORDER BY y";
exports.SELECT_TOP_CONTRACTS = "SELECT m.id,m.surname,m.name,m.patronymic,sum(c.income) FROM contracts c JOIN models m ON c.model=m.id GROUP BY m.id ORDER BY sum desc";
exports.SELECT_TOP_JOBS = "SELECT m.id,m.surname,m.name,m.patronymic,sum(j.income) FROM jobs j JOIN models m ON j.model=m.id GROUP BY m.id ORDER BY sum desc";
exports.SELECT_TOP_COUNTRIES = "SELECT country, sum(income) FROM contracts c JOIN agencies a ON c.agency=a.id GROUP BY country ORDER BY sum desc";
exports.SELECT_MODELS_INFO = "SELECT id,surname,name,patronymic,model_name FROM models ORDER BY surname";
exports.SELECT_AGENCIES_INFO = "SELECT id,name,country,city FROM agencies ORDER BY name";
exports.SELECT_COUNTRIES = "SELECT DISTINCT country FROM agencies ORDER BY country";
exports.SELECT_CITIES = "SELECT DISTINCT city FROM agencies ORDER BY city";
exports.SELECT_COUNTRIES_CONTRACTS = "SELECT DISTINCT country FROM contracts c JOIN models m ON c.model=m.id JOIN agencies a ON c.agency=a.id ORDER BY country";
exports.SELECT_MODELS_WHERE_LIKE = "SELECT * FROM models WHERE lower(concat(surname,' ',name,' ',patronymic)) LIKE ";
exports.SELECT_AGENCIES_WHERE_LIKE = "SELECT * FROM agencies WHERE lower(name) LIKE ";
exports.SELECT_CONTRACTS_WHERE_LIKE = "SELECT c.id,m.id id_model,m.surname,m.name name_model,m.patronymic,m.image,m.model_name,a.id id_agency,a.name name_agency,a.country,a.city,c.c_start,c.c_end,c.guarantee,c.income "+
                                    "FROM contracts c JOIN models m ON c.model=m.id JOIN agencies a ON c.agency=a.id WHERE lower(concat(m.surname,' ',m.name,' ',m.patronymic,' ',a.name)) LIKE ";
exports.SELECT_JOBS_WHERE_LIKE = "SELECT j.id,j.name,m.id id_model,m.surname,m.name name_model,m.patronymic,m.image,m.model_name,j.date,j.time,j.address,j.total,j.income "+
                                "FROM jobs j JOIN models m ON j.model=m.id WHERE lower(concat(m.surname,' ',m.name,' ',m.patronymic,' ',j.name)) LIKE ";
exports.SELECT_INCOMES_BY_YEARS = `SELECT DATE_PART('YEAR',yr) y, sum(income) FROM (SELECT c_end yr, income FROM contracts UNION SELECT date yr, income FROM jobs ) x GROUP BY y ORDER BY y`;

exports.ORDER_NAME = " ORDER BY name";
exports.ORDER_SURNAME = " ORDER BY surname";
exports.ORDER_MODEL_NAME = " ORDER BY model_name";
exports.ORDER_HEIGHT = " ORDER BY height";
exports.ORDER_HEIGHT_DESC = " ORDER BY height desc";
exports.ORDER_C_START_DESC = " ORDER BY contract_start desc,contract_end desc";
exports.ORDER_COUNTRY = " ORDER BY country";
exports.ORDER_CITY = " ORDER BY city";
exports.ORDER_START_DECS = " ORDER BY c.c_start desc";
exports.ORDER_DATE_DECS = " ORDER BY j.date desc";

exports.AND_GENDER_TRUE = " AND gender=true";
exports.AND_GENDER_FALSE = " AND gender=false";
exports.AND_HEIGHT_FROM = " AND height>=";
exports.AND_HEIGHT_TO = " AND height<=";
exports.AND_BUST_FROM = " AND bust>=";
exports.AND_BUST_TO = " AND bust<=";
exports.AND_WAIST_FROM = " AND waist>=";
exports.AND_WAIST_TO = " AND waist<=";
exports.AND_HIPS_FROM = " AND hips>=";
exports.AND_HIPS_TO = " AND hips<=";
exports.AND_ACTIVE_C_MODS = " AND contract_end>now()";
exports.AND_ENDED = " AND contract_end<now()";
exports.AND_NO_CONTRACT = " AND (contract_start IS null AND contract_end IS null)";
exports.AND_GUARANTEE_NOT_NULL = " AND guarantee IS NOT NULL";
exports.AND_ACTIVE_C_CONTS = " AND c_start<now() AND c_end>now()";
exports.AND_ENDED_CONTS = " AND c_end<now()";
exports.AND_COMING = " AND c_start>now()";
exports.AND_INCOME_NOT_ZERO = " AND income<>0";
exports.AND_JOB_TODAY = " AND date=cast(now() as date)";
exports.AND_ENDED_JOB = " AND date<cast(now() as date)";
exports.AND_COMING_JOB = " AND date>cast(now() as date)";

exports.INSERT_MODEL_VALUES = "INSERT INTO models (surname,name,patronymic,model_name,birth,height,bust,waist,hips,shoes,contract_start,contract_end,contacts,image,gender) VALUES ";
exports.INSERT_AGENCY_VALUES = "INSERT INTO agencies (name,country,city,contacts) VALUES ";
exports.INSERT_CONTRACT_VALUES = "INSERT INTO contracts (model,agency,c_start,c_end,guarantee,income) VALUES ";
exports.INSERT_JOB_VALUES = "INSERT INTO jobs (name,model,date,time,address,total,income) VALUES ";