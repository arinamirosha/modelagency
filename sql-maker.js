const cts = require("./constants.js");
const sharp = require('sharp');
const fs = require('file-system');

exports.getSqlModels = function(q){
    if (!q.search) q.search="";
    sql=cts.SELECT_MODELS_WHERE_LIKE+"lower(trim('%"+q.search+"%'))";
    if (q.sex==cts.WOMEN) sql+=cts.AND_GENDER_TRUE;
        else if (q.sex==cts.MEN) sql+=cts.AND_GENDER_FALSE;
            else q.sex=cts.ALL;
    if (q.heightfrom) sql+=cts.AND_HEIGHT_FROM+q.heightfrom;
    if (q.heightto) sql+=cts.AND_HEIGHT_TO+q.heightto;
    if (q.bustfrom) sql+=cts.AND_BUST_FROM+q.bustfrom;
    if (q.bustto) sql+=cts.AND_BUST_TO+q.bustto;
    if (q.waistfrom) sql+=cts.AND_WAIST_FROM+q.waistfrom;
    if (q.waistto) sql+=cts.AND_WAIST_TO+q.waistto;
    if (q.hipsfrom) sql+=cts.AND_HIPS_FROM+q.hipsfrom;
    if (q.hipsto) sql+=cts.AND_HIPS_TO+q.hipsto;
    if (q.cont==cts.ACTIVE) sql+=cts.AND_ACTIVE_C_MODS;
        else if (q.cont==cts.C_END) sql+=cts.AND_ENDED;
            else if (q.cont==cts.NO_C) sql+=cts.AND_NO_CONTRACT;
                else q.cont=cts.ALL;
    if (q.order) switch(q.order){
        case cts.SORT_SNAME: sql+=cts.ORDER_SURNAME; break;
        case cts.SORT_NAME: sql+=cts.ORDER_NAME; break;
        case cts.SORT_M_NAME: sql+=cts.ORDER_MODEL_NAME; break;
        case cts.SORT_SHORT: sql+=cts.ORDER_HEIGHT; break;
        case cts.SORT_TALL: sql+=cts.ORDER_HEIGHT_DESC; break;
        case cts.SORT_CONTRACT: sql+=cts.ORDER_C_START_DESC; break;
    } else sql+=cts.ORDER_SURNAME;
    return sql;
}

exports.getSqlAgencies = function(q){
    if (!q.search) q.search="";
    sql=cts.SELECT_AGENCIES_WHERE_LIKE+"lower(trim('%"+q.search+"%'))";
    if (q.country) { 
        sql+=" AND ("; 
        for (i in q.country) 
        if(i!=q.country.length-1) sql+="country='"+q.country[i]+"' OR "; 
        else sql+="country='"+q.country[i]+"'"; sql+=")"; 
    }
    if (q.city) { 
        sql+=" AND ("; 
        for (i in q.city) 
        if(i!=q.city.length-1) sql+="city='"+q.city[i]+"' OR "; 
        else sql+="city='"+q.city[i]+"'"; sql+=")"; 
    }
    if (q.order) switch(q.order){
        case cts.SORT_NAME: sql+=cts.ORDER_NAME; break;
        case cts.SORT_COUNTRY: sql+=cts.ORDER_COUNTRY; break;
        case cts.SORT_CITY: sql+=cts.ORDER_CITY; break;
    } else sql+=cts.ORDER_NAME;
    return sql;
}

exports.getSqlContracts = function(q){
    if (!q.search) q.search="";
    sql=cts.SELECT_CONTRACTS_WHERE_LIKE+"lower(trim('%"+q.search+"%'))";
    if (q.country) { 
        sql+=" AND ("; 
        for (i in q.country) 
        if(i!=q.country.length-1) sql+="a.country='"+q.country[i]+"' OR "; 
        else sql+="a.country='"+q.country[i]+"'"; sql+=")"; 
    }
    if (q.guarantee) sql+=cts.AND_GUARANTEE_NOT_NULL;
    if (q.paid) sql+=cts.AND_INCOME_NOT_ZERO;
    if (q.cont==cts.ACTIVE) sql+=cts.AND_ACTIVE_C_CONTS;
        else if (q.cont==cts.C_END) sql+=cts.AND_ENDED_CONTS;
            else if (q.cont==cts.COMING) sql+=cts.AND_COMING;
                else q.cont=cts.ALL;
    sql+=cts.ORDER_START_DECS;
    return sql;
}

exports.getSqlJobs = function(q){
    if (!q.search) q.search="";
    sql=cts.SELECT_JOBS_WHERE_LIKE+"lower(trim('%"+q.search+"%'))";
    if (q.paid) sql+=cts.AND_INCOME_NOT_ZERO;
    if (q.cont==cts.ACTIVE) sql+=cts.AND_JOB_TODAY;
        else if (q.cont==cts.J_END) sql+=cts.AND_ENDED_JOB;
            else if (q.cont==cts.COMING) sql+=cts.AND_COMING_JOB;
                else q.cont=cts.ALL;
    sql+=cts.ORDER_DATE_DECS;
    return sql;
}

exports.getSqlInsert = function(q,table_name,file){
    switch(table_name){
        case cts.MODELS:
            for (i in q) if (q[i]=="") q[i]=null;  else q[i]="'"+q[i]+"'";
            if (file) {
                imgPath=file.path;
                sharp(imgPath).resize(200,200).toBuffer(function (err, buf) {
                    if (err) return next(err)
                    img= buf.toString('base64');
                    fs.writeFile(imgPath , img, {encoding: 'base64'},  function(err){});
                });
            }
            image=(file)?"'"+file.originalname+"'":null;
            sql=cts.INSERT_MODEL_VALUES+`(initcap(trim(${q.surname})),initcap(trim(${q.name})),initcap(trim(${q.patronymic})),${q.model_name},
                ${q.birth},${q.height},${q.bust},${q.waist},${q.hips},${q.shoes},${q.contract_start},${q.contract_end},${q.contacts},${image},${q.gender})`;
            break;
        case cts.AGENCIES:
            q.contacts=(q.contacts!="")?"'"+q.contacts+"'":null;
            sql=cts.INSERT_AGENCY_VALUES+`(trim('${q.name}'),initcap(trim('${q.country}')),initcap(trim('${q.city}')),${q.contacts})`;
            break;
        case cts.CONTRACTS:
            q.guarantee=(q.guarantee!="")?"'"+q.guarantee+"'":null;
            if(q.income=="") q.income=cts.ZERO;
            sql=cts.INSERT_CONTRACT_VALUES+`(${q.model},${q.agency},'${q.c_start}','${q.c_end}',${q.guarantee},${q.income})`;
            break;
        case cts.JOBS:
            if(q.income=="") q.income=cts.ZERO;
            for (i in q) if (q[i]=="") q[i]=null; else q[i]="'"+q[i]+"'";
            sql=cts.INSERT_JOB_VALUES+`(${q.name},${q.model},${q.date},${q.time},${q.address},${q.total},${q.income})`;
            break;
    }
    return sql;
}

exports.getSqlUpdate = function(q,table_name,file){
    switch(table_name){
        case cts.MODELS:
            for (i in q) if (q[i]=="") q[i]=null;  else q[i]="'"+q[i]+"'";
            image="";
            if (q.delimg) image=",image=null";
            if (file) {
                imgPath=file.path;
                sharp(imgPath).resize(200,200).toBuffer(function (err, buf) {
                    if (err) return next(err)
                    img= buf.toString('base64');
                    fs.writeFile(imgPath , img, {encoding: 'base64'},  function(err){});
                });
                if (!q.delimg) image=",image='"+file.originalname+"'";
            }
            sql=cts.UPD_M_SET+`surname=initcap(trim(${q.surname})),name=initcap(trim(${q.name})),patronymic=initcap(trim(${q.patronymic})),
                model_name=${q.model_name},birth=${q.birth},height=${q.height},bust=${q.bust},waist=${q.waist},hips=${q.hips},shoes=${q.shoes},
                contract_start=${q.contract_start},contract_end=${q.contract_end},contacts=${q.contacts}${image},gender=${q.gender} WHERE id=${q.id}`;
            break;
        case cts.AGENCIES:
            q.contacts=(q.contacts!="")?"'"+q.contacts+"'":null;
            sql=cts.UPD_A_SET+`name='${q.name}',country=initcap('${q.country}'),city=initcap('${q.city}'),contacts=${q.contacts} WHERE id=${q.id}`;
            break;
        case cts.CONTRACTS:
            q.guarantee=(q.guarantee!="")?"'"+q.guarantee+"'":null;
            if(q.income=="") q.income=cts.ZERO;
            sql=cts.UPD_C_SET+`model=${q.model},agency=${q.agency},c_start='${q.c_start}',c_end='${q.c_end}',guarantee=${q.guarantee},income=${q.income} WHERE id=${q.id}`;
            break;
        case cts.JOBS:
            if(q.income=="") q.income=cts.ZERO;
            for (i in q) if (q[i]=="") q[i]=null; else q[i]="'"+q[i]+"'";
            sql=cts.UPD_J_SET+`name=${q.name},model=${q.model},date=${q.date},time=${q.time},address=${q.address},total=${q.total},income=${q.income} WHERE id=${q.id}`;
            break;
    }
    return sql;
}