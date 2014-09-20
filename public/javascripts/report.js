var server = io.connect(window.location.hostname);
server.on('error', function() {
  server.socket.connect();
});

// Myo Functionality

  var showPose = function(poseName){
    $('.images img').hide();
    $('#' + poseName).show();
  }

  var makeHistory = function(count, obj){
    var result =[];
    for(var i=0; i<count; i++){
      result.push(obj)
    }
    return result;
  }



  Myo.start();


  Myo.isLocked = true;


  //Myo.options.armbusy_threshold = 20;


  var maGyro = 0;


  var myoHistory_size = 200;
  var myoHistory = {
    pose : [],
    orientation : makeHistory(myoHistory_size,{x:0,y:0,z:0,w:0}),
    accelerometer : makeHistory(myoHistory_size,{x:0,y:0,z:0}),
    gyroscope : makeHistory(myoHistory_size,{x:0,y:0,z:0,ema:0})
  };




  Myo.on('imu', function(data){

    myoHistory.orientation.push(data.orientation);
    myoHistory.orientation = myoHistory.orientation.slice(1);
    myoHistory.accelerometer.push(data.accelerometer);
    myoHistory.accelerometer = myoHistory.accelerometer.slice(1);


    data.gyroscope.ema = Myo.armBusyData;

    myoHistory.gyroscope.push(data.gyroscope);
    myoHistory.gyroscope = myoHistory.gyroscope.slice(1);

    //console.log(data.orientation.z);



    if(Myo.armIsBusy){
      $('#busy').html('BUSY');
    }else{
      $('#busy').html('----');
    }

    if(hasFist && data.gyroscope.z > data.gyroscope.y + 150){
      console.log('PUNCH');
    }



    $('#y').html(Myo.mouse[0].toFixed(3))
    $('#z').html(Myo.mouse[1].toFixed(3))


    //$('#pan_x').height( ((dist*d.x + d.y) + 0.5)*100 + '%')
    //$('#pan_y').width( ((dist*d.x + d.z) + 0.5)*100 + '%')


    update();
  });

  var getData = function(measurement){

    var result = {};
    _.each(measurement, function(data, index){
      _.each(data, function(val, axis){
        result[axis] = result[axis] || {label : axis, data : []};
        result[axis].data.push([index, val])
      });
    });
    return _.values(result);
  }

  var hasFist = false;

  Myo.on('fist', function(edge){
    hasFist = edge;
  })



  var plots = {
    gyroscope : $.plot("#gyroscope", getData(myoHistory.gyroscope), {
      series: {shadowSize: 0},
      //xaxis: { show: false},
      yaxis : {
        min : -400,
        max : 400
      }
    }),

    accelerometer : $.plot("#accelerometer", getData(myoHistory.accelerometer), {
      series: {shadowSize: 0},
      //xaxis: { show: false},
      yaxis : {
        min : -2.5,
        max : 2.5
      }
    }),
    orientation : $.plot("#orientation", getData(myoHistory.orientation), {
      series: {shadowSize: 0},
      //xaxis: { show: false},
      yaxis : {
        min : -1,
        max : 1
      }
    }),
  }

  var update = _.throttle(function(){
    _.each(plots, function(plot, type){
      data = getData(myoHistory[type])
      plot.setData(data);
      plot.draw();
    });

  }, 30);





  Myo.on('bluetooth_strength', function(val){
    $('#ble').html(val);
  });


  var filterPose = function(pose){
    console.log('YEAH', pose);
    //Myo.vibrate('short');

    showPose(pose);
  }


  var poseHold;
  Myo.on('pose', function(pose, edge){
    if(Myo.isLocked || pose == 'rest') return;

    Myo.unlock(edge ? 0 : 5000);

    Myo.timer(edge, 200, function(){
      filterPose(pose);
    })

    //console.log(pose, edge);


    if(pose == 'spread'){
      Myo.zeroOrientation();
      Myo.requestBluetooth();
      //console.log('working');
      //peaks=[];
    }

  });


  Myo.on('unlock', function(){
    //Myo.vibrate('short').vibrate('short');
    console.log('unlocked');
  })

  Myo.on('lock', function(){
    //Myo.vibrate('medium');
    console.log('locked');
  })


  Myo.on('thumb_to_pinky', function(edge){
    hasFist = edge;
    if(!Myo.isLocked || Myo.armIsBusy) return;

    //if(edge) Myo.vibrate('short');

    Myo.timer(edge, 500, function(){
      //Myo.unlock(2000);
    });
  });



  Myo.on('double_tap', function(){
    Myo.zeroOrientation();
    Myo.mouse = [0,0];
    if(Myo.isLocked){
      Myo.unlock()
    }else{
      Myo.lock();
    }

  })
