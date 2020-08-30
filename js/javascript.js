function setMenu(set){
    switch(set){
        case 'models': set='МОДЕЛИ'; break;
        case 'agencies': set='АГЕНТСТВА'; break;
        case 'contracts': set='КОНТРАКТЫ'; break;
        case 'jobs': set='РАБОТЫ'; break;
        case 'income': set='ОТЧЕТЫ'; break;
    }
    $('#menu a:contains('+set+')').css({'color':'red'});
    link=document.createElement('link');
    link.href="/images/icon.jpg";
    link.rel="icon";
    $('head').append(link);
}
function statusModelContract(){
    ends=$('.ends');
    starts=$('.starts');
    for(i=0; i<ends.length; i++) {
        e=ends[i].innerHTML.split(".");
        e=new Date(e[2], e[1], e[0]);
        e=e.setMonth(e.getMonth()-1);
        s=starts[i].innerHTML.split(".");
        s=new Date(s[2], s[1], s[0]);
        s=s.setMonth(s.getMonth()-1);
        if (e<Date.now())
            $('.statuses:eq('+i+')').html('Истек').css({'color':'red'});
        else if (s<Date.now() || e>Date.now())
            $('.statuses:eq('+i+')').html('Действует').css({'color':'green'});
        else
            $('.statuses:eq('+i+')').html('Отсутствует').css({'color':'orange'});
    }
}
function statusForeignContract(){
    ends=$('.ends');
    starts=$('.starts');
    for(i=0; i<ends.length; i++) {
        e=ends[i].innerHTML.split(".")
        e=new Date(e[2], e[1], e[0])
        e=e.setMonth(e.getMonth()-1);
        s=starts[i].innerHTML.split(".")
        s=new Date(s[2], s[1], s[0])
        s=s.setMonth(s.getMonth()-1);
        if (e<Date.now())
            $('.statuses:eq('+i+')').html('Завершен').css({'color':'red'});
        else if (s<Date.now() && e>Date.now()) 
            $('.statuses:eq('+i+')').html('В работе').css({'color':'green'});
        else
            $('.statuses:eq('+i+')').html('Запланирован').css({'color':'orange'});
    }
    $('.guar').css({'font-style':'italic'});
}
function statusJob(){
    dates=$('.dates');
    for(i=0; i<dates.length; i++) {
        d=dates[i].innerHTML.split(".")
        d=new Date(d[2], d[1], d[0])
        d=d.setMonth(d.getMonth()-1);
        dn=Math.floor((Date.now()-d)/(1000*60*60*24))
        if (dn>0)
            $('.statuses:eq('+i+')').html('Завершена').css({'color':'red'});
        else if (dn==0)
            $('.statuses:eq('+i+')').html('Сегодня').css({'color':'green'});
        else
            $('.statuses:eq('+i+')').html('Запланирована').css({'color':'orange'});
    }
}
function seperateIncome(){
    ins=$('.in');
    for(i=0; i<ins.length; i++) {
        x=ins[i].innerHTML.replace(/(\d{1,3})(?=((\d{3})*([^\d]|$)))/g," $1 ")
        $('.in:eq('+i+')').html(x);
    }
}
function fill(elem,fill){
   $('#'+elem).html($('#'+fill).val());
}
function selectAgency(agency){
    selectA = $('#agency option');
    for (i=0; i<selectA.length; i++) { if (selectA[i].value == agency) selectA[i].selected = true; }
}
function selectModel(model){
    selectM = $('#model option');
    for (i=0; i<selectM.length; i++) { if (selectM[i].value == model) selectM[i].selected = true; }
}
function calcIncome(){
    total = $('#total').val();
    $('#income').val(Math.round(total*0.2));
}
function calcTotal(){
    income = $('#income').val();
    $('#total').val(Math.round(income*5));
}
function setNowStart(){
    $('#contract_start').val($('#today').val());
}
function calcEnd(){
    yrs = $('#yrs').val();
    date = new Date($('#contract_start').val());
    date.setFullYear(date.getFullYear() + parseInt(yrs));
    formatted_date = date.getFullYear() + "-" + appendLeadingZeroes(date.getMonth() + 1) + "-" + appendLeadingZeroes(date.getDate());
    $('#contract_end').val(formatted_date);
}
function appendLeadingZeroes(n){
    if (n <= 9) { return "0" + n; }
    return n
}
function hide_all_in(){
    $("#table_one .tr_all:gt(2)").hide()
    $("#table_two .tr_all:gt(2)").hide()
    $("#table_three .tr_all:gt(2)").hide()
}
function swt(table){
    $(`#${table} .tr_all:gt(2)`).toggle()
}
function msgKeyUp(){
    $(":input").keyup(function(){
        $('#msg').hide();
    });
}

google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(drawChart);
function drawChart() {
    years=$('.years');
    y_jobs=$('.y_jobs');
    y_contracts=$('.y_contracts');
    incomes=$('.incomes');
    in_jobs=$('.incomes_jobs');
    in_contracts=$('.incomes_contracts');
    sum_incomes=sum_jobs=sum_contracts=0;
    arr=[['Год','ВСЕГО','РАБОТЫ','КОНТРАКТЫ']];
    arr_j=[['Год','РАБОТЫ']];
    arr_c=[['Год','КОНТРАКТЫ']];
    for(i=0; i<years.length; i++) {
        ys=years[i].value
        is=incomes[i].value
        arr.push([ys,parseInt(is),0,0])
        sum_incomes+=parseInt(is);
    }
    for(i=0; i<y_jobs.length; i++) {
        ys=y_jobs[i].value
        is=in_jobs[i].value
        arr_j.push([ys,parseInt(is)])
        sum_jobs+=parseInt(is);
    }
    for(i=0; i<y_contracts.length; i++) {
        ys=y_contracts[i].value
        is=in_contracts[i].value
        arr_c.push([ys,parseInt(is)])
        sum_contracts+=parseInt(is);
    }

    for(i=1; i<arr.length; i++) {
        for(j=1; j<arr_j.length; j++) {
            if (arr_j[j][0]==arr[i][0]) arr[i][2]=arr_j[j][1]
        }
        for(j=1; j<arr_c.length; j++) {
            if (arr_c[j][0]==arr[i][0]) arr[i][3]=arr_c[j][1]
        }        
    }
    
    data = google.visualization.arrayToDataTable(arr);
    options = {
        title: 'Суммарная прибыль по годам',
        hAxis: {title: 'Год'},
        vAxis: {title: 'Руб.'}
    };
    chart = new google.visualization.ColumnChart(document.getElementById('diagram'));
    chart.draw(data, options);

    $("#all").html(sum_incomes);
    $("#all_jobs").html(sum_jobs);
    $("#all_contracts").html(sum_contracts);
}