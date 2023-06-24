var http=require('http');
var express=require('express');

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


var Serverdata=[
{name:"ummar",starttime:"09:06",endtime:"10:00",batteryVoltage:Number,status:String},
{name:"ummar",starttime:"09:06",endtime:"10:00",batteryVoltage:Number,status:String},
{name:"ummar",starttime:"09:06",endtime:"10:00",batteryVoltage:Number,status:String},
{name:"ummar",starttime:"09:06",endtime:"10:00",batteryVoltage:Number,status:String},
{name:"ummar",starttime:"09:06",endtime:"10:00",batteryVoltage:Number,status:String},
{name:"ummar",starttime:"09:06",endtime:"10:00",batteryVoltage:Number,status:String},
{name:"ummar",starttime:"09:06",endtime:"10:00",batteryVoltage:Number,status:String},
{name:"ummar",starttime:"09:06",endtime:"10:00",batteryVoltage:Number,status:String},
{name:"ummar",starttime:"09:06",endtime:"10:00",batteryVoltage:Number,status:String},
{name:"ummar",starttime:"09:06",endtime:"10:00",batteryVoltage:Number,status:String},
{name:"ummar",starttime:"09:06",endtime:"10:00",batteryVoltage:Number,status:String},
];

app.use(express.static(__dirname + '/public'));
app.get("/",function(req,res){res.render('index');});

//FROM MICRO CONTROLLER
app.get("/data",function(req,res){
    Serverdata[parseInt(req.query.id)].batteyVoltage=parseFloat(req.query.v);
   //lastseen[parseInt(req.query.id)]=new Date();
    
    res.send(led[parseInt(req.query.id)]);
   // console.log(Serverdata);
});

setInterval(updateLed, 1000);






//console.log(Serverdata);
var led = new Array(11).fill(false);
//var batteryVolt=new Array(11).fill(0);
//setInterval(updateLed, 1000);
//var lastseen=new Array(11).fill( new Date());
function updateLed()
{
    //lastseenupdate();
    var time= new Date();
  for(var i=0; i<11;i++)
   {
    let [shours, smins] = Serverdata[i].starttime.split(":");
    let [ehours, emins] = Serverdata[i].endtime.split(":");

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
   console.log(led);
   console.log(time);
}


io.on('connection',function(socket){
    console.log('client connected.....');
    io.emit('data',Serverdata);
    socket.on('datachange',function(data){
         
        console.log("data change in pos");

        Serverdata=data;
        io.emit('data',Serverdata);
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




server.listen(3000);
