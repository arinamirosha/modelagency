const cts = require("./constants.js");
const sm = require("./sql-maker.js");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({extended: false});
const pgp = require("pg-promise")();
const db = pgp(cts.CONNECTION);
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);

const multer  = require("multer");
const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, "uploads"); },
    filename: (req, file, cb) => { cb(null, file.originalname); },
});

const hbs = require('hbs');
hbs.registerHelper('dateFormat', require('handlebars-dateformat'));
hbs.registerHelper('if_eq', function(a, b, opts) { if (a == b) return opts.fn(this); else return opts.inverse(this); });
hbs.registerHelper("inc", function(value, opts){ return parseInt(value) + 1; });

app.use(cookieParser());
app.use(express.static(__dirname));
app.use(multer({storage:storageConfig}).single("image"));
app.use(express.static('images'));
app.set("view engine", "hbs");

function checkLoginPassword(cks){
    if (cks.lgn_hash===bcrypt.hashSync(cts.USER_LOGIN,salt) && 
            cks.psw_hash===bcrypt.hashSync(cts.USER_PASSWORD,salt))
        return true;
    else return false;
}

app.get("/login", function(request, response){
    if (!checkLoginPassword(request.cookies)) response.render(cts.HBS_LOGIN, { agency_name:cts.AGENCY });
    else response.redirect("/main");
});

app.post("/login", urlencodedParser, function(request, response){
    if (!checkLoginPassword(request.cookies)) {
        q=request.body;
        if (q.login===cts.USER_LOGIN && q.password===cts.USER_PASSWORD) {
            lgn_hash=bcrypt.hashSync(q.login,salt);
            psw_hash=bcrypt.hashSync(q.password,salt);
            response.cookie(cts.LGN_HASH,lgn_hash,{maxAge:3600*24*365*1000});
            response.cookie(cts.PSW_HASH,psw_hash,{maxAge:3600*24*365*1000});
            response.redirect("/main");
        }
        else response.render(cts.HBS_LOGIN, { agency_name:cts.AGENCY, msg:cts.WRONG, lgn:q.login, psw:q.password });
    }
    else response.redirect("/main");
});

app.get("/logout", function(request, response){
    response.clearCookie(cts.LGN_HASH);
    response.clearCookie(cts.PSW_HASH);
    response.redirect("/login");
});

app.get("/", function(request, response){
    response.redirect("/main");
}); 

app.get("/main", function(request, response){
    if (!checkLoginPassword(request.cookies)) response.redirect("/logout");
    else {
        response.header('Cache-Control', cts.NO_CASH);
        response.render(cts.HBS_MAIN, { mainmenu: cts.MENU });
    }
});

app.get("/models", function(request, response){
    if (!checkLoginPassword(request.cookies)) response.redirect("/logout");
    else {
        q=request.query;
        sql=sm.getSqlModels(q);
        db.any(sql).then(function (data) {
            response.render(cts.HBS_MODELS, {
                agency_name:cts.AGENCY, mainmenu:cts.MENU, models:data,
                search:q.search, sex:q.sex, heightfrom:q.heightfrom, heightto:q.heightto,
                bustfrom:q.bustfrom, bustto:q.bustto, waistfrom:q.waistfrom, waistto:q.waistto,
                hipsfrom:q.hipsfrom, hipsto:q.hipsto, cont:q.cont, order:q.order, length:data.length
            });
        })
        .catch(function (error) { console.log(error); });
    }
});

app.get("/agencies", function(request, response){
    if (!checkLoginPassword(request.cookies)) response.redirect("/logout");
    else {
        q=request.query;
        sql=sm.getSqlAgencies(q);
        db.any(sql).then(function (data) {
            db.any(cts.SELECT_COUNTRIES).then(function (countries) {
                db.any(cts.SELECT_CITIES).then(function (cities) {
                    response.render(cts.HBS_AGENCIES, {
                        agency_name:cts.AGENCY, mainmenu:cts.MENU, agencies:data, countries:countries, cities:cities,
                        search:q.search, order:q.order, length:data.length
                    });
                }).catch(function (error) { console.log(error); });
            }).catch(function (error) { console.log(error); });
        }).catch(function (error) { console.log(error); });
    }
});

app.get("/contracts", function(request, response){
    if (!checkLoginPassword(request.cookies)) response.redirect("/logout");
    else {
        q=request.query;
        sql=sm.getSqlContracts(q);
        db.any(sql).then(function (data) {
            db.any(cts.SELECT_COUNTRIES_CONTRACTS).then(function (countries) {
                response.render(cts.HBS_CONTRACTS, {
                    agency_name:cts.AGENCY, mainmenu:cts.MENU, contracts:data, search:q.search, paid:q.paid,
                    countries:countries, guarantee:q.guarantee, cont:q.cont, length:data.length
                });
            }).catch(function (error) { console.log(error); });
        }).catch(function (error) { console.log(error); });
    }
});

app.get("/jobs", function(request, response){
    if (!checkLoginPassword(request.cookies)) response.redirect("/logout");
    else {
        q=request.query;
        sql=sm.getSqlJobs(q);
        db.any(sql).then(function (data) {
            response.render(cts.HBS_JOBS, {
                agency_name:cts.AGENCY, mainmenu:cts.MENU, jobs:data, length:data.length, search:q.search,
                paid:q.paid, cont:q.cont, coming:q.coming
            });
        }).catch(function (error) { console.log(error); });  
    }
});

app.get("/income", function(request, response){
    if (!checkLoginPassword(request.cookies)) response.redirect("/logout");
    else {
        db.any(cts.SELECT_JOBS_INCOME).then(function (incomes_jobs) {
            db.any(cts.SELECT_CONTRACTS_INCOME).then(function (incomes_contracts) {
                db.any(cts.SELECT_TOP_CONTRACTS).then(function (top_contracts) {
                    db.any(cts.SELECT_TOP_JOBS).then(function (top_jobs) {
                        db.any(cts.SELECT_TOP_COUNTRIES).then(function (top_countries) {
                            db.any(cts.SELECT_INCOMES_BY_YEARS).then(function (incomes) {
                                response.render(cts.HBS_INCOME, {
                                    agency_name:cts.AGENCY, mainmenu:cts.MENU, 
                                    incomes_jobs:incomes_jobs, incomes_contracts:incomes_contracts,
                                    top_contracts:top_contracts, top_jobs:top_jobs, 
                                    top_countries:top_countries, incomes:incomes
                                });
                            }).catch(function (error) { console.log(error); });
                        }).catch(function (error) { console.log(error); });
                    }).catch(function (error) { console.log(error); });
                }).catch(function (error) { console.log(error); });
            }).catch(function (error) { console.log(error); });
        }).catch(function (error) { console.log(error); });
    }
});

app.get("/insert", function(request, response){
    if (!checkLoginPassword(request.cookies)) response.redirect("/logout");
    else {
        q=request.query;
        switch(q.table_name){
            case cts.MODELS:
                response.render(cts.HBS_FORM_MODEL, { agency_name:cts.AGENCY, mainmenu:cts.MENU, today:Date.now() });
                break;
            case cts.AGENCIES:
                db.any(cts.SELECT_COUNTRIES).then(function (countries) {
                    db.any(cts.SELECT_CITIES).then(function (cities) {
                        response.render(cts.HBS_FORM_AGENCY, { agency_name:cts.AGENCY, mainmenu:cts.MENU, countries:countries, cities:cities });
                    }).catch(function (error) { console.log(error); });
                }).catch(function (error) { console.log(error); });
                break;
            case cts.CONTRACTS:
                db.any(cts.SELECT_MODELS_INFO).then(function (models) {
                    db.any(cts.SELECT_AGENCIES_INFO).then(function (agencies) {
                        response.render(cts.HBS_FORM_CONTRACT, { agency_name:cts.AGENCY, mainmenu:cts.MENU, models:models, agencies:agencies, 
                            id_model:q.id_model, id_agency:q.id_agency });
                    }).catch(function (error) { console.log(error); });
                }).catch(function (error) { console.log(error); });
                break;
            case cts.JOBS:
                db.any(cts.SELECT_MODELS_INFO).then(function (models) {
                    response.render(cts.HBS_FORM_JOB, { agency_name:cts.AGENCY, mainmenu:cts.MENU, models:models, id_model:q.id_model });
                }).catch(function (error) { console.log(error); });
                break;
        }
    }
});

app.post("/insert", urlencodedParser, function(request, response){
    if (!checkLoginPassword(request.cookies)) response.redirect("/logout");
    else {
        q = request.body;
        table_name = request.query.table_name;
        file = request.file;
        sql = sm.getSqlInsert(q,table_name,file);
        db.none(sql).then(function (data) { response.redirect("/success?table_name="+table_name); })
        .catch(function (error) { console.log(error); });
    }
});

app.post("/update", urlencodedParser, function(request, response){
    if (!checkLoginPassword(request.cookies)) response.redirect("/logout");
    else {
        q = request.body;
        table_name = request.query.table_name;
        if (q.data=="true") switch(table_name){
            case cts.MODELS:
                response.render(cts.HBS_FORM_MODEL, {
                    agency_name:cts.AGENCY, mainmenu:cts.MENU, id:q.id, surname:q.surname, name:q.name, patronymic:q.patronymic,
                    model_name:q.model_name, birth:q.birth, height:q.height, bust:q.bust, waist:q.waist, hips:q.hips,
                    shoes:q.shoes, contract_start:q.contract_start, contract_end:q.contract_end, contacts:q.contacts,
                    image:q.image, gender:q.gender, act:cts.UPD, today:Date.now() }); 
                    break;
            case cts.AGENCIES:
                db.any(cts.SELECT_COUNTRIES).then(function (countries) {
                    db.any(cts.SELECT_CITIES).then(function (cities) {
                        response.render(cts.HBS_FORM_AGENCY, {
                            agency_name:cts.AGENCY, mainmenu:cts.MENU, id:q.id, name:q.name, country:q.country, city:q.city,
                            contacts:q.contacts, act:cts.UPD, countries:countries, cities:cities
                        });
                    }).catch(function (error) { console.log(error); });
                }).catch(function (error) { console.log(error); }); 
                break;
            case cts.CONTRACTS:
                db.any(cts.SELECT_MODELS_INFO).then(function (models) {
                    db.any(cts.SELECT_AGENCIES_INFO).then(function (agencies) {
                        response.render(cts.HBS_FORM_CONTRACT, { agency_name:cts.AGENCY, mainmenu:cts.MENU, models:models, agencies:agencies, act:cts.UPD,
                            id:q.id, id_model:q.id_model, id_agency:q.id_agency, c_start:q.c_start, c_end:q.c_end, guarantee:q.guarantee, income:q.income
                        });
                    }).catch(function (error) { console.log(error); });
                }).catch(function (error) { console.log(error); }); 
                break;
            case cts.JOBS:
                db.any(cts.SELECT_MODELS_INFO).then(function (models) {
                    response.render(cts.HBS_FORM_JOB, { agency_name:cts.AGENCY, mainmenu:cts.MENU, models:models, act:cts.UPD,
                        id:q.id, id_model:q.id_model, name:q.name, date:q.date, time:q.time, address:q.address, total:q.total, income:q.income
                    });
                }).catch(function (error) { console.log(error); }); 
                break;
        }
        else {
            file = request.file;
            sql = sm.getSqlUpdate(q,table_name,file)
            db.none(sql).then(function (data) { response.redirect("/success/?act="+request.query.act+"&table_name="+table_name); })
            .catch(function (error) { console.log(error); });
        }
    }
});

app.get("/success", function(request, response){
    if (!checkLoginPassword(request.cookies)) response.redirect("/logout");
    else {
        response.render(cts.HBS_SUCCESS, {
            agency_name:cts.AGENCY, mainmenu:cts.MENU, act:request.query.act, table_name:request.query.table_name
        });
    }
});

app.get("/delete", function(request,response){
    if (!checkLoginPassword(request.cookies)) response.redirect("/logout");
    else {
        q = request.query;
        sql = cts.DEL+q.table_name+cts.WHERE_ID+q.id;
        db.none(sql)
        .then(function (data) {
            response.redirect("/"+q.table_name);
        })
        .catch(function (error) { console.log(error); response.send(cts.CANNOT_DEL);});
    }
});

app.get("/css/*.css", function(request, response){
    response.sendFile(__dirname + request.url);
});


app.listen(process.env.PORT || 3000);