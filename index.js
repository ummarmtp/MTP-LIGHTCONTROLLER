var http=require('http');
var express=require('express');
const { time } = require('console');

process.env.TZ = 'Asia/Dubai' 
'Asia/Dubai'
var app=express();
var server=http.createServer(app);
var io=require('socket.io')(server);
app.set('view engine','ejs');

// var Serverdata=new Array(11).fill({ 
//     name:"UMMAR",
//     starttime:"09:06",
//     endtime:"06:07",
//     batteyVoltage:10,
//     status: "OFFLINE",  
// });
var lastseen=new Array(11).fill(new Date());
var m=false;

var Serverdata=[
{name:"name-1",starttime:"09:06",endtime:"10:00",batteryVoltage:0,status:""},
{name:"name-2",starttime:"09:06",endtime:"10:00",batteryVoltage:0,status:""},
{name:"name-3",starttime:"09:06",endtime:"10:00",batteryVoltage:0,status:""},
{name:"name-4",starttime:"09:06",endtime:"10:00",batteryVoltage:0,status:""},
{name:"name-5",starttime:"09:06",endtime:"10:00",batteryVoltage:0,status:""},
{name:"name-6",starttime:"09:06",endtime:"10:00",batteryVoltage:0,status:""},
{name:"name-7",starttime:"09:06",endtime:"10:00",batteryVoltage:0,status:""},
{name:"name-8",starttime:"09:06",endtime:"10:00",batteryVoltage:0,status:""},
{name:"name-9",starttime:"09:06",endtime:"10:00",batteryVoltage:0,status:""},
{name:"name-10",starttime:"09:06",endtime:"10:00",batteryVoltage:0,status:""},
{name:"name-11",starttime:"09:06",endtime:"10:00",batteryVoltage:0,status:""},
];

app.use(express.static(__dirname + '/public'));
app.get("/",function(req,res){res.render('index');});

//FROM MICRO CONTROLLER
app.get("/data",function(req,res){
    Serverdata[parseInt(req.query.id)].batteyVoltage=parseFloat(req.query.v);
lastseen[parseInt(req.query.id)]=new Date();
    m=false;
    res.send(led[parseInt(req.query.id)]);
   // console.log(Serverdata);
});

setInterval(updateLed, 1000);

var refreshtime=new Date();




//console.log(Serverdata);
var led = new Array(11).fill(false);
//var batteryVolt=new Array(11).fill(0);
//setInterval(updateLed, 1000);
//var lastseen=new Array(11).fill( new Date());
function updateLed()
{
    //lastseenupdate();
    var time= new Date();
    refreshtime=new Date();
  for(var i=0; i<11;i++)
   {
    let [shours, smins] = Serverdata[i].starttime.split(":");
    let [ehours, emins] = Serverdata[i].endtime.split(":");
    lastSeen(i,time);

    shours=parseInt(shours,10) ;
    ehours=parseInt(ehours,10) ;
    smins=parseInt(smins,10) ;
    emins=parseInt(emins,10) ;
    
   // console.log(shours);
    //console.log(ehours);
    //console.log(time);
    //console.log("   ...............");

    if(shours<=time.getHours() && ehours>=time.getHours())
    {
        //start time
       if(shours==time.getHours())// || ehours==time.getHours())
        {
           if(smins<=time.getMinutes())/// || emins>time.getMinutes() ) 
           {
            led[i]=true;
           }
           else
           {
            led[i]=false;

           }
        }
       
        else
        {
            led[i]=true;
        }
        //end time

        if(ehours==time.getHours())// || ehours==time.getHours())
        {
           if(emins>time.getMinutes() && shours!=ehours)/// || emins>time.getMinutes() ) 
           {
            led[i]=true;
           }
           else if(emins>time.getMinutes() && shours==ehours && smins<emins)
           {
            led[i]=true;

           }
           else if(shours==ehours && smins>emins)
           {
            
            led[i]=true;
            if(emins<=time.getMinutes() && smins>time.getMinutes())
            {
                led[i]=false;
            }

           }
           
           
           else
           {
            led[i]=false;

           }
        }
       
        




    }

    else
    {
        led[i]=false;
    }
    
 
   }
  // console.log(led);
  // console.log(time.getHours());
   //console.log(Serverdata[0].starttime)
}


io.on('connection',function(socket){
    console.log('client connected.....');
    io.emit('data',Serverdata);
    socket.on('datafullchange',function(data){
         
        console.log("data change in pos");

        Serverdata=data;
        io.emit('data',Serverdata,refreshtime);
       // console.log('Received message from client!',Serverdata);
      // setInterval(updateLed(), 1000);

      //updateLed();
       // console.log(led);
      // setInterval(updateLed, 1000);
    
       
    });


    socket.on('datachange',function(data1,data2,data3,pos){
         
        console.log("data change in pos");

       // Serverdata=data;
       Serverdata[pos].name=data1;
       Serverdata[pos].starttime=data2;
       Serverdata[pos].endtime=data3;

        io.emit('data',Serverdata,refreshtime);
       // console.log('Received message from client!',Serverdata);
      // setInterval(updateLed(), 1000);

      //updateLed();
       // console.log(led);
      // setInterval(updateLed, 1000);
    
       
    });
    
    socket.on('disconnect' , function(){
        console.log('cleint disconnected.....');
    });
});
 

// function lastseenupdate()
// {
//     Time=new Date();
//     for(var i=0;i<11;i++)
//     {
//         if(parseInt(lastseen[i].getMinutes())-parseInt(Time.getMinutes())<=1)
//     {
//         Serverdata[i].status="ONLINE";

//     }
//     else
//     {
//         Serverdata[i].status="LASTSEEN 2MINS AGAO";
//     }

//     }
    
// }
//last seen update
function lastSeen(i,time)
{
    
//    if(lastseen[i].getDay()==time.getDay() && lastseen[i].getHours()==time.getHours())
//     {
//         var mins=parseInt(time.getMinutes())-parseInt(lastseen[i].getMinutes());
//         if(mins<3)
//         {
//             Serverdata[i].status= "Online"

//         }
//         else{
//             Serverdata[i].status= " Last Seen "+mins+" Mins ago"

//         }

      
//     }
//     else if(lastseen[i].getDay()==time.getDay())
//     {
//         var hours=parseInt(time.getHours())-parseInt(lastseen[i].getHours());
//         if(hours<=23)
//         {
//             Serverdata[i].status= " Last Seen "+hours+" hours ago"

//         }
        

//     }
//     else
//     {
//         var days=parseInt(time.getDay())-parseInt(lastseen[i].getDay());
//         if(days<=6)
//         {
//             d[7]={SUNDAY,MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY};
//             Serverdata[i].status= " Last Seen "+d[days]+"ago";

//         }

//     }

var mins=parseInt(time.getMinutes())-parseInt(lastseen[i].getMinutes());
         if(Math.abs(mins)<1 && m==false)
         {
            Serverdata[i].status= "Online"

        }
         else{
            var day=lastseen[i].getDate();
            var month=lastseen[i].getMonth();
            var year=lastseen[i].getFullYear();
            var hour=lastseen[i].getHours();
            var min=lastseen[i].getMinutes();

            strLen(day);
            strLen(month);
            strLen(min);
            strLen(hour);
            


             Serverdata[i].status=+day+"/"+month+ "/"+year+ " "+hour+":"+min;
             m=true;

         }



}

function strLen(data)
{
    if(data.length==1)
    {
        data="0"+data;
    }

}

server.listen(3000);
