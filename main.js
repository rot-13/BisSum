bisSum = function(selector){
  var sum=0;
  var days=0;
  var lastDate="";
  var avg = 0;
  $(selector).each(function() {
    var date_from = new Date, date_to = new Date;
    // Lunch is from 6:00 to 16:30
    date_from.setHours(6);
    date_from.setMinutes(0);
    date_to.setHours(16);
    date_to.setMinutes(30);
    var dat = new Date;
    var time = $(this).children().eq(2).text().split(/\:|\-/g);
    var payDate = $(this).children().eq(1).text();
    // console.log(payDate.trim());
    dat.setHours(time[0]);
    dat.setMinutes(time[1]);
    if (dat>date_from && dat<date_to) {
      var curr_price = Number($(this).children().eq(5).text().replace(/[^\d.-]/g,''));
      sum += curr_price;
      if (payDate != lastDate) {
        days += 1;
        lastDate = payDate;
      }
    }
  });
  if (days !== 0) {
    avg = sum/days;
  }
  return {"sum": sum, "days": days, "avg": avg};
}

workingDays = function(){
  var days = 0;
  var startEnd = $('.reportGeneralDataFieldValueTd').first().text().trim().split('-');
  var month = parseInt(startEnd[0].split('/')[1]);
  var year = parseInt($('.ui-datepicker-year').val());
  var start = startEnd[0].split('/')[0];
  var end = startEnd[1].split('/')[0];
  var startDate = new Date(year, month, parseInt(start));
  var endDate = new Date(year, month, parseInt(end));
  while (startDate <= endDate) {
    if(isWorkingDay(startDate)) {
      days += 1;
    }
    startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 1);
  }
  return days;
}

isWorkingDay = function(date) {
  if (date.getDay() < 5) {
    return true;
  }
  return false;
}

var until = function (selector, time, callback) {
  var $match = $(selector);
  if ($match.length) {
    return callback($match);
  }
  setTimeout(function () {
    until(selector, time, callback);
  }, time);
};

$(document).ready(function() {
  var DAILY_ALLOWANCE = 40;
  // wait 5 seconds if we can't get the year from the datepicker
  until('.ui-datepicker-year', 5000, function() {
    var d = bisSum('.userReportDataTbl .reportDataTr');
    var totalDays = workingDays();
    var monthBudget = totalDays * DAILY_ALLOWANCE;

    $(".reportHeaderDiv").prepend(
      '<div style="float:left; width:309px;">' +
        '<div style="float:left; color:#D2232A; font-weight:bold;">' +
          '<p>₪' + d.sum.toFixed(2) + '</p>' +
          '<p>₪' + monthBudget + '</p>' +
          '<p style="direction: ltr;">₪' + (monthBudget - d.sum).toFixed(2) + '</p>' +
          '<p>' + totalDays + '</p>' +
          '<p>' + d.days + '</p>' +
          '<p>₪' + d.avg.toFixed(2) + '</p>' +
        '</div>' +
        '<div style="float: right; font-weight: bold;">' +
          '<p>נוצלו החודש בצהריים:</p>' +
          '<p>תקציב חודשי*:</p>' +
          '<p>תקציב נותר:</p>' +
          '<p>ימי עבודה החודש*:</p>' +
          '<p>ימים עם תשלום:</p>' +
          '<p>תשלום ממוצע ליום שימוש:</p>' +
          '<p style="font-weight: normal;">* ללא התחשבות בחגים וחופשים</p>' +
        '</div>' +
      '</div>');
  });
});
